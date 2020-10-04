const db = require("../models");
const config = require("../config/auth.config");
const User = db.user;

const Op = db.Sequelize.Op;

var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");

exports.signup = (req, res) => {
    // Save User to Database
    User.create({
        username: req.body.username,
        login: req.body.login,
        password: bcrypt.hashSync(req.body.password, 8)
    })
        .then(user => {
                var token = jwt.sign({ id: user.id }, config.secret, {
                    expiresIn: 86400 // 24 hours
                });
                res.status(200).send({
                    id: user.id,
                    username: user.username,
                    login: user.login,
                    accessToken: token
                });
        }
        ).catch(err => {
            res.status(500).send({ message: err.message });
        });
};

exports.signin = (req, res) => {
    User.findOne({
        where: {
            login: req.body.login
        }
    })
        .then(user => {
            if (!user) {
                return res.status(404).send({ message: "Пользователь не найден." });
            }

            var passwordIsValid = bcrypt.compareSync(
                req.body.password,
                user.password
            );

            if (!passwordIsValid) {
                return res.status(401).send({
                    accessToken: null,
                    message: "Неправильный пароль!"
                });
            }

            var token = jwt.sign({ id: user.id }, config.secret, {
                expiresIn: 86400 // 24 hours
            });

                res.status(200).send({
                    id: user.id,
                    username: user.username,
                    login: user.login,
                    accessToken: token
                });
        })
        .catch(err => {
            res.status(500).send({ message: err.message });
        });
};
