let express = require('express');
let pusher = require('pusher');
let app = express();
 let mongoose = require('mongoose');
let dotenv = require('dotenv');
dotenv.config();
 let fileupload = require("express-fileupload");
 let multer  = require('multer')

let User = require('./models/User.js');
let port = process.env.PORT || 3000;
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const path = require('path');
const {joinRoom,getCurrentUser,getUsersFromRoom} = require('./rooms.js');


app.set('view engine','ejs');
app.use(express.json());
app.use(express.urlencoded({extended:false}));
app.set('views',path.join(__dirname,'views'));
app.use(express.static('public'));
// app.use(fileupload());



app.get('/',(req,res)=>{
   
  // console.log(req.body.url);
  //  if(req.body.url)
  //  {
  User.find({}).then(user => res.render('index',{user}) );
  //  }
  //  else 
  //  {
  //    res.send('Please insert a valid image URL')
  //  }
})

app.get('/login',(req,res)=>{
    res.render('login');
    console.log(req.body);
 })
 
mongoose.connect(process.env.MONGO_URI,{useNewUrlParser:true,useUnifiedTopology:true,useCreateIndex:true})
.then(()=>console.log('Connected to the database'));
io.on('connection',(socket)=>{

   

  socket.on('typing',(message)=>{
     socket.broadcast.emit('typing',{message:'User is typing'})
  })
   // Responds to event from frontend (where we got the query string data (user and room ) and passed it to backend )
    socket.on('join-room',({username,room,url})=>{
     // Now we want to grab the user that joined 
     // Socket holds an id for each user that joined the room;
      let user = joinRoom(socket.id,username,room,url);
      // Join room with user data
      socket.join(user.room);

  
    

      // Now send back user details via socket.emit
      socket.emit('userjoinedroom',{user});
       User.findOne({username}).then((user)=>{ 
          if(!user)
       {
       User.create({_id:socket.id,username,room,url}).then(()=>console.log('A new user has been saved to the database'));
       }
       else
       {
         return;
       }
       })
       // Display users 
           let users = getUsersFromRoom(user.room);
         // User.find({}).then((result)=>{
         io.to(user.room).emit('displayUsers',{users})
         // io.to(user.room).emit('displayUsers',{users})
         // });
        // Display disconnect message 
      socket.on('disconnect', () => {
         // User.findOneAndDelete({username:user.username}).then(()=> console.log('User has left chat'));
         socket.broadcast.emit('userDisconnected',{message: `${user.username} has disconnected !`,user:getCurrentUser(socket.id)});
   
      });
       socket.on('stoppedTyping',()=>{
         socket.to(user.room).emit('stopTyping',{content:`${user.username} has stopped typing`})
       })
      socket.on('typing',()=>{
         socket.to(user.room).emit('isTyping',{message:`${user.username} is typing`})
       })
       socket.broadcast.emit('userConnected',{message: `${user.username}`});
        
       socket.on('saveUser',({username,message,date})=>{
        // console.log(username,message,date);
       });
      //  socket.on('changedColors',()=>{
      //    io.to(user.room).broadcast.emit('changedColors',{message:`${username} has changed chat colors!`})
      //  })

 
          // socket.emit(event,param);
    socket.on('message',(received)=>{
      // console.log(socket.id);
      // let currentUser = getCurrentUser(socket.id);
      // console.log(currentUser)
       //   console.log(currentUser);
        //  User.findById(_id:socket.id).then((currentUser)=>{
        //   console.log(currentUser);
        //  })

          // io.to(user.room).emit send to everyone,socket.to(user.room).emit() send to everyone but the user 
          io.to(user.room).emit('sendMessageToUsers',{received,user});
       //  io.to(user.room).emit('sendMessageToUsers',{received,user});
         

    });
    
    })
 
})










// https://www.pubnub.com/blog/http-long-polling/


server.listen(port,()=>{console.log(`Listening on port ${port}`)}); 