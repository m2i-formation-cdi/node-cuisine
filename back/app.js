const express = require("express");
const bodyParser = require("body-parser");
const session = require("express-session");
const mongoose = require("mongoose");
const userRoute = require("./routes/user-routes")
const models = require("./model");

const app = express();

app.use(express.static("./public"));

app.set("views", "./views");
app.set("view engine", "pug");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(session({ secret: "que j'aime à faire apprendre une nombre utile aux sages" }));

mongoose.connect("mongodb://admin:admin123@ds241530.mlab.com:41530/mongo-test");

app.use('', userRoute)






//chemin pour afficher la liste
app.get("/query", (req, res) => {
    let query = models.recipe.find()
        .select("title cookingTime PrepareTime theme difficulty nbPerson")
    query.exec((err, data) => {
        //res.json(data);
        res.render('home', { recipeList: data })
    });
})


app.listen(3000, () => {
    console.log("listening to port 3000")
});
