let express = require('express');
let router = express.Router();
let mongoose = require('mongoose');
let passport = require('passport');

//create the user Model instance
let Survey = require('../models/survey');

//helper function for guard purpose
function requireAuth(req, res, next)
{
    // check if the user is logged in
    if(!req.isAuthenticated())
    {
        return res.redirect('/login');
    }
    next();
}

router.get('/', (req, res, next) => {
    Survey.find((err, surveyList)=> {
        if(err){
            return console.error(err);
        }
        else{
            //console.log(surveyList);
            res.render('survey/survey', {title: 'Survey List', SurveyList: surveyList, 
            displayName: req.user ? req.user.displayName : '' })
        }
    });
});

router.get('/create', requireAuth, (req, res, next) => {
    let emptySurvey = Survey({
        title: '',
        description: '',
        created: null,
        updated: null,
        expiry: null,
        active: null,
        startDate: null

      });

    res.render('survey/create_update', {title: 'Create Survey', Survey: emptySurvey, 
    displayName: req.user ? req.user.displayName : '' });   
}
);

router.post('/create', requireAuth, (req, res, next) => {

    let newServey = Survey({
        title: req.body.title,
        description: req.body.description,
        owner: "Group 10",
        questions: null,
        created: new Date(),
        updated: null,
        expiry: req.body.expiry,
        active: null, //req.body.active
        startDate: req.body.startDate,
        
    });

    Survey.create(newServey, (err, Survey) => {
        if(err)
        {
            console.log(err);
            res.end(err);
        }
        else
        {
            res.redirect('/survey-list');
        }
    });

});


router.get('/update/:id', requireAuth, (req, res, next) => {

    let id = req.params.id;

    Survey.findById(id, (err, survey) => {
        if(err)
        {
            console.log(err);
            res.end(err);
        }
        else
        {
            console.log("salfkdjslf"+Survey.title);
            console.log("test1235");
            res.render('survey/create_update', {title: 'Update Survey', Survey: survey, 
            displayName: req.user ? req.user.displayName : '' });   
        }
    });  

});

router.put('/update:id', requireAuth, (req, res, next) => {
    console.log("test1234");
    let id = req.params.id;

    let newServey = Survey({
        title: req.body.title,
        description: req.body.description,
        owner: req.body.owner,
        questions: req.body.questions,
        created: req.body.created,
        updated: req.body.updated,
        expiry: req.body.expiry,
        active: req.body.active, 
        startDate: req.body.startDate,
        
    });
    Survey.updateOne({_id: id}, newServey, (err) => {
        if(err)
        {
            console.log(err);
            res.end(err);
        }
        else
        {
            // console.log(req.body);

            res.redirect('survey/create_Update');
        }
    });
    
});



router.get('/delete/:id', requireAuth, (req, res, next) => {
    let id = req.params.id;
    Survey.remove({_id: id}, (err) => {
        if(err)
        {
            console.log(err);
            res.end(err);
        }
        else
        {
        res.redirect('/survey-list');
        }
    });

});

module.exports = router;