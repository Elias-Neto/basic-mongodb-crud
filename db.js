require("dotenv").config()
const { MongoClient } = require("mongodb")

const URI = `mongodb://${process.env.DB_HOST}:${process.env.DB_PORT}`

const client = new MongoClient(URI)

const initDatabase = async () => {
  try {
    await client.connect()
    console.log("Database connected")
    const db = client.db(process.env.DB_NAME)
    return db.collection("books")
  } catch (error) {
    console.log(error)
  }
}

module.exports = {
  initDatabase
}