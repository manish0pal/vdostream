const express = require('express')
const app = express()
const cors = require('cors')

app.use(cors({
  origin: '*'
}));

const server = require('http').Server(app)
const io = require('socket.io')(server)
const { ExpressPeerServer } = require('peer');
const peerServer = ExpressPeerServer(server, {
  debug: true
});
//const { v4: uuidV4 } = require('uuid')

app.use('/peerjs', peerServer);

app.set('view engine', 'ejs')
app.use(express.static('public'))

app.get('/',(req,res)=>{
  res.render('proctor')
})

app.get('/:userId', (req, res) => {
  res.render('room',{userId: req.params.userId})
})





let candidateList =[];

io.on('connection', socket => {
  socket.on('join-room', (roomId, user) => {
    socket.join(roomId)
    socket.to(roomId).broadcast.emit('user-connected', user);
       //add single userId 
    candidateList.indexOf(user.userId) === -1 ? candidateList.push(user.userId) : console.log("This Candidate already exists");

    
    socket.join(user.userId)
    console.log("candidate user-connected",candidateList)
    //sigle messages to candidate
    socket.on('message', (tomsg) => {
      //send message to the same room
      io.sockets.in(tomsg.userId).emit('createMessage', tomsg);
  }); 
  //candidate_message
    socket.on('candidate_message', (tomsg) => {
      //send message to the same room
      io.to(roomId).emit('createMessageCandidate', tomsg);
  }); 
  socket.on("control-event",params=>{
    console.log("UserId",params.userId,"control-event",params.event)
    io.sockets.in(params.userId).emit('getControlEvent', params.event);
  })

  socket.on('userEvent',userEvent=>{
    io.to(roomId).emit("getUserEvent",userEvent);
  })

    socket.on('disconnect', () => {
      socket.to(roomId).broadcast.emit('user-disconnected', user.userId)
      const index = candidateList.indexOf(user.userId);
      if (index > -1) {
        candidateList.splice(index, 1);
      }
      console.log("candidate desconnect",candidateList)
      
    })
  })
})


server.listen(process.env.PORT||3030)
