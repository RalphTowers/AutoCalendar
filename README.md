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

### Error Handling

The script includes error handling for:
- **API Limits:** If the Google Calendar API limit is reached, the script will log the issue and stop further processing.
- **Data Retrieval Errors:** The `getRangeWithRetry` function ensures that data is correctly retrieved from the sheet, with up to 5 retry attempts.

### Resumption Logic

- The script uses `PropertiesService` to remember the last processed row and resumes from that row in the next execution. This ensures that the script can handle large datasets over multiple runs without duplication.

### Contributing

Feel free to contribute by opening issues or submitting pull requests. Ensure your changes maintain the script's functionality and simplicity.

### License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
