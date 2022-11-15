const History = require('../models/history'); // Import History Model Schema
const { v4: uuidv4 } = require('uuid');
const hash = require('../config/password-hasher');
let bcrypt = require('bcryptjs');


module.exports = (router) => {

    router.get('/getAllHistory', (req, res) => {

        // Search database for all blog posts
        History.find({ status: true }, {}, (err, history) => {
            // Check if error was found or not
            if (err) {
                res.json({ success: false, message: err }); // Return error message
            } else {
                // Check if blogs were found in database
                if (!history) {
                    res.json({ success: false, message: 'No History found.' }); // Return error of no blogs found
                } else {
                    res.json({ success: true, history: history }); // Return success and blogs array
                }
            }
        }).sort({ '_id': -1 }); // Sort blogs from newest to oldest
    });



    router.get('/getTotalHistory', (req, res) => {

        // Search database for all blog posts
        History.countDocuments({ status: true }, (err, history) => {
            // Check if error was found or not
            if (err) {
                res.json({ success: false, message: err }); // Return error message
            } else {
                // Check if SocialWorker were found in database
                if (!history) {
                    res.json({ success : true, name: 'Historys' , total: history }); // Return error of no Volunteer found
                } else {
                    res.json({ success : true, name: 'Historys' , total: history }); // Return success and SocialWorker array
                }
            }
        }); // Sort SocialWorker from newest to oldest
    });




    router.post('/addHistory', (req, res) => {

        console.log('addHistory');

        if (!req.body.date || !req.body.action) {
            res.json({ success: false, message: 'You must provide a date and action' })
        } else {

            let history = new History({
                id: uuidv4(),
                date: req.body.date,
                action: req.body.action,
                createdBy: req.body.createdBy,
               
            })

            history.save((err, data) => {
                if (err) {
                    if (err.code === 11000) {
                        res.json({ success: false, message: 'History Error', err: err.message })
                    } else {
                        if (err.errors) {
                            res.json({ success: false, message: err.errors.message })
                        } else {
                            res.json({ success: false, message: 'Could not save history Error : ' + err })
                        }
                    }
                } else {
                    res.json({ success: true, message: 'history Registered successfully', data:data });
                    // globalconnetion.emitter('history')
                }
            })
        }

    });


    router.put('/deleteHistory', (req, res) => {

        let data = req.body;

        History.deleteOne({
            id: data.id
        }, (err, history) => {
                if (err) {
                    res.json({ success: false, message: 'Could not Delete History' + err })
                } else {
                    res.json({ success: true, message:' Successfully Deleted the History', data: history });
                    // globalconnetion.emitter('history')
                }
            })


    });




    router.put('/updateHistory', (req, res) =>   {

        let data = req.body;
        let historyData = {};

     History.findOne({id: data.id }, async (err,docs) => {
         //check old password against the database
       
            if (err){
                res.json({ success: false, message: 'Error unable to Process Profile update: ' + err })
            }
            else{

                    historyData.date = data.date
                    historyData.action = data.action
                    historyData.createdBy = data.createdBy
                    

                    History.findOneAndUpdate({ id: data.id }, historyData, { upsert: true }, (err, response) => {
                        if (err) return res.json({ success: false, message: err.message });
                        if (response) {
                             res.json({ success: true, message: "History Information has been updated!", data: response  });
                        } else {
                            res.json({ success: true, message: "No History has been modified!", data: response });
                        }
                    });
              
            }
        })

    });


    return router;
};


