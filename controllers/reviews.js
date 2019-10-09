let db = require('../models');
let router = require('express').Router();


// Get All reviews
router.get('/', (req, res) => {
  db.Review.find()
  .then(reviews => {
    console.log(reviews)
    res.send({ reviews})
  })
  .catch(err => {
    res.status(404).send({message: "Could not find Goats"})
  })
})

router.get('/:goatId', (req, res) => {
  db.User.findOne({_id: req.params.goatId})
  .then(user => {
    if(user) {
      res.status(201).send({reviews: user.reviews})
    }
    else {
      res.status(404).send({message: "resource not located" })
    }
  })
  .catch(err => {
    console.log("error in the get one route", err)
    res.status(404).send({message: "Could not find the Goat you were looking for"})
  })
})

router.post('/:goatId', (req, res) => {
  db.Review.create({
    goatId: req.params.goatId,
    //Change to req.user.id after testing is over
    clientId: req.body.clientId,
    title: req.body.title,
    content: req.body.content,
    rating: req.body.rating
  })
  .then(review => {
    res.status(201).send({success: review})
  })
  .catch(err => {
    console.log("error in the post route", err)
    res.status(500).send({message: "Failed posting the review"})
  })
})

router.put('/:reviewId', (req, res) => {
  db.Review.findOne({
    _id: req.params.reviewId
  })
  .then(review => {
    console.log(review.clientId)
    console.log(req.user._id)
    if (review.clientId === req.user._id) {
      review.title = req.body.title;
      review.content = req.body.content;
      review.rating = req.body.rating;
      review.save()
      res.send({message: "Review Updated"})
    }
    else {
      res.send({message: "This is not your review. Update denied."})
    }
  })
  .catch(err => {
    console.log("error in the put route", err)
    res.status(503).send({message: "Could not update"})
  })
})

router.delete('/:reviewId', (req, res) => {
  db.User.findOne({_id : req.params.reviewId})
  .then(review => {
    if (review.clientId === req.user.id) {
      db.Review.deleteOne({
        _id: req.params.reviewId
      })
      .then(() => {
        res.send({message: "successfully deleted"})
      })
    }
    else {
      res.send({message: "This is not your review. Delete denied." })
    }
  })
  .catch(err => {
    console.log("error in the delete route", err)
    res.status(503).send({message: "Could not delete"})
  })
})

module.exports = router;
