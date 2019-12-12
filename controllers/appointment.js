require('dotenv').config()
let router = require('express').Router();
let db = require('../models')
var nodemailer = require('nodemailer');


//Setting up the sender for nodemail
var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'munchmylawn@gmail.com',
    pass: process.env.EMAIL_PS
  }
});
//Twilio
const accountSid = process.env.ACCOUNT_SID;
const authToken = process.env.TWILIO_TOKEN;
const client = require('twilio')(accountSid, authToken);


// POST appointment
router.post('/create', (req,res) => {
  console.log('this is my req.body', req.body)
  db.Appointment.findOne({
    goatId: req.body.goatId,
    startDate: req.body.startDate,
    endDate: req.body.endDate
  })
  .then((appointment)=>{
    if (appointment){
      res.send('Thats been taken!')
    }
    db.Appointment.create(req.body)
    .then((newAppointment) => {
      //Send an email about the appointment
      // var mailOptions = {
      //   from: 'munchmylawn@gmail.com',
      //   to: req.user.email,
      //   subject: 'Appointment Set',
      //   text: `You have set an appointment for ${req.body.startDate}`
      // };
      console.log(req.user)

    //   transporter.sendMail(mailOptions, function(error, info){
    //     if (error) {
    //       console.log(error);
    //     } else {
    //       console.log('Email sent: ' + info.response);
    //     }
    //   });

    //   client.messages
    //     .create({
    //        body: 'This is the ship that made the Kessel Run in fourteen parsecs?',
    //        from: '+12054489339',
    //        to: req.user.phone
    //      })
    //     .then(message => console.log(message.sid));

    //   res.send({
    //     message: 'Appointment successfully created',
    //     appointmentId: newAppointment._id
    //   })
     })
    .catch((err) => {
      console.log('Error when creating new appointment', err)
      res.status(500).send({ message: 'Error creating appointment' })
    })
  })
  .catch((err) => {
    console.log('Error in POST/appointment/create', err)
    res.status(503).send({ message: 'Something went wrong.'})
  })
})

// GET all goat's appointments
router.get('/', (req,res) => {
  if (req.user.isGoat) {
    db.Appointment.find({
      goatId: req.user.id
    })
    .then((appointments)=>{
      res.send(appointments)
    })
    .catch((err) => {
      console.log('Error in GET/appointment/', err)
      res.status(503).send({ message: 'Something went wrong.' })
    })
  }
})

router.get('/all',(req,res) => {
  db.Appointment.find()
  .then((appointments) => {
    return res.send({appointments})
  })
})

// GET one appointment
router.get('/:appointmentId' ,(req,res) => {
  db.Appointment.findOne({
    _id: req.params.appointmentId
  })
  .then((appointment)=>{
    if (!req.user.id === appointment.clientId || !req.user.id === appointment.goatId){
      return res.status(403).send({ message: 'You do not have permission for this action.' })
    }
    res.send({ appointment })
  })
  .catch((err) => {
    console.log(`Error in GET/appointment/${req.params.appointmentId}`, err)
    res.status(503).send({ message: 'Something went wrong.' })
  })
})

// DELETE appointment
router.delete('/:appointmentId', (req,res) => {
  db.Appointment.findOne({
    _id: req.params.appointmentId
  })
  .then((appointment)=>{
    if (!req.user.id === appointment.clientId || !req.user.id === appointment.goatId){
      return res.status(403).send({ message: 'You do not have permission for this action.' })
    }
    db.Appointment.deleteOne({
      _id: req.params.appointmentId
    })
    .then(() => {
      res.send({ message: 'Deleted successfully' })
    })
    .catch((err) => {
      console.log('Error when deleting appointment', err)
      res.status(500).send({ message: 'Error deleting appointment' })
    })
  })
  .catch((err) => {
    console.log(`Error in DELETE/appointment/${req.params.appointmentId}`, err)
    res.status(503).send({ message: 'Something went wrong.' })
  })
})

// PUT appointment
router.put('/:appointmentId', (req, res) => {
  db.Appointment.findOne({
    _id: req.params.appointmentId
  })
  .then((appointment) => {
    if (!req.user.id === appointment.clientId || !req.user.id === appointment.goatId){
      return res.status(403).send({ message: 'You do not have permission for this action.' })
    }
    if (req.body.startDate) {
      appointment.startDate = req.body.startDate
    }
    if (req.body.endDate) {
      appointment.endDate = req.body.endDate
    }
    if (req.body.location) {
      appointment.location = req.body.location
    }
    appointment.save()
    .then((appointment)=>{
      res.send({
        message: 'Updated apppointment successfully',
        appointment
      })
    })
  })
  .catch((err) => {
    console.log(`Error in PUT/appointment/${req.params.appointmentId}`, err)
    res.status(503).send({ message: 'Something went wrong.' })
  })
})

module.exports = router;
