const {mongoose } = require('../config/db')
const {Schema} = mongoose;

const bookSchema = new Schema({
  title: String,
  author: String,
  genre: String,
  published_year: Number,
  price: Number,
  in_stock: { type: Boolean, default:false },
  pages: Number,
  publisher: String,
},{timestamps:true});

const Book = mongoose.model('Book', bookSchema);
module.exports = {Book}