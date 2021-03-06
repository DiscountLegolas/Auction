"use strict";


var buyedıtems = new Array();
var lastbidderconnectionid = "";
var auctionid = window.location.href.replace("https://localhost:44336/Auction/", "");
var açılışfiyatı = document.getElementById("açılışfiyatı");
var buton = document.getElementById("SatışıBaşlat");
var ürün = document.getElementById("Ürün");
var input = document.getElementById("CurrentMiktar");
var sayım = document.getElementById("countdown");
var currentmiktar = document.getElementById("currentmiktar");
var nextbutton = document.getElementById("NextButton");
var currentıtemıd = document.getElementById("ıtemıd");
var connection = new signalR.HubConnectionBuilder().withUrl("/auctionhub").build();
connection.on("Givelastplace", function () {
    if (model.IsModerator) {
        connection.invoke("GiveObj", auctionid, num.toString()).catch(function (err) {
            currentmiktar.innerText = err.toString();
        });
        var teklif = document.getElementById("from").innerText.replace("from", "");
        if (Number(teklif) == 0) {
            teklif = Number(obj.AçılışFiyatı).toString();
        }
        connection.invoke("SendCurrentAuctionValue", currentmiktar.innerText, auctionid, teklif, lastbidderconnectionid).catch(function (err) {
            return console.error(err.toString());
        });
    }
});
connection.on("ReceiveCurrentAuctionValue", function (value, name, connectıd) {
    lastbidderconnectionid = connectıd;
    input.min = value;
    input.value = value;
    currentmiktar.innerHTML = "<b>" + Number(value).toString() + "</b>";
    document.getElementById("from").innerHTML = "<b> from " + name.toString() + "</b>";
    buton.innerText = Number(value).toString() + " Fiyatından Satışı Aç";
    if (model.IsModerator) {
        buton.className = "";
    }
    var synt = window.speechSynthesis;
    const voicearray = window.speechSynthesis.getVoices();
    var line = name.toString() + "'den" + Number(value).toString() + "Tl";
    var utterence = new SpeechSynthesisUtterance(line);
    utterence.pitch = 1;
    utterence.volume = 1;
    for (var i = 0; i < voicearray.length; i++) {
        if (voicearray[i].name === "Microsoft Tolga - Turkish (Turkey)") {
            utterence.voice = voicearray[i];
            break;
        }
    }
    synt.speak(utterence);
});
function BuyedItem(id,name, price) {
    this.id = id;
    this.name = name;
    this.price = price;
}
connection.on("ReceiveSatış", function () {
    BeginSatış();
});
connection.on("ReceiveObj", function (number) {
    var obj = model.Items[Number(number)];
    açılışfiyatı.innerText=obj.AçılışFiyatı
    currentıtemıd.innerText = obj.Id;
    document.getElementById("from").innerText = "";
    currentmiktar.innerText = "";
    input.value = obj.AçılışFiyatı;
    input.min = obj.AçılışFiyatı;
    input.disabled = false;
    sayım.innerHTML = "";
    ürün.innerText = obj.Name;
});
buton.onclick = function () {
    BeginSatış();
    connection.invoke("BeginSatış", auctionid).catch(function (err) {
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
        event.preventDefault();
        lastbidderconnectionid = connectionıd;
        currentmiktar.innerHTML = "<b>" + Number(input.value).toString() + "</b>";
        document.getElementById("from").innerHTML = "<b> from " + model.Name + "</b>";
        buton.innerText = Number(input.value).toString() + " Fiyatından Satışı Aç";
        input.min = input.value;
        connection.invoke("SendCurrentAuctionValue", currentmiktar.innerText, auctionid, model.Name, connectionıd).catch(function (err) {
            return console.error(err.toString());
        });
    }
});
function BeginSatış() {
    var synt = window.speechSynthesis;
    const voicearray = window.speechSynthesis.getVoices();
    var utterance = new SpeechSynthesisUtterance();
    utterance.pitch = 1;
    utterance.volume = 1;
    for (var i = 0; i < voicearray; i++) {
        if (voicearray[i].name === "Microsoft Tolga - Turkish (Turkey)") {
            utterence.voice = voicearray[i];
            break;
        }
    }
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
                var buyedıtem = new BuyedItem(Number(currentıtemıd.innerText), ürün.innerText, a);
                buyedıtems.push(buyedıtem);
            }
            sayım.innerHTML = "<b>Sattım</b>";
            utterance.text = "Sattım";
            synt.speak(utterance);
            input.disabled = true;
            if (model.IsModerator && document.getElementById("Ürün").innerText != lastıtem.Name) {
                nextbutton.className = "";
            }
            if (document.getElementById("Ürün").innerText == lastıtem.Name) {
                var xhttp = new XMLHttpRequest();
                var url = "https://localhost:44336/CloseAuction/" + auctionid;
                xhttp.open("GET", url, false);
                xhttp.send(null);
                window.location.href = "https://localhost:44336/BuyPage/" + JSON.stringify(buyedıtems);
            }
            
        } else {
            if (timeleft == 4) {
                sayım.innerHTML = a.toString() + " e Satıyorum";
                utterance.text = "Satıyorum";
                synt.speak(utterance);
            }
            else if (timeleft == 3) {
                sayım.innerHTML = "";
            }
            else if (timeleft == 2) {
                sayım.innerHTML = a.toString() + " e Satıyorum";
                utterance.text = "Satıyorum";
                synt.speak(utterance);
            }
            else {
                sayım.innerHTML = "";
            }
        }
        timeleft -= 1;
    }, 1000);
    return;
}