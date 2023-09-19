require('dotenv').config();
const express = require('express');
const nodemailer = require("nodemailer");
const app = express();
const router = require('./routes');
const hostname = "82.165.104.134";
const PORT = process.env.PORT || 5000;
const DBConnect = require("./dbmongo");
const projectModal = require('./project-modal');
app.use(express.json({ limit: '8mb' }));

const cors = require('cors');
app.use(cors());
app.use(router);

// Database
DBConnect();

app.use('/uploads', express.static('uploads'));

app.get("/", (req, res) => {
    res.send({ message: "Hello From Smart Snapper Server" });
})

app.post('/sendemail', async (req, res) => {
    try {
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: "aatechkumar@gmail.com",
                pass: "pkhsoykjgdbtsgel",
            },
        });

        const { name, message, email, subject } = req.body;
        const content =
            `<div style="font-family: Helvetica,Arial,sans-serif;min-width:1000px;overflow:auto;line-height:2>
                    <p style="font-size:0.9em;">${name} <br /> ${email} <br /> from Ashish Portfolio </p>
                    <p>${message}</p>
                    <hr style="border:none;border-top:1px solid #eee" />
                    <div style="float:right;padding:8px 0;color:#aaa;font-size:0.8em;line-height:1;font-weight:300">
                          <p>Ashish.com Inc</p>
                          <p>1600 North-East-South-West</p>
                          <p>India</p>
                    </div>
              </div>`;

        await transporter.sendMail({
            from: process.env.USER,
            to: 'ashishkumar.nitsri@gmail.com',
            subject: `${subject}`,
            html: content,
        });
        console.log("email sent successfully");
        return res.status(200);
    } catch (error) {
        console.log("email not sent!");
        console.log(error);
        return error;
    }
})

app.get('/projects', async (req, res) => {
    const projects = await projectModal.find().sort({ zindex: -1 });
    res.status(200).send({
        message: 'Hello from Ashish Portfolio!',
        projects
    })
})


app.listen(PORT, () => {
    console.log("Server is running on PORT", PORT);
})