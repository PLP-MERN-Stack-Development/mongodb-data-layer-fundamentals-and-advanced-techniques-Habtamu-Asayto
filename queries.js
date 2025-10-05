
const { Book } = require("./Model/Book");
const { connectDB, mongoose } = require("./config/db");

const mongoose = require("mongoose");
require("dotenv").config();
async function connectDB() {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log("Successfully connected to MongoDB");
}

module.exports = { connectDB, mongoose };


const { mongoose } = require("../config/db");
const { Schema } = mongoose;

const bookSchema = new Schema(
  {
    title: String,
    author: String,
    genre: String,
    published_year: Number,
    price: Number,
    in_stock: { type: Boolean, default: false },
    pages: Number,
    publisher: String,
  },
  { timestamps: true }
);

const Book = mongoose.model("Book", bookSchema);
module.exports = { Book };


async function main() {
  await connectDB();

  await Book.deleteMany({});

  await Book.insertMany([
    {
      title: "The Silent Storm",
      author: "John Carter",
      genre: "Thriller",
      published_year: 2020,
      price: 14.99,
      in_stock: true,
      pages: 320,
      publisher: "BlueSky Press",
    },
    {
      title: "Echoes of Time",
      author: "Lisa Morgan",
      genre: "Science Fiction",
      published_year: 2018,
      price: 19.5,
      in_stock: false,
      pages: 410,
      publisher: "Nova Books",
    },
    {
      title: "Shadows of the Past",
      author: "David Kim",
      genre: "Mystery",
      published_year: 2022,
      price: 17.0,
      in_stock: true,
      pages: 280,
      publisher: "Maple House",
    },
    {
      title: "The Last Kingdom",
      author: "Michael Grant",
      genre: "Historical Fiction",
      published_year: 2016,
      price: 21.99,
      in_stock: true,
      pages: 500,
      publisher: "Heritage Books",
    },
    {
      title: "Rising Sun",
      author: "Kenji Tanaka",
      genre: "Drama",
      published_year: 2021,
      price: 12.75,
      in_stock: true,
      pages: 290,
      publisher: "Kyoto Publishing",
    },
    {
      title: "Ocean’s Whisper",
      author: "Maria Lopez",
      genre: "Romance",
      published_year: 2019,
      price: 10.99,
      in_stock: false,
      pages: 350,
      publisher: "HeartLit Media",
    },
    {
      title: "Code of Honor",
      author: "Daniel Brooks",
      genre: "Action",
      published_year: 2023,
      price: 25.0,
      in_stock: true,
      pages: 450,
      publisher: "IronPen Books",
    },
    {
      title: "Dreamcatcher’s Tale",
      author: "Aisha Rahman",
      genre: "Fantasy",
      published_year: 2017,
      price: 15.49,
      in_stock: true,
      pages: 380,
      publisher: "Starling Press",
    },
    {
      title: "Parallel Minds",
      author: "Olivia Chen",
      genre: "Science Fiction",
      published_year: 2024,
      price: 22.99,
      in_stock: true,
      pages: 420,
      publisher: "Quantum Reads",
    },
    {
      title: "Whispers in the Wind",
      author: "Ethan Miles",
      genre: "Poetry",
      published_year: 2015,
      price: 8.5,
      in_stock: false,
      pages: 120,
      publisher: "Evergreen Books",
    },
  ]);
  console.log("10 books inserted successfully!");

  const books = await Book.find({ genre: "Science Fiction" });
  console.log("All Books", books);

  const pub_books = await Book.find({ published_year: { $gt: 2020 } });
  if (pub_books.length === 0) {
    console.log(`No books found published after 2020.`);
  } else {
    console.log("Books published after 2020:", pub_books);
    console.log(`or\n Books published after 2020:`);
    pub_books.forEach((book) => {
      console.log(`- ${book.title} by ${book.author} (${book.published_year})`);
    });
  }

  const author_name = "Daniel Brooks";
  const by_author = await Book.find({
    author: { $regex: new RegExp(author_name, "i") },
  });
  if (by_author.length === 0) {
    console.log(`No book found with ${author_name}`);
  } else {
    console.log(`Books of ${author_name}`);
    by_author.forEach((book) => {
      console.log(`- ${book.title} in ${book.published_year}`);
    });
  }

  const book_title = "The Silent Storm";
  const new_price = 21;
  const update_price = await Book.updateOne(
    { title: book_title },
    { $set: { price: new_price } }
  );
  if (update_price.matchedCount === 0) {
    console.log(`No book found with ${book_title} title`);
  } else {
    console.log(
      `The ${book_title} price is updated to ${new_price} successfully`
    );
  }

  const results = await Book.deleteOne({ title: book_title });
  if (results.deletedCount === 0) {
    console.log(`No book found with title: ${book_title}`);
  } else {
    console.log(`Book "${book_title}" deleted successfully`);
  }

  const pub_year = 2010;
  const stocked_2010 = await Book.find({
    in_stock: true,
    published_year: { $gt: pub_year },
  }).select("title author published_year in_stock");
  if (stocked_2010.length === 0) {
    console.log("No books found matching the criteria");
  } else {
    console.log("Books in stock and published after 2010");
    console.table(
      stocked_2010.map((b) => ({
        Title: b.title,
        Author: b.author,
        Year: b.published_year,
        InStock: b.in_stock,
      }))
    );
  }

  const projec_books = await Book.find({}, "title author price");
  if (projec_books.length === 0) {
    console.log("No book found");
  } else {
    console.table(
      projec_books.map((book) => ({
        Title: book.title,
        Author: book.author,
        Price: book.price,
      }))
    );
  }

  const sort_book = await Book.find({}).sort({ price: 1 });
  if (sort_book.length === 0) {
    console.log("No book found");
  } else {
    console.table(
      sort_book.map((book) => ({
        Title: book.title,
        Author: book.author,
        Price: book.price,
      }))
    );
  }

  const pages = 2;
  const limit = 5;
  const skip = (pages - 1) * limit;
  const limit_skip = await Book.find({})
    .sort({ title: 1 })
    .skip(skip)
    .limit(limit);
  console.table(limit_skip);

  const avgPrices = await Book.aggregate([
    {
      $group: {
        _id: "$genre",
        averagePrice: { $avg: "$price" },
      },
    },
    {
      $project: {
        _id: 0,
        Genre: "$_id",
        AveragePrice: { $round: ["$averagePrice", 2] },
      },
    },
  ]);
  console.table(avgPrices);

  const topAuthor = await Book.aggregate([
    {
      $group: {
        _id: "$author",
        totalBooks: { $sum: 1 },
        count,
      },
    },
    { $sort: { totalBooks: -1 } },
    { $limit: 1 },
    {
      $project: {
        _id: 0,
        Author: "$_id",
        TotalBooks: "$totalBooks",
      },
    },
  ]);
  console.table(topAuthor);

  const booksByDecade = await Book.aggregate([
    {
      $addFields: {
        decade: {
          $multiply: [{ $floor: { $divide: ["$published_year", 10] } }, 10],
        },
      },
    },
    {
      $group: {
        _id: "$decade",
        totalBooks: { $sum: 1 },
      },
    },
    {
      $sort: { _id: 1 },
    },
    {
      $project: {
        _id: 0,
        Decade: { $concat: [{ $toString: "$_id" }, "s"] },
        TotalBooks: "$totalBooks",
      },
    },
  ]);
  console.table(booksByDecade);

  await Book.collection.createIndex({ title: 1 });
  console.log("Index created successfully");

  await Book.collection.createIndex({ author: 1, published_year: -1 });
  console.log("Index created with author and published year successfully");

  const result = await Book.find({ title: "The Last Kingdom" }).explain(
    "executionStats"
  );
  console.log(JSON.stringify(result.executionStats, null, 2));

  End;
  await mongoose.disconnect();
}

main();
