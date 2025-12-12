// test-db.js
require('dotenv').config();
const { Client } = require('pg');

const client = new Client({
  connectionString: process.env.DATABASE_URL,
});

console.log("Attempting to connect...");
client.connect()
  .then(() => {
    console.log("✅ Success! Connected to Neon.");
    return client.end();
  })
  .catch(err => {
    console.error("❌ Connection failed:", err.message);
  });