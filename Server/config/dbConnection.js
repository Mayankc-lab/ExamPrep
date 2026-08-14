import mongoose from "mongoose";

/**
 * @Connects to MongoDB database
 */
mongoose.set('strictQuery', false);

const connectionToDB= async ()=>{

    try {
        const mongoUrl = process.env.MONGODB_URL || process.env.MONGO_URI || 'mongodb://localhost:27017/lms_database';
        const{ connection}= await mongoose.connect(mongoUrl)
    
        if(connection){
            console.log(`Connected to MongoDB :${connection.host}`);
        }

    } catch (e) {
        console.error('MongoDB connection failed:', e?.message || e);
        // Do not exit the process here so the server can start for smoke tests.
        // Return so callers can decide how to proceed when DB is unavailable.
        return false;
    } 
}
export default connectionToDB;