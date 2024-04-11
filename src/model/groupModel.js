import { mongoose } from "mongoose";

const groupSchema = mongoose.Schema({
    groupName: {
        type: String,
        required: true,
        unique: true
    },
    members: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    }]
})

const Group = mongoose.model("Group", groupSchema);

export { Group };