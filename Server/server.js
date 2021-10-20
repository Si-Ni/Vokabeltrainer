const express = require("express");
const app = express();
const http = require("http");
const mysql = require("mysql");

const server = http.createServer(app);
const socketio = require("socket.io");
const { isBuffer } = require("util");
const io = socketio(server);

const PORT = 3000;

const db = mysql.createConnection({
    host        : "localhost",
    user        : "root",
    password    : "123456",
    database    : "vokabeltrainer"
});

//vokabeltrainer: vokabeln(id, vokabel1, vokabel2)

db.connect((err) => {
    if(err) throw err;
    console.log("Database connected");
})

io.on("connection", (socket) => { 
    console.log("someone connected");
    let sql = `SELECT * FROM vokabeln`
    let query = db.query(sql, (err, result) => {
        result.forEach((res) => {
            socket.emit("alleEintraege", res);
        })
    })
    socket.on("eingabe", (data) => {
        let sql = `SELECT * FROM vokabeln WHERE vokabel1 = "${data.vokabel1}"`;
        let query = db.query(sql, (err, result) => {
            if(err) throw err;
            if(Object.keys(result).length > 0){
                socket.emit("eintragExists");
            }else{
                let eintrag = {vokabel1: data.vokabel1, vokabel2: data.vokabel2};
                let sql = "INSERT INTO vokabeln SET ?";
                let query = db.query(sql, eintrag, (err, result) => {
                    if(err) throw err;
                    let sql = `SELECT id FROM vokabeln WHERE vokabel1 = "${data.vokabel1}"`;
                    let query = db.query(sql, (err, result) => {
                        let id = result[0].id;
                        io.emit("eingabe", {vokabel1: data.vokabel1, vokabel2: data.vokabel2, id: id});
                    });
                });
            }
        });
    });
    socket.on("delete", (clicked_id) => {
        let sql = 'DELETE FROM vokabeln WHERE id = ' + clicked_id;
            let query = db.query(sql, (err, result) => {
                if(err) throw err;
                io.emit("delete", clicked_id);
            });
    });
    socket.on("deleteAll", () => {
        let sql = 'TRUNCATE TABLE vokabeln';
            let query = db.query(sql, (err, result) => {
                if(err) throw err;
                io.emit("deleteAll");
            });
    });
    socket.on("links", () => {
        io.emit("links");
    })
    
    socket.on("rechts", () => {
        io.emit("rechts");
    })
    
    socket.on("anzeigen", () => {
        io.emit("anzeigen");
    })
});

server.listen(PORT, "192.168.178.104", () => {
    console.log(`Server listening on ${PORT}`)
});