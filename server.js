const express = require("express");
const fs = require("fs"); // node file system
const path = require("path");
// using UUID to keep a track of list items.
const { v4: uuidv4 } = require("uuid");
// uuidv4(); returns the unique id

const noteList = require("./db/db.json");
const app = express();

const PORT = 3001;

//middlewares
app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//connecting to the public folder
app.get("/", (req, res) =>
  res.sendFile(path.join(__dirname, "/public/index.html"))
);
app.get("/notes", (req, res) =>
  res.sendFile(path.join(__dirname, "/public/notes.html"))
);
app.get("/api/notes", (req, res) => res.json(noteList));

app.listen(PORT, () => console.log(`Listening to port: ${PORT}`));
