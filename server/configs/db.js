import mongoose from "mongoose";

const connectDB = async () => {
    try {
        mongoose.connection.on("connected", ()=> {console.log("Data base connected successfully")})
        let mongoDBUri = process.env.MONGODB_URI;
        const projectName = "resume-builder";

        if(!mongoDBUri) {
            throw new Error("MongoDB URI environment varible not set")
        }

        if(mongoDBUri.endsWith('/')) {
            mongoDBUri = mongoDBUri.slice(0, -1);
        }

        await mongoose.connect(`${mongoDBUri}/${projectName}`)
    } catch (error) {
        console.error("Error connecting to Mongo DB", error)
    }
}

export default connectDB;