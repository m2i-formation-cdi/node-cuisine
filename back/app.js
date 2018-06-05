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

app.get('/article-load', (req, res)=>{
    let author1 = new models.author({
        name: 'Modiano',
        firstName: 'Patrick',
        sex: 'M',
        nationality: 'française'
    });


    author1.save();
    author2.save();

    res.json(article);
});




mongoose.connect("mongodb://admin:admin123@ds241530.mlab.com:41530/mongo-test"); 

app.get("/", (req, res)=>{
    res.render("home");
})

//Affichage du formulaire de login
app.get('/login', (req,res)=>{
    //Récupération du message enregistré en session
    let err = req.session.errorMessage || null;
    //Destruction du message enregistré en session
    delete req.session.errorMessage;
    res.render('login', {error: err});
});


app.post("/login", (req, res)=>{

    //Définition des critères de la requête
    let search = {
        email: req.body.email,
        password: req.body.pwd
    };

    console.log(search);
    //Exécution de la requête
    models.user.findOne(search, (err, data) =>{
        if(err){
            console.log(err);
            res.end('Erreur d\'authentification');
        } else{
            if(data) {
                //Redirection si l'utilisateur est bien authentifié
                //Enregistrement des données de l'utilisateur dans la session
                req.session.user = data;
                console.log("Identification correcte")

                if(data.role == 'admin'){
                    res.redirect('/login');
                }else {
                    res.redirect('/');
                }
            } else {
                //Redirection si échec de authentifié
                //Enregistrement d'un message en variable de session
                req.session.errorMessage = "Tu t'es trompé";
                res.redirect('/login');
            }
        }
    })
})


app.listen(3000, ()=>{
    console.log("listening to port 3000")
});
