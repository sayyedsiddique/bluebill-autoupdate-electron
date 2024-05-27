const Database = require("better-sqlite3");
const path = require("path");
console.log("ENV... ", process.env.NODE_ENV)

const dbPath =
process.env.NODE_ENV === "development"
    ? "./bbdatabase.db"
    : path.join(process.resourcesPath, "./bbdatabase.db");

    console.log("resourcesPath... ", process.resourcesPath);
console.log("dbPath... ", dbPath);
const db = new Database(dbPath);
db.pragma("journal_mode = WAL");

exports.db = db;
