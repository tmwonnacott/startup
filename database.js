import { readFile } from 'node:fs/promises';
import { MongoClient } from 'mongodb';

const config = JSON.parse(await readFile(new URL('./dbconfig.json', import.meta.url), 'utf8'));
const hostname = config.hostname.replace(/^@+/, '').replace(/\/+$/, '');

if (!config.userName || !config.password || !hostname) {
  throw new Error('dbconfig.json must provide userName, password, and hostname.');
}

const url = `mongodb+srv://${encodeURIComponent(config.userName)}:${encodeURIComponent(config.password)}@${hostname}`;
const client = new MongoClient(url);
const db = client.db('rental');
const collection = db.collection('house');

async function main() {
  try {
    await db.command({ ping: 1 });
    console.log(`DB connected to ${hostname}`);

    const house = {
      name: 'Beachfront views',
      summary: 'From your bedroom to the beach, no shoes required',
      property_type: 'Condo',
      beds: 1,
    };
    const insertResult = await collection.insertOne(house);

    try {
      const query = { property_type: 'Condo', beds: { $lt: 2 } };
      const options = {
        sort: { name: -1 },
        limit: 10,
      };
      const rentals = await collection.find(query, options).toArray();
      rentals.forEach((rental) => console.log(rental));
    } finally {
      const deleteResult = await collection.deleteOne({ _id: insertResult.insertedId });
      if (deleteResult.deletedCount !== 1) {
        throw new Error(`Could not remove temporary test house ${insertResult.insertedId}`);
      }
    }
  } finally {
    await client.close();
  }
}

main().catch((error) => {
  console.error(`MongoDB test failed: ${error.message}`);
  process.exitCode = 1;
});