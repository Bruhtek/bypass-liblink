// ==UserScript==
// @name         Bypass liblink
// @version      1.0
// @description  Bypass the annoying liblink in user messages.
// @author       Bartosz Kasperski
// @match        https://synergia.librus.pl/wiadomosci/*
// @grant        GM_xmlhttpRequest
// @connect      liblink.pl
// ==/UserScript==

(async function() {
    'use strict';

    var targetDiv = document.querySelector(".container-message-content");

    var targetLinksCollector = targetDiv.getElementsByTagName('a');

    for(var i = 0; i < targetLinksCollector.length; i++) {
        await GM_xmlhttpRequest({
        method: "GET",
        url: targetLinksCollector[i].innerHTML,
        headers: {
          "User-Agent": "Mozilla/5.0",
          "Accept": "text/html"
        },
        context: {"a": targetLinksCollector, "i": i},
        onload: function(response) {
            //alert(response.responseText);

            var parser = new DOMParser();
            var doc = parser.parseFromString(response.responseText, "text/html");
            if(doc.title == "404 Not Found") { //abort if site doesnt exist
                return;
            }
            var link = doc.getElementsByTagName('span')[0].innerHTML;
            response.context.a[response.context.i].setAttribute('title', "Liblink bypass.");
            response.context.a[response.context.i].setAttribute('href', link);
            response.context.a[response.context.i].innerHTML = link;
        }
        });

    }

})();
