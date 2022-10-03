const nodemailer = require("nodemailer");
const master_mail = "devquartz3152@gmail.com";

let transport = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD
    }
});

const send__to__dev__post = (req, res) => {  
    const name = req.body.sender_name_dev.trim();
    const email = req.body.sender_mail_dev.trim();
    const message = req.body.sender_msg_dev;
    if(name.length == 0 || email.length == 0 || message.length <= 15){
        req.flash("errorMsg", "fill required fields!!!");
        req.redirect("back");
    }
    const sender = name + '['+email+']' + '<' + master_mail + '>';
    const mailOptions = {
        from: sender,
        to: master_mail,
        subject: `Message from ${name}`,
        text: message
    };

    transport.sendMail(mailOptions).then(info=>{
        console.log(info);
        res.redirect("back");
    }).catch(err=>{
        console.log(err);
        res.redirect("back");
    });
}

module.exports = { send__to__dev__post, transport };