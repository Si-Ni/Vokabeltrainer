const socket = io("http://192.168.178.104:3000/", { transports : ['websocket'] });

const eingabeForm = document.getElementById("neuerEintragForm");
const input1 = document.getElementById("eingabe1");
const input2 = document.getElementById("eingabe2");

eingabeForm.addEventListener("submit", (e) => {
    e.preventDefault();
    socket.emit("eingabe", {vokabel1: input1.value, vokabel2: input2.value});
    input1.value = "";
    input2.value = "";
    input1.focus();
})

socket.on("eingabe", (data) => {
    add(data);
})

function add (data) {
    var item = document.createElement("li");
    item.innerHTML =    `<form id="changeForm">
                        <button id="${data.id}" type="button" class="buttonD" onClick="reply_clickButton(this.id)">D</button>
                        <div class="ersteVokabel">${data.vokabel1}</div>
                        <div class='zweiteVokabel'>${data.vokabel2}</div>
                        </form>`;
    item.className = data.id + "d";
    ausgabe.appendChild(item);
    window.scrollTo(0, document.body.scrollHeight);
}

function reply_clickButton(clicked_id){
    socket.emit("delete", clicked_id);
}

socket.on("eintragExists", () => {
    console.log("Dieser Eintrag existiert bereits, keine doppelten Eintragungen möglich")
})

socket.on("alleEintraege", (data) => {
    add({vokabel1: data.vokabel1, vokabel2: data.vokabel2, id: data.id});
})

socket.on("delete", clicked_id => {
    item = document.getElementsByClassName(clicked_id+"d")[0];
    item.remove();
});

socket.on("deleteAll", () => {
    window.location.href = "index.html";
})

socket.on("links", () => {
    let all = document.getElementsByClassName('ersteVokabel');
        for (let i = 0; i < all.length; i++) {
            all[i].style.setProperty("--main-color", "transparent");
        }
    all = document.getElementsByClassName('zweiteVokabel');
        for (let i = 0; i < all.length; i++) {
            all[i].style.setProperty("--main-color", "black");
        }
})

socket.on("rechts", () => {
    let all = document.getElementsByClassName('zweiteVokabel');
        for (let i = 0; i < all.length; i++) {
            all[i].style.setProperty("--main-color", "transparent");
        }
    all = document.getElementsByClassName('ersteVokabel');
        for (let i = 0; i < all.length; i++) {
            all[i].style.setProperty("--main-color", "black");
        }
})

socket.on("anzeigen", () => {
    let all = document.getElementsByClassName('ersteVokabel');
        for (let i = 0; i < all.length; i++) {
            all[i].style.setProperty("--main-color", "black");
        }
    all = document.getElementsByClassName('zweiteVokabel');
        for (let i = 0; i < all.length; i++) {
            all[i].style.setProperty("--main-color", "black");
        }
})

