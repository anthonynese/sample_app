import fs from 'node:fs';
import path from 'node:path';
import { google } from 'googleapis';

const credentialsPath = path.resolve('service-account.json');
const spreadsheetId = process.env.SPREADSHEET_ID;
const range = 'Sheet1!A1:C1';

async function authorize() {
  const credentials = JSON.parse(fs.readFileSync(credentialsPath, 'utf8'));
  const scopes = ['https://www.googleapis.com/auth/spreadsheets'];

  const auth = new google.auth.JWT(
    credentials.client_email,
    undefined,
    credentials.private_key,
    scopes
  );

  await auth.authorize();
  return auth;
}

async function appendRow(auth) {
  const sheets = google.sheets({ version: 'v4', auth });

  const response = await sheets.spreadsheets.values.append({
    spreadsheetId,
    range,
    valueInputOption: 'USER_ENTERED',
    requestBody: {
      values: [
        ['Hello', 'from', 'Node.js']
      ]
    }
  });

  console.log('Append result:', response.data.updates?.updatedRange);
}

(async () => {
  if (!spreadsheetId) {
    throw new Error('Set the SPREADSHEET_ID environment variable.');
  }

  const auth = await authorize();
  await appendRow(auth);
})();
