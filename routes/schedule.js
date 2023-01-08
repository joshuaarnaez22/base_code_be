const Schedule = require('../models/schedule'); // Import Schedule Model Schema
const { v4: uuidv4 } = require('uuid');
const isot = require('../config/iso-to-string').isoToString


module.exports = (router) => {

    router.get('/getAllSchedule', (req, res) => {
        
        Schedule.aggregate([
        
            {
                $lookup:
                    {
                        from: "volunteers",
                        localField: "volunteer_id",
                        foreignField: "id",
                        as: "volunteers"
                    }
            },
            {
                $unwind: "$volunteers"
            },
            {
                $project: {
                    id: 1,
                    volunteers: { $concat: [
                        { $ifNull: [ "$volunteers.firstname", "" ] }, ", ",
                        { $ifNull: [ "$volunteers.lastname", "" ] }, " ",
                       ]
                    },
                    schedule_date: 1,
                    schedule: 1,
                    status: "$status",
                    dateAdded: 1,
                }
            }
        ], (err, results) => {

                if( err ) return res.json({ success:false, message:err.message });
                if( results.length ){
                   // return res.json({ success:true, data: results  });
                    return res.json({ success:true, data: results.map( e => ({ ...e, date_added : isot(e.dateAdded) }) )  });

                }else{
                    return res.json({ success:false, message: "No data found!", toaster: 'off', data : []  });
                }
            }
        );
    });


    router.get('/getAllScheduleByID', (req, res) => {
        
        let id = req.body.id

        Schedule.aggregate([
        
            {
                $lookup:
                    {
                        from: "volunteers",
                        localField: "volunteer_id",
                        foreignField: "id",
                        as: "volunteers"
                    }
            },
            {
                $unwind: "$volunteers"
            },
            {
                $match: {
                    "volunteers.id": id,
                },
            },
            {
                $project: {
                    id: 1,
                    volunteers: { $concat: [
                        { $ifNull: [ "$volunteers.firstname", "" ] }, ", ",
                        { $ifNull: [ "$volunteers.lastname", "" ] }, " ",
                       ]
                    },
                    schedule_date: 1,
                    schedule: 1,
                    status: "$status",
                    dateAdded: 1,
                }
            }
        ], (err, results) => {

                if( err ) return res.json({ success:false, message:err.message });
                if( results.length ){
                    return res.json({ success:true, data: results  });
                }else{
                    return res.json({ success:false, message: "No data found!", toaster: 'off', data : []  });
                }
            }
        );
    });



    router.get('/getTotalSchedule', (req, res) => {

        Schedule.countDocuments({ status: true }, (err, schedule) => {
            if (err) {
                res.json({ success: false, message: err }); 
            } else {
                if (!schedule) {
                    res.json({ success : true, name: 'Schedules' , total: schedule }); 
                } else {
                    res.json({ success : true, name: 'Schedules' , total: schedule }); 
                }
            }
        }); 
    });




    router.post('/addSchedule', (req, res) => {

        console.log('addSchedule');

        if (!req.body.volunteer_id || !req.body.schedule_date) {
            res.json({ success: false, message: 'You must provide a date and volunteer' })
        } else {

            let schedule = new Schedule({
                id: uuidv4(),
                schedule_date: req.body.schedule_date,
                volunteer_id: req.body.volunteer_id,
                schedule: req.body.schedule,
            })

            schedule.save((err, data) => {
                if (err) {
                    if (err.code === 11000) {
                        res.json({ success: false, message: 'Schedule Error', err: err.message })
                    } else {
                        if (err.errors) {
                            res.json({ success: false, message: err.errors.message })
                        } else {
                            res.json({ success: false, message: 'Could not save Schedule, Error : ' + err })
                        }
                    }
                } else {
                    res.json({ success: true, message: 'Schedule Registered successfully', data:data });
                    // globalconnetion.emitter('schedule')
                }
            })
        }

    });


    router.put('/deleteSchedule', (req, res) => {

        let data = req.body;

        Schedule.findOneAndUpdate({ id: data.id }, { status : data.status }, { upsert: true }, (err, schedule) => {
                if (err) {
                    res.json({ success: false, message: 'Could not Delete Schedule' + err })
                } else {
                    res.json({ success: true, message:' Successfully Deleted the Schedule', data: schedule });
                    // globalconnetion.emitter('schedule')
                }
            })


    });
    // router.put('/deleteSchedule', (req, res) => {

    //     let data = req.body;

    //     Schedule.deleteOne({
    //         id: data.id
    //     }, (err, schedule) => {
    //             if (err) {
    //                 res.json({ success: false, message: 'Could not Delete Schedule' + err })
    //             } else {
    //                 res.json({ success: true, message:' Successfully Deleted the Schedule', data: schedule });
    //                 // globalconnetion.emitter('schedule')
    //             }
    //         })


    // });




    router.put('/updateSchedule', (req, res) =>   {

        let data = req.body;
        let scheduleData = {};

     Schedule.findOne({id: data.id }, async (err,docs) => {
         //check old password against the database
       
            if (err){
                res.json({ success: false, message: 'Error unable to Process Profile update: ' + err })
            }
            else{

                scheduleData.volunteer_id = data.volunteer_id ?? ''
                scheduleData.schedule_date = data.schedule_date
                scheduleData.schedule = data.schedule
                    

                    Schedule.findOneAndUpdate({ id: data.id }, scheduleData, { upsert: true }, (err, response) => {
                        if (err) return res.json({ success: false, message: err.message });
                        if (response) {
                             res.json({ success: true, message: "Schedule Information has been updated!", data: response  });
                        } else {
                            res.json({ success: true, message: "No Schedule has been modified!", data: response });
                        }
                    });
              
            }
        })

    });


    return router;
};


