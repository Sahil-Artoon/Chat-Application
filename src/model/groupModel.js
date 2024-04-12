import { mongoose } from "mongoose";

const groupSchema = mongoose.Schema({
    admin:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    }],
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
}, { timestamps: true })

const Group = mongoose.model("Group", groupSchema);

export { Group };