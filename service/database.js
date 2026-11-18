const fs = require('node:fs');
const path = require('node:path');
const { MongoClient } = require('mongodb');

function getMongoUri() {
  if (process.env.MONGODB_URI) {
    return process.env.MONGODB_URI;
  }

  const configPath = process.env.MONGODB_CONFIG_PATH || path.resolve(__dirname, '../dbconfig.json');
  let config;
  try {
    config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
  } catch (error) {
    throw new Error(`Could not load MongoDB configuration at ${configPath}: ${error.message}`);
  }

  const hostname = config.hostname?.replace(/^mongodb\+srv:\/\//, '').replace(/^@+/, '').replace(/\/+$/, '');
  if (!config.userName || !config.password || !hostname) {
    throw new Error('MongoDB configuration must provide userName, password, and hostname.');
  }

  return `mongodb+srv://${encodeURIComponent(config.userName)}:${encodeURIComponent(config.password)}@${hostname}`;
}

const client = new MongoClient(getMongoUri());
const userCollection = client.db('neverword').collection('user');

async function connectToDatabase() {
  await client.connect();
  await client.db('neverword').command({ ping: 1 });
  await userCollection.createIndex({ email: 1 }, { unique: true });
}

function getUserByEmail(email) {
  return userCollection.findOne({ email });
}

function getUserByToken(token) {
  return token ? userCollection.findOne({ token }) : null;
}

async function addUser(user) {
  return userCollection.insertOne(user);
}

async function setUserToken(email, token) {
  const result = await userCollection.updateOne({ email }, { $set: { token } });
  if (result.matchedCount !== 1) {
    throw new Error(`Could not set authentication token for ${email}`);
  }
}

async function removeUserToken(token) {
  if (token) {
    await userCollection.updateOne({ token }, { $unset: { token: '' } });
  }
}

async function closeDatabaseConnection() {
  await client.close();
}

module.exports = {
  addUser,
  closeDatabaseConnection,
  connectToDatabase,
  getUserByEmail,
  getUserByToken,
  removeUserToken,
  setUserToken,
};
