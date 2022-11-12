const Orphan = require('../models/orphan'); // Import Orphan Model Schema
const { v4: uuidv4 } = require('uuid');
const hash = require('../config/password-hasher');
let bcrypt = require('bcryptjs');


module.exports = (router) => {

    router.get('/getAllOrphan', (req, res) => {

        // Search database for all blog posts
        Orphan.find({ deleted: false }, {}, (err, orphan) => {
            // Check if error was found or not
            if (err) {
                res.json({ success: false, message: err }); // Return error message
            } else {
                // Check if blogs were found in database
                if (!orphan) {
                    res.json({ success: false, message: 'No Orphan found.' }); // Return error of no blogs found
                } else {
                    res.json({ success: true, orphan: orphan }); // Return success and blogs array
                }
            }
        }).sort({ '_id': -1 }); // Sort blogs from newest to oldest
    });



    router.get('/getTotalOrphan', (req, res) => {

        // Search database for all blog posts
        Orphan.countDocuments({ deleted: 'false' }, (err, orphan) => {
            // Check if error was found or not
            if (err) {
                res.json({ success: false, message: err }); // Return error message
            } else {
                // Check if SocialWorker were found in database
                if (!orphan) {
                    res.json({ success: false, message: 'No Visitation found.' }); // Return error of no Volunteer found
                } else {
                    res.json({ success: true, getTotalOrphan: orphan }); // Return success and SocialWorker array
                }
            }
        }); // Sort SocialWorker from newest to oldest
    });




    router.post('/addOrphan', (req, res) => {



        if (!req.body.firstname || !req.body.lastname) {
            res.json({ success: false, message: 'You must provide an name or lastname' })
        } else {

            let orphan = new Orphan({
                id: uuidv4(),
                firstname: req.body.firstname.toLowerCase(),
                lastname: req.body.lastname.toLowerCase(),
                age: req.body.age,
                height: req.body.height,
                weight: req.body.weight,
                waist: req.body.waist,
                dob: req.body.dob,
                place_of_birth: req.body.place_of_birth,
                birth_status: req.body.birth_status,
                birth_status: req.body.birth_status,
                present_whereabouts: req.body.present_whereabouts,
                date_admission: req.body.date_admission,
                date_surrendered: req.body.date_surrendered,
                category: req.body.category,
                moral: req.body.moral,
                mointoring: req.body.mointoring,
            })

            orphan.save((err, data) => {
                if (err) {
                    if (err.code === 11000) {

                        res.json({ success: false, message: 'Orphan Error', err: err.message })
                    } else {

                        if (err.errors) {
                            //for specific error email,orphanname and password
                            if (err.errors.email) {
                                res.json({ success: false, message: err.errors.email.message })
                            } else {
                                if (err.errors.orphanname) {
                                    res.json({ success: false, message: err.errors.orphanname.message })
                                } else {
                                    if (err.errors.password) {
                                        res.json({ success: false, message: err.errors.password.message })
                                    } else {
                                        res.json({ success: false, message: err })
                                    }
                                }
                            }

                        } else {
                            res.json({ success: false, message: 'Could not save orphan Error : ' + err })
                        }
                    }
                } else {
                    res.json({ success: true, message: 'orphan Registered successfully', data: { email: data.email, orphanname: data.orphanname } });
                    // globalconnetion.emitter('orphan')
                }
            })
        }

    });


    router.put('/deleteOrphan', (req, res) => {

        let data = req.body;

        Orphan.deleteOne({
            id: data.id
        }, (err, orphan) => {
                if (err) {
                    res.json({ success: false, message: 'Could not Delete Orphan' + err })
                } else {
                    res.json({ success: true, message:' Successfully Deleted the Orphan', data: orphan });
                    // globalconnetion.emitter('orphan')
                }
            })


    });




    router.put('/updateOrphan', (req, res) =>   {

        let data = req.body;
        let orphanData = {};

     Orphan.findOne({id: data.id }, async (err,docs) => {
         //check old password against the database
       
            if (err){
                res.json({ success: false, message: 'Error unable to Process Profile update: ' + err })
            }
            else{

                    orphanData.firstname = data.firstname.toLowerCase(),
                    orphanData.lastname = data.lastname.toLowerCase(),
                    orphanData.age = data.age,
                    orphanData.height = data.height,
                    orphanData.weight = data.weight,
                    orphanData.waist = data.waist,
                    orphanData.dob = data.dob,
                    orphanData.place_of_birth = data.place_of_birth,
                    orphanData.birth_status = data.birth_status,
                    orphanData.birth_status = data.birth_status,
                    orphanData.present_whereabouts = data.present_whereabouts,
                    orphanData.date_admission = data.date_admission,
                    orphanData.date_surrendered = data.date_surrendered,
                    orphanData.category = data.category,
                    orphanData.moral = data.moral,
                    orphanData.mointoring = data.mointoring,

                    Orphan.findOneAndUpdate({ id: data.id }, orphanData, { upsert: true }, (err, response) => {
                        if (err) return res.json({ success: false, message: err.message });
                        if (response) {
                             res.json({ success: true, message: "Orphan Information has been updated!", data: response  });
                        } else {
                            res.json({ success: true, message: "No Orphan has been modified!", data: response });
                        }
                    });
              
            }
        })

    });


    return router;
};


