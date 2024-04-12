import { User } from "../model/userModel.js";
import { fileURLToPath } from 'url';
import path from "path";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// This is For Send File to User
const sendFileToUser = (req, res) => {
    try {
        console.log("file sending");
        const filePath = path.join(__dirname, "../../public", "index.html");
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
        if (!users) return io.emit('ALL_USER', { message: "can't find user" })
        return io.emit('ALL_USER', { message: "ok", users })
    } catch (error) {
        return io.emit('ALL_USER', { message: error.message })
    }
}

const findUserWithRegex = async (data, socketID) => {
    try {
        if (data) {
            const regex = new RegExp(data, "i");
            const users = await User.find({ "name": regex })
            if (!users) return io.to(socketID).emit("SEARCH_USER", { message: "can't find user" })
            return io.to(socketID).emit("SEARCH_USER", { message: "ok", users })
        }
    } catch (error) {
        return io.to(socketID).emit("SEARCH_USER", { message: error.message })
    }
}

const findAlluserAtSearchTime = async (socketID) => {
    try {
        const users = await User.find({})
        if (!users) return io.to(socketID).emit('ALL_USER_AT_SEARCH', { message: "can't find user" })
        return io.to(socketID).emit('ALL_USER_AT_SEARCH', { message: "ok", users })
    } catch (error) {
        return io.to(socketID).emit('ALL_USER_AT_SEARCH', { message: error.message })
    }
}

const updateSocketId = async (socketID) => {
    try {
        const updateUser = await User.findOne({ socketId: socketID })
        if (updateUser) {
            updateUser.socketId = ""
            await updateUser.save({ validateBeforeSave: false })
            return true;
        }
    } catch (error) {
        console.log(error.message)
        return false;
    }
}

const addNewSocketId = async (data, socketID) => {
    try {
        const user = await User.findById(data._id)
        if (user) {
            user.socketId = socketID
            await user.save({ validateBeforeSave: false })
            return true;
        }
        return false;
    } catch (error) {
        console.log(error.message)
        return false;
    }
}

const findAlluserForGroup = async (socketID) => {
    try {
        const users = await User.find({})
        if (!users) return io.to(socketID).emit('GET_ALL_USER_FOR_GROUP', { message: "can't find user" })
        return io.to(socketID).emit('GET_ALL_USER_FOR_GROUP', { message: "ok", users })
    } catch (error) {
        console.log(error.message)
        return io.to(socketID).emit('GET_ALL_USER_FOR_GROUP', { message: error.message })
    }
}
export { addUserData, sendFileToUser, loginUser, findAlluser, findUserWithRegex, findAlluserAtSearchTime, updateSocketId, addNewSocketId, findAlluserForGroup }