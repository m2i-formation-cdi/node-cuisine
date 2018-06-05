const express = require("express");
const router = express.Router();
const Model = require('./../model');

router.get('/', (req, res) => {
    recipeModel.find({}, (err, data) => {
        if (err) {
            console.log(err);
            res.end('Erreur Mongoose');
        } else {
            console.log(data)
            res.render('home',{ recipeList: data });
        }
    });
});

router.post('/form*', (req, res) => {
    console.log(req.body);
    let recipe = {
        title: req.body.title,
        cookingTime:req.body.cookingTime,
        PrepareTime:req.body.PrepareTime,
        theme:req.body.theme,
        difficulty:req.body.difficulty,
        nbPerson:req.body.nbPerson,
    };
});


router.get('/delete/:id', (req,res)=>{
    model.remove({_id:req.params.id},(err)=>{
        if (err){
            console.log(err);
            res.end('erreur');
        }else {
            res.redirect('/home');
        }
        
    })
})
module.exports=router;