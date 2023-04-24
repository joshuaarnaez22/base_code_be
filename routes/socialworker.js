const SocialWorker = require('../models/socialworker'); // Import User Model Schema
const { v4: uuidv4 } = require('uuid');
const hash = require('../config/password-hasher');
let bcrypt = require('bcryptjs');


module.exports = (router) => {

    router.get('/getAllSocialWorker', (req, res) => {

        // Search database for all blog posts
        SocialWorker.find({ deleted: false }, { _id: 1, email: 1, username: 1, role: 1, status: 1 }, (err, user) => {
            // Check if error was found or not
            if (err) {
                res.json({ success: false, message: err }); // Return error message
            } else {
                // Check if SocialWorker were found in database
                if (!user) {
                    res.json({ success: false, message: 'No SocialWorker found.' }); // Return error of no Volunteer found
                } else {
                    res.json({ success: true, user: user }); // Return success and SocialWorker array
                }
            }
        }).sort({ 'dateAdded': 1 }); // Sort SocialWorker from newest to oldest
    });

    router.get('/getTotalSocialWorker', (req, res) => {

        // Search database for all blog posts
        SocialWorker.countDocuments({ deleted: false }, (err, worker) => {
            // Check if error was found or not
            if (err) {
                res.json({ success: false, message: err }); // Return error message
            } else {
                // Check if SocialWorker were found in database
                if (!worker) {
                    res.json({  success : true, name: 'Social Workers' , total: worker }); // Return error of no Volunteer found
                } else {
                    res.json({ success : true, name: 'Social Workers' , total: worker }); // Return success and SocialWorker array
                }
            }
        }); // Sort SocialWorker from newest to oldest
    });


    /*
    Adventure.countDocuments({ type: 'jungle' }, function (err, count) {
  console.log('there are %d jungle adventures', count);
});
    
    */


    router.post('/addSocialWorker', (req, res) => {



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

                    let socialWorker = new SocialWorker({
                        id: uuidv4(),
                        email: req.body.email.toLowerCase(),
                        username: req.body.username.toLowerCase(),
                        password: req.body.password,
                        role: req.body.role.toLowerCase(),
                        firstname : req.body.firstname?.toLowerCase() || '',
                        lastname : req.body.lastname?.toLowerCase() || '',
                        address : req.body.address?.toLowerCase() || '',
                    })

                    socialWorker.save((err, data) => {
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
                                    res.json({ success: false, message: 'Could not save SocialWorker Error : ' + err })
                                }
                            }
                        } else {
                            res.json({ success: true, message: 'SocialWorker Account Registered successfully', data: { email: data.email, username: data.username } });
                            // globalconnetion.emitter('user')
                        }
                    })

                }
            }
        }

    });


    router.put('/deleteSocialWorker', (req, res) => {

        let data = req.body;

        console.log(data);

        SocialWorker.deleteOne({
            id: data.id
        }, (err, user) => {
                if (err) {
                    res.json({ success: false, message: 'Could not Delete SocialWorker' + err })
                } else {
                    res.json({ success: true, message: ' Successfully Deleted the SocialWorker', data: user });
                    // globalconnetion.emitter('user')
                }
            })


    });




    router.put('/updateSocialWorker', (req, res) =>   {

        let data = req.body;
        let socialworkerData = {};

        SocialWorker.findOne({id: data.id }, async (err,docs) => {
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
                            socialworkerData.role = data.role;
                            socialworkerData.firstname = data.firstname  || '';
                            socialworkerData.lastname = data.lastname  || '';
                            socialworkerData.address = data.address || '';
                            socialworkerData.username = data.username;
                            socialworkerData.email = data.email;
                            socialworkerData.password = hash;
                            changedPassword = true;
                            SocialWorker.findOneAndUpdate({ id: data.id }, socialworkerData, { upsert: true }, (err, response) => {
                                if (err) return res.json({ success: false, message: err.message });
                                if (response) {
                                    res.json({ success: true, message: "SocialWorker Information has been updated!", data: response });
                                } else {
                                    res.json({ success: true, message: "No User has been modified!", data: response });
                                }
                            });
                        }).catch(err => { console.log(err); })

                    }
                }else{

                    socialworkerData.role = data.role;
                    socialworkerData.username = data.username;
                    socialworkerData.email = data.email;
                    socialworkerData.firstname = data.firstname  || '';
                    socialworkerData.lastname = data.lastname  || '';
                    socialworkerData.address = data.address || '';
                    socialworkerData.status = data.status;
                    SocialWorker.findOneAndUpdate({ id: data.id }, socialworkerData, { upsert: true }, (err, response) => {
                        if (err) return res.json({ success: false, message: err.message });
                        if (response) {
                             res.json({ success: true, message: "SocialWorker Information has been updated!", data: response  });
                        } else {
                            res.json({ success: true, message: "No SocialWorker has been modified!", data: response });
                        }
                    });
                    
                }
            }
        })

    });

    return router;
};


