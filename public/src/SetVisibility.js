export function setVisibility(buttonClicked){
    const selectingMessages = messages.querySelectorAll("li");
  selectingMessages.forEach((message) => {
    let local = message.getAttribute("from");
    message.classList.remove('hidden');
      
    if (buttonClicked !== local ) {
      message.classList.add('hidden');
    }
  });
  }