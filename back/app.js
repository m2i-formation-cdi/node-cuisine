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

//u15 ajout d'un middleware admin avant d'accéder aux pages
app.use('/admin*', (req, res, next)=>{
    let user = req.session.user
    if(user && user.role == 'admin'){
        next();
    } else {
        req.session.error = "Access denied";
        res.redirect('/');
    }
});

//u15 : accéder à la liste des ingrédients / creation + modification
app.get("/admin/ingredients", (req, res)=> {
        models.ingredient.find({}, (err, data)=>{
            if(err){
                console.log(err);
                res.end("erreur mongoose");
            }
            else {
                res.render('admin-ingredients', {ingList: data});
            }
        })
        .sort({ name: 1 }); 
});

// u15 : formulaire d'ajout de la collection ingredient par l'admin
app.get("/admin/add-ingredient", (req, res)=>{

    const types = models.ingredient.schema.path("ingredientType").enumValues;
    
    res.render('admin-edit-ingredient', 
        {   types:types,
            ing:{name:null, ingredientType:types, description:null, _id:null}},
    );

});

//u15 : Traitement du formulaire d'ajout dans la collection ingredient par l'admin
app.post('/admin/add-ingredient', (req, res)=>{
    let ingredient = {
        name: req.body.name,
        ingredientType: req.body.ingredientType,
        description: req.body.description
    }
    //Persistance
    let model = new models.ingredient(ingredient);

    model.save((err)=>{
        if(err){
            res.end('erreur');
            console.log(err);
        } else {
            res.redirect('/admin/ingredients');
        }
    });
});

// u15 : route vers le formulaire de modification de la collection ingredient par l'admin
app.get("/admin/edit-ingredient/:id", (req, res)=>{
    const types = models.ingredient.schema.path("ingredientType").enumValues;

    models.ingredient.findById(req.params.id, (err, data)=>{
        if(err){
            console.log(err);
            res.end('erreur mongoose');
        } else{
            res.render("admin-edit-ingredient", {
                types:types,
                ing: data});
        }
    });
})

// u15 : traitement du formulaire de modification de la collection ingredient par l'admin
app.post("/admin/edit-ingredient/:id", (req, res)=>{
    const types = models.ingredient.schema.path("ingredientType").enumValues;

    let ingredient = {
        name: req.body.name,
        ingredientType: req.body.ingredientType,
        description: req.body.description
    };
    
    models.ingredient.updateOne({_id: req.body.id}, ingredient, (err)=>{
        if(err){
            res.end('erreur');
            console.log(err);
        } else {
            res.redirect('/admin/ingredients');
        }
    });
});


// u15 : Suppression d'un doc dans la collection ingredients par l'admin
app.get('/admin/delete/:id', (req, res)=>{
    models.ingredient.remove({_id:req.params.id}, (err)=>{
        if(err){
            console.log(err);
            res.end('erreur');
        } else {
            res.redirect('/admin/ingredients');
        }
    });
});

app.listen(3000, ()=>{
    console.log("listening to port 3000")
});
