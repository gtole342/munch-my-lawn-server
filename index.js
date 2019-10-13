require('dotenv').config()
const express = require('express')
const cors = require('cors')
const expressJwt = require('express-jwt')
const rowdyLogger = require('rowdy-logger')
const socketIO = require('socket.io')
const MessagingResponse = require('twilio').twiml.MessagingResponse;
const app = express()
const rowdyResults = rowdyLogger.begin(app);
const http = require('http')
const server = http.createServer(app);
const io = socketIO(server);
const db = require('./models')

app.use(cors())
app.use(express.urlencoded({ extended: false }))
app.use(express.json({ limit: '10mb' }))

io.on('connection', function(socket){
  console.log('a user connected');
  let handshakeData = socket.request;
  let room = handshakeData._query['room']
  socket.join(room)
  socket.on('end', () => {
    socket.disconnect();
    socket.leave(room);
    console.log('a user disconnected');

  })
  socket.on('add message', (message, sender, recipient) => {
  io.to(room).emit('add message', message);
    const chatId = `${sender}-${recipient}`;
    console.log('update sender')
    db.User.updateOne(
      {_id: sender},
      {$push: { chats: chatId }}
    )
    .then(()=>{
      console.log('updated recipient')
      db.User.updateOne(
        {_id: recipient},
        {$push: { chats: chatId }}
      ).then(()=> {
        db.Message.create({
          message, 
          sender, 
          recipient,
          chatId
        })
        console.log('db entry made!')
      })
    })
    socket.on('is typing', (userId) => {
      console.log(userId)
    io.to(room).broadcast.emit('is typing', userId)
    })
    socket.on('disconnect', () => {
      socket.disconnect();
      socket.leave(room);
      console.log('a user disconnected');
    })
  })
});

app.post('/sms', (req, res) => {
  const twiml = new MessagingResponse();

  twiml.message('The Goats are coming! Head for the hills!');

  res.writeHead(200, {'Content-Type': 'text/xml'});
  res.end(twiml.toString());
});

app.use('/auth',
  expressJwt({
    secret: process.env.JWT_SECRET
  })
  .unless({
    path: [
      { url: '/auth/all', methods: ['GET'] },
      { url: '/auth/login', methods: ['POST'] },
      { url: '/auth/signup', methods: ['POST'] }
    ]
}), require('./controllers/auth'))

app.use('/message', require('./controllers/message'));
app.use('/reviews', 
  expressJwt({
  secret: process.env.JWT_SECRET
}), require('./controllers/reviews'))
app.use('/appointment',
  expressJwt({
    secret: process.env.JWT_SECRET
  }), require('./controllers/appointment'))
app.use('/user', require('./controllers/user'))
app.use('/chatlist', require('./controllers/chatlist'))
app.use('/goat', require('./controllers/goat'))
app.get('*', (req,res) => {
  res.status(404).send({
    message: 'Not Found'
  })
})

server.listen(process.env.PORT, ()=>{
  rowdyResults.print()
})
