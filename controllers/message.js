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

router.get('/:userId', (req,res)=>{
    db.User.findOne({
        _id: req.params.userId
    })
    .then((user)=>{
        const getUserChats = async () => {
            return Promise.all(user.chats.map( async (chat)=>{
            let ids = chat.split('-');
            if (ids[0] == user._id) {
                return await db.User.findById(`${ids[1]}`)
                .then(async (user) => {
                    return {
                        id: user._id,
                        firstname: user.firstname,
                        lastname: user.lastname,
                        chatId: chat
                    }
                })
            }
            else if (ids[1] == user._id){
                return await db.User.findById(`${ids[0]}`)
                .then((user) => {
                    return {
                        id: user._id,
                        firstname: user.firstname,
                        lastname: user.lastname,
                        chatId: chat
                    }
                })
            }
            else{
                console.log('NOTHING FIRED!!!!! await function just returned without results')
                return
            }
        })
        )}
        getUserChats().then(response => {
            console.log(response);
            res.send({response})
        })
    })
})

module.exports = router;
