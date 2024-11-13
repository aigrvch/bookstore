import { Schema, model } from 'mongoose'

const Product = new Schema({
    title: {
        type: String,
        required: true
    },
    price: {
        type: Number
    }
})

export default model('Product', Product)