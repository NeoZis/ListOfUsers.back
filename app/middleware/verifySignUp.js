const db = require("../models");
const User = db.user;

checkDuplicateLogin = (req, res, next) => {
    // Username
    User.findOne({
        where: {
            login: req.body.login
        }
    }).then(user => {
        if (user) {
            res.status(400).send({
                message: "Ошибка! Данный логин уже используется!"
            });
            return;
        }
            next();
    });
};

const verifySignUp = {
    checkDuplicateLogin: checkDuplicateLogin
};

module.exports = verifySignUp;
