import { User } from "../model/userModel.js";
import { fileURLToPath } from 'url';
import path from "path";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// This is For Send File to User
const sendFileToUser = (req, res) => {
    try {
        console.log("file sending");
        const filePath = path.join(__dirname, "public", "index.html");
        res.sendFile(filePath);
    } catch (error) {
        console.error(error.message);
        return res.status(400).json({ message: error.message })
    }
}

// This is For Get Data Of Users
const getUserData = async (req, res) => {
    try {
        const { name, mobile } = req.body
        if (!name && !mobile) return res.status(404).json({ message: 'Invalid Data' })
        const checkUserIsExistOrNot = await User.findOne({ "mobile": mobile })
        if (checkUserIsExistOrNot) return res.status(409).json({ message: "User already exists" })

        const userCreate = await User.create({
            name,
            mobile
        })
        if (!userCreate) return res.status(500).json({ message: "can't create user" })
        return res.status(200).json({
            message: "User created successfully",
            user: userCreate
        })
    } catch (error) {
        return res.status(400).json({
            error: error.message,
            message: "Bad request"
        })
    }
}

export { getUserData, sendFileToUser }