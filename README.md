# Google Calendar Event Automation Script

This Google Apps Script automates the creation of events in Google Calendar based on data stored in a Google Sheet. The script processes data starting from a specified row and continues until the last row with data, resuming from the last processed row in each execution.

## How It Works

1. **Data Retrieval:** The script reads event data from a Google Sheet, including the event title, date, start and end times, location, organizer, description, and other relevant information.

2. **Event Creation:** It checks if an event with the same title and time frame already exists in the specified Google Calendar. If not, it creates the event with the appropriate details.

3. **Error Handling:** The script includes retry logic for data retrieval and handles errors related to Google Calendar API limits.

4. **Resumption:** The script remembers the last processed row and resumes from that row in the next execution.

## Setup Instructions

### Prerequisites

- A Google Calendar and Google Sheet with the necessary data.
- Google Apps Script access.

### Steps

1. **Copy the Script:**
   - Copy the provided script into the Google Apps Script editor associated with your Google Sheet.

2. **Configure the Script:**
   - Replace `YOUR_CALENDAR_ID_HERE@group.calendar.google.com` with your Google Calendar ID.
   - Adjust the `sheetName`, `startRow`, and column ranges to match your sheet's structure.

3. **Set Up Triggers (Optional):**
   - Set up a trigger to run the script periodically (e.g.,
   - Set up a trigger to run the script periodically (e.g., every 2 hours) using Google Apps Script's built-in triggers.

4. **Deploy the Script:**
   - Save and close the script editor.
   - The script will now automatically create events in your Google Calendar based on the data in your Google Sheet.

### Script Configuration

- **calendarId:** The ID of the Google Calendar where events will be created.
- **sheetName:** The name of the Google Sheet where your event data is stored.
- **startRow:** The row number where your data starts (e.g., 2 if row 1 has headers).
- **Column Ranges:** Modify the column ranges (e.g., `B2:B1000`) to match the layout of your Google Sheet. Each range corresponds to specific event details such as title, date, and time.

### Column Details

The script assumes the following column layout:

| Column | Purpose                          |
|--------|----------------------------------|
| A      | Event Date                       |
| B      | Event Title                      |
| C      | Start Time Hour                  |
| D      | Start Time Minute                |
| E      | End Time Hour                    |
| F      | End Time Minute                  |
| G      | Event Location                   |
| H      | Event Organizer                  |
| I      | Event Description                |
| J      | Number of Attendees              |
| K      | Type of Setup                    |
| L      | Furniture Requested              |
| M      | Responsible Person               |

### Example Google Sheet Layout

| A (Date) | B (Title)            | C (Start Hour) | D (Start Min) | E (End Hour) | F (End Min) | G (Location)   | H (Organizer)      | I (Description)        | J (Attendees) | K (Setup Type) | L (Furniture) | M (Responsible)  |
|----------|----------------------|----------------|---------------|--------------|-------------|----------------|--------------------|------------------------|---------------|----------------|---------------|------------------|
| 2024-08-01 | Project Kickoff Meeting | 09             | 00            | 11           | 00          | Conference Room | Jane Doe           | Initial project meeting | 15            | Round Table    | Chairs         | John Smith       |
| 2024-08-02 | Client Presentation    | 14             | 30            | 16           | 00          | Meeting Room 2  | Acme Corp          | Presenting project status | 10            | Theater        | Podium         | Jane Doe         |

- **A (Date):** The date of the event in YYYY-MM-DD format.
- **B (Title):** The title of the event.
- **C (Start Hour) and D (Start Min):** The start time in hours and minutes.
- **E (End Hour) and F (End Min):** The end time in hours and minutes.
- **G (Location):** The location where the event will be held.
- **H (Organizer):** The organizer of the event.
- **I (Description):** A brief description of the event.
- **J (Attendees):** The number of attendees expected.
- **K (Setup Type):** The type of setup required for the event.
- **L (Furniture):** Any furniture requested for the event.
- **M (Responsible):** The person responsible for overseeing the event.

This is just an example; you can adjust the column layout and headers to fit your specific needs.

### Error Handling

The script includes error handling for:
- **API Limits:** If the Google Calendar API limit is reached, the script will log the issue and stop further processing.
- **Data Retrieval Errors:** The `getRangeWithRetry` function ensures that data is correctly retrieved from the sheet, with up to 5 retry attempts.

### Resumption Logic

- The script uses `PropertiesService` to remember the last processed row and resumes from that row in the next execution. This ensures that the script can handle large datasets over multiple runs without duplication.

### Potential Use Cases

This script can be used in various scenarios, including but not limited to:

1. **Automated Event Scheduling:**
   - Automatically populate a Google Calendar with events based on a schedule maintained in a Google Sheet, ensuring that your calendar is always up to date.

2. **Team Meeting Coordination:**
   - Teams can use a shared Google Sheet to log upcoming meetings, and the script will ensure these are reflected in the team’s Google Calendar without manual input.

3. **Event Planning and Management:**
   - Event planners can maintain details of multiple events in a Google Sheet, and the script will automate the creation of these events in a calendar, including detailed descriptions, setup instructions, and more.

4. **Classroom or Workshop Schedules:**
   - Educators or trainers can use this script to automatically schedule classes, workshops, or sessions based on a predefined schedule stored in Google Sheets.

5. **Client or Project Meetings:**
   - Agencies or consultancies can keep track of client meetings in a Google Sheet and automate the process of scheduling these in a shared calendar.

### Customization for Specific Use Cases

- **Adding Custom Fields:** If your events require additional information not currently handled by the script (e.g., special instructions, external links), you can modify the script to include these details in the event descriptions.
- **Different Time Zones:** If your events occur in different time zones, you can modify the script to handle time zone conversions before creating events.

### Best Practices for Maintaining the Script

1. **Regularly Monitor Execution:**
   - Use the built-in logging (`Logger.log`) to monitor the script’s execution and spot any issues early.

2. **Handle API Limits:**
   - Be mindful of Google Calendar API limits. If you’re adding many events, consider spreading the workload over multiple script executions.

3. **Keep Data Consistent:**
   - Ensure that your Google Sheet data is consistent and correctly formatted. This minimizes errors and ensures that the script runs smoothly.

4. **Backup Your Script:**
   - Regularly back up your script code and Google Sheet. If using version control (like Git), commit changes frequently.

5. **Adapt and Extend:**
   - As your needs change, adapt the script. For example, you might add new features like event reminders, custom notifications, or integrations with other Google services.

### Contributing

Feel free to contribute by opening issues or submitting pull requests. Ensure your changes maintain the script's functionality and simplicity.

### Troubleshooting and FAQs

#### 1. Why aren’t my events appearing in Google Calendar?

- **Check the Calendar ID:** Ensure that the Calendar ID in the script matches the one you want to populate.
- **Data Format:** Verify that the data in your Google Sheet is correctly formatted (e.g., dates in `YYYY-MM-DD` format, times in 24-hour format).
- **API Limits:** Google Calendar has API usage limits. If you’re adding a large number of events, the script might hit these limits, which will be logged.

#### 2. How do I find my Google Calendar ID?

- Open Google Calendar.
- Go to Settings and select the calendar you want to use.
- Scroll down to the "Integrate calendar" section. The Calendar ID is listed here.

#### 3. The script stopped processing at a certain row. What should I do?

- **Check the Logs:** Go to `View > Logs` in the Apps Script editor to see why the script stopped. Common reasons include hitting API limits or encountering a data error.
- **Restart the Script:** If necessary, you can manually run the script again. The script will resume from the last processed row.

#### 4. How do I set up the script to run automatically?

- Go to the Apps Script editor.
- Click on the clock icon to open the `Triggers` menu.
- Set up a trigger for the `createCalendarEvents` function to run at your preferred interval (e.g., every 2 hours).

#### 5. Can I use this script for multiple Google Calendars?

- Yes, you can modify the script to work with multiple calendars by either creating separate instances of the script or modifying the logic to handle multiple calendar IDs.

### License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
