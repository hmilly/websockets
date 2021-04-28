const socket = io();
const messageForm = document.querySelector(".message_form");
const messages = document.querySelector(".messages")
const nameForm = document.querySelector(".name_form");
const closebtn = document.querySelector(".closebtn")

let name = "Guest"
let typing = false;

nameForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const input = e.target.querySelector("input")
    if (input.value != "") {
        name = input.value
        nameForm.remove()
        document.querySelector(".userName").innerHTML += name
        socket.emit("newUser", name)
    }
})
socket.on("newUser", (name) => {
    messages.innerHTML += `<li class="openMsg">${name} has joined the chat!</li>`
})

messageForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const input = e.target.querySelector("input")
    if (input.value != "") {
        typing = false
        socket.emit("typing", { name, typing });
        socket.emit("messageEvent", { name, message: input.value })
        e.target.reset()
    }
})


const userTyping = messageForm.addEventListener("keydown", (e) => {
    typing = true
    socket.emit("typing", { name, typing });
})

socket.on("messageEvent", ({ name, message }) => {
    messages.innerHTML += `<li class="msg">${name}: ${message}</li>`
})

socket.on("typing", ({ name, typing }) => {
    const typingmsg = document.querySelector("li.typingmsg")
    if (typing === true && !typingmsg) {
        messages.innerHTML += `<li class="typingmsg">${name} is typing...</li>`;

    } else if (typing === false && typingmsg) {
        typingmsg.remove()
    }
})

closebtn.addEventListener("click", (e) => {
    e.preventDefault();
    //const msgs = messages.forEach(i => i.innerHTML)
        socket.emit("closeEvent", name)
        document.body.remove()
})

socket.on("closeEvent", (name) => {
    messages.innerHTML += `<li class="closeMsg">${name} has left the chat!</li>`
})
