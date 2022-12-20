
const express = require("express"),
bodyParser = require("body-parser"),
uuid = require("uuid");

const morgan = require("morgan");
const app = express();
const mongoose = require("mongoose");
const Models = require("./models.js");

const movieSchema = require("./models.js");

const Movies = Models.Movie;
const Users = Models.User;
const Genres = Models.Genres;
const Director = Models.Director;


// mongose.connect(process.env.Connection_URI, {
  // useNewUrlParser: true, useUnifiedTopology: true })
  // .then( console.log('DB Connected') );


  // This allows mongoose connect to the database so it can perform CRUD operations .
mongoose.connect('mongodb://localhost:27017/myFlixDB', { useNewUrlParser: true, useUnifiedTopology: true });

//log requests to server
app.use(morgan("common"));
app.use(bodyParser.json());

//import auth into index

//default text response when at /
app.get("/", (reg, res) => {
  res.send("Welcome ro MyFlix!")
});

//Get a full list of movies (return JSON object when at /movies)
app.get("/movies", (req, res) => {
  Movies.find()
  .then((movies) => {
    res.status(201).json(movies);
  })
  .catch((err) => {
    console.error(err);
    res.status(500).send("Error: " + err);
  });
});


// Get information about a single movie by title  (GET JSON movie info when looking for specific title)
app.get("/movies/:Title", (req, res) => {
  Movies.findOne({ Title: req.params.Title })
     .then((movie) => {
      res.json(movie);
     })
     .catch((err) => {
       console.error(err);
       res.status(500).send("Error: " + err);
     });
});

//Get information about a specific genre of film (GET JSON genre info when looking for specific genre)
app.get("/movies/genres/:Name", (req, res) => {
  Movies.findOne({ "Genre.Name": req.params.Name })
     .then((movies) => {
      res.json(movies.Genre);
     })
     .catch((err) => {
       console.error(err);
       res.status(500).send("No such genre.Error: " + err);
     });
});


//get info on director when looking for specific director
app.get("/movies/directors/:Name", (req, res) => {
  Movies.findOne({ "Director.name": req.params.Name })
     .then((movies) => {
      res.json(movies.Director);
     })
     .catch((err) => {
       console.error(err);
       res.status(500).send("No such director.Error: " + err);
     });
});

//allow users to register
app.post('/users', (req, res) => {
  Users.findOne({ Username: req.body.Username })
    .then((user) => {
      if (user) {
        return res.status(400).send(req.body.Username + 'already exists');
      } else {
        Users.create({
            Username: req.body.Username,
            Password: req.body.Password,
            Email: req.body.Email,
            Birthday: req.body.Birthday
          })
          .then((user) =>{res.status(201).json(user) })
        .catch((error) => {
          console.error(error);
          res.status(500).send('Error: ' + error);
        })
      }
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send('Error: ' + error);
    });
});


// Get all users
app.get('/users', (req, res) => {
  Users.find()
    .then((users) => {
      res.status(201).json(users);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

app.get("/users", function (req, res) {
  Users.find()
    .then(function (users) {
      res.status(201).json(users);
    })
    .catch(function (err) {
      console.error(err) ;
      res.status(500).send("Error: " + err);
    });
});


// Get a user by username
app.get('/users/:Username', (req, res) => {
  Users.findOne({ Username: req.params.Username })
    .then((user) => {
      res.json(user);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});


//allow users to update their user info, by username//
app.put('/users/:Username', async (req, res) => {
  try {
    const updatedUser = await Users.findOneAndUpdate({ Username: req.params.Username }, {
      $set: {
        Username: req.body.Username,
        Password: req.body.Password,
        Email: req.body.Email,
        Birthday: req.body.Birthday,
      },
    },
    { new: true }); // This line makes sure that the updated document is returned

    if (updatedUser) {
      res.json(updatedUser);
    } else {
      res.status(404).send('User not found');
    }
  } catch (err) {
    console.error(err);
    res.status(500).send("Error: " + err);
  }
});

// Delete a user by username
app.delete('/users/:Username', (req, res) => {
  Users.findOneAndRemove({ Username: req.params.Username })
    .then((user) => {
      if (!user) {
        res.status(400).send(req.params.Username + ' was not found');
      } else {
        res.status(200).send(req.params.Username + ' was deleted.');
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

// Add a movie to a user's list of favorites
app.post('/users/:Username/movies/:MovieID', (req, res) => {
  Users.findOneAndUpdate({ Username: req.params.Username }, {
     $push: { FavoriteMovies: req.params.MovieID }
   },
   { new: true }, // This line makes sure that the updated document is returned
  (err, updatedUser) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error: ' + err);
    } else {
      res.json(updatedUser);
    }
  });
});

// remove a movie from username's list
app.delete("/users/:Username/Movies/:MovieID", (req, res) => {
  Users.findOneAndUpdate(
    { Username: req.params.Username },
    { $pull: {Fav: req.params.MovieID } },
    { new: true },
    (error, updatedUser) => {
      if (error) {
        console.error(error);
        res.status(500).send ("Error: " + error);
      } else {
        res.json(updatedUser);
      }
    });
});


//access documentation.html using express.static
app.use("/documentation", express.static("public"));

//error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Error");
});

//listen on port
app.listen(8080, () => console.log("My app is listening on port 8080."))





