import { mongoose } from "mongoose"
import { GroupChat } from "../model/groupChatModel.js"
import { Group } from "../model/groupModel.js"
import { User } from "../model/userModel.js"


const addGroupChat = async (data, socketID) => {
    try {
        const { sender, receiver, message } = data
        if (!sender && !receiver && !message) return io.to(socketID).emit('ADD_GROUP_CHAT', { status: 404, message: "Please Send Valid sender, receiver, message" })

        const findGroupChat = await Group.findById(receiver).populate('members')
        // console.log("findGroupChat::::::::", findGroupChat)
        if (!findGroupChat) return io.to(socketID).emit('ADD_GROUP_CHAT', { status: 404, message: "Can't Found Group By Id." })

        const addGroupChat = await GroupChat.create({
            sender,
            receiver,
            message
        })
        if (!addGroupChat) return io.to(socketID).emit('ADD_GROUP_CHAT', { status: 404, message: "Can't add data" })
        let socketIds = [];
        for (let i = 0; i < findGroupChat.members.length; i++) {
            socketIds.push(findGroupChat.members[i].socketId)
        }
        return io.to(socketIds).emit('ADD_GROUP_CHAT', { status: 200, message: "ok", addGroupChat });
    } catch (error) {
        console.log("addGroupChat", error.message)
        return io.to(socketID).emit("ADD_GROUP_CHAT", { status: 500, message: error.message });
    }
}

const pastGroupChat = async (data, socketID) => {
    try {
        // console.log("PAST_GROUP_CHAT:::::::", data)
        const { sender, receiver } = data
        if (!receiver && !sender) return io.to(socketID).emit('PAST_GROUP_CHAT', { status: 404, message: "Plz send Data Of sender and receiver" })
        let id = new mongoose.Types.ObjectId(receiver)
        const pastChatData = await GroupChat.find({ receiver: id }).populate('sender receiver')
        if (!pastChatData) return false
        // let socketIds = [];
        // for (let i = 0; i < pastChatData[0].receiver.members.length; i++) {
        //     const dataOfGroupMembers = await User.findById(pastChatData[0].receiver.members[i])
        //     // console.log(`dataOfGroupMembers${i}::::${dataOfGroupMembers.socketId}`)
        //     socketIds.push(dataOfGroupMembers.socketId)
        // }
        return io.to(socketID).emit('PAST_GROUP_CHAT', { status: 200, message: "ok", pastChatData });
    } catch (error) {
        console.log("pastGroupChat", error.message)
        return io.to(socketID).emit("PAST_GROUP_CHAT", { status: 500, message: error.message });
    }
}

export { addGroupChat, pastGroupChat }