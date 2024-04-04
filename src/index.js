// File: index.mjs
import express from 'express';
import http from 'http';
import path from 'path';
import { Server } from 'socket.io';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import connectDB from './config/connectDB.js';
import router from './Router/userRouter.js';

connectDB()

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.json());
app.use(express.static('public'));
app.use('/', router);

const port = process.argv[2] || 5000;
server.listen(port, () => console.log(`App listening on port ${port}!`));
