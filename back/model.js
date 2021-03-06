const mongoose = require("mongoose");
const schema = mongoose.Schema;
const crypto = require("crypto");

const User = new schema({
    email: { type: String, required: true, unique: true, index: true },
    name: { type: String, required: true },
    firstName: { type: String },
    password: {
        type: String, required: true, index: true,
        set: (val) => {
            let sha1 = crypto.createHash('sha1');
            return sha1.update(val).digest('hex');
        }
    },
    role: { type: String, enum: ['user', 'admin'], default: "user" },
    active: { type: Boolean, default: true }
});

const Ingredient = new schema({
    name: { type: String, required: true },
    ingredientType: { type: String, enum: ["légume", "fruit", "viande", "poisson", "autre"] },
    description: { type: String }
});

const Theme = new schema({
    name: { type: String, required: true }
});

const dishType = new schema({
    name: { type: String, required: true }
});

const Recipe = new schema({
    title: { type: String, required: true },
    ingredients: [{ type: schema.Types.ObjectId, ref: "Ingredients" }],
    cookingTime: { type: Number },
    PrepareTime: { type: Number },
    theme: { type: schema.Types.ObjectId, ref: "Themes" },
    dishType: { type: schema.Types.ObjectId, ref: "dishTypes" },
    difficulty: { type: Number, min: 1, max: 5 },
    nbPerson: { type: Number, min: 1 },
    steps: { type: String },
    ratings: [{
        user: { type: schema.Types.ObjectId, ref: "users", unique: true },
        score: { type: Number, min: 1, max: 10 }
    }],
    comments: [
        {
            user: { type: schema.Types.ObjectId, ref: "users", unique: true },
            text: { type: String },
            createdAt: { type: Date, default: Date.now }
        }
    ]
});

module.exports = {
    user: mongoose.model("user", User),
    ingredient: mongoose.model("ingredient", Ingredient),
    theme: mongoose.model("theme", Theme),
    dishType: mongoose.model("dishType", dishType),
    recipe: mongoose.model("recipe", Recipe)
};