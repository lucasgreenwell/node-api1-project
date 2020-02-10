const express = require("express");
const db = require("./data/db");
const server = express();
const port = 5000;
const cors = require('cors')
server.use(express.json());
server.use(cors())


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
        res
          .status(400)
          .json({ message: "The user with the specified ID does not exist." });
      }
    })
    .catch(err => {
      res.status(500).json("The users information could not be retrieved.");
    });
});

//creates a new user and returns an obj with the the new user's id
server.post("/api/users", (req, res) => {
  if (!req.body.name || !req.body.bio) {
    res
      .status(400)
      .json({ errorMessage: "Please provide name and bio for the user." });
  } else {
    db.insert(req.body)
      .then(response => {
        res.status(201).json(response);
      })
      .catch(err => {
        res.status(500).json({
          errorMessage:
            "There was an error while saving the user to the database"
        });
      });
  }
});

//deletes a user by id and returns an empty object which is not a very useful thing to return, is it?
server.delete(`/api/users/:id`, (req, res) => {
  const { id } = req.params;
  db.remove(id)
    .then(user => {
      if (user) {
        res.status(200).json(req.body);
      } else {
        res
          .status(404)
          .json({ message: "The user with the specified ID does not exist." });
      }
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ errorMessage: "The user could not be removed" });
    });
});

//updates a user by id and returns the updated user
server.put("/api/users/:id", (req, res) => {
  const { id } = req.params;
  const user = req.body;
  if (!user.bio || !user.name){
    res.status(400).json({ errorMessage: "Please provide name and bio for the user." })
  } else {
    db.update(id, user)
    .then(num => {
      if (num === 1){
        res.status(200).json(req.body)
      }
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ errorMessage: "The user could not be removed" });
    });
  }
  
});

server.listen(5000, () => {
  console.log(`server listening on port ${port}`);
});
