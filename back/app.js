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
app.use(bodyParser.urlencoded({
    extended: false
}));

app.use(session({
    secret: "que j'aime à faire apprendre une nombre utile aux sages"
}));

mongoose.connect("mongodb://admin:admin123@ds241530.mlab.com:41530/mongo-test");

app.get("/", (req, res) => {
    res.render("home");
})

//Traitement du formulaire
app.post('/login', (req, res) => {
    let search = {
        email: req.body.email,
        password: req.body.pwd
    };
    console.log(search);

    models.user.findOne(search, (err, data) => {
        if(err) {
            console.log(err);
            res.end('Erreur d\'authentification');
        } else {
            if(data) {
                req.session.user = data;
                if(data.role == 'admin') {
                    res.redirect('/');
                } else {
                    res.redirect('/');
                }
            } else {
                req.session.errorMessage = "Tu t'es trumpé lol";
                res.redirect('/login');
            }
        }
    });
});


app.listen(3000, () => {
    console.log("listening to port 3000")
});