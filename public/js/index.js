
const picker = new EmojiButton({position:'top-start'});
const trigger = document.getElementById('emoji');
const logout = document.getElementById('logout');
const chatSound = document.getElementById("myAudio"); 
let expression = /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[\-;:&=\+\$,\w]+@)?[A-Za-z0-9\.\-]+|(?:www\.|[\-;:&=\+\$,\w]+@)[A-Za-z0-9\.\-]+)((?:\/[\+~%\/\.\w\-_]*)?\??(?:[\-\+=&;%@\.\w_]*)#?(?:[\.\!\/\\\w]*))?)/;
let regex = new RegExp(expression);
 picker.on('emoji', (emoji) => {
//  console.log(emoji);
 input.value += emoji;
 });
 trigger.addEventListener('click', () => picker.pickerVisible ? picker.hidePicker() : picker.showPicker(trigger));
 
  


//  socket.on('usersFound',()=>{

//  })


  const {username,room,url} = Qs.parse(location.search,{ignoreQueryPrefix:true});
  

  if(!username && !room)
  {
    window.location.replace("http://localhost:3000/login");

  }
 
//   if(url=='')
//   {
//        console.log( );
//     // document.getElementById('newUser').getElementById('avatar').src = url;
//   }

   const socket = io("http://localhost:3000");
  const messageContainer = document.getElementById('messageContainer');
  const button = document.querySelector('.fa-paper-plane');
  const h1 =  document.querySelector('h1');
  const input = document.querySelector('input');
  let avatar = document.getElementById('avatar');
  let palette = document.querySelector('input[type=color]');
   
 
  document.querySelector('#newUser').innerHTML = `${username}
  <img id="sidebarAvatar" src=${url || "https://cdn.iconscout.com/icon/free/png-256/manager-2506834-2130095.png"}></div>`;
  // input.addEventListener('input',(e)=>{
  //   socket.emit('typing',{message:'User is typing'})
  // })
 
  input.addEventListener('input',()=>{
       socket.emit('typing',{});
})

input.addEventListener('keyup',()=>{
    socket.emit('stoppedTyping',{});

});

socket.on('stopTyping',(message)=>{
    let typingText = document.getElementById('isTyping');
    typingText.innerText = `${message.content}`;
 })


socket.on('isTyping',(message)=>{
    console.log(message);
    let typingText = document.getElementById('isTyping');
    typingText.style.display="block";

    typingText.innerText = `${message.message}`;
})

  // socket.on('typing',(retrieved)=>{
  //    document.getElementById('isTyping').innerText = retrieved.message;
  // })
  button.addEventListener('click',(e)=>{
    let element = document.createElement('div');

      let value = input.value;
       if(value=='')
       {
          return;
       }
       // Sending the message to the server to be later passed to other users;
      socket.emit('message',{userMessage: value})
        
      element.innerHTML = `${value}`; 
      messageContainer.scrollTop = messageContainer.scrollHeight;



  })
  
   function userStatus() 
   {
    let span  = document.createElement('span');
   span.innerHTML= '<div></div>';
   span.id ='status';
    return span; 
   }

  socket.on('displayUsers',(activeUsers) => {
 
    let userContainer = document.getElementById('users');
    let singleUser = userContainer.getElementsByTagName('p');
//    console.log(activeUsers.users);
    activeUsers.users.forEach(user=>{
      let elem = document.createElement('p');
     elem.innerHTML = `${user.username} <span id="status"><div></div></span> `;
     // Checking if username already exists in user list ,if it does don't add to it
     if(userContainer.innerText.indexOf(user.username) > -1)
     {
       return;
     }
     else {
    
    
     userContainer.appendChild(elem); 
     }
     })
  });
  // Receiving message on backend
  socket.on('userConnected',(user)=>{
    chatSound.play();
   let element = document.createElement('div');
      element.classList.add('comment');
      element.innerHTML = ` ${user.message} has connected` ; 
        messageContainer.appendChild(element);

  })

socket.on('userDisconnected',(message,user)=>{
    let users = document.getElementById('users');
    let divs = users.querySelectorAll('#status');
    let currentUsers  = users.children;
   
      

    
 
    let element = document.createElement('div');
       element.classList.add('comment');
       element.innerHTML = `${message.message}` ; 
    
       messageContainer.appendChild(element);
       users.removeChild(users.lastChild);
 })

 
        /*
        document.querySelector('#newUser').innerHTML = `${username}
<div id="avatar"></div>     
<span class="status"></span>
        `;
        */

  socket.on('sendMessageToUsers',async({received,user})=>{
    let element = document.createElement('div');
    let bgColor = localStorage.getItem('color');

     console.log(received);
     element.id='newMessage';
     element.style.backgroundColor = bgColor;
       // <img id="avatar" class="userAvatar" src="https://i.pinimg.com/originals/51/f6/fb/51f6fb256629fc755b8870c801092942.png"></img>
      if(user.username === username)
      {
          if(received.userMessage)
          {
            let data =  fetch(`https://source.unsplash.com/weekly?dogs
            `).then((data)=>console.log(data.url));
           
          } 
        
       element.innerHTML =  `
      
      <p><strong>${user.username}</strong></p>
        <div id="userArea">
        <p> ${received.userMessage}</p>
        <img id="avatar" src=${url || 'https://cdn.iconscout.com/icon/free/png-256/manager-2506834-2130095.png'}></img>
        </div>
      <p> ${moment().format('h:mm a')}</p> ` ; 
         socket.emit('saveUser',{user:user.username,message:received.userMessage,date:moment().format('h:mm a')})
       messageContainer.appendChild(element);
       messageContainer.scrollTop =  messageContainer.scrollHeight;
       input.value = '';
      }
      else 
      {
        element.innerHTML =  `
      
        <p><strong>${user.username}</strong></p>
          <div id="userArea">
          <p> ${received.userMessage}</p>
          </div>
        <p> ${moment().format('h:mm a')}</p> ` ; 
           socket.emit('saveUser',{user:user.username,message:received.userMessage,date:moment().format('h:mm a')})
         messageContainer.appendChild(element);
         messageContainer.scrollTop =  messageContainer.scrollHeight;
         input.value = '';
      }
  })

 let roomName = document.getElementById('roomName');
  
 // Sending event to join room  (getting data from query ) *********** HERE STARTS JOINING ROOMS LOGIC 
  socket.emit('join-room',{username,room,url});
  // Upon joining room display room name;
  socket.on('userjoinedroom',(user)=>{
        roomName.innerHTML =    `${ user.user.room.toUpperCase()}`;
  })


  // Redirecting on disconnect to home
  logout.addEventListener('click',(e)=>{
    window.location.replace("http://localhost:3000");
    socket.emit('disconnect',{});
  })

 // Event for changing colors
  palette.addEventListener('change',(e)=>{
    let innerDivs = messageContainer.getElementsByTagName("div");

 
for(var i=0; i<innerDivs.length; i++) 
{ 
  innerDivs[i].style.backgroundColor = e.target.value
  
}

socket.emit('changedColors',{});
localStorage.setItem('color',e.target.value);
    
  })