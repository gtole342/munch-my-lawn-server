const router = require('express').Router();
const db = require('../models')

router.get('/:senderId/:recipientId', (req, res) => {
    console.log(req.body);
   db.Message.find({
       sender: req.params.senderId,
       recipient: req.params.recipientId
   })
   .then(messages => {
       console.log(messages);
       res.send(messages)
   })
   .catch(err => {
       console.log(err)
   })
})

module.exports = router;
