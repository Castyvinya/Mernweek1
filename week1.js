// Import MongoDB client
const { MongoClient } = require("mongodb");

// Connection URL and Database Name
const url = "mongodb://localhost:27017";
const client = new MongoClient(url);
const dbName = "library";

async function main() {
  await client.connect();
  console.log("Connected to MongoDB");
  const db = client.db(dbName);
  const booksCollection = db.collection("books");

  // 1. Insert Data
  await booksCollection.insertMany([
    { title: "Book One", author: "Author A", publishedYear: 1999, genre: "Fiction", ISBN: "1111" },
    { title: "Book Two", author: "Author B", publishedYear: 2005, genre: "Sci-Fi", ISBN: "2222" },
    { title: "Book Three", author: "Author A", publishedYear: 2010, genre: "Mystery", ISBN: "3333" },
    { title: "Book Four", author: "Author C", publishedYear: 2018, genre: "Fiction", ISBN: "4444" },
    { title: "Book Five", author: "Author D", publishedYear: 2021, genre: "Sci-Fi", ISBN: "5555" }
  ]);
  console.log("Books inserted");

  // 2. Retrieve Data
  console.log(await booksCollection.find().toArray()); // Retrieve all books
  console.log(await booksCollection.find({ author: "Author A" }).toArray()); // Find books by author
  console.log(await booksCollection.find({ publishedYear: { $gt: 2000 } }).toArray()); // Books published after 2000

  // 3. Update Data
  await booksCollection.updateOne({ ISBN: "1111" }, { $set: { publishedYear: 2001 } }); // Update published year
  await booksCollection.updateMany({}, { $set: { rating: 5 } }); // Add rating field to all books

  // 4. Delete Data
  await booksCollection.deleteOne({ ISBN: "2222" }); // Delete book by ISBN
  await booksCollection.deleteMany({ genre: "Sci-Fi" }); // Remove all books of a genre

  // 5. Data Modeling (E-Commerce Platform)
  const usersCollection = db.collection("users");
  const productsCollection = db.collection("products");
  const ordersCollection = db.collection("orders");

  await usersCollection.insertOne({
    name: "User One",
    email: "user1@example.com",
    address: "123 Street, City",
  });
  await productsCollection.insertOne({
    name: "Product A",
    price: 100,
    category: "Electronics"
  });
  await ordersCollection.insertOne({
    userId: "User1_ID",
    productIds: ["ProductA_ID"],
    totalPrice: 100,
    status: "Pending"
  });

  // 6. Aggregation Pipeline
  console.log(await booksCollection.aggregate([
    { $group: { _id: "$genre", count: { $sum: 1 } } }
  ]).toArray()); // Total books per genre
  
  console.log(await booksCollection.aggregate([
    { $group: { _id: null, avgPublishedYear: { $avg: "$publishedYear" } } }
  ]).toArray()); // Average published year
  
  console.log(await booksCollection.find().sort({ rating: -1 }).limit(1).toArray()); // Top-rated book

  // 7. Indexing
  await booksCollection.createIndex({ author: 1 });
  console.log("Index created on author field");
  
  console.log("Indexing improves query performance by allowing faster lookups on indexed fields.");

  await client.close();
}

main().catch(console.error);
