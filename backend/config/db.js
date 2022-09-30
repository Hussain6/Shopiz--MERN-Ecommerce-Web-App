import mongoose from "mongoose";

const connectDB = async () => {
    try {
        const conn = await mongoose.connect("mongodb+srv://imessage:admin@cluster0.z6u4aec.mongodb.net/proshop?retryWrites=true&w=majority", {
            useUnifiedTopology: true,
            useNewUrlParser: true
        })
        console.log(`MongoDb Connected: ${conn.connection.host}`)
    }
    catch (error) {
        console.error(`Error: ${error.message}`)
        process.exit(1)
    }
}
export default connectDB