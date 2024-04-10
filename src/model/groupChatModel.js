import { mongoose } from "mongoose";

const groupChatSchema = mongoose.Schema({
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    receiver: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Group",
        required: true
    },
    message: {
        type: String,
        required: true
    }
})

const GroupChat = mongoose.model("GroupChat", groupChatSchema);

export { GroupChat };