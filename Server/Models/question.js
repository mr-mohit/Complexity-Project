let mongoose = require('mongoose');

// create a model class
let questionModel = mongoose.Schema({
    surveyId: String, //It must be changed and linked to database
    answers: []
    },
    {
        collection: "questions" //name of the collection
    }
);

module.exports = mongoose.model('Question', questionModel);