const express = require('express');
const mongoose = require('mongoose');
const app = express();
const cors = require("cors");
const { hashSync, compareSync } = require("bcrypt")
const User = require("./models/database.model");
const passport = require("passport");
const jwt = require("jsonwebtoken")
app.use(express.urlencoded({ extended: true }));
app.use(express.static("views"))
app.use(cors());
app.use(passport.initialize());

require("./middleware/passport.middleware")
app.get("/login", async (req, res) => {
    res.render("login");
})

app.get("/", async (req, res) => {

})

app.post("/register", async (req, res) => {
    const user = new User({
        username: req.body.username,
        password: hashSync(req.body.password, 10)
    })
    user.save()
        .then((user) => {
            res.send({ success: true, user: { id: user._id, username: user.username } });
        })
        .catch((error) => {
            res.send({ success: false, error })
        })
})

app.post("/login", async (req, res) => {

    User.findOne({ username: req.body.username })
        .then((user) => {
            console.log(user)
            if (!user) {
                return res.status(401).send({ success: false, message: "User not found" })
            }
            if (!compareSync(req.body.password, user.password)) {
                return res.status(401).send({ success: false, message: "Incorrect Password" })
            }
            const payload = {
                username: user.username, id: user._id
            }
            const token = jwt.sign(payload, "My secret", { expiresIn: "1d" });
            res.status(200).send({ success: true, message: "Login Success", token: "Bearer " + token });
        })
})

app.get("/protected", passport.authenticate("jwt", { session: false }), (req, res) => {
    return res.status(200).send({
        success: true,
        user: {
            id: req.user._id,
            username: req.user.username
        }
    })
})
app.listen(8000, () =>
    console.log("listening..."))