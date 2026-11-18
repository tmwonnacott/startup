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
const leaderboardCollection = client.db('neverword').collection('leaderboard');

async function connectToDatabase() {
  await client.connect();
  await client.db('neverword').command({ ping: 1 });
  await userCollection.createIndex({ email: 1 }, { unique: true });
  await leaderboardCollection.createIndex({ length: -1, createdAt: -1 });
  await leaderboardCollection.createIndex(
    { normalizedWord: 1 },
    {
      name: 'unique_normalized_leaderboard_word',
      unique: true,
      partialFilterExpression: { normalizedWord: { $type: 'string' } },
    },
  );
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

async function addLeaderboardScore(score) {
  const normalizedWord = score.word.toLowerCase();
  const createdAt = new Date();
  const previewScore = { ...score, createdAt };

  const existingScore = await leaderboardCollection.findOne(
    { word: score.word },
    { collation: { locale: 'en', strength: 2 } },
  );
  if (existingScore) {
    return { inserted: false, score: previewScore };
  }

  const savedScore = { ...previewScore, normalizedWord };
  try {
    await leaderboardCollection.insertOne(savedScore);
    return { inserted: true, score: savedScore };
  } catch (error) {
    if (error.code === 11000) {
      const duplicate = await leaderboardCollection.findOne({ normalizedWord });
      if (duplicate) {
        return { inserted: false, score: previewScore };
      }
    }
    throw error;
  }
}

async function getLeaderboardEntries() {
  return leaderboardCollection
    .aggregate([
      { $sort: { length: -1, createdAt: -1 } },
      {
        $group: {
          _id: { $toLower: '$word' },
          entry: { $first: '$$ROOT' },
        },
      },
      { $replaceRoot: { newRoot: '$entry' } },
      { $sort: { length: -1, createdAt: -1 } },
      { $limit: 10 },
      {
        $project: {
          _id: 0,
          username: 1,
          word: 1,
          length: 1,
          createdAt: 1,
        },
      },
    ])
    .toArray();
}

async function closeDatabaseConnection() {
  await client.close();
}

module.exports = {
  addUser,
  addLeaderboardScore,
  closeDatabaseConnection,
  connectToDatabase,
  getLeaderboardEntries,
  getUserByEmail,
  getUserByToken,
  removeUserToken,
  setUserToken,
};
