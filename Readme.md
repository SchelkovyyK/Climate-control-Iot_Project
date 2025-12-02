
# 1. Before starting, ensure you have the following installed on your system:
 - Node.js (and npm)
 - PostgreSQL database running and accessible. Or any other DB you want to use but then you need to rewrite the code 

# 2. Server Setup
The server component is responsible for collecting data from the Chrome plugin and serving the dashboard frontend.


## Step 1: Install Dependencies
Navigate to the server directory and install the required npm packages. The project uses the following dependencies as defined in package.json:
```json
{
  "dependencies": {
    "cors": "^2.8.5",
    "dotenv": "^17.2.3",
    "express": "^5.1.0",
    "node-cron": "^4.2.1",
    "pg": "^8.16.3",
    "socket.io": "^4.7.2",
    "ws": "^8.18.3"
  }
}
```

```bash
cd server
npm install
```

## Step 2: Configure Environment Variables (.env)
The database logic relies on environment variables. Create a file named .env in the root of the server directory and add your PostgreSQL credentials:

```ini
DB_USER=your_username
DB_HOST=localhost
DB_NAME=your_database_name
DB_PASS=your_database_password
DB_PORT=5432
```

## Step 3: Database Logic (db.js)
This file handles all database interactions, including insertion, retrieval, clearing, and scheduled cleanup of old logs:

You will have to create your own **Table** and replace this **sensor_logs**

```javascript
async function insertLog(log) {
  return pool.query(
    `INSERT INTO sensor_logs (time, temp, hum, gas, emergency)
     VALUES ($1, $2, $3, $4, $5)`,
    [log.time, log.temp, log.hum, log.gas, log.emergency]
  );
}
```

## Step 4: Start the Server
Run the main server file. The server will start on http://localhost:3000 by default.
```bash
node index.js
```

# 3. Chrome Plugin Setup
The plugin captures console logs and exceptions from the browser and sends them to the server. Its configuration is defined in manifest.json:
```json
{
  "name": "Console Copy Tool",
  "version": "1.0",
  "manifest_version": 3,
  "description": "Capture everything from DevTools Console",
  "permissions": [
    "storage",
    "clipboardWrite",
    "debugger",
    "tabs",
    "activeTab"
  ],
  "devtools_page": "devtools.html",
  "background": {
    "service_worker": "background.js"
  },
  "host_permissions": [
    "<all_urls>"
  ]
}
```

## Step 1: Enable Developer Mode in Chrome
1. Open your Chrome browser.
2. Navigate to chrome://extensions/.
3. In the top-right corner, toggle the "Developer mode" switch to ON.

## Step 2: Load the Plugin
1. Click the "Load unpacked" button.
2. Navigate to the project root directory and select the created new folder.
3. The "Console Copy" extension should now appear in your list.

## Step 3: Usage
The plugin works via a DevTools panel:
1. Open Chrome DevTools (Right-click -> Inspect, or F12).
2. Navigate to the new "Console Copy" tab/panel.
3. Click "Start Recording" to attach the debugger and begin sending logs to the server.

# 4. Dashboard (Frontend)
The dashboard is served by the Node.js server from the dashboard/build directory.
To access the dashboard, simply navigate to http://localhost:3000 in your web browser.