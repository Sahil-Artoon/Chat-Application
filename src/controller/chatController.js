import { Chat } from "../model/chatModel.js";
import { User } from "../model/userModel.js";

const addChat = async (data, socketID) => {
    try {
        const { sender, receiver, message } = data;
        if (!sender && !receiver && !message) return io.to(socketID).emit("ADD_CHAT", { status: 404, message: "Enter Valid Data" });

        const Data = await Chat.create({
            sender,
            receiver,
            message
        })
        if (!Data) return io.to(socketID).emit("ADD_CHAT", { status: 500, message: "Can't add Data !!!" });
        return io.to(socketID).emit("ADD_CHAT", { status: 200, message: "ok", Data });
    } catch (error) {
        console.log(error.message);
        return io.to(socketID).emit("ADD_CHAT", { status: 500, message: "Internal Server Error" });
    }
}

const getCurrentChatData = async (data, socketID) => {
    try {
        if (data.Data) {
            // console.log("Data.Data is", data)
            let senderUser = await User.findById(data.Data.sender)
            let receiverUser = await User.findById(data.Data.receiver)
            if (!senderUser && !receiverUser) return io.to(socketID).emit("GET_CHAT_DATA", { status: 404, message: "User not found" });
            const sendData = await Chat.findById(data.Data._id).populate('sender receiver');
            // console.log(sendData);
            let senderUserid = sendData.sender.socketId
            let receiverUserid = sendData.receiver.socketId
            let socketIDs = [senderUserid, receiverUserid]
            return io.to(socketID).emit("GET_CHAT_DATA", { status: 200, message: "ok", sendData });
        } else {
            return io.to(socketID).emit("GET_CHAT_DATA", { status: 404, message: "Enter Valid Data" });
        }
    } catch (error) {
        console.log(error);
        return io.to(socketID).emit("GET_CHAT_DATA", { status: 500, message: "Internal Server Error" });
    }
}

const findPaseChatMessages = async (data, socketID) => {
    try {
        const { senderId, receiverId } = data
        // console.log("SenderID::::::::::", senderId)
        // console.log("receiverId::::::::::", receiverId)
        if (!senderId && !receiverId) return io.to(socketID).emit("PAST_CHAT_MESSAGE", { status: 404, message: "Invalid Data" });
        const chatData = await Chat.find({
            $or: [
                { sender: senderId, receiver: receiverId },
                { sender: receiverId, receiver: senderId }
            ]
        }).sort({ createdAt: 'asc' }).populate('sender receiver')
        if (chatData == "") return io.to(socketID).emit("PAST_CHAT_MESSAGE", { status: 200, message: "ok", chatData });
        let senderSocketID = chatData[0].sender.socketId
        let receiverSocketID = chatData[0].receiver.socketId
        // console.log("senderSocketID=>", senderSocketID)
        // console.log("receiverSocketID===>", receiverSocketID)
        // console.log(chatData)
        let arrayOfSocketIds = [senderSocketID, receiverSocketID]
        return io.to(socketID).emit('PAST_CHAT_MESSAGE', { status: 200, message: 'ok', chatData })
    } catch (error) {
        console.log("error at findPaseChatMessages time.", error.message);
        return io.to(socketID).emit("PAST_CHAT_MESSAGE", { status: 500, message: "Internal Server Error" });
    }
}

export { addChat, getCurrentChatData, findPaseChatMessages }