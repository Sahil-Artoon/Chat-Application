// File: index.mjs
import express from 'express';
import http from 'http';
import path from 'path';
import { Server } from 'socket.io';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import connectDB from './config/connectDB.js';
import router from './Router/userRouter.js';
import { addNewSocketId, addUserData, findAlluser, findAlluserAtSearchTime, findAlluserForGroup, findUserWithRegex, loginUser, updateSocketId } from './controller/userController.js';
import { addChat, findPaseChatMessages, getCurrentChatData } from './controller/chatController.js';
import { createGroup, getAllGroups } from './controller/groupController.js';
import { addGroupChat, pastGroupChat } from './controller/groupChatController.js';

connectDB()

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const server = http.createServer(app);
global.io = new Server(server);

io.on('connection', async (socket) => {
    console.log(socket.id);
    socket.on('ADD_SOCKET_ID', async (data) => {
        await addNewSocketId(data, socket.id);
    })
    socket.on("ADD_USER_DATA", async (data) => {
        const resultOfAddUser = await addUserData(data, socket.id)
        // console.log("resultOfAddUser = ", resultOfAddUser)

    })
    socket.on('LOGIN_USER', async (data) => {
        await loginUser(data, socket.id)
    })

    socket.on('ALL_USER', async () => {
        await findAlluser(socket.id)
    })
    socket.on('SEARCH_USER', async (data) => {
        await findUserWithRegex(data, socket.id)
    })
    socket.on('ALL_USER_AT_SEARCH', async (data) => {
        await findAlluserAtSearchTime(socket.id);
    })
    socket.on('GET_ALL_USER_FOR_GROUP', async (data) => {
        await findAlluserForGroup(socket.id)
    })

    socket.on("ADD_CHAT", async (data) => {
        await addChat(data, socket.id)
    })
    socket.on('GET_CHAT_DATA', async (data) => {
        await getCurrentChatData(data, socket.id)
    })
    socket.on('PAST_CHAT_MESSAGE', async (data) => {
        await findPaseChatMessages(data, socket.id)
    })

    socket.on('CREATE_GROUP', async (data) => {
        await createGroup(data, socket.id)
    })

    socket.on('GET_ALL_GROUP', async (data) => {
        await getAllGroups(data, socket.id)
    })

    socket.on('ADD_GROUP_CHAT', async (data) => {
        await addGroupChat(data, socket.id)
    })

    socket.on('PAST_GROUP_CHAT', async (data) => {
        await pastGroupChat(data, socket.id)
    })

    socket.on('disconnect', async () => {
        await updateSocketId(socket.id);
    })
})

app.use(express.json());
app.use(express.static('public'));
app.use('/', router);

const port = process.argv[2] || 5000;
server.listen(port, () => console.log(`App listening on port ${port}!`));
