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
app.get("/", (req, res) => {
    res.render("home");
})


app.get('/recipe-load', (req, res) => {
    /* let theme= new models.theme({
         title: "Cuisine exotique"
     });*/
    let theme1 = new models.theme({
        title: "Cuisine exotique"
    });


    let recipe = new models.recipe({
        title: 'Poulet au curry',
        cookingTime: 45,
        PrepareTime: 20,
        theme: [theme1._id],
        difficulty: 3,
        nbPerson: 4
    });

    let recipe1 = new models.recipe({
        title: 'Tarte à la Rhubarbe',
        cookingTime: 30,
        PrepareTime: 15,
        theme: [recipe._id],
        difficulty: 4,
        nbPerson: 4
    });
    //pour enregistrer

    recipe.save((err, data) => {
        if (err) {
            console.log(err);
            res.end(err);
        } else {
            res.json(data);
        }
    });

    /*recipe1.save((err, data)=>{
        if(err){
            console.log(err);
            res.end(err);
        } else {
            res.json(data);
        }
    }); */
});


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
