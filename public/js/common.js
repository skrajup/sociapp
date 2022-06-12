const successMsg = document.getElementsByClassName("success-message");
const errorMsg = document.getElementsByClassName("error-message");
console.log("jai shree ram");

setTimeout(()=>{
    if(successMsg.length!=0){
        successMsg[0].style.display = "none";
    }
    if(errorMsg.length!=0){
        errorMsg[0].style.display = "none";
    }
}, 3000);