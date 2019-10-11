const router = require('express').Router();
const db = require('../models')

router.get('/', (req, res) => {
   db.Message.find({
       sender: req.body.currentUser,
       recipient: req.body.recipient
   })
   .then(response => {
       res.send(response)
   })
   .catch(err => {
       console.log(err)
   })
})

module.exports = router;
