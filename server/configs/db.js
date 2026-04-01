import mongoose from "mongoose";

const connectDB = async () => {
    try {
        mongoose.connection.on("connected", ()=> {console.log("Database connected successfully")})
        let mongoDBUri = process.env.MONGODB_URI;
        const projectName = "resume-builder";

        if(!mongoDBUri) {
            console.log("MongoDB URI not set - running without database");
            return;
        }

        if(mongoDBUri.endsWith('/')) {
            mongoDBUri = mongoDBUri.slice(0, -1);
        }

        await mongoose.connect(`${mongoDBUri}/${projectName}`)
    } catch (error) {
        console.log("Error connecting to MongoDB - running without database:", error.message)
    }
}

export default connectDB;