//node modules
const express = require("express");
const logger = require("morgan");
const fs = require("fs");
const path = require("path");
const { v4: uuidv4 } = require("uuid");

//for heroku
const PORT = process.env.PORT || 8080;
//npm modules
const app = express();

//middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(logger("dev"));
app.use(express.static("public"));

// * The application frontend has already been created, it's your job to build the backend and connect the two.

app.get("/", function(req, res) {
    res.sendFile(__dirname + ".html");
});

//   * GET `/notes` - Should return the `notes.html` file.
app.get("/notes", function(req, res) {
    res.sendFile(path.join(__dirname + "/notes.html"));
});

//   * GET `/api/notes` - Should read the `db.json` file and return all saved notes as JSON.
app.get("/api/notes", function(req, res) {
    fs.readFile(__dirname + "/db/db.json", "utf8", function(err, data) {
        res.send(JSON.parse(data))
            // const notes = JSON.parse(data);
            // res.json(notes);
    });
});



//   * POST `/api/notes` - Should receive a new note to save on the request body, add it to the `db.json` file, and then return the new note to the client.
app.post("/api/notes", function(req, res) {
    const note = {
        id: uuidv4(),
        ...req.body,
    };

    fs.readFile(__dirname + "/db/db.json", "utf8", function(err, data) {
        //read the data from db.json
        //parse json
        const notes = JSON.parse(data);
        notes.push(note);
        //stringify the data
        const stringifiedData = JSON.stringify(notes, null, 2);

        fs.writeFile(__dirname + "/db/db.json", stringifiedData, function() {
            res.json(note);
        });
    });
});

//   * DELETE `/api/notes/:id` - Should receive a query parameter containing the id of a note to delete. This means you'll need to find a way to give each note a unique `id` when it's saved. In order to delete a note, you'll need to read all notes from the `db.json` file, remove the note with the given `id` property, and then rewrite the notes to the `db.json` file.
app.delete("/api/notes/:id", async function(req, res) {
    try {
        const { id } = req.params;
        const data = await fs.promises.readFile(__dirname + "/db/db.json", "utf8");
        let notes = JSON.parse(data);
        notes = notes.filter((note) => note.id !== id); //only grabbing notes that have the specific id
        const stringifiedData = JSON.stringify(notes, null, 2);
        await fs.promises.writeFile(__dirname + "/db/db.json", stringifiedData);
        res.json(true);
    } catch (err) { res.status(500).end() };
});

//   * GET `*` - Should return the `index.html` file
app.get("*", function(req, res) {
    res.sendFile(path.join(__dirname, "/public/index.html"));
});

app.listen(PORT, () =>
    console.log(`App listening at http://localhost:${PORT}`)
);