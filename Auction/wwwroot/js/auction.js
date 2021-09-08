"use strict";

var lastbidderconnectionid = "";
var lastbidder = "";
var auctionid = window.location.href.replace("https://localhost:44336/Auction/", "");
var buton = document.getElementById("SatışıBaşlat");
var input = document.getElementById("CurrentMiktar");
var sayım = document.getElementById("countdown");
var currentmiktar = document.getElementById("currentmiktar");
var connection = new signalR.HubConnectionBuilder().withUrl("/auctionhub").build();
connection.on("ReceiveCurrentAuctionValue", function (value, name, connectıd) {
    lastbidderconnectionid = connectıd;
    input.min = value;
    input.value = value;
    currentmiktar.innerHTML = "<b>" + Number(value).toString() + "</b>";
    lastbidder = name.toString();
    document.getElementById("from").innerHTML = "<b> from " + name.toString() + "</b>";
    buton.innerText = Number(value).toString() + " Fiyatından Satışı Aç";
    BeginSatış();
});
connection.on("ReceiveNextObj", function (number) {
    var obj = model.Items[Number(number)];
    input.value = obj.AçılışFiyatı;
    input.min = obj.AçılışFiyatı;
    currentmiktar.innerText = obj.AçılışFiyatı;
    document.getElementById("Ürün").innerText = obj.Name;
});
buton.onclick = function () {
    BeginSatış();
    connection.invoke("SendCurrentAuctionValue", currentmiktar.innerText, auctionid).catch(function (err) {
        return console.error(err.toString());
    });
}
connection.start().then(function () {
    connection.invoke("JoinGroup", auctionid).catch(function (err) {
        return console.error(err.toString());
    });
}).catch(function (err) {
    return console.error(err.toString());
});
input.addEventListener("keyup", function (event) {
    if (event.keyCode == 13) {
        currentmiktar.innerHTML = "<b>" + Number(input.value).toString() + "</b>";
        buton.innerText = Number(input.value).toString() + " Fiyatından Satışı Aç";
        input.min = input.value;
        BeginSatış();
        connection.invoke("SendCurrentAuctionValue", currentmiktar.innerText, auctionid, model.Name, connectionıd).catch(function (err) {
            return console.error(err.toString());
        });
    }
});
function BeginSatış() {
    var timeleft = 4;
    var a = Number(currentmiktar.innerText);
    var timer = setInterval(function () {
        if (sayım.innerText != "Sattım" && Number(currentmiktar.innerText) > a) {
            clearInterval(timer);
            sayım.innerHTML = "";
            return;
        }
        if (timeleft <= 0) {
            clearInterval(timer);
            if (lastbidderconnectionid == connectionıd) {
                window.location.href = "https://localhost:44336/";
            }
            sayım.innerHTML = "<b>Sattım</b>";
        } else {
            if (timeleft == 4) {
                sayım.innerHTML = a.toString() + " e Satıyorum";
            }
            else if (timeleft == 3) {
                sayım.innerHTML = "";
            }
            else if (timeleft == 2) {
                sayım.innerHTML = a.toString() + " e Satıyorum";
            }
            else {
                sayım.innerHTML = "";
            }
        }
        timeleft -= 1;
    }, 1000);
    return;
}