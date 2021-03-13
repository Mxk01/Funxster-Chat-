let express = require('express');
let pusher = require('pusher');
let app = express();
let mongoose = require('mongoose');
let dotenv = require('dotenv');
dotenv.config();
let User = require('./models/User.js');
let port = process.env.PORT || 3000;
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const path = require('path');
const {joinRoom} = require('./rooms.js');
app.set('view engine','ejs');
app.set('views',path.join(__dirname,'views'));
app.use(express.static('public'));
app.get('/',(req,res)=>{
   res.render('index');
})

app.get('/login',(req,res)=>{
    res.render('login');
 })
 
mongoose.connect(process.env.MONGO_URI,{useNewUrlParser:true,useUnifiedTopology:true,useCreateIndex:true})
.then(()=>console.log('Connected to the database'));
io.on('connection',(socket)=>{
  socket.on('typing',(message)=>{
     socket.broadcast.emit('typing',{message:'User is typing'})
  })
   // Responds to event from frontend (where we got the query string data (user and room ) and passed it to backend )
    socket.on('join-room',({username,room})=>{
     // Now we want to grab the user that joined 
     // Socket holds an id for each user that joined the room;
      let user = joinRoom(socket.id,username,room);
      // Join room with user data
      socket.join(user.room);

  


      // Now send back user details via socket.emit
      socket.emit('userjoinedroom',{user});
       User.findOne({username}).then((user)=>{ 
          if(!user)
       {
       User.create({_id:socket.id,username,room}).then(()=>console.log('A new user has been saved to the database'));
       }
       else
       {
         return;
       }
       })
      
       User.find({}).then((result)=>{
       io.to(user.room).emit('displayUsers',{result})
       });

      socket.on('disconnect', () => {
         socket.broadcast.emit('userDisconnected',{message: `${user.username} has disconnected !`});
   
      });

      socket.broadcast.emit('userConnected',{message: `${user.username}`});
       

          // socket.emit(event,param);
    socket.on('message',async(received)=>{
      // console.log(socket.id);
       User.findById({_id:socket.id}).then((result)=>{
          console.log(result);
         io.to(user.room).emit('sendMessageToUsers',{received});

       })

    });
    
    })
 
})






// https://www.pubnub.com/blog/http-long-polling/


server.listen(port,()=>{console.log(`Listening on port ${port}`)}); 