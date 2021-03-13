let joinRoom = (id,username,room) =>{  // Getting username and room from frontend; Id from socket.id backend 
  let user = {id,username,room}; // Logged in user as an object 
  let users = [] ; 
   users.push(user); // Pushing user data to array
   return user; // users array will consist of  an array of objects ( each object has an username and a room.)
}




module.exports = {joinRoom}; 