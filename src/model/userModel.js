import { mongoose } from "mongoose";

const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    mobile: {
        type: String,
        required: true
    },
    socketId: {
        type: String
    }
}, { timestamps: true })

const User = mongoose.model("User", userSchema);

export { User };