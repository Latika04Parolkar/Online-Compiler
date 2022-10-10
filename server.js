require('./db/config/db');
const express = require('express');
const env = require("dotenv");
env.config();
const cors = require('cors');

const index = require('./routes/index');

const PORT = process.env.PORT_NUMBER;

const app = express();

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(index);

app.listen(PORT, () => {
    console.log(`Listening at port ${PORT}!`);
});

// C:\Program Files\MongoDB\Server\5.0\bin
// C:\Redis-x64-3.0.504 --- redis-server