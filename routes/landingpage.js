const landingPage = require('../models/landingpage');
const { v4: uuidv4 } = require('uuid');
const isot = require('../config/iso-to-string').isoToString


module.exports = (router) => { 

    router.post('/addlandingpage', (req, res) => {

        console.log('addlandingpage');
        console.log(req.body);

        let landingData = new landingPage({
            id: uuidv4(),
            information : req.body.information,
            services : req.body.services,
            trusted_agency : req.body.trusted_agency,
            contact_number : req.body.contact_number,
            email : req.body.email,
            address : req.body.address,
        });

        landingData.save( (err, landingData)  => {
                if(err){
                    res.json({ success: false, message: 'An Error Occured ', err: err.message })

                }else{
                    res.json({ success: true, message: 'Landing Page information successfully created', data: landingData});

                }
        });

    });


    router.get('/getLatestLandingPage', (req, res) =>{

        landingPage.find(
            { status: true },
            (err, landingPageData) => {
              // Check if error was found or not
              if (err) {
                res.json({ success: false, message: err }); // Return error message
              } else {
                // Check if blogs were found in database
                if (!landingPageData) {
                  res.json({ success: false, message: "No User found." }); // Return error of no blogs found
                } else {
                  res.json({ success: true, landingPageData: landingPageData.map( e => ({ ...e._doc , date_added : isot(e.dateAdded) } ) )[0] }); // Return success and blogs array
                }
              }
            }
          ).sort({ _id: -1 });

    });

    return router
};