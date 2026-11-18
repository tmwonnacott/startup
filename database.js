import database from './service/database.js';

try {
  await database.connectToDatabase();
  console.log('Connected to the NeverWord database.');
} catch (error) {
  console.error(`MongoDB connection test failed: ${error.message}`);
  process.exitCode = 1;
} finally {
  await database.closeDatabaseConnection();
}