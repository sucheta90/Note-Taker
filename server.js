const express = require("express");
const fs = require("fs"); // node file system
const path = require("path");
const { title } = require("process");
// using UUID to keep a track of list items.
const { v4: uuidv4 } = require("uuid");
// uuidv4(); returns the unique id

// const noteList = require("./db/db.json");
const app = express();

// const PORT = 3001;
const PORT = process.env.PORT || 3001;

//middlewares
app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//connecting to the public folder
app.get("/notes", (req, res) =>
  res.sendFile(path.join(__dirname, "/public/notes.html"))
);

// This get route reads file db.json and parses the data that is then used to render the data
app.get("/api/notes", (req, res) => {
  fs.readFile("./db/db.json", "utf-8", (error, data) => {
    if (error) {
      res.json(`Found an error while trying to get the data`, error);
    } else {
      res.json(JSON.parse(data));
    }
  });
});

// The post request saves data to the db.json file
app.post("/api/notes", (req, res) => {
  const { title, text } = req.body;
  if (title && text) {
    fs.readFile("./db/db.json", "utf-8", (error, data) => {
      if (error) {
        res.status(500).json(`Couldn't get data`);
      } else {
        let temp = JSON.parse(data);
        let noteItem = req.body;
        noteItem.id = uuidv4();
        temp.push(noteItem);
        fs.writeFile("./db/db.json", JSON.stringify(temp), (err) => {
          res.status(200).json(`Saved notes to the dataBase`);
        });
      }
    });
  } else {
    res.status(500).json(`Couldn't have notes at this time!`);
  }
});

// This route deletes data from the local db.json
app.delete("/api/notes/:id", (req, res) => {
  let idToDelete = req.params.id;
  if (idToDelete) {
    fs.readFile("./db/db.json", "utf-8", (error, data) => {
      if (error) {
        res.status(500).json(`Data unavailable at this time`);
      } else {
        let dbData = JSON.parse(data);
        let newData = dbData.filter((el) => {
          if (el.id !== idToDelete) {
            return el;
          }
        });

        fs.writeFile("./db/db.json", JSON.stringify(newData), (err) => {
          res.status(200).json(`Note was deleted`);
        });
      }
    });
  } else {
    res.json(`Nothing to delete at this time`);
  }
});

// Any other route brings the user back to the homepage
app.get("*", (req, res) =>
  res.sendFile(path.join(__dirname, "/public/index.html"))
);

// listing on port
app.listen(PORT, () => console.log(`Listening to port: ${PORT}`));
