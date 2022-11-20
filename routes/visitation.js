const Visitation = require('../models/visitation'); // Import User Model Schema
const { v4: uuidv4 } = require('uuid');
const hash = require('../config/password-hasher');
let bcrypt = require('bcryptjs');
const isot = require('../config/iso-to-string').isoToString


module.exports = (router) => {

    router.get('/getAllVisitation', (req, res) => {

        // Search database for all blog posts
        Visitation.find({ deleted: false }, { id: 1, user_id: 1, orphan_id: 1, purpose: 1, status: 1 }, (err, user) => {
            // Check if error was found or not
            if (err) {
                res.json({ success: false, message: err }); // Return error message
            } else {
                // Check if Visitation were found in database
                if (!user) {
                    res.json({ success: false, message: 'No Visitation found.' }); // Return error of no Volunteer found
                } else {
                    res.json({ success:true, data: user.map( e => ({ ...e._doc, date_added : isot(e.dateAdded) }) )  });
                    //return  res.json({ success: true, user: user }); // Return success and Visitation array
                }
            }
        }).sort({ '_id': -1 }); // Sort Visitation from newest to oldest
    });


    router.get('/getTotalVisitation', (req, res) => {

        // Search database for all blog posts
        Visitation.countDocuments({deleted: false}, (err, visit) => {
            // Check if error was found or not
            if (err) {
                res.json({ success: false, message: err }); // Return error message
            } else {
                // Check if Visitation were found in database
                if (!visit) {
                    res.json({ success : true, name: 'Visitations' , total: visit }); // Return error of no Volunteer found
                } else {
                    res.json({ success : true, name: 'Visitations' , total: visit }); // Return success and Visitation array
                }
            }
        }); // Sort Visitation from newest to oldest
    });


    router.get('/getTotalApprovedVisitation', (req, res) => {

        // Search database for all blog posts
        Visitation.countDocuments({ status: 'approved' }, (err, visitation) => {
            // Check if error was found or not
            if (err) {
                res.json({ success: false, message: err }); // Return error message
            } else {
                // Check if SocialWorker were found in database
                if (!visitation) {
                    res.json({ success : true, name: 'Approved Visitations' , total: visitation }); // Return error of no Volunteer found
                } else {
                    res.json({ success : true, name: 'Approved Visitations' , total: visitation}); // Return success and SocialWorker array
                }
            }
        }); // Sort SocialWorker from newest to oldest
    });

    router.get('/getTotalPendingVisitation', (req, res) => {

        // Search database for all blog posts
        Visitation.countDocuments({ status: 'pending' }, (err, visitation) => {
            // Check if error was found or not
            if (err) {
                res.json({ success: false, message: err }); // Return error message
            } else {
                // Check if SocialWorker were found in database
                if (!visitation) {
                    res.json({ success : true, name: 'Pending Visitations' , total: visitation }); // Return error of no Volunteer found
                } else {
                    res.json({ success : true, name: 'Pending Visitations' , total: visitation }); // Return success and SocialWorker array
                }
            }
        }); // Sort SocialWorker from newest to oldest
    });

    router.get('/getTotalCancelledVisitation', (req, res) => {

        // Search database for all blog posts
        Visitation.countDocuments({ deleted: true }, (err, visitation) => {
            // Check if error was found or not
            if (err) {
                res.json({ success: false, message: err }); // Return error message
            } else {
                // Check if SocialWorker were found in database
                if (!visitation) {
                    res.json({ success : true, name: 'Cancelled Visitations' , total: visitation }); // Return error of no Volunteer found
                } else {
                    res.json({ success : true, name: 'Cancelled Visitations' , total: visitation }); // Return success and SocialWorker array
                }
            }
        }); // Sort SocialWorker from newest to oldest
    });


    router.post('/addVisitation', (req, res) => {
        
        let visitation = new Visitation({
            id: uuidv4(),
            user_id: req.body.user_id,
            orphan_id: !req.body.orphan_id === 0 ? req.body.orphan_id.toLowerCase() : 0,
            date: req.body.date,
            role: req.body.role.toLowerCase(),
            purpose : req.body.purpose?.toLowerCase() || '',
            
        });

        if(!req.body.user_id){
            res.json({ success: false, message: 'Please Provide id of the visitor'})
        }else if(!req.body.date){
            res.json({ success: false, message: 'Please Provide date of visit'})

        }else if(!req.body.purpose){
            res.json({ success: false, message: 'Please Provide purpose of visit'})

        }else{
            
            visitation.save((err, data) => {
                if (err) {
                    if (err.code === 11000) {
                        res.json({ success: false, message: 'An Error Occured ', err: err.message })
                    } else {
    
                        if (err.errors) {
                            //for specific error email,username and password
                            if (err.errors.user_id) {
                                res.json({ success: false, message: err.errors.user_id.message })
                            } else {
                                if (err.errors.date) {
                                    res.json({ success: false, message: err.errors.date.message })
                                } else {
                                    if (err.errors.purpose) {
                                        res.json({ success: false, message: err.errors.purpose.message })
                                    } else {
                                        res.json({ success: false, message: err })
                                    }
                                }
                            }
    
                        } else {
                            res.json({ success: false, message: 'Could not save Visitation Error : ' + err })
                        }
                    }
                } else {
                    res.json({ success: true, message: 'Visitation Account Registered successfully', data: visitation});
                    // globalconnetion.emitter('user')
                }
            })
        }


        

    });


    router.put('/deleteVisitation', (req, res) => {

        let data = req.body;

        console.log(data);

        Visitation.deleteOne({
            id: data.id
        }, (err, user) => {
                if (err) {
                    res.json({ success: false, message: 'Could not Delete Visitation' + err })
                } else {
                    res.json({ success: true, message: ' Successfully Deleted the Visitation', data: user });
                    // globalconnetion.emitter('user')
                }
            })


    });


    router.put('/updateStatusVisitation', (req, res) => {

        let data = req.body;

        Visitation.findOne({id: data.id }, async (err,docs) => {
            if (err){
                res.json({ success: false, message: 'Error unable to Process Visitation update: ' + err })
            }
            else{
                    Visitation.findOneAndUpdate({ id: data.id }, { status : data.status}, { upsert: true }, (err, response) => {
                        if (err) return res.json({ success: false, message: err.message });
                        if (response) {
                             res.json({ success: true, message: "Visitation Information has been updated!", data: response  });
                        } else {
                            res.json({ success: true, message: "No Visitation has been modified!", data: response });
                        }
                    });
            }
        })


    });




    router.put('/updateVisitation', (req, res) =>   {

        let data = req.body;
        let visitationData = {};

        Visitation.findOne({id: data.id }, async (err,docs) => {
            if (err){
                res.json({ success: false, message: 'Error unable to Process Visitation update: ' + err })
            }
            else{
                    visitationData.date = data.date;
                    visitationData.purpose = data.purpose;
                    visitationData.user_id = data.user_id;
                    visitationData.orphan_id = data.orphan_id;
                    visitationData.role = data.role  ;
                   
                    Visitation.findOneAndUpdate({ id: data.id }, visitationData, { upsert: true }, (err, response) => {
                        if (err) return res.json({ success: false, message: err.message });
                        if (response) {
                             res.json({ success: true, message: "Visitation Information has been updated!", data: response  });
                        } else {
                            res.json({ success: true, message: "No Visitation has been modified!", data: response });
                        }
                    });
            }
        })

    });

    return router;
};


