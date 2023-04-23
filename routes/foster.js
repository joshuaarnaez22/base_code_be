const Foster = require('../models/foster'); // Import User Model Schema
const { v4: uuidv4 } = require('uuid');
const hash = require('../config/password-hasher');
let bcrypt = require('bcryptjs');


module.exports = (router) => {

    router.get('/getAllFoster', (req, res) => {

        // Search database for all blog posts
        Foster.find({ deleted: false }, { _id: 1, email: 1, username: 1, role: 1, status: 1 }, (err, user) => {
            // Check if error was found or not
            if (err) {
                res.json({ success: false, message: err }); // Return error message
            } else {
                // Check if Foster were found in database
                if (!user) {
                    res.json({ success: false, message: 'No Foster found.' }); // Return error of no Volunteer found
                } else {
                    res.json({ success: true, user: user }); // Return success and Foster array
                }
            }
        }).sort({ 'dateAdded': -1 }); // Sort Foster from newest to oldest
    });

    router.get('/getTotalFoster', (req, res) => {

        // Search database for all blog posts
        Foster.countDocuments({ deleted: false}, (err, user) => {
            // Check if error was found or not
            if (err) {
                res.json({ success: false, message: err }); // Return error message
            } else {
                // Check if Foster were found in database
                if (!user) {
                    res.json({ success : true, name: 'Fosters' , total: user  }); // Return error of no Volunteer found
                } else {
                    res.json({ success : true, name: 'Fosters' , total: user  }); // Return success and Foster array
                }
            }
        }).sort({ 'dateAdded': -1 }); // Sort Foster from newest to oldest
    });




    router.post('/addFoster', (req, res) => {

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

                    let foster = new Foster({
                        id: uuidv4(),
                        email: req.body.email.toLowerCase(),
                        username: req.body.username.toLowerCase(),
                        password: req.body.password,
                        role: req.body.role.toLowerCase(),
                        firstname : req.body.firstname?.toLowerCase() || '',
                        lastname : req.body.lastname?.toLowerCase() || '',
                        address : req.body.address?.toLowerCase() || '',
                    })

                    foster.save((err, data) => {
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
                                    res.json({ success: false, message: 'Could not save Foster Error : ' + err })
                                }
                            }
                        } else {
                            res.json({ success: true, message: 'Foster Account Registered successfully', data: { email: data.email, username: data.username } });
                            // globalconnetion.emitter('user')
                        }
                    })

                }
            }
        }

    });


    router.put('/deleteFoster', (req, res) => {

        let data = req.body;

        console.log(data);

        Foster.deleteOne({
            id: data.id
        }, (err, user) => {
                if (err) {
                    res.json({ success: false, message: 'Could not Delete Foster' + err })
                } else {
                    res.json({ success: true, message: ' Successfully Deleted the Foster', data: user });
                    // globalconnetion.emitter('user')
                }
            })


    });




    router.put('/updateFoster', (req, res) =>   {

        let data = req.body;
        let fosterData = {};

        Foster.findOne({id: data.id }, async (err,docs) => {
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
                            fosterData.role = data.role;
                            fosterData.firstname = data.firstname  || '';
                            fosterData.lastname = data.lastname  || '';
                            fosterData.address = data.address || '';
                            fosterData.username = data.username;
                            fosterData.email = data.email;
                            fosterData.password = hash;
                            changedPassword = true;
                            Foster.findOneAndUpdate({ id: data.id }, fosterData, { upsert: true }, (err, response) => {
                                if (err) return res.json({ success: false, message: err.message });
                                if (response) {
                                    res.json({ success: true, message: "Foster Information has been updated!", data: response });
                                } else {
                                    res.json({ success: true, message: "No Foster has been modified!", data: response });
                                }
                            });
                        }).catch(err => { console.log(err); })

                    }
                }else{

                    fosterData.role = data.role;
                    fosterData.username = data.username;
                    fosterData.email = data.email;
                    fosterData.firstname = data.firstname  || '';
                    fosterData.lastname = data.lastname  || '';
                    fosterData.address = data.address || '';
                    fosterData.status = data.status;
                    Foster.findOneAndUpdate({ id: data.id }, fosterData, { upsert: true }, (err, response) => {
                        if (err) return res.json({ success: false, message: err.message });
                        if (response) {
                             res.json({ success: true, message: "Foster Information has been updated!", data: response  });
                        } else {
                            res.json({ success: true, message: "No Foster has been modified!", data: response });
                        }
                    });
                    
                }
            }
        })

    });

    return router;
};


