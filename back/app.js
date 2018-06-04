const express = require("express");
const bodyParser = require("body-parser");
const session = require("express-session");
const mongoose = require("mongoose");

const models = require("./model");

const app = express();

app.use(express.static("./public"));

app.set("views", "./views");
app.set("view engine", "pug");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.use(session({secret: "que j'aime à faire apprendre une nombre utile aux sages"}));

mongoose.connect("mongodb://admin:admin123@ds241530.mlab.com:41530/mongo-test"); 

app.get("/", (req, res)=>{
    res.render("home");
});

/************* Création d'une nouvelle recette *******************/

app.use("/new-recipe", (req, res, next)=>{
    let themePromise =  models.theme.find({}).exec();
    let dishesPromise = models.dishType.find({}).exec();

    themePromise.then((data)=>{
        req.themes = data;
        return dishesPromise;
    }).then((data)=>{
        req.dishTypes = data;
        next();
    }).catch((err)=>{
        console.log(err);
        res.end(err);
    });
});

app.get("/new-recipe", (req, res) => {
    res.render("recipe-form", {
        themeList: req.themes,
        dishTypeList: req.dishTypes
    });
});

app.post("/new-recipe", (req, res)=>{
    let recipe = {
        title: req.body.title,
        cookingTime: req.body.cookingTime,
        prepareTime: req.body.prepareTime,
        difficulty: req.body.difficulty,
        nbPerson: req.body.nbPerson,
        steps: req.body.steps,
        theme: req.body.theme,
        dishType: req.body.dishType
    }

    model = new models.recipe(recipe);

    model.save((err, data)=>{
        if(err){
            console.log(err);
            res.end(err);
        }else {
            res.redirect("/"); 
        }
    })
});



app.listen(3000, ()=>{
    console.log("listening to port 3000")
});
