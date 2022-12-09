const { addListener } = require("nodemon");

const express = require("express"),
  app = express(),
  bodyParser = require("body-parser"),
  uuid = require("uuid");

app.use(bodyParser.json());

let users = [
    {
        id: 1,
        name: "Dylan",
        favoriteMovies: []
    },
    {
        id: 2,
        name: "Nate",
        favoriteMovies: ["Harry Potter and the Chamber of Secrets"]
    },
]

let movies = [
  {
    "Title": "Harry Potter and the Chamber of Secrets",
    "Description":
      "The Chamber of Secrets was home to an ancient Basilisk, which, according to legend, was intended to be used to purge the area of Muggle-born students. The Chamber is flanked with toweringpillars entwined with carved wood, and a tall statue of Salazar Slytherin is at the far end",
    "Genre": {
      "Name": "Fantasy",
      "Description": "Fantasy films are films that belong to the fantasy genre with fantastic themes, usually magic, supernatural events, mythology, folklore, or exotic fantasy worlds. The genre is considered a form of speculative fiction alongside science fiction films and horror films, although the genres do overlap."
    },
    "Director": {
      "Name": "Chris Columbus",
      "Bio": "Born in Spangler, Pennsylvania, Columbus studied film at the Tisch School of the Arts where he developed an interest in filmmaking . After writing screenplays for several teen comedies in the mid-1980s, he made his directorial debut with a teen adventure, Adventures in Babysitting (1987).",
      "Birth": 1958.0
    },
    "ImageURL": "https://www.google.com/search?q=Harry+Potter+and+the+Chamber+of+Secrets+movie+image&tbm=isch&ved=2ahUKEwiKoL2e7ur7AhUMlRoKHdc-DK0Q2-cCegQIABAA&oq=Harry+Potter+and+the+Chamber+of+Secrets+movie+image&gs_lcp=CgNpbWcQAzIFCAAQgAQ6BAgAEEM6BwgAEIAEEBhQ_whYlRVgtx5oAHAAeACAAZ0BiAHlBZIBAzQuM5gBAKABAaoBC2d3cy13aXotaW1nwAEB&sclient=img&ei=F0mSY8q4MIyqatf9sOgK&bih=577&biw=1280#imgrc=d9ikkQRgb365VM",
    "Featured": false
  },
  {
    "Title": "Lord of the Rings: The Fellowship of the Ring",
    "Description":
      "The film is about power and greed, innocence and enlightenment. Ultimately, it describes a battle of good against evil, of kindness and trust against suspicion, and of fellowship against the desire for individual power. ",
    "Genre": {
      "Name": "Horror",
      "Description": "Horror films may incorporate incidents of physical violence and psychological terror; they may be studies of deformed, disturbed, psychotic, or evil characters; stories of terrifying monsters or malevolent animals; or mystery thrillers that use atmosphere to build suspense."
    },
    "Director": {
      "Name": "Peter Jackson",
      "Bio": "Born on October 31, 1961, in New Zeland, Peter Jackson started his prolific career as a child, creating short films with a 8-mm movie camera. Without any formal training, Jackson has directed a number of successful films ranging across all genres.",
      "Birth": 1961.0
    },
    "ImageURL": "https://www.google.com/search?q=Lord+of+the+Rings%3A+The+Fellowship+of+the+Ring+movie+image&tbm=isch&ved=2ahUKEwi24cPi7ur7AhUCphoKHarlAEoQ2-cCegQIABAA&oq=Lord+of+the+Rings%3A+The+Fellowship+of+the+Ring+movie+image&gs_lcp=CgNpbWcQAzoFCAAQgARQ-A5Y-A5gihtoAHAAeACAAVGIAZcBkgEBMpgBAKABAaoBC2d3cy13aXotaW1nwAEB&sclient=img&ei=pkmSY7b2HoLMaqrLg9AE&bih=577&biw=1280",
    "Featured": false
  },
  {
    "Title": "Alice in Wonderland",
    "Description":
      "Alice's Adventures in Wonderland represents the child's struggle to survive in the confusing world of adults . To understand our adult world, Alice has to overcome the open-mindedness that is characteristic for children. Apparently, adults need rules to live by. ",
    "Genre": {
      "Name": "Drama",
      "Description": "The drama genre features stories with high stakes and many conflicts . They're plot-driven and demand that every character and scene move the story forward. Dramas follow a clearly defined narrative plot structure, depicting real-life scenarios or extreme situations with emotionally-driven characters."
    },
    "Director": {
      "Name": "Tim Burton",
      "Bio": "Tim Burton was born Timothy Walter Burton on August 25, 1958, in Burbank, California. As a child, Burton was engrossed with the classic horror films of Roger Corman—many of which featured quintessential screen villain Vincent Price.",
      "Birth": 1958.0
    },
      "ImageURL": "https://www.google.com/search?q=tim+burton+alice+in+wonderland+images&tbm=isch&ved=2ahUKEwj-yoPK8er7AhVThHMKHasECDUQ2-cCegQIABAA&oq=alice+in+wonderland+tim+burton+image&gs_lcp=CgNpbWcQARgAMgYIABAIEB46BQgAEIAEOgcIABCABBAYUMwOWKI9YMhCaABwAHgAgAGCAYgB7gaSAQQxMC4xmAEAoAEBqgELZ3dzLXdpei1pbWfAAQE&sclient=img&ei=mEySY_6eGtOIzgOriaCoAw&bih=577&biw=1280",
      "Featured": false
  },
];

