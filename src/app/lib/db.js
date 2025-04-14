import "server-only";

const { MongoClient } = require("mongodb");

if (!process.env.MONGOURI) {
  throw new Error("No Mongo URI Found");
}

const client = new MongoClient(process.env.MONGOURI);

async function getDB(dbName) {
  try {
    // Connect to MongoDB
    await client.connect();
    console.log(">>>>>DB CONNECTED<<<<<");

    // Get the database
    const db = client.db(dbName);

    return db;
  } catch (error) {
    console.error("Error in connecting to DB:", error);
    throw error;
  }
}

export async function getCollection(collectionName) {
  const db = await getDB("nextjs-todo-app");
  if (db) {
    return db.collection(collectionName);
  }

  return null;
}
