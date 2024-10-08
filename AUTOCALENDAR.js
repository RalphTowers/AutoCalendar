/**
 * This script automates the creation of Google Calendar events based on data stored in a Google Sheet.
 * It processes rows starting from a specified row and continues until the last row with data.
 * The script is designed to resume from the last processed row in each execution.
 * 
 * Instructions
 * - Modify the constants for calendarId, sheetName, and column ranges as needed.
 * - Set up a trigger to run the script periodically (e.g., every 2 hours) if desired.
 */

function createCalendarEvents() {
  const calendarId = 'YOUR_CALENDAR_ID_HERE@group.calendar.google.com';  // Replace with your Google Calendar ID
  const calendar = CalendarApp.getCalendarById(calendarId);
  const sheetName = 'Sheet1'; // Replace with the name of your Google Sheet
  const startRow = 2;  // The first row to start processing (e.g., 2 if row 1 has headers)
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(sheetName);

  // Column ranges - Adjust these as needed to match your sheet structure
  const titleColumn = `B${startRow}:B1000`;  // Event title
  const dateColumn = `A${startRow}:A1000`;  // Event date
  const startTimeHourColumn = `C${startRow}:C1000`;  // Start time hour
  const startTimeMinuteColumn = `D${startRow}:D1000`;  // Start time minute
  const endTimeHourColumn = `E${startRow}:E1000`;  // End time hour
  const endTimeMinuteColumn = `F${startRow}:F1000`;  // End time minute
  const locationColumn = `G${startRow}:G1000`;  // Event location
  const organizerColumn = `H${startRow}:H1000`;  // Event organizer
  const descriptionColumn = `I${startRow}:I1000`;  // Event description
  const attendeesColumn = `J${startRow}:J1000`;  // Number of attendees
  const setupTypeColumn = `K${startRow}:K1000`;  // Type of setup
  const furnitureColumn = `L${startRow}:L1000`;  // Furniture requested
  const responsiblePersonColumn = `M${startRow}:M1000`;  // Responsible person

  const titles = getRangeWithRetry(sheet, titleColumn);
  const dates = getRangeWithRetry(sheet, dateColumn);
  const startHours = getRangeWithRetry(sheet, startTimeHourColumn);
  const startMinutes = getRangeWithRetry(sheet, startTimeMinuteColumn);
  const endHours = getRangeWithRetry(sheet, endTimeHourColumn);
  const endMinutes = getRangeWithRetry(sheet, endTimeMinuteColumn);
  const locations = getRangeWithRetry(sheet, locationColumn);
  const organizers = getRangeWithRetry(sheet, organizerColumn);
  const descriptions = getRangeWithRetry(sheet, descriptionColumn);
  const attendees = getRangeWithRetry(sheet, attendeesColumn);
  const setupTypes = getRangeWithRetry(sheet, setupTypeColumn);
  const furniture = getRangeWithRetry(sheet, furnitureColumn);
  const responsiblePersons = getRangeWithRetry(sheet, responsiblePersonColumn);

  // Resumption logic using PropertiesService
  const properties = PropertiesService.getScriptProperties();
  let lastProcessedRow = parseInt(properties.getProperty('lastProcessedRow') || startRow);

  Logger.log(`Resuming from row ${lastProcessedRow}.`);

  for (let i = lastProcessedRow - startRow; i < titles.length; i++) {
    const title = titles[i] ? titles[i][0] : null;
    const dateString = dates[i] ? dates[i][0] : null;
    const eventDate = dateString ? new Date(dateString) : null;

    if (!eventDate || eventDate.getFullYear() < new Date().getFullYear()) {
      continue;  // Skip past dates
    }

    if (!title) {
      Logger.log(`Empty row encountered at row ${i + startRow}. Stopping process.`);
      break;
    }

    const year = eventDate.getFullYear();
    const month = eventDate.getMonth();
    const day = eventDate.getDate();
    let startHour = startHours[i] ? startHours[i][0] : null;
    const startMinute = startMinutes[i] ? startMinutes[i][0] : null;
    let endHour = endHours[i] ? endHours[i][0] : null;
    const endMinute = endMinutes[i] ? endMinutes[i][0] : null;

    if (startHour !== null && startMinute !== null && endHour !== null && endMinute !== null) {
      if (startHour >= 0 && startHour < 6) {
        Logger.log(`Correcting format: Row ${i + startRow} has incorrect start time.`);
        startHour += 12;
      }

      const startDateTime = new Date(year, month, day, startHour, startMinute);
      let endDateTime = new Date(year, month, day, endHour, endMinute);

      if (startDateTime >= endDateTime) {
        Logger.log(`Correcting format: Row ${i + startRow} has incorrect end time.`);

        if (endHour < startHour && endHour < 12) {
          endHour += 12;
          endDateTime = new Date(year, month, day, endHour, endMinute);
        }
      }

      if (startDateTime < endDateTime) {
        const existingEvents = calendar.getEvents(startDateTime, endDateTime, {search: "Event | " + title});

        const eventExists = existingEvents.some(event => 
          event.getTitle() === "Event | " + title &&
          event.getStartTime().getTime() === startDateTime.getTime() &&
          event.getEndTime().getTime() === endDateTime.getTime()
        );

        if (!eventExists) {
          const location = locations[i] ? locations[i][0] : "";
          const organizer = organizers[i] ? organizers[i][0] : "";
          const description = descriptions[i] ? descriptions[i][0] : "";
          const attendeeCount = attendees[i] ? attendees[i][0] : "";
          const setupType = setupTypes[i] ? setupTypes[i][0] : "";
          const furnitureRequested = furniture[i] ? furniture[i][0] : "";
          const responsiblePerson = responsiblePersons[i] ? responsiblePersons[i][0] : "";

          const eventDescription = 
            `<b>Location:</b> ${location}\n` +
            `<b>Organizer:</b> ${organizer}\n` +
            `<b>Description:</b> ${description}\n` +
            `<b>Attendees:</b> ${attendeeCount}\n` +
            `<b>Setup Type:</b> ${setupType}\n` +
            `<b>Furniture Requested:</b> ${furnitureRequested}\n` +
            `<b>Responsible Person:</b> ${responsiblePerson}\n`;

          try {
            const event = calendar.createEvent("Event | " + title, startDateTime, endDateTime, {description: eventDescription});
            event.setColor("3");
            Logger.log(`Event created: Event | ${title} from ${startDateTime} to ${endDateTime}`);
          } catch (e) {
            if (e.message.includes("Service invoked too many times for one day: calendar")) {
              Logger.log("API limit reached. Stopping process.");
              break;
            } else {
              Logger.log(`Error creating event: Event | ${title} - ${e.message}`);
            }
          }
        } else {
          Logger.log(`Event already exists: Event | ${title} between ${startDateTime} and ${endDateTime}`);
        }
      } else {
        Logger.log(`Invalid event time: Row ${i + startRow} has a start time greater than or equal to end time, even after correction.`);
      }
    } else {
      Logger.log(`Missing data in row ${i + startRow}: Year=${year}, Month=${month + 1}, Day=${day}, Start=${startHour}:${startMinute}, End=${endHour}:${endMinute}`);
    }

    // Save the last processed row to PropertiesService
    properties.setProperty('lastProcessedRow', i + startRow + 1);
  }

  if (lastProcessedRow >= titles.length + startRow - 1) {
    properties.setProperty('lastProcessedRow', `${startRow}`);
  }
}

/**
 * Helper function to handle reading data with retries.
 * This function attempts to read data from the sheet up to 5 times in case of an error.
 */
function getRangeWithRetry(sheet, range) {
  const maxRetries = 5;
  let attempt = 0;
  let success = false;
  let result;

  while (attempt < maxRetries && !success) {
    try {
      result = sheet.getRange(range).getValues();
      success = true;
    } catch (e) {
      attempt++;
      if (attempt >= maxRetries) {
        throw e;
      }
      Logger.log(`Error reading range ${range}, attempt ${attempt}: ${e.message}`);
      Utilities.sleep((Math.pow(2, attempt) + Math.random()) * 1000);
    }
  }
  
  return result;
}
