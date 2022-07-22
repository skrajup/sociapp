const Message = require("../models/messages");
const User = require("../models/user");

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
            socket.broadcast.emit("user_connected", {user: username});
        });

        // listen from client
        socket.on("send_message", (data) => {
            // save msg data to database
            let msg = new Message({
                sender: data.sender,
                receiver: data.receiver,
                message: data.message,
                status: data.status,
                type: data.type,
                time: data.time
            });

            if(data.receiver in users){ // if user is online
                msg.status = true;
            }

            // save message data in database
            msg.save()
                .then(()=>{
                    // console.log("message saved");
                    // send event to receiver
                    // change message type
                    data.type = "incoming";

                    // if receiver is still online
                    if(data.receiver in users){
                        // send event to the receiver to render the msg to his/her screen
                        let receiverSocketId = users[data.receiver];
                        io.to(receiverSocketId).emit("new_message", data);
                        // as receiver recived and render the msg successfully on their screen
                        // notify the sender about the message status as message "seen"
                        let senderSocketId = users[data.sender];
                        io.to(senderSocketId).emit("seen_or_not", {status: true});
                    }else{
                        console.log("but user is offline right now");
                        // as receiver is offline
                        // notify the sender about the message status as message "unseen"
                        let senderSocketId = users[data.sender];
                        io.to(senderSocketId).emit("seen_or_not", {status: false});
                    }
                })
                .catch(err=>{
                    console.log(err.errors.message.properties.message);
                });
        });

        // listen from client that user is selected as receiver
        socket.on("user_selected", (data) => {
            let filterForFind = {$or: [{sender: data.sender, receiver: data.receiver}, {sender: data.receiver, receiver: data.sender}]};
            let filterForUpdate = {sender: data.receiver, receiver: data.sender};
            let update = { status: true };

            // update all incoming messages status to "seen"
            Message.updateMany(filterForUpdate, update)
                .then(()=>{
                    Message.find(filterForFind)
                        .then(docs => {
                            if(docs){
                                let senderSocketId = users[data.sender];
                                let receiverSocketId = users[data.receiver];
                                let receiver_status;
                                
                                if(data.receiver in users){
                                    receiver_status = "online"
                                    io.to(senderSocketId).emit("messages_data", {docs: docs, receiver_status: receiver_status});
                                    // notify receiver to let them know that all messages are seen
                                    io.to(receiverSocketId).emit("seen_by_receiver", {docs: docs, sender: data.sender});
                                }else {
                                    User.findOne({username: data.receiver})
                                        .then(user => {
                                            if(user){
                                                io.to(senderSocketId).emit("messages_data", {docs: docs, receiver_status: user.last_seen});
                                                // notify receiver to let them know that all messages are seen
                                                io.to(receiverSocketId).emit("seen_by_receiver", {docs: docs, sender: data.sender});
                                            }else{
                                                console.log("error: receiver not in db!!!");
                                            }
                                        })
                                        .catch(err => {
                                            console.log(err);
                                        });
                                } 
                            }
                        }).catch(err => {
                            console.log(err);
                        });
                }).catch(err => {
                    console.log(err);
                });
        });

        socket.on("disconnect", () => {
            // find in users array 
            var userKeyToRemove = getKeyByValue(users, socket.id);
            var now = new Date();
            var time = now.toLocaleTimeString()+", "+now.toLocaleDateString();
            // store user's last seen time
            User.updateOne({username: userKeyToRemove}, {last_seen: time})
                .then(()=>{
                    // delete from active users list
                    delete users[userKeyToRemove];    

                    // inform all active clients to update connected clients
                    socket.broadcast.emit("users_updated", {user: userKeyToRemove, last_seen: time});
                    // console.log(userKeyToRemove, " left the chat");  
                })
                .catch(err=>{
                    console.log(err);
                });
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
