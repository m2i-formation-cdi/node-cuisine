const express = require("express");
const router = express.Router();
const Model = require('./../model');

router.get('/', (req, res) => {
    Model.recipe.find({}, (err, data) => {
        if (err) {
            console.log(err);
            res.end('Erreur Mongoose');
        } else {
            console.log(data)
            res.render('home',{ recipeList: data });
        }
    });
});

module.exports=router;