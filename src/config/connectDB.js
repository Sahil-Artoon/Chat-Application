import mongoose from "mongoose";
const connectDB = async () => {
    try {
        await mongoose.connect("mongodb://localhost:27017/chatapp")
        console.log("connection successfull with database");
    } catch (error) {
        return console.log(error.message)
    }
}
export default connectDB;