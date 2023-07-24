const express = require("express");
const fs = require("fs"); // node file system
const path = require("path");
// using UUID to keep a track of list items.
const { v4: uuidv4 } = require("uuid");
// uuidv4(); returns the unique id

// const noteList = require("./db/db.json");
const app = express();

// const PORT = 3001;
const port = process.env.PORT || 3001;

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

// This get route reads file db.json and parses the data that is then used to render the data
app.get("/api/notes", (req, res) => {
  console.log(`inside get call`);
  fs.readFile("./db/db.json", "utf-8", (error, data) => {
    if (error) {
      console.log(`Inside error`, error);
    } else {
      console.log(`Reading data`, data);
      res.json(JSON.parse(data));
    }
  });
});
// The post request saves data to the db.json file
app.post("/api/notes", (req, res) => {
  fs.readFile("./db/db.json", "utf-8", (error, data) => {
    if (error) {
      console.log(error);
    } else {
      let temp = JSON.parse(data);
      let noteItem = req.body;
      noteItem.id = uuidv4();
      temp.push(noteItem);
      fs.writeFile("./db/db.json", JSON.stringify(temp), (err) => {
        //console.error(err);
        res.send();
      });
    }
  });
});

// This route deletes data
app.delete("/api/notes/:id", (req, res) => {
  console.log(`inside delete API`);
  let idToDelete = req.params.id;
  fs.readFile("./db/db.json", "utf-8", (error, data) => {
    if (error) {
      console.log(error);
    } else {
      let dbData = JSON.parse(data);
      let newData = dbData.filter((el) => {
        if (el.id !== idToDelete) {
          return el;
        }
      });

      fs.writeFile("./db/db.json", JSON.stringify(newData), (err) => {
        // console.error(err);
        res.send();
      });
    }
  });
});
app.listen(PORT, () => console.log(`Listening to port: ${PORT}`));
