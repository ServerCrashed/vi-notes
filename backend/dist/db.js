import { Db, MongoClient } from 'mongodb';
let client = null;
let database = null;
export async function connectDb() {
    const mongoUri = process.env.MONGODB_URI;
    if (!mongoUri) {
        throw new Error('MONGODB_URI is required');
    }
    if (database) {
        return database;
    }
    client = new MongoClient(mongoUri);
    await client.connect();
    database = client.db();
    await database.collection('users').createIndex({ email: 1 }, { unique: true });
    return database;
}
export function getDb() {
    if (!database) {
        throw new Error('Database not connected. Call connectDb() first.');
    }
    return database;
}
export async function closeDb() {
    if (client) {
        await client.close();
        client = null;
        database = null;
    }
}
//# sourceMappingURL=db.js.map