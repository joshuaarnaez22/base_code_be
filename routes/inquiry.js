const Inquiry = require('../models/inquiry');
const { v4: uuidv4 } = require('uuid');
const isot = require('../config/iso-to-string').isoToString


module.exports = (router) => {

    router.post('/addinquiry', (req, res) => {

        let inquiryData = new Inquiry({
            id: uuidv4(),
            name : req.body.name ?? '',
            message : req.body.message ?? '',
            phone : req.body.phone ?? '',
            email : req.body.email ?? '',
            
        });
        inquiryData.save( (err, inquiryReturnData ) => {
            if(err){
                res.json({ success: false, message: 'An Error Occured ', err: err.message })

            }else{
                res.json({ success: true, message: 'Inquiry successfully created', data: inquiryReturnData});
            }
        } )
    });



    router.get('/getAllInquiry', (req, res) =>{

        Inquiry.find(
            { deleted: false },
            (err, inquiryData) => {
              // Check if error was found or not
              if (err) {
                res.json({ success: false, message: err }); // Return error message
              } else {
                // Check if blogs were found in database
                if (!inquiryData) {
                  res.json({ success: false, message: "No Inquiry found." }); // Return error of no blogs found
                } else {
                  res.json({ success: true, inquiryData: inquiryData.map( e => ({ ...e._doc , date_added : isot(e.dateAdded), reads : e.read ? 'read' : 'unread', }) ) }); // Return success and blogs array
                }
              }
            }
          ).sort({ _id: -1 });

    });


    router.get('/getAllUnreadInquiry', (req, res) =>{

        Inquiry.countDocuments(
            { read: false },
            (err, inquiryData) => {
              // Check if error was found or not
              if (err) {
                res.json({ success: false, message: err }); // Return error message
              } else {
                // Check if blogs were found in database
                if (!inquiryData) {
                    res.json({ success : true, name: 'Total Inquiry' , total: inquiryData }); // Return error of no Volunteer found
                } else {
                    res.json({ success : true, name: 'Total Inquiry' , total: inquiryData }); // Return success and SocialWorker array
                }
              }
            }
          ).sort({ _id: -1 });

    });


    router.put('/deleteInquiry', (req, res) => {

        let data = req.body;

        Inquiry.deleteOne({
            id: data.id
        }, (err, user) => {
                if (err) {
                    res.json({ success: false, message: 'Could not Delete Inquiry' + err })
                } else {
                    res.json({ success: true, message: ' Successfully Deleted the Inquiry', data: user });
                    // globalconnetion.emitter('user')
                }
            })


    });


    router.put('/updateStatusInquiry', (req, res) => {

        let data = req.body;

        Inquiry.findOne({id: data.id }, async (err,docs) => {
            if (err){
                res.json({ success: false, message: 'Error unable to Process Inquiry update: ' + err })
            }
            else{
                    Inquiry.findOneAndUpdate({ id: data.id }, { status : data.status, deleted : data.deleted}, { upsert: true }, (err, response) => {
                        if (err) return res.json({ success: false, message: err.message });
                        if (response) {
                             res.json({ success: true, message: "Inquiry Information has been updated!", data: response  });
                        } else {
                            res.json({ success: true, message: "No Inquiry has been modified!", data: response });
                        }
                    });
            }
        })
    });
    router.put('/updateReadStatusInquiry', (req, res) => {

        let data = req.body;

        Inquiry.findOne({id: data.id }, async (err,docs) => {
            if (err){
                res.json({ success: false, message: 'Error unable to Process Inquiry update: ' + err })
            }
            else{
                    Inquiry.findOneAndUpdate({ id: data.id }, { read : data.read }, { upsert: true }, (err, response) => {
                        if (err) return res.json({ success: false, message: err.message });
                        if (response) {
                             res.json({ success: true, message: "Inquiry Information has been updated!", data: response  });
                        } else {
                            res.json({ success: true, message: "No Inquiry has been modified!", data: response });
                        }
                    });
            }
        })
    });
    router.put('/readAllinquryMessages', (req, res) => {
        
        Inquiry.updateMany({read: false }, {read : true }, async (err,docs) => {
            if (err){
                res.json({ success: false, message: 'Error mark All read documents: ' + err })
            }
            else{
                res.json({ success: true, message: "All inquiry are marked read", data: docs });
            }
        })
    });
//const res = await Person.updateMany({ name: /Stark$/ }, { isDeleted: true });

    return router;
};