let router = require('express').Router()
let db = require('../models')


router.get('/goats', (req,res) => {
  db.User.find({
      isGoat: true
  })
  .then((users) => {
    res.send({users})
  })
  .catch((err)=>{
    console.log(err)
  })
})

// GET  profile
router.get('/:userId', (req,res) => {
  db.User.findOne({
    _id: req.params.userId
  })
  .then((user) => {
    res.send({user})
  })
  .catch((err) => {
    console.log(`Error in GET/user/${req.params.id}`, err)
    res.status(503).send({ message: 'Something went wrong.' })
  })
})

module.exports = router;