// database.js (outside of src folder)
const fs = require('fs');
const path = require('path');

const databasePath = path.resolve(__dirname, 'database.json');

function getUsers() {
  if (!fs.existsSync(databasePath)) {
    return [];
  }
  const data = fs.readFileSync(databasePath);
  return JSON.parse(data);
}

function saveUsers(users) {
  fs.writeFileSync(databasePath, JSON.stringify(users, null, 2));
}

module.exports = { getUsers, saveUsers };