// CREATE
app.post('/users', (req, res) => {
    const newUser = req.body;

    if (newUser.name) {
        newUser.id = uuid.v4();
        users.push(newUser);
        res.status(201).json(newUser)
    } else {
        res.status(400).send('users need names')
    }
})

// UPDATE
app.put('/users/:id', (req, res) => {
    const { id } = req.params;
    const updatedUser = req.body;

    let user = users.find( user => user.id == id );

    if (user) {
        user.name = updatedUser.name;
        res.status(200).json(user)
    } else {
        res.status(400).send('no such user')
    }
})

// CREATE
app.post('/users/:id/:movieTitle', (req, res) => {
    const { id, movieTitle } = req.params;

    let user = users.find( user => user.id == id );

    if (user) {
        user.favoriteMovies.push(movieTitle);
        res.status(200).send(`${movieTitle} has been added to user ${id}'s array`);;
    } else {
        res.status(400).send('no such user')
    }
})

// DELETE
app.delete('/users/:id/:movieTitle', (req, res) => {
    const { id, movieTitle } = req.params;

    let user = users.find( user => user.id == id );

    if (user) {
        user.favoriteMovies = user.favoriteMovies.filter( title => title !== movieTitle);
        res.status(200).send(`${movieTitle} has been removed from user ${id}'s array`);;
    } else {
        res.status(400).send('no such user')
    }
})

// DELETE
app.delete('/users/:id', (req, res) => {
    const { id } = req.params;

    let user = users.find( user => user.id == id );

    if (user) {
        users = users.filter( user => user.id != id);
        res.status(200).send(`user ${id} has been deleted`);
    } else {
        res.status(400).send('no such user')
    }
})

// READ
app.get("/movies", (req, res) => {
  res.status(200).json(movies);
});

// READ
app.get("/movies/:title", (req, res) => {
  const { title } = req.params;
  const movie = movies.find((movie) => movie.Title === title);

  if (movie) {
    res.status(200).json(movie);
  } else {
    res.status(400).send("no such movie");
  }
});

// READ
app.get("/movies/genre/:genreName", (req, res) => {
  const { genreName } = req.params;
  const genre = movies.find((movie) => movie.Genre.Name === genreName).Genre;

  if (genre) {
    res.status(200).json(genre);
  } else {
    res.status(400).send("no such genre");
  }
});

// READ
app.get("/movies/directors/:directorName", (req, res) => {
    const { directorName } = req.params;
    const director = movies.find((movie) => movie.Director.Name === directorName).Director;
  
    if (director) {
      res.status(200).json(director);
    } else {
      res.status(400).send("no such director");
    }
  });








app.listen(8080, () => console.log("Listening on 8080."));
