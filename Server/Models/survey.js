let mongoose = require('mongoose');

// create a model class
let surveyModel = mongoose.Schema({
    title: String,
    description: String,
    owner: String,
    questions: [],
    created: Date,
    updated: Date,
    expiry: Date,
    active: Date,
    startDate: Date

    },
    {
        collection: "surveys" //name of the collection
    }
);

module.exports = mongoose.model('Survey', surveyModel);