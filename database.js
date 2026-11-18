import { readFile } from 'node:fs/promises';
import { MongoClient } from 'mongodb';

const config = JSON.parse(await readFile(new URL('./dbconfig.json', import.meta.url), 'utf8'));
const hostname = config.hostname.replace(/^@+/, '').replace(/\/+$/, '');

if (!config.userName || !config.password || !hostname) {
  throw new Error('dbconfig.json must provide userName, password, and hostname.');
}

const url = `mongodb+srv://${encodeURIComponent(config.userName)}:${encodeURIComponent(config.password)}@${hostname}`;
const client = new MongoClient(url);

async function main() {
  try {
    await client.connect();
    const collection = client.db('rental').collection('house');
    const house = {
      name: 'Beachfront views',
      summary: 'From your bedroom to the beach, no shoes required',
      property_type: 'Condo',
      beds: 1,
    };
    const insertResult = await collection.insertOne(house);
    console.log(`Connected to MongoDB. Inserted house with _id: ${insertResult.insertedId}`);
  } finally {
    await client.close();
  }
}

main().catch((error) => {
  console.error('MongoDB connection or insert failed:', error.message);
  process.exitCode = 1;
});