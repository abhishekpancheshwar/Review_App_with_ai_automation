const mongoose = require('mongoose');
const dotenv = require('dotenv');
const users = require('./users');
const products = require('./products');
const User = require('../models/User');
const Product = require('../models/Product');
const Review = require('../models/Review');
const connectDB = require('../config/db');

dotenv.config({ path: './.env' });
connectDB();

const importData = async () => {
    try {
        await Review.deleteMany();
        await Product.deleteMany();
        await User.deleteMany();

        await User.insertMany(users);
        await Product.insertMany(products);

        console.log('Data Imported!');
        process.exit();
    } catch (error) {
        console.error(`${error}`);
        process.exit(1);
    }
};

const destroyData = async () => {
    try {
        await Review.deleteMany();
        await Product.deleteMany();
        await User.deleteMany();

        console.log('Data Destroyed!');
        process.exit();
    } catch (error) {
        console.error(`${error}`);
        process.exit(1);
    }
};

if (process.argv[2] === '-d') {
    destroyData();
} else {
    importData();
}