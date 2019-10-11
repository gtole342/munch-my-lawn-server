const router = require('express').Router();
const db = require('../models')

router.get('/', (req, res) => {
    db.Message.find({
        sender: req.body.userId
    })
    .then(message => {
        res.send(`these are all the messages: ${message}`)
    })
    .catch(err => {
        console.log(err)
    })
})

module.exports = router;