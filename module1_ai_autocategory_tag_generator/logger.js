import fs from 'fs';

const LOG_FILE = 'ai_logs.json';

export const logInteraction = (prompt, response) => {
  let logs = [];

  // 1. If the file exists, read the current logs first
  if (fs.existsSync(LOG_FILE)) {
    const data = fs.readFileSync(LOG_FILE);
    logs = JSON.parse(data);
  }

  // 2. Add the new interaction to the list
  logs.push({
    timestamp: new Date().toISOString(),
    prompt,
    response
  });

  // 3. Save the entire array back to the file
  fs.writeFileSync(LOG_FILE, JSON.stringify(logs, null, 2));
};