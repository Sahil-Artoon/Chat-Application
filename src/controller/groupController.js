import { Chat } from "../model/chatModel.js";
import { Group } from "../model/groupModel.js";
import { User } from "../model/userModel.js";


const createGroup = async (data, socketID) => {
    try {
        const { selectedId, nameOfGroup } = data
        if (selectedId.length == 0) return io.to(socketID).emit("CREATE_GROUP", { status: 404, message: "Please select group members." })
        if (!nameOfGroup) return io.to(socketID).emit("CREATE_GROUP", { status: 404, message: "Please enter group name." })

        const makeGroup = await Group.create({
            groupName: nameOfGroup,
            members: selectedId
        })
        const dataOfNewGroup = await Group.findById(makeGroup._id).populate('members')
        console.log("CREATE_GROUP:::::::❤",dataOfNewGroup)
        let socketIds = []
        for (let i = 0; i < dataOfNewGroup.members.length; i++) {
            socketIds.push(dataOfNewGroup.members[i].socketId)
        }
        if (!makeGroup) return io.to(socketID).emit("CREATE_GROUP", { status: 404, message: "Cam't add Data of group." })

        return io.to(socketIds).emit("CREATE_GROUP", { status: 200, message: "ok", makeGroup });

    } catch (error) {
        console.log("error at createGroup", error.message)
        return io.to(socketID).emit("CREATE_GROUP", { status: 500, message: error.message });
    }
}

const getAllGroups = async (data, socketID) => {
    try {
        if (!data) return io.to(socketID).emit("GET_ALL_GROUP", { status404, message: "can't Get UserID !!!" })

        const findUser = await User.findById(data)
        if (!findUser) return io.to(socketID).emit("GET_ALL_GROUP", { status404, message: "can't Get user By UserID !!!" })

        const groups = await Group.find({ members: data })
        if (!groups) return io.to(socketID).emit("GET_ALL_GROUP", { status: 404, message: "can't Get Groups!!!" })

        // console.log("GET_ALL_GROUP :::::", groups);
        return io.to(socketID).emit("GET_ALL_GROUP", { status: 200, message: "ok", groups });
    } catch (error) {
        console.log("getAllGroups", error.message)
        return io.to(socketID).emit("GET_ALL_GROUP", { status: 500, message: error.message });
    }
}


export { createGroup, getAllGroups }