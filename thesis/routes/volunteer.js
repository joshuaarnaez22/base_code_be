const Volunteer = require('../models/volunteer'); // Import User Model Schema
const { v4: uuidv4 } = require('uuid');
const hash = require('../config/password-hasher');
let bcrypt = require('bcryptjs');


module.exports = (router) => {

    router.get('/getAllVolunteer', (req, res) => {

        // Search database for all blog posts
        Volunteer.find({ deleted: false }, { _id: 1, email: 1, username: 1, role: 1, status: 1 }, (err, user) => {
            // Check if error was found or not
            if (err) {
                res.json({ success: false, message: err }); // Return error message
            } else {
                // Check if Volunteer were found in database
                if (!user) {
                    res.json({ success: false, message: 'No Volunteer found.' }); // Return error of no Volunteer found
                } else {
                    res.json({ success: true, user: user }); // Return success and Volunteer array
                }
            }
        }).sort({ '_id': -1 }); // Sort Volunteer from newest to oldest
    });




    router.post('/addVolunteer', (req, res) => {



        if (!req.body.email) {
            res.json({ success: false, message: 'You must provide an email' })
        } else {

            if (!req.body.username) {
                res.json({ success: false, message: 'You must provide an username' })
            } else {
                if (!req.body.password) {
                    res.json({ success: false, message: 'You must provide an password' })

                } else if (req.body.password !== req.body.confirm) {

                    res.json({ success: false, message: 'Password dont match' })

                } else {

                    let volunteer = new Volunteer({
                        id: uuidv4(),
                        email: req.body.email.toLowerCase(),
                        username: req.body.username.toLowerCase(),
                        password: req.body.password,
                        role: req.body.role.toLowerCase(),
                        firstname : req.body.firstname?.toLowerCase() || '',
                        lastname : req.body.lastname?.toLowerCase() || '',
                        address : req.body.address?.toLowerCase() || '',
                    })

                    volunteer.save((err, data) => {
                        if (err) {
                            if (err.code === 11000) {

                                res.json({ success: false, message: 'Username or Email already exists ', err: err.message })
                            } else {

                                if (err.errors) {
                                    //for specific error email,username and password
                                    if (err.errors.email) {
                                        res.json({ success: false, message: err.errors.email.message })
                                    } else {
                                        if (err.errors.username) {
                                            res.json({ success: false, message: err.errors.username.message })
                                        } else {
                                            if (err.errors.password) {
                                                res.json({ success: false, message: err.errors.password.message })
                                            } else {
                                                res.json({ success: false, message: err })
                                            }
                                        }
                                    }

                                } else {
                                    res.json({ success: false, message: 'Could not save Volunteer Error : ' + err })
                                }
                            }
                        } else {
                            res.json({ success: true, message: 'Volunteer Account Registered successfully', data: { email: data.email, username: data.username } });
                            // globalconnetion.emitter('user')
                        }
                    })

                }
            }
        }

    });


    router.put('/deleteVolunteer', (req, res) => {

        let data = req.body;

        console.log(data);

        Volunteer.deleteOne({
            id: data.id
        }, (err, user) => {
                if (err) {
                    res.json({ success: false, message: 'Could not Delete Volunteer' + err })
                } else {
                    res.json({ success: true, message: ' Successfully Deleted the Volunteer', data: user });
                    // globalconnetion.emitter('user')
                }
            })


    });




    router.put('/updateVolunteer', (req, res) =>   {

        let data = req.body;
        let volunteerData = {};

        Volunteer.findOne({id: data.id }, async (err,docs) => {
         //check old password against the database
       
            if (err){
                res.json({ success: false, message: 'Error unable to Process Profile update: ' + err })
            }
            else{
                //if they change thier password
                if(data.changePassword){
                    
                    let checkPassword = await bcrypt.compare(data.old_password, docs.password); 

                    if( !checkPassword){
                        res.json({ success: false, message: 'Old Password Incorrect: ' + !checkPassword })
                    }else{
                        
                        hash.encryptPassword(data.new_password).then(hash => {
                            volunteerData.role = data.role;
                            volunteerData.firstname = data.firstname  || '';
                            volunteerData.lastname = data.lastname  || '';
                            volunteerData.address = data.address || '';
                            volunteerData.username = data.username;
                            volunteerData.email = data.email;
                            volunteerData.password = hash;
                            changedPassword = true;
                            Volunteer.findOneAndUpdate({ id: data.id }, volunteerData, { upsert: true }, (err, response) => {
                                if (err) return res.json({ success: false, message: err.message });
                                if (response) {
                                    res.json({ success: true, message: "User Information has been updated!", data: response });
                                } else {
                                    res.json({ success: true, message: "No User has been modified!", data: response });
                                }
                            });
                        }).catch(err => { console.log(err); })

                    }
                }else{

                    volunteerData.role = data.role;
                    volunteerData.username = data.username;
                    volunteerData.email = data.email;
                    volunteerData.firstname = data.firstname  || '';
                    volunteerData.lastname = data.lastname  || '';
                    volunteerData.address = data.address || '';
                    volunteerData.status = data.status;
                    Volunteer.findOneAndUpdate({ id: data.id }, volunteerData, { upsert: true }, (err, response) => {
                        if (err) return res.json({ success: false, message: err.message });
                        if (response) {
                             res.json({ success: true, message: "User Information has been updated!", data: response  });
                        } else {
                            res.json({ success: true, message: "No User has been modified!", data: response });
                        }
                    });
                    
                }
            }
        })

    });

    return router;
};


