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

    return router;
};