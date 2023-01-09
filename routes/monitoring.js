const Monitoring = require('../models/monitoring'); // Import Monitoring Model Schema
const { v4: uuidv4 } = require('uuid');
const hash = require('../config/password-hasher');
let bcrypt = require('bcryptjs');
const isot = require('../config/iso-to-string').isoToString


module.exports = (router) => {

    router.get('/getAllMonitoring', (req, res) => {

        Monitoring.aggregate([
            {
              '$lookup': {
                'from': 'users', 
                'localField': 'addedby', 
                'foreignField': 'id', 
                'as': 'users'
              }
            }, {
              '$unwind': {
                'path': '$users', 
                'preserveNullAndEmptyArrays': true
              }
            }, {
              '$lookup': {
                'from': 'orphans', 
                'localField': 'orphan_id', 
                'foreignField': 'id', 
                'as': 'orphans'
              }
            }, {
              '$unwind': {
                'path': '$orphans', 
                'preserveNullAndEmptyArrays': true
              }
            }, {
              '$project': {
                'id': 1, 
                'addedByName': {
                  '$concat': [
                    {'$ifNull': [ '$users.firstname', '']}, ' ', 
                    {'$ifNull': ['$users.lastname', '']}, ' '
                  ]
                }, 
                'orphanName': {
                  '$concat': [
                    {'$ifNull': ['$orphans.firstname', '']}, ' ',
                    { '$ifNull': ['$orphans.lastname', '']}, ' '
                              ]
                }, 
                "role" : "$users.role",
                'orphan_id': '$orphan_id', 
                'status': '$status', 
                'date': '$date', 
                'deleted': '$deleted', 
                'education': '$education', 
                'daily_health': '$daily_health', 
                'chores': '$chores', 
                'action': '$action', 
                'meal': '$meal'
              }
            }
          ], (err, results) => {

                if( err ) return res.json({ success:false, message:err.message });
                if( results.length ){
                    return res.json({ success:true, data: results.map( e => ({ ...e, date_added : isot(e.dateAdded) }) )  });
                }else{
                    return res.json({ success:false, message: "No data found!", toaster: 'off' , data : [] });
                }
            }
        );





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

            if(req.body.orphan_id.length){
                let monitoring = [];
                req.body.orphan_id.map(e => {

                      monitoring.push(new Monitoring({
                        id: uuidv4(),
                        addedby: req.body.addedby,
                        orphan_id: e.id,
                        education: req.body.education,
                        daily_health: req.body.daily_health,
                        chores: req.body.chores,
                        action: req.body.action,
                        meal: req.body.meal,
                        date: req.body.date,
                    }));
                })

                Monitoring.insertMany(monitoring, (err, data) => {

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
                });
    
            }else{
                res.json({ success: false, message: 'Could not save monitoring Error : ' })   
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

                    monitoringData.addedby = data.addedby,
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


