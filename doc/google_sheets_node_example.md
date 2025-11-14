# Updating Google Sheets from Node.js

The repository primarily contains Ruby code, but you can still automate Google Sheets updates in a standalone Node.js script.

## Prerequisites
1. Create a Google Cloud project and enable the **Google Sheets API**.
2. Create a **Service Account** and download its JSON key.
3. Share the target Google Sheet with the service account email.
4. Use Node.js 18+ (or enable ES modules with `"type": "module"` in `package.json`).
5. Install dependencies: `npm install googleapis`.

## Where to find these files

- **On GitHub:** open your repository in the browser, expand the `doc/` directory in the file list, and click either `google_sheets_node_example.md` (this guide) or `googleSheetsUpdateSample.js` (the runnable script). Use the **Raw** button if you want to copy or download the file without diff formatting.

  *Example with your GitHub account:* if the repository that contains these files lives at `https://github.com/anthonynese/sample_app`, the doc directory is directly browsable at `https://github.com/anthonynese/sample_app/tree/main/doc`. Click that URL, then select whichever file you need (or append `/blob/main/doc/<filename>` for a specific file), and use the **Raw** button for a clean copy. Replace `sample_app` and `main` if your repository uses different names.
- **On your computer:** when you have the repository cloned locally, the same directory exists at `<repo-root>/doc/`. For example, after running `git clone ... sample_app`, change into it with `cd sample_app/doc` (or, from the repository root, run `ls doc` to see the files).

## Sample script
Save the script below as `doc/googleSheetsUpdateSample.js`. It reads a credentials JSON file, authenticates the Sheets API client, and appends a row of values to the specified sheet.

> **Can't find the file in GitHub?**
>
> The repository already includes both `doc/google_sheets_node_example.md` and the runnable `doc/googleSheetsUpdateSample.js`. In the GitHub web UI you can expand the `doc/` folder in the file tree or go directly to `https://github.com/<your-org>/<your-repo>/blob/<branch>/doc/googleSheetsUpdateSample.js`. Click **Raw** to copy or download the plain JavaScript file without any diff formatting. Replace `<your-org>`, `<your-repo>`, and `<branch>` (for example `main`) with the values that match your project.

```js
import fs from 'node:fs';
import path from 'node:path';
import { google } from 'googleapis';

const credentialsPath = path.resolve('service-account.json');
const spreadsheetId = process.env.SPREADSHEET_ID; // e.g. "1abc..."
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
```

Run the script with:

```bash
node doc/googleSheetsUpdateSample.js
```

The script appends a row of values to the configured sheet. You can customize the `range` and `values` arrays to update different cells.
