const express = require('express');

const router = express.Router();

//Middleware pour vérifier l'authentification
router.use('', (req, res, next)=>{
    let user = req.session.user
    if(user){
        next();
    } else {
        req.session.errorMessage = "Vous devez être authentifié pour accéder aux pages user";
        res.redirect('/login');
    }
});