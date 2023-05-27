/*
Micro Project 2 Problem Statement:
1. Set up a MongoDB database to store your recipes from mongodb website
2. Create a Node.js project and install the necessary packages, including Express, EJS, and Mongoose.
3. When the form is submitted, use Mongoose to save the new recipe to your database.
4. You need to take data from user in the body and then create a data entry in the database using the help of POST reqest
- body: {
    _id: Object("..."),
     receipeName: "Maggie",
     receipeTime: "12 mins"
     ingredeints: ["maggie", "water", "maggie masala"]
     serves: "2 person"
}
5. Create a page that displays all the recipes currently in the database.
6. You need to display your data using GET request, display all the entries of receipes in the browser
7. Add the ability to edit and delete recipes from the list.
8. You need to create a DELETE request, where user will be passing the id of a receipe and based on the id provided, you need to remove the entry from the database
Example: localhost:3000/delete-receipe/:id => as soon as this reqest is received at the backend, based on the id the entry for that particular receipe will be removed from the database.
9. You need to create a PUT request, where user will be passing partial data in the body and based on the data provided we will update the fields of a particular receipe in the database
Example: localhost:3000/update-receipe/:id
                  body = {
                  receipeTime: "15 mins",
                  serves: "3 person"
                 }
*/

/*
POST: / : home route (form for adding recepies)
GET: /recepies : get all recipes
DELETE: /delete-receipe/:id : delete the specific recipe
PUT: /update-receipe/:id : update the specific recipe
*/

const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const dotEnv = require("dotenv");
dotEnv.config();

app.use(bodyParser.urlencoded({ extended: false }));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public/"));
app.set("views", `${__dirname}/views`);


const Recipe = mongoose.model("Recipe", {
  receipeName: String,
  receipeTime: String,
  ingredeints: [String],
  serves: String,
});

// create (C)
app.post("/add-recipe", (req, res) => {
  const { receipeName, receipeTime, ingredeints, serves } = req.body;
  const receipe1 = new Recipe({
    receipeName: receipeName,
    receipeTime: receipeTime,
    ingredeints: ingredeints.split(","),
    serves: serves,
  });

  receipe1
    .save()
    .then((receipe1) => {
      res.json({ message: "Receipe got added successfully" });
    })
    .catch(() => {
      res.json({ message: "Something went wrong :(" });
    });
});

// html - Add Recipe Form
app.get("/", (req, res) => {
  res.sendFile(`${__dirname}/get.html`);
});

// read (R)
app.get("/recipes", (req, res) => {
  Recipe.find()
    .then((recipes) => {
      res.json(recipes);
    })
    .catch(() => {
      res.json({ message: "Something went wrong :(" });
    });
});

// html - update Recipe Form
app.get("/update-receipe/:id", (req, res) => {
  const { id } = req.params;
  res.render("put", { id: id });
});

//update (U)
app.post("/update-receipe/:id", (req, res) => {
  const { id } = req.params;
  const { receipeName, receipeTime, ingredeints, serves } = req.body;
  let t1, t2, t3, t4;

  Recipe.findById(id)
    .then((recipe) => {
      recipe.receipeName = t1;
      recipe.receipeTime = t2;
      recipe.ingredeints = t3;
      recipe.serves = t4;

      console.log(recipe);
    })
    .catch((err) => {
      console.log(err);
    });

  if (receipeName.trim().length >= 1) t1 = receipeName;
  if (receipeTime.trim().length >= 1) t2 = receipeTime;
  if (ingredeints.trim().length >= 1) t3 = ingredeints;
  if (serves.trim().length >= 1) t4 = serves;

  Recipe.findByIdAndUpdate(id, {
    receipeName: t1,
    receipeTime: t2,
    ingredeints: t3,
    serves: t4,
  })
    .then(() => {
      res.json({ message: "Recipe updated successfully :)" });
    })
    .catch(() => {
      res.json({ message: "Something Went Wrong :(" });
    });
});

// html - delete Recipe Form
app.get("/delete-receipe/:id", (req, res) => {
    const { id } = req.params;
    res.render("delete", { id: id });
});

// delete (D)

app.post("/delete-receipe/:id", (req, res) => {
  const { id } = req.params;

  Recipe.findByIdAndDelete(id)
    .then(() => {
      res.json({ message: "Recipe deleted successfully :)" });
    })
    .catch(() => {
      res.json({ message: "Something Went Wrong :(" });
    });
});

app.listen(process.env.SERVER_PORT, () => {
  mongoose
    .connect(process.env.MONGODB_URL)
    .then(() => {
      console.log("Connected to MongoDB");
      console.log(`Server is running on port ${process.env.SERVER_PORT}`);
    })
    .catch((err) => {
      console.log("Could not connect to MongoDB", err);
    });
});
