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
app.use(bodyParser.urlencoded({ extended: false }));

app.use(session({ secret: "que j'aime à faire apprendre une nombre utile aux sages" }));

mongoose.connect("mongodb://admin:admin123@ds241530.mlab.com:41530/mongo-test");

app.get("/", (req, res) => {
    res.render("home");
})

//...afficher le formulaire d'inscription
app.get('/inscription', (req, res) => {
    let message = req.session.message || {};
    res.render("inscription", { message: message });
});

 //.. afficherla liste de tous les utilisateurs inscrits
app.get("/inscription/all", (req, res) => {
    let query = models.user.find()
        .select("name")

    query.exec((err, data) => {
        res.json(data)
    });
});



//Traitement du formulaire
app.post('/inscription', (req, res) => {
    let user = {
        email: req.body.email,
        password: req.body.pwd,
        firstName: req.body.prenom,
        name: req.body.nom,
        
    }
    if (req.body.id) {
        //Modification d'un utilisateur existant
        models.user.updateOne({
            _id: req.body.id
        }, user, (err) => {
            if (err) {
                res.end('Erreur');
                console.log(err);
            } else {
                res.redirect('/');
            }
        });
    } else {
        //Création d'un nouvel utilisateur
        let model = new models.user(user);
        model.save((err) => {
            if (err) {
                res.end('Erreur');
                console.log(err);
            } else {
                res.redirect('/');
            }
        
        });
    }
        
}); 


app.listen(3000, () => {
    console.log("listening to port 3000")
});

