const write_to_dev_btn = document.querySelector(".write-to-dev-btn");
const dev_contact_form_container = document.querySelector(".dev-contact-form-container");
const dev_contact_form = document.querySelector(".dev-contact-form");
const background_container = document.querySelector(".custom-container");
// error messages
const successMsg = document.getElementsByClassName("success-message");
const errorMsg = document.getElementsByClassName("error-message");

setTimeout(()=>{
    if(successMsg.length!=0){
        successMsg[0].style.display = "none";
    }
    if(errorMsg.length!=0){
        errorMsg[0].style.display = "none";
    }
}, 3000);

// contact to developer form 
write_to_dev_btn.addEventListener("click", ()=>{
    dev_contact_form_container.style.display = "block";
    background_container.style.filter = "blur(2px)";
});

function closeDevContactForm() {    
    dev_contact_form_container.style.display = "none";
    background_container.style.filter = "blur(0px)";
}