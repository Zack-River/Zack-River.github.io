document.addEventListener("DOMContentLoaded", function(){
    const Icon = document.getElementById("lock-ico");
    const Password = document.getElementById("password");

    Icon.addEventListener("click", function(){
        if(Password.type === "password"){
            Password.type = "text";
            Icon.classList.remove("bxs-lock-alt");
            Icon.classList.add("bxs-lock-open-alt")
        } else {
            Password.type = "password";
            Icon.classList.remove("bxs-lock-open-alt");
            Icon.classList.add("bxs-lock-alt");
        }

    })
});