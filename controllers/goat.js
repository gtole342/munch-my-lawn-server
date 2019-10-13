let router = require('express').Router()
let db = require('../models')

router.get('/:id', (req,res) => {
  console.log("I HEAR YOU NEED ONE OF MY GOATS")
  console.log(req.params)
    db.User.findById({
      _id: req.params.id
    })
    .then((user) => {
      res.send({user})
    })
    .catch((err) => {
      console.log(`Error in GET/user/${req.params.id} Oh my goodness`, err)
      res.status(503).send({ message: 'Something went wrong.' })
    })
  })

module.exports = router;