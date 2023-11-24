import { setVisibility } from "./SetVisibility.js";
import { setColor } from "./SetColor.js";
const socket = io();

export function selectRoom(e, attribute) {
    
      let selectedRoom = null;
      let targetSocketId = null;
  
      if (e.target.classList[0] !== "title") {
        if (attribute === "roomid") {
          selectedRoom = e.target.textContent;
          socket.emit("join room", selectedRoom);
        } else if (attribute === "userid") {
          targetSocketId = e.target.getAttribute(attribute);
        }
      }
      const buttonClicked = selectedRoom ||targetSocketId || "global" ;
      setVisibility(buttonClicked);
      setColor(e, targetSocketId, selectedRoom);
      if(attribute === "userid"){
        return targetSocketId
      }else{
        
      return selectedRoom
      }
       
     
    }
  

  

