//node modules
const express = require("express");
const logger = require("morgan");
const fs = require("fs");

//npm modules
const app = express();
const PORT = 8080;

//middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(logger("dev"));



// * The application frontend has already been created, it's your job to build the backend and connect the two.

// * The following HTML routes should be created:

//   * GET `/notes` - Should return the `notes.html` file.
//   * GET `/api/notes` - Should read the `db.json` file and return all saved notes as JSON.
app.get("/api/notes", function(req, res) {
    res.sendFile(path.join(__dirname, "/public/notes.html"));
    fs.readFile(__dirname + "/db/db.json", "utf8", function(err, data) {
        if (err) throw err;

        console.log(data)
    });
});

//   * POST `/api/notes` - Should receive a new note to save on the request body, add it to the `db.json` file, and then return the new note to the client.
app.post("/api/notes", function(req, res) {
    console.log(req.body)
    const note = {
        id: 1234,
        ...req.body,
    };
    console.log(note)
    let notes = JSON.stringify(note);

    // fs.readFile(__dirname + "/db/db.json", function(err, data) {
    // console.log(data)
    // if (err) throw err;
    //read from my db.json file
    // const notes = JSON.parse(data);
    // console.log(notes)
    // console.log(notes);
    //parse JSON
    // res.json(JSON.parse(data))
    //     //stringify the data
    // const stringifiedData = JSON.stringify(notes, null, 2)
    //     //write to db.json
    fs.appendFile(__dirname + "/db/db.json", notes, function() {
        res.json(notes);

        // });

        //thought... it can be write file if i am first reading the info as a whole, THEN pushing new stuff into it... this does overwrite but says the data that's already there is being read, nothing is lost



    })
})

//   * GET `*` - Should return the `index.html` file
app.get("*", function(req, res) {
    res.sendFile(path.join(__dirname, "/public/index.html"));
});


// * The application should have a `db.json` file on the backend that will be used to store and retrieve notes using the `fs` module.
// * The following API routes should be created:


//   * DELETE `/api/notes/:id` - Should receive a query parameter containing the id of a note to delete. This means you'll need to find a way to give each note a unique `id` when it's saved. In order to delete a note, you'll need to read all notes from the `db.json` file, remove the note with the given `id` property, and then rewrite the notes to the `db.json` file.

app.listen(PORT, () =>
    console.log(`App listening at http://localhost:${PORT}`)
);