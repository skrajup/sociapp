const Message = require("../models/messages");

console.log("Socket setup executed");
function configSocketServer(http){ 
    // socket implementation
    const io = require("socket.io")(http);

    var users = [];

    io.on("connection", (socket)=>{
        // console.log("user-connected: " + socket.id);
        socket.on("user_connected", (username) => {
            // send all online clients list back to this client
            io.to(socket.id).emit("online_clients", Object.keys(users));

            // save in users array
            // socket id will be used to send msg to individual
            users[username] = socket.id;

            // notify all connected clients except sender itself
            socket.broadcast.emit("user_connected", username);
        });

        // listen from client
        socket.on("send_message", (data) => {
            // save msg data to database
            let msg = new Message({
                sender: data.sender,
                receiver: data.receiver,
                message: data.message,
                type: data.type,
                time: data.time
            });

            msg.save()
                .then(()=>{
                    // console.log("message saved");
                    // send event to receiver
                    // change message type
                    data.type = "incoming";

                    if(data.receiver in users){
                        let socketId = users[data.receiver];
                        io.to(socketId).emit("new_message", data);
                    }else{
                        console.log("but user is offline right now");
                    }
                })
                .catch(err=>{
                    console.log(err.errors.message.properties.message);
                });
        });

        // listen from client that user is selected as receiver
        socket.on("user_selected", (data) => {
            Message.find({$or: [{sender: data.sender, receiver: data.receiver}, {sender: data.receiver, receiver: data.sender}]})
                .then(docs => {
                    if(docs){
                        let socketId = users[data.sender];
                        let status;
                        (data.receiver in users) ? status = "online" : status = "offline";
                        io.to(socketId).emit("messages_data", {docs: docs, status: status});
                    }
                }).catch(err => {
                    console.log(err);
                });
        });

        socket.on("disconnect", () => {
            // find in users array 
            var userKeyToRemove = getKeyByValue(users, socket.id);
            delete users[userKeyToRemove];    

            // inform all active clients to update connected clients
            socket.broadcast.emit("users_updated", userKeyToRemove);
            // console.log(userKeyToRemove, " left the chat");      
        });

        // listen from client for typing status
        socket.on("typing", (persons) => {
            let socketId = users[persons.receiver];
            io.to(socketId).emit("typing", persons.sender);
        });
    });
}

function getKeyByValue(obj, val) {  
    return Object.keys(obj).find(key => obj[key] === val);
}

module.exports = configSocketServer;
