const express = require("express");
const db = require("./data/db");
const server = express();
const port = 5000;
server.use(express.json())

//returns array of every user
server.get("/api/users", (req, res) => {
  db.find()
    .then(users => {
      res.status(200).json(users);
    })
    .catch(err => {
      res.status(500).json("The users information could not be retrieved.");
    });
});

//returns a single user by id
server.get(`/api/users/:id`, (req, res) => {
  const id = req.params.id;
  db.findById(id)
    .then(user => {
      if (user) {
        res.status(200).json(user);
      } else {
          res.status(400).json({ message: "The user with the specified ID does not exist." })
      }
    })
    .catch(err => {
        res.status(500).json("The users information could not be retrieved.");
    });
});

//creates a new user and returns an obj with the the new user's id
server.post('/api/users', (req, res) => {
    if(!req.body.name || !req.body.bio){
        res.status(400).json({ errorMessage: "Please provide name and bio for the user." })
    }else {
        db.insert(req.body)
            .then(response => {
                res.status(201).json(response)
            })
            .catch(err => {
                res.status(500).json({ errorMessage: "There was an error while saving the user to the database" })
            })
    }
})



// When the client makes a `DELETE` request to `/api/users/:id`:

// - If the _user_ with the specified `id` is not found:

//   - respond with HTTP status code `404` (Not Found).
//   - return the following JSON object: `{ message: "The user with the specified ID does not exist." }`.

// - If there's an error in removing the _user_ from the database:
//   - respond with HTTP status code `500`.
//   - return the following JSON object: `{ errorMessage: "The user could not be removed" }`.
server.delete(`/api/users/:id`, (req, res) => {
    const id = req.params.id;
    db.remove(id)
        .then( user => {
            if (user) {
                res.status(200).json(req)
            }
            else {
                res.status(404).json({ message: "The user with the specified ID does not exist." })
            }
        })
        .catch(err => {
            res.status(500).json({ errorMessage: "The user could not be removed" })
        })
})




server.listen(5000, () => {
  console.log(`server listening on port ${port}`);
});
