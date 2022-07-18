// socket setup on client side
const socket = io();// default namespace "/"

let userForm = document.querySelector(".user-form");
let chatPanelWrapper = document.querySelector(".chat-panel-wrapper");
let msgTable = document.querySelector(".chat-table");
let chatMsgForm = document.querySelector(".chat-msg-form");
let connectedUsers = document.querySelector(".users > ul"); 
let myStatus = document.querySelector(".users > h5");
let selected = document.querySelector("#user");
let indicator = document.querySelector("#typing-status");
let msgInputField = document.querySelector("#chat_msg");

let username = "";
let sender = "";
let receiver = "";

function appendMessage(data){
    // create a list item and add message content to it
    let li = document.createElement("li");
    let className = data.type;
    li.classList.add(className, "chat-msg");

    if(data.type === "outgoing"){
        // msg markup
        let outgoingMarkup = `
            <span class="chat-msg-text">${data.message} <br><span class="msg-time">${data.time}</span></span>
        `;
        li.innerHTML = outgoingMarkup;
    }else{
        let incomingMarkup = `
            <span class="chat-msg-text"><span class="sender">${data.sender}:</span> ${data.message} <br><span class="msg-time">${data.time}</span></span>
        `;
        li.innerHTML = incomingMarkup;
    }

    scrollToBottom();
    msgTable.appendChild(li);
}

// scroll to bottom for messages
function scrollToBottom() {  
    chatPanelWrapper.scrollTop = chatPanelWrapper.scrollHeight;
}

// register user 
const enterName = () => {
    // get the username
    username = userForm.username.value;

    // send to server
    socket.emit("user_connected", username);

    // save my name is global variable
    sender = username;

    // change my status
    myStatus.textContent = "Your status: active";
    myStatus.style.backgroundColor = "green";

    // disable input and submit fields
    let elements = userForm.elements;
    for(let a = 0; a < elements.length; a++){
        elements[a].disabled = true;
    }
    
    // prevent form from submitting
    return false;
}

const onUserSelected = (username) => {  
    // save selected user in global variable
    receiver = username;
    selected.textContent = username;
    // tell the server to load all prev msg from database
    socket.emit("user_selected", {receiver: receiver, sender: sender});
}


const sendMessage = () => {  
    // get the message 
    let message = chatMsgForm.chat_msg.value;
    let now = new Date();
    let msg = {
        sender: sender,
        receiver: receiver,
        message: message,
        type: "outgoing",
        time: now.toLocaleTimeString()+", "+now.toLocaleDateString()
    }

    // if receiver is set or selected
    if(receiver != ""){
        // send to server
        socket.emit("send_message", msg);
        // append own message
        appendMessage(msg);
    }else{
        console.log("select user");
    }

    // reset the msg input field
    chatMsgForm.reset();

    // prevent form from submitting
    return false;
}

const updateUsers = (concerning_user) => {  
    // html collection of all list items: .froEach is not applicable
    // convert to array to use .forEach
    let allUsers = Array.from(connectedUsers.children);

    let index = allUsers.findIndex(user => {
        // each li item
        let username = user.children[0].textContent.trim();// first button textContent
        return (username === concerning_user)
    });

    if(index != -1){
        // get the button
        let button = allUsers[index].children[0];
        const check = button.classList.toggle("offline");
        // check===true means online to offline o/t vice versa
        if(concerning_user === receiver){
            indicator.textContent = (check) ? `offline` : `online`;
        }
    }else{
        // new user detected
        addNewUser(concerning_user);
    }    
}

const addNewUser = (concerning_user) => {
    if(sender != ""){
        let markup = `
                    <li>
                        <button onclick="onUserSelected(this.textContent.trim());" class="online">
                            <span>${concerning_user}</span>
                        </button>
                    </li>
                    `;
        connectedUsers.innerHTML = markup + connectedUsers.innerHTML;
    }
}

// handle socket events----------------------------------------------

// listen from server when a new user connected
socket.on("user_connected", (username) => {
    if(sender != ""){
        updateUsers(username);
    }
});

socket.on("online_clients", (users) => {
    users.forEach(user => {
        let markup = `
        <li>
            <button onclick="onUserSelected(this.textContent.trim());" class="online">
                <span>${user}</span>
            </button>
        </li>
        `;
        connectedUsers.innerHTML = markup + connectedUsers.innerHTML;
    });
});

// listen froms server for new_message
socket.on("new_message", (data) => {
    // append received message
    if(receiver === data.sender)
        appendMessage(data);
});

// listen from server for selected client msg data
socket.on("messages_data", (data) => {
    // set status of receiver
    indicator.textContent = data.status;
    msgTable.innerHTML = ``;
    data.docs.forEach(message => {
        if(message.sender === sender){
            message.type = "outgoing";
        }else{
            message.type = "incoming";
        }
        appendMessage(message);
    });
});

socket.on("users_updated", (removed) => {
    if(removed != null){
        updateUsers(removed);
    }
});

// someone is typing
msgInputField.addEventListener("keyup", ()=>{
    socket.emit("typing", {sender: sender, receiver: receiver}); 
});

// listen from server for typing status
let timer;
socket.on("typing", sender => {
    if(sender === receiver){
        indicator.textContent = `${sender} is typing...`;

        clearTimeout(timer);
        timer = setTimeout(()=>{
            indicator.textContent = `online`;
        }, 500);
    }
});