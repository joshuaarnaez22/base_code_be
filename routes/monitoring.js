const Monitoring = require('../models/monitoring'); // Import Monitoring Model Schema
const { v4: uuidv4 } = require('uuid');
const hash = require('../config/password-hasher');
let bcrypt = require('bcryptjs');


module.exports = (router) => {

    router.get('/getAllMonitoring', (req, res) => {

        // Search database for all blog posts
        Monitoring.find({ deleted: false }, {}, (err, monitoring) => {
            // Check if error was found or not
            if (err) {
                res.json({ success: false, message: err }); // Return error message
            } else {
                // Check if blogs were found in database
                if (!monitoring) {
                    res.json({ success: false, message: 'No Monitoring found.' }); // Return error of no blogs found
                } else {
                    res.json({ success: true, monitoring: monitoring }); // Return success and blogs array
                }
            }
        }).sort({ '_id': -1 }); // Sort blogs from newest to oldest
    });



    router.get('/getTotalMonitoring', (req, res) => {

        // Search database for all blog posts
        Monitoring.countDocuments({ deleted: 'false' }, (err, monitoring) => {
            // Check if error was found or not
            if (err) {
                res.json({ success: false, message: err }); // Return error message
            } else {
                // Check if SocialWorker were found in database
                if (!monitoring) {
                    res.json({ success : true, name: 'Monitoring' , total: monitoring }); // Return error of no Volunteer found
                } else {
                    res.json({ success : true, name: 'Monitoring' , total: monitoring }); // Return success and SocialWorker array
                }
            }
        }); // Sort SocialWorker from newest to oldest
    });




    router.post('/addMonitoring', (req, res) => {

        if (!req.body.social_worker_id || !req.body.orphan_id) {
            res.json({ success: false, message: 'You must provide an all' })
        } else {
            let monitoring = new Monitoring({
                id: uuidv4(),
                social_worker_id: req.body.social_worker_id,
                orphan_id: req.body.orphan_id,
                education: req.body.education,
                daily_health: req.body.daily_health,
                chores: req.body.chores,
                action: req.body.action,
                meal: req.body.meal,
                date: req.body.date,
            })

            monitoring.save((err, data) => {
                if (err) {
                    if (err.errors) {
                        res.json({ success: false, message: err.errors.message })
                    } else {
                        res.json({ success: false, message: 'Could not save monitoring Error : ' + err })
                    }
                } else {
                    res.json({ success: true, message: 'monitoring Registered successfully', data: data });
                    // globalconnetion.emitter('monitoring')
                }
            })
        }

    });


    router.put('/deleteMonitoring', (req, res) => {

        let data = req.body;

        Monitoring.deleteOne({
            id: data.id
        }, (err, monitoring) => {
                if (err) {
                    res.json({ success: false, message: 'Could not Delete Monitoring' + err })
                } else {
                    res.json({ success: true, message:' Successfully Deleted the Monitoring', data: monitoring });
                    // globalconnetion.emitter('monitoring')
                }
            })


    });




    router.put('/updateMonitoring', (req, res) =>   {

        let data = req.body;
        let monitoringData = {};

     Monitoring.findOne({id: data.id }, async (err,docs) => {
         //check old password against the database
       
            if (err){
                res.json({ success: false, message: 'Error unable to Process Monitoring update: ' + err })
            }
            else{

                    monitoringData.social_worker_id = data.social_worker_id,
                    monitoringData.orphan_id = data.orphan_id,
                    monitoringData.education = data.education,
                    monitoringData.daily_health = data.daily_health,
                    monitoringData.chores = data.chores,
                    monitoringData.action = data.action,
                    monitoringData.date = data.date,
                    monitoringData.meal = data.meal,
                    

                    Monitoring.findOneAndUpdate({ id: data.id }, monitoringData, { upsert: true }, (err, response) => {
                        if (err) return res.json({ success: false, message: err.message });
                        if (response) {
                             res.json({ success: true, message: "Monitoring Information has been updated!", data: response  });
                        } else {
                            res.json({ success: true, message: "No Monitoring has been modified!", data: response });
                        }
                    });
              
            }
        })

    });


    return router;
};


