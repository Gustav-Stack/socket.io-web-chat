const socket = io();
export function setColor(e, targetSocketId) {
    
const roomsOnline = document.getElementById("rooms-online");
const usersconnected = document.getElementById("users-online");

    var allUserItems = roomsOnline.querySelectorAll("li");
    var allRoomItems = usersconnected.querySelectorAll("li");
    var allItems = Array.from(allUserItems).concat(Array.from(allRoomItems))
    if (!allItems) {
      return;
    }
    if (e.target.tagName === "LI") {
      allItems.forEach((item) => {
        item.style.background = "#c3c2c2";
        item.style.color = "#5640ff";
      });
      
      e.target.style.background = "rgb(14 14 14)";
      e.target.style.color = "#fff";
  
      if(targetSocketId === socket.id){
        e.target.style.backgroundColor = "#808080";
        
      targetSocketId = null;
      }  
    }
    
  }