const express = require('express');
const app = express();
const port = 3000;
require('dotenv').config();

const { initSocket } = require('./socket');
const { createServer } = require('node:http');
const server = createServer(app);

const bodyParser = require('body-parser');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const path = require('path');

const route = require('./routes/index');
const connectDB = require('./config/connectDB');
const { askQuestion } = require('./utils/chatbot');

connectDB();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(cors({ origin: process.env.DOMAIN_URL, credentials: true }));

app.use(express.static(path.join(__dirname, '../src')));

app.use(cookieParser());

app.post('/api/chatbot', async (req, res) => {
    const { question } = req.body;
    const data = await askQuestion(question);
    return res.status(200).json(data);
});

route(app);

app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    res.status(statusCode).json({
        success: false,
        message: err.message || 'Lỗi server',
    });
});

initSocket(server);

server.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
