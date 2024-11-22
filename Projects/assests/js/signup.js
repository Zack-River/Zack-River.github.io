document.addEventListener("DOMContentLoaded", function() {
    const Show_Pass = document.getElementById("show-pass");
    const Show_Confirm = document.getElementById("show-confirm");
    const password = document.getElementById("password");
    const confirm = document.getElementById("confirm-password");

    const terms = document.getElementById("terms")

    Show_Pass.addEventListener("click", function() {
        if (password.type === "password") {
            password.type = "text";
            Show_Pass.classList.remove("bx-lock-alt");
            Show_Pass.classList.add("bx-lock-open-alt");
        } else {
            password.type = "password";
            Show_Pass.classList.remove("bx-lock-open-alt");
            Show_Pass.classList.add("bx-lock-alt");
        }
    });

    Show_Confirm.addEventListener("click", function() {
        if (confirm.type === "password") {
            confirm.type = "text";
            Show_Confirm.classList.remove("bx-lock-alt");
            Show_Confirm.classList.add("bx-lock-open-alt");
        } else {
            confirm.type = "password";
            Show_Confirm.classList.remove("bx-lock-open-alt");
            Show_Confirm.classList.add("bx-lock-alt");
        }
    });

    terms.addEventListener("click", function(){
        event.preventDefault();
        window.alert("You are gay😆")
    })
});