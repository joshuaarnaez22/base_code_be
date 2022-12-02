const Visitation = require('../models/visitation'); // Import User Model Schema
const { v4: uuidv4 } = require('uuid');
const hash = require('../config/password-hasher');
let bcrypt = require('bcryptjs');
const isot = require('../config/iso-to-string').isoToString


module.exports = (router) => {

    router.get('/getAllVisitation', (req, res) => {
            
        Visitation.aggregate([
        
            {
                $lookup:
                    {
                        from: "users",
                        localField: "user_id",
                        foreignField: "id",
                        as: "users"
                    }
            },
            {
                $unwind : {
                    path : "$users",
                    preserveNullAndEmptyArrays: true,
                  }
            },
            {
                $lookup:
                    {
                        from: "orphans",
                        localField: "orphan_id",
                        foreignField: "id",
                        as: "orphans"
                    }
            },
            {
                $unwind : {
                    path : "$orphans",
                    preserveNullAndEmptyArrays: true,
                  }
            },
            {
                $project: {
                    id: 1,
                    users: { $concat: [
                        { $ifNull: [ "$users.firstname", "" ] }, ", ",
                        { $ifNull: [ "$users.lastname", "" ] }, " ",
                       ]
                    },
                    orphan: { $concat: [
                        { $ifNull: [ "$orphans.firstname", "" ] }, ", ",
                        { $ifNull: [ "$orphans.lastname", "" ] }, " ",
                       ]
                    },
                    user_id: "$user_id",
                    orphan_id: "$orphan_id",
                    purpose: "$purpose",
                    status: "$status",
                    deleted: "$deleted",
                    dateAdded: "$dateAdded",
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
            orphan_id: !req.body.orphan_id ? '' : req.body.orphan_id,
            date: req.body.date,
            role: !req.body.role ? '' : req.body.role,  
            purpose : !req.body.purpose ? '' :  req.body.purpose.toLowerCase(),
            
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


    router.put('/updateVisitationWithOrphan', (req, res) =>   {

        let data = req.body;
        let visitationData = {};

        Visitation.findOne({id: data.id }, async (err,docs) => {
            if (err){
                res.json({ success: false, message: 'Error unable to Process Find this Visitation : ' + err })
            }
            else{
                 
                    visitationData.orphan_id = data.orphan_id;
                   
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


    // router.post('/getAllVisitationForLoggedUser', (req, res) =>   {

    //     let data = req.body;

    //     Visitation.find({ user_id: data.user_id }, async (err,docs) => {
    //         if (err){
    //             res.json({ success: false, message: 'Error Fetching Visitation : ' + err })
    //         }
    //         else{
    //             res.json({ success: true, data: docs  });
    //         }
    //     })
    // });




    router.post('/getAllVisitationForLoggedUser', (req, res) => {
            
        Visitation.aggregate([
        
            {
                $lookup:
                    {
                        from: "users",
                        localField: "user_id",
                        foreignField: "id",
                        as: "users"
                    }
            },
            {
                $unwind : {
                    path : "$users",
                    preserveNullAndEmptyArrays: true,
                  }
            },
            {
                $lookup:
                    {
                        from: "orphans",
                        localField: "orphan_id",
                        foreignField: "id",
                        as: "orphans"
                    }
            },
            {
                $unwind : {
                    path : "$orphans",
                    preserveNullAndEmptyArrays: true,
                  }
            },
            { 
                
                $match : {
                    user_id: req.body.user_id
                }  
            },
            {
                $project: {
                    id: 1,
                    users: { $concat: [
                        { $ifNull: [ "$users.firstname", "" ] }, ", ",
                        { $ifNull: [ "$users.lastname", "" ] }, " ",
                       ]
                    },
                    orphan: { $concat: [
                        { $ifNull: [ "$orphans.firstname", "" ] }, ", ",
                        { $ifNull: [ "$orphans.lastname", "" ] }, " ",
                       ]
                    },
                    user_id: "$user_id",
                    orphan_id: "$orphan_id",
                    purpose: "$purpose",
                    status: "$status",
                    deleted: "$deleted",
                    dateAdded: "$dateAdded",
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




    return router;
};


