const mongoose = require("mongoose");

//schema setup
let campgroundSchema = new mongoose.Schema({
    name: String,
    price: String,
    image: String,
    location: String,
    lat: Number,
    lng: Number,
    description: String,
    author: {
        id: {
            type: mongoose.Schema.Types.ObjectId, 
            ref: "User"
        },
        username: String
    },
    comments: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Comment"
        }        
    ]
});
//makes a model that ises schema and has methods added that we can use to interact with data base
module.exports = mongoose.model("Campground", campgroundSchema);

