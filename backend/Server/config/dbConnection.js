import dns from "node:dns";
import mongoose from "mongoose";

/**
 * @Connects to MongoDB database
 */
mongoose.set('strictQuery', false);

const connectionToDB= async ()=>{

    try {
        const dnsServers = process.env.MONGODB_DNS_SERVERS
            ?.split(',')
            .map((server) => server.trim())
            .filter(Boolean);

        if (dnsServers?.length) {
            dns.setServers(dnsServers);
        }

        const mongoUrl = process.env.MONGODB_URL || process.env.MONGO_URI || 'mongodb://localhost:27017/lms_database';
        const clientOptions = {
            serverApi: {
                version: '1',
                strict: true,
                deprecationErrors: true,
            },
        };
        const { connection } = await mongoose.connect(mongoUrl, clientOptions);
        await connection.db.admin().command({ ping: 1 });

        if(connection){
            console.log(`Connected to MongoDB :${connection.host}`);
        }

        return true;
    } catch (e) {
        console.error('MongoDB connection failed:', e?.message || e);
        // Do not exit the process here so the server can start for smoke tests.
        // Return so callers can decide how to proceed when DB is unavailable.
        return false;
    } 
}
export default connectionToDB;