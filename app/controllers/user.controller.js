const db = require("../models");
const User = db.user;

const Op = db.Sequelize.Op;

exports.allAccess = (req, res) => {
    res.status(200).send("Публичная информация.");
};

exports.userBoard = (req, res) => {
    const user = req.query.username;
    let condition = user ? { user: { [Op.like]: `%${user}%` } } : null;

    User.findAll({ where: condition })
        .then(data => {
            data = data.map(item => {
                let user = {id: item.id, username: item.username, login: item.login};
                return user})
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while retrieving users."
            });
        });
};



