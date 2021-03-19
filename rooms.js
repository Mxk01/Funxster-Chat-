let users = [] ; 
let joinRoom = (id,username,room,url) =>{  // Getting username and room from frontend; Id from socket.id backend 
  let user = {id,username,room,url}; // Logged in user as an object 
   users.push(user); // Pushing user data to array
   return user; // users array will consist of  an array of objects ( each object has an username and a room.)
}
function getCurrentUser(id) {
    // Find the user which has the id equal to socket.id 
    return users.find(user => user.id === id);
  }
  
function getUsersFromRoom(room)
{
  return users.filter(user=> user.room ===  room ) // Filtering users that are in the same room 
}


module.exports = {joinRoom,getCurrentUser,getUsersFromRoom}; 