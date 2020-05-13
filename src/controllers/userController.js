const User = require('../models/userModel')
const bcrypt = require('bcryptjs')

// TODO estrarre parte di generazione token e hash password, queste sono solo prove

exports.get_user = async (req, res) => {
    const { name, email } = req.user
    res.status(200).send({ name, email })
}

exports.get_user_orders = async (req, res) => {
    // TODO
}

exports.delete_user = async (req, res) => {
    // TODO
}







