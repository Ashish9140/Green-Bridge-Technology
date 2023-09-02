require('dotenv').config();
const express = require('express');
const app = express();
const router = require('./routes');
const hostname = "82.165.104.134";
const PORT = process.env.PORT || 5000;
app.use(express.json({ limit: '8mb' }));

const cors = require('cors');
app.use(cors());
app.use(router);

app.use('/uploads', express.static('uploads'));

app.get("/", (req, res) => {
    res.send({ message: "Hello From Smart Snapper Server" });
})

// app.listen(PORT, hostname, () => {
//     console.log("Server is running on PORT", PORT);
// })

app.listen(PORT, () => {
    console.log("Server is running on PORT", PORT);
})