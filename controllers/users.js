const UserRouter = require('express').Router();
const User = require('../models/user');
const bcrypt = require('bcrypt');

UserRouter.post('/', async (request, response, next) => {
    const body = request.body;

    if (!body.password) {
        response.status(401).json({ error: 'Please give a password!' })
    }

    if (body.password && body.password.length < 3) {
        response.status(401).json({ error: 'password to short' })
    }

    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(body.password, saltRounds)

    const user = new User({
        username: body.username,
        name: body.name,
        passwordHash
    })

    try {
        const savedUser = await user.save();
        response.json(savedUser)
    } catch (error) {
        next(error);
    }
})

UserRouter.get('/', async (request, response) => {
    const users = await User.find({})
    response.json(users)
})

module.exports = UserRouter;