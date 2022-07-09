// socket setup on client side
const socket = io();

let chatPanelWrapper = document.querySelector(".chat-panel-wrapper");
let msgTable = document.querySelector(".chat-table");
let chatMsgForm = document.querySelector(".chat-msg-form");

let username;
// do {
//     username = prompt("Please enter your name");
// } while (!username);

// get the typed msg and append in UI
chatMsgForm.addEventListener("submit", (e)=>{
    e.preventDefault();
    if(chatMsgForm.chat_msg.value.length != 0){
        sendMessage(chatMsgForm.chat_msg.value);
    }

    chatMsgForm.reset();
});

function sendMessage(message) {  
    let msg = {
        user: username,
        message: message.trim(),
        time: new Date().getMinutes()
    }
    // Append
    appendMessage(msg, "sender");
    scrollToBottom();

    // send to server
    socket.emit("newMessage", msg); // server listens for this event

}

function appendMessage(msg, type){
    // create a list item and add message content to it
    let li = document.createElement("li");
    let className = type;
    li.classList.add(className, "chat-msg");

    // markup inside li
    let senderMsgMarkup = `
        <span class="chat-msg-text">${msg.message}</span>
    `;

    let receipientMsgMarkup = `
        <img src="//www.gravatar.com/avatar/d3123e057c3dc9c7d9e2f9ef23878bc8?d=retro&s=35" alt="">
        <span class="chat-msg-text">${msg.message}</span>
    `;

    if(type == "sender"){
        li.innerHTML = senderMsgMarkup;
    }else{
        li.innerHTML = receipientMsgMarkup;
    }

    msgTable.appendChild(li);
}

// listen for receiving messages of other clients
socket.on("newMessageReceiving", (msg)=>{
    appendMessage(msg, "reciepient");
    scrollToBottom();
})


// scroll to bottom for messages
function scrollToBottom() {  
    chatPanelWrapper.scrollTop = chatPanelWrapper.scrollHeight;
}

