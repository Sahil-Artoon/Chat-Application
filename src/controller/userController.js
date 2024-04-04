import { User } from "../model/userModel.js";
import { fileURLToPath } from 'url';
import path from "path";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// This is For Send File to User
const sendFileToUser = (req, res) => {
    try {
        console.log("file sending");
        const filePath = path.join(__dirname, "../public", "index.html");
        return res.sendFile(filePath);
    } catch (error) {
        console.error(error.message);
        return res.status(400).json({ message: error.message })
    }
}

// This is For Get Data Of Users
const addUserData = async (data, socketID) => {
    try {
        const { name, mobile } = data
        if (!name && !mobile) return io.to(socketID).emit("ADD_USER_DATA", { status: 404, message: "Enter Valid Data" })
        const checkUserIsExistOrNot = await User.findOne({ "mobile": mobile })
        if (checkUserIsExistOrNot) return io.to(socketID).emit("ADD_USER_DATA", { status: 409, message: "User already exists" })

        const userCreate = await User.create({
            name,
            mobile,
            socketId: socketID
        })
        if (!userCreate) return ({ message: "can't create user" })
        return io.to(socketID).emit("ADD_USER_DATA", { status: 200, message: "ok", userCreate })
    } catch (error) {
        console.log(error.message)
        return io.to(socketID).emit("ADD_USER_DATA", { error: error.message, message: "Bad request" })
    }
}

const loginUser = async (data, socketID) => {
    try {
        const { mobile } = data
        if (!mobile) return io.to(socketID).emit('LOGIN_USER_RES', { message: "Enter Valid Data" })

        const findUser = await User.findOne({ "mobile": mobile })
        // console.log("Find With Mobile Number", findUser)
        if (!findUser) return io.to(socketID).emit('LOGIN_USER_RES', { status: 404, message: "User Not Found" })
        return io.to(socketID).emit('LOGIN_USER_RES', { status: 200, message: "ok", findUser })

    } catch (error) {
        console.log(error.message)
        return io.to(socketID).emit('LOGIN_USER_RES', { message: error.message })
    }
}

const findAlluser = async (socketID) => {
    try {
        const users = await User.find({})
        if (!users) return io.to(socketID).emit('ALL_USER', { message: "can't find user" })
        return io.to(socketID).emit('ALL_USER', users)
    } catch (error) {
        return io.to(socketID).emit('ALL_USER', { message: error.message })
    }
}

export { addUserData, sendFileToUser, loginUser, findAlluser }