const router = require('express').Router();
const fs = require('fs');
const jwt = require('jsonwebtoken');

router.post('/', (req, res) => {
    var log = fs.readFileSync('./src/file/loginData.json');
    var auth = JSON.parse(log);
    emails = [];
    passwords = [];
    for (i = 0; i < auth.length; i++) {
        emails.push(auth[i].email);
        passwords.push(auth[i].password);
    }
    if (!emails.includes(req.body.email)) {
        res.send({ notEmail: "User not found" });
    } else if (req.body.cnfpass !== auth[0].password) {
        res.send({ wrongPasswd: "Wrong password" });
    } else {
        jwt.sign(auth, 'secret', { expiresIn: '24h' }, (err, data) => {
            res.status(200).json({ msg: "Logged In", token: data });
        })
    }
})

module.exports = router;