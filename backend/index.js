import express from 'express';
import cors from 'cors';
import jsonwebtoken from 'jsonwebtoken';
import mongoose from 'mongoose';

import User from './models/User.js';
import Product from './models/Product.js';
import { port, secret, mongo } from './config.js';

const app = express();
app.use(cors());
app.use(express.json());

const asyncHandler = (fn) => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
};

app.post('/registration', asyncHandler(async (req, res) => {
    const { login, password, email } = req.body;
    const user = new User({ login, password, email });
    await user.save();
    res.json({ message: 'Вы успешно зарегистрировались!' });
}));

app.post('/login', asyncHandler(async (req, res) => {
    const { login, password } = req.body;
    const user = await User.findOne({ login });
    if (!user || user.password !== password) {
        return res.status(400).json({ message: 'Неверный логин или пароль!' });
    }
    const jwtToken = jsonwebtoken.sign({ id: user.id, login: user.login, email: user.email }, secret, { expiresIn: '24h' });
    res.json({ message: 'Вы успешно вошли на сайт!', token: jwtToken });
}));

app.post('/user/changePassword', asyncHandler(async (req, res) => {
    const { token, password } = req.body;
    const login = jsonwebtoken.verify(token, secret).login;
    const user = await User.findOneAndUpdate({ login }, { password }, { returnOriginal: false });
    if (!user) return res.status(400).json({ message: 'Пользователь отсутствует в базе.' });
    res.json({ message: 'Пароль изменён!', newPassword: user.password });
}));

app.post('/user/changeEmail', asyncHandler(async (req, res) => {
    const { token, email } = req.body;
    const login = jsonwebtoken.verify(token, secret).login;
    const user = await User.findOneAndUpdate({ login }, { email }, { returnOriginal: false });
    if (!user) return res.status(400).json({ message: 'Пользователь отсутствует в базе.' });
    res.json({ message: 'E-Mail изменён! Для применения изменений заново авторизуйтесь!', newEmail: user.email });
}));

app.get('/products', asyncHandler(async (req, res) => {
    const products = await Product.find();
    res.json({ data: products });
}));

app.post('/products/add', asyncHandler(async (req, res) => {
    const { title, price } = req.body;
    const product = new Product({ title, price });
    await product.save();
    res.json({ message: 'Товар успешно добавлен! Обновите страницу для того, чтобы получить изменения.' });
}));

app.use((err, req, res, next) => {
    if (err.code === 11000) {
        console.error('Duplicate data error');
        return res.status(400).json({ message: 'Не используйте повторно эти данные!' });
    }
    console.error('Unknown error:', err);
    res.status(500).json({ message: 'Неизвестная ошибка.' });
});

(async () => {
    try {
        await mongoose.connect(mongo.url, { user: mongo.user, pass: mongo.pass });
        app.listen(port, () => console.log(`Сервер работает на порту ${port}`));
    } catch (e) {
        console.error(e);
    }
})();
