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
                    res.json({ success : true, name: 'Orphans' , total: orphan }); // Return error of no Volunteer found
                } else {
                    res.json({ success : true, name: 'Orphans' , total: orphan }); // Return success and SocialWorker array
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
                gender: req.body.gender,
                height: req.body.height,
                weight: req.body.weight,
                waist: req.body.waist,
                dob: req.body.dob,
                place_of_birth: req.body.place_of_birth,
                birth_status: req.body.birth_status,
                present_whereabouts: req.body.present_whereabouts,
                date_admission: req.body.date_admission,
                date_surrendered: req.body.date_surrendered,
                category: req.body.category,
                moral: req.body.moral,
                place_where_found :  req.body.place_where_found,
                date_surrendered : req.body.date_surrendered,
                souce_information :  req.body.souce_information,
                circumstances :  req.body.circumstances,
                background_info :  req.body.background_info,
                desc_child_admission : req.body.desc_child_admission,
                dev_history :  req.body.dev_history,
                desc_present_envi :  req.body.desc_present_envi,
                termination_rights_abandonement : req.body.termination_rights_abandonement,
                assesement_recomendation :  req.body.assesement_recomendation,
                // mointoring: req.body.mointoring,
            })

            orphan.save((err, data) => {
                if (err) {
                    if (err.code === 11000) {
                        res.json({ success: false, message: 'Orphan Error', err: err.message })
                    } else {
                        if (err.errors) {
                            res.json({ success: false, message: err.errors.message })
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
                    orphanData.gender = data.gender,
                    orphanData.height = data.height,
                    orphanData.weight = data.weight,
                    orphanData.waist = data.waist,
                    orphanData.dob = data.dob,
                    orphanData.place_of_birth = data.place_of_birth,
                    orphanData.birth_status = data.birth_status,
                    orphanData.present_whereabouts = data.present_whereabouts,
                    orphanData.date_admission = data.date_admission,
                    orphanData.date_surrendered = data.date_surrendered,
                    orphanData.category = data.category,
                    orphanData.moral = data.moral,
                    // orphanData.mointoring = data.mointoring,
                    orphanData.place_where_found =  req.body.place_where_found,
                    orphanData.souce_information =  req.body.souce_information,
                    orphanData.circumstances = req.body.circumstances,
                    orphanData.background_info =  req.body.background_info,
                    orphanData.desc_child_admission = req.body.desc_child_admission,
                    orphanData.dev_history =  req.body.dev_history,
                    orphanData.desc_present_envi =  req.body.desc_present_envi,
                    orphanData.termination_rights_abandonement = req.body.termination_rights_abandonement,
                    orphanData.assesement_recomendation =  req.body.assesement_recomendation,


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


