const PORT = 9001
const URLDB = 'mongodb://127.0.0.1:27017/'

import express from 'express'
import cors from 'cors'
import jsonwebtoken from 'jsonwebtoken';
import mongoose from 'mongoose'
import { secret } from './config.js'
import User from './models/User.js'
import Product from './models/Product.js'

const app = express()
app.use(cors())
app.use(express.json())

const generateAccessToken = (id, login, email) => {
    const payload = {
        id, login, email
    }

    return jsonwebtoken.sign(payload, secret, { expiresIn: '24h' })
}

const start = async () => {
    try {
        await mongoose.connect(URLDB)
        app.listen(PORT, () => console.log(`Сервер работает на порту ${PORT}`))
    } catch (e) {
        console.error(e)
    }
}

app.post('/registration', async (req, res) => {
    console.log(req.body)
    const { login, password, email } = req.body
    const user = new User({ login, password, email })

    try {
        await user.save()
    } catch (err) {
        if (err && err.code !== 11000) {
            res.json({
                message: 'Неизвестная ошибка.'
            })
                .status(500)

            return
        }

        //duplicate key
        if (err && err.code === 11000) {
            res.json({
                message: 'Не используйте повторно эти данные!'
            })
                .status(400)
            console.error('Не используйте повторно эти данные!')

            return
        }
    }

    res.json({
        message: 'Вы успешно зарегистрировались!'
    })
})

app.post('/login', async (req, res) => {
    console.log(req.body)
    const { login, password } = req.body
    let user

    try {
        user = await User.findOne({ login })
    } catch (err) {
        res.json({
            message: 'Неизвестная ошибка.'
        })
            .status(500)

        return
    }

    if (!user) {
        return res.status(400).json({ message: 'Пользователь отсутствует в базе.' })
    }
    if (user.password !== password) {
        return res.status(400).json({ message: 'Неверный логин или пароль!' })
    }
    const jwtToken = generateAccessToken(user._id, user.login, user.email)

    res.json({
        message: 'Вы успешно вошли на сайт!',
        token: jwtToken
    })
})

app.post('/user/changePassword', async (req, res) => {
    console.log(req.body)
    const { token, password } = req.body
    let user

    try {
        user = await User.findOneAndUpdate({ login: jsonwebtoken.verify(token, secret).login },
            { password: password }, { returnOriginal: false })

        if (user === null) {
            res.json({
                message: 'Пользователь отсутствует в базе.'
            })
                .status(400)
        }
    } catch (err) {
        res.json({
            message: 'Неизвестная ошибка.'
        })
            .status(500)

        return
    }

    res.json({
        message: 'Пароль изменён!',
        newPassword: user.password
    })
})

app.post('/user/changeEmail', async (req, res) => {
    console.log(req.body)
    const { token, email } = req.body
    let user

    try {
        user = await User.findOneAndUpdate({ login: jsonwebtoken.verify(token, secret).login },
            { email: email }, { returnOriginal: false })

        if (user === null) {
            res.json({
                message: 'Пользователь отсутствует в базе.'
            })
                .status(400)
        }
    } catch (err) {
        if (err && err.code !== 11000) {
            res.json({
                message: 'Неизвестная ошибка.'
            })
                .status(500)

            return
        }

        //duplicate key
        if (err && err.code === 11000) {
            res.json({
                message: 'Не используйте повторно эти данные!'
            })
                .status(400)
            console.error('Не используйте повторно эти данные!')

            return
        }
    }

    res.json({
        message: 'E-Mail изменён! Для применения изменений заново авторизуйтесь!',
        newEmail: user.email
    })
})

app.get('/products', async (req, res) => {
    let products

    try {
        products = await Product.find()
    } catch (err) {
        res.json({
            message: 'Неизвестная ошибка.'
        })
            .status(500)

        return
    }

    res.json({
        data: products
    })
})

app.post('/products/add', async (req, res) => {
    console.log(req.body)
    const { title, price } = req.body
    const product = new Product({ title, price })

    try {
        await product.save()
    } catch (err) {
        if (err && err.code !== 11000) {
            res.json({
                message: 'Неизвестная ошибка.'
            })
                .status(500)

            return
        }
    }

    res.json({
        message: 'Товар успешно добавлен! Обновите страницу для того, чтобы получить изменения.'
    })
})

app.use((err, req, res, next) => {
    console.error(err.stack)
    res.status(500).send('Something broke!')
})

start()