const { Post } = require("../models/post"); //Post model
const User = require("../models/user");


var posts = [];
const dashboard_index = (req, res)=>{
    // The below line was added so we couldn't display the "/home-dashboard" page
    // after we logged out using the "back" button of the browser, which
    // would normally display the browser cache and thus expose the
    // "/home-dashboard" page we want to protect.
    res.set(
        'Cache-Control',
        'no-cache, private, no-store, must-revalidate, max-stal e=0, post-check=0, pre-check=0'
    );

    fetchUserPosts(req.user)
        .then(docs => {
            posts = docs;
            res.render("dashboard", {user: req.user, posts: posts, successMsg: req.flash("successMsg"), errorMsg: req.flash("errorMsg")});
            // console.log(posts);
        })
        .catch(err => {
            console.log(err);
            res.render("dashboard", {user: req.user, posts: posts, successMsg: req.flash("successMsg"), errorMsg: req.flash("errorMsg")});
        })
    
    // console.log(posts);
}

const fetchPosts = async function (userId, postPerUser) {  
    var posts = [];
    await User.findOne({_id: userId})
        .then(user => {
            if(user){
                // console.log(user.username);
                posts = posts.concat(user.posts.sort((p1, p2) => (p1.date > p2.date) ? -1: 1).slice(0, postPerUser));
                // console.log(posts);
            }
        })
        .catch(err=>{
            console.log(err);
            return err;
        });
    
    return posts;
}

const fetchUserPosts = async function (user) { 
    // fetch posts of users that logged in user follows
    var posts = [];
    var limit = 20;
    var followingLen = user.following.length;
    var postPerUser = Math.floor(limit/followingLen);
    var i = 0;
    var following = user.following;
    for(var user of following){
        var userPosts = await fetchPosts(user.userId, postPerUser);
        // console.log(userPosts);

        posts = posts.concat(userPosts);
        // console.log("in", i);
        // i++;
    }; 

    // console.log(posts);
    // console.log("out", i);
    // i++;

    return posts;
}
// search panel requests
var usersFound = [];
var postsFound = [];

const dashboard_search_get = (req, res)=>{
    res.set(
        'Cache-Control',
        'no-cache, private, no-store, must-revalidate, max-stal e=0, post-check=0, pre-check=0'
    );
    res.render("search", {user: req.user, users: usersFound, posts: postsFound, successMsg: req.flash("successMsg"), errorMsg: req.flash("errorMsg")});
}

const dashboard_search_key_post = (req, res)=>{
    res.set(
        'Cache-Control',
        'no-cache, private, no-store, must-revalidate, max-stal e=0, post-check=0, pre-check=0'
    );
    
    var key = req.body.search;
    // console.log(key);
    User.find({$text: {$search: key}}, {score: {$meta: "textScore"}}).sort({score: {$meta: "textScore"}})
        .then(users=>{
            usersFound = users;
            Post.find({$text: {$search: key}}, {score: {$meta: "textScore"}}).sort({score: {$meta: "textScore"}})
                .then(posts=>{
                    // console.log(posts);
                    postsFound = posts;
                    res.redirect("back");
                });
        });
}

const dashboard_chat_get = (req, res)=>{
    res.set(
        'Cache-Control',
        'no-cache, private, no-store, must-revalidate, max-stal e=0, post-check=0, pre-check=0'
    );

    res.render("chat", {user: req.user, successMsg: req.flash("successMsg"), errorMsg: req.flash("errorMsg")});
}

const dashboard_create_get = (req, res)=>{
    res.set(
        'Cache-Control',
        'no-cache, private, no-store, must-revalidate, max-stal e=0, post-check=0, pre-check=0'
    );
    res.render("create-post", {user: req.user, successMsg: req.flash("successMsg"), errorMsg: req.flash("errorMsg")});
}

const dashboard_create_post = (req, res)=>{
    // console.log(req.user);
    res.set(
        'Cache-Control',
        'no-cache, private, no-store, must-revalidate, max-stal e=0, post-check=0, pre-check=0'
    );
    const newPost = new Post({
        username: req.user.username,
        title: req.body.title,
        body: req.body.postContent,
        postedOn: new Date().toLocaleDateString(),
        postedBy: req.user._id,
        date: new Date()
    });
    // console.log(newPost);

    newPost.save((err)=>{
        if(err){
            console.log(err);
            req.flash("errorMsg", "Title and Body fields are required!!!");
            res.redirect("back");
        }else{
            // console.log(newPost);
            req.user.posts.push(newPost);
            req.user.save()
            .then(()=>{
                req.flash("successMsg", "Post has been successfully created.");
                res.redirect("/dashboard/profile");
            }).catch(err=>{console.log(err);});
        }
    });
}

const dashboard_profile_get = (req, res)=>{
    res.set(
        'Cache-Control',
        'no-cache, private, no-store, must-revalidate, max-stal e=0, post-check=0, pre-check=0'
    );
   
    res.render("profile", {user: req.user, classes: ["active", "", ""], loggedId: req.user._id, successMsg: req.flash("successMsg"), errorMsg: req.flash("errorMsg")});
}

const dashboard_profile_followers_get = (req, res)=>{
    // console.log(req);
    res.set(
        'Cache-Control',
        'no-cache, private, no-store, must-revalidate, max-stal e=0, post-check=0, pre-check=0'
    );
    
    res.render("profile-followers.ejs", {user: req.user, classes: ["", "active", ""], loggedId: req.user._id, successMsg: req.flash("successMsg"), errorMsg: req.flash("errorMsg")});
}

const dashboard_profile_following_get = (req, res)=>{
    res.set(
        'Cache-Control',
        'no-cache, private, no-store, must-revalidate, max-stal e=0, post-check=0, pre-check=0'
    );  
    
    res.render("profile-following.ejs", {user: req.user, classes: ["", "", "active"], loggedId: req.user._id, successMsg: req.flash("successMsg"), errorMsg: req.flash("errorMsg")});
}

module.exports = {
    dashboard_index,
    dashboard_search_get,
    dashboard_search_key_post,
    dashboard_chat_get,
    dashboard_create_get,
    dashboard_create_post,
    dashboard_profile_get,
    dashboard_profile_followers_get,
    dashboard_profile_following_get
}
