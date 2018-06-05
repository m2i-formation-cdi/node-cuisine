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
<<<<<<< HEAD
app.use(bodyParser.urlencoded({ extended: false }));

app.use(session({ secret: "que j'aime à faire apprendre une nombre utile aux sages" }));
=======
app.use(bodyParser.urlencoded({
    extended: false
}));

app.use(session({
    secret: "que j'aime à faire apprendre une nombre utile aux sages"
}));
>>>>>>> origin/u10

mongoose.connect("mongodb://admin:admin123@ds241530.mlab.com:41530/mongo-test");

app.get("/", (req, res) => {
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

<<<<<<< HEAD
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

=======
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
>>>>>>> origin/u10
