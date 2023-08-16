var macAddress = "";
var geoLocation = "";

function loginFunc() {
    var user = document.getElementById("id_user").value;
    console.log("Inside loginFunction.....120[" + user);
    //document.cookie = "userName="+user+"; path=/";
    var loginId = document.getElementById("id_login");
    loginId.click();
}

function displayMsg() {
    var query = window.location.search.substring(1);
    var parms = query.split('&');

    for (var i = 0; i < parms.length; i++) {
        var pos = parms[i].indexOf('=');

        if (pos > 0 && "ERR_MSG" == parms[i].substring(0, pos)) {
            if (document.getElementById("message") != null) {
                document.getElementById("message").style = "padding-top: 22px";
                document.getElementById("message").innerHTML = "Session has expired or not logged in, please login to proceed";
            }
        }
    }
    document.getElementById('id_user').focus();
}

function getMACAddress() {
    console.log("In getMACAddress");
    var nav = window.navigator;
    var screen = window.screen;
    var guid = nav.mimeTypes.length;
    var userAgent = nav.userAgent;
    console.log("In getMACAddress userAgent:[" + nav.userAgent + "]");
    var str1 = userAgent.substring(0, userAgent.indexOf('Chrome'));
    var str2 = userAgent.substring(userAgent.indexOf('Chrome'));
    str2 = str2.substring(str2.indexOf(' ') + 1);
    var str3 = str1 + str2;
    guid += str3.replace(/\D+/g, '');
    guid += nav.plugins.length;
    guid += screen.height || '';
    guid += screen.width || '';
    guid += screen.pixelDepth || '';
    console.log("In getMACAddress uuid:[" + guid + "]");
    macAddress = guid;
    var input = document.getElementById("MAC_ADDRESS");
    if (input != null) {
        input.value = macAddress;
    }
}

function createIndexedDBTable() {
    console.log("In createIndexedDBTable mac address:[" + macAddress + "]");
    var userID = document.getElementById("id_user");
    var userIDVal = checkNull(userID.value);
    console.log("In createIndexedDBTable userId:[" + userIDVal + "]");
    try {
        // This works on all devices/browsers, and uses IndexedDBShim as a final fallback 
        var indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB || window.shimIndexedDB;

        // Open (or create) the database
        var open = indexedDB.open("UUIDDatabase", 1);

        open.onerror = function (event) {
            console.log("Failed to open database in createIndexedDBTable");
        }

        // Create the schema
        open.onupgradeneeded = function () {
            console.log("In onupgradeneeded");
            var db = open.result;
            var store = db.createObjectStore("StoreUUID", {
                keyPath: "id"
            });
        };

        open.onsuccess = function () {
            // Start a new transaction
            var db = open.result;
            var tx = db.transaction("StoreUUID", "readwrite");
            var store = tx.objectStore("StoreUUID");

            // Query the data
            var getUUID = store.get(userIDVal);

            getUUID.onsuccess = function () {

                console.log("cache uuid for user " + userIDVal + " result:[" + getUUID.result + "]");
                var fromCache = document.getElementById("FROM_CACHE");
                if (getUUID.result != null) {
                    console.log("result is not null");
                    var uuid = checkNull(getUUID.result.uuid);
                    console.log("cache uuid for user " + userIDVal + ":[" + uuid + "]");
                    console.log("cache uuid for user " + userIDVal + " length:[" + uuid.length + "]");
                    if (uuid.length == 0) {
                        if (fromCache != null) {
                            fromCache.value = "false";
                            console.log("after set false cache value:[" + fromCache.value + "]");
                        }
                        //store.put({id: userIDVal, uuid: macAddress});
                    } else {
                        if (fromCache != null) {
                            fromCache.value = "true";
                            console.log("after set true cache value:[" + fromCache.value + "]");
                        }
                    }
                } else {
                    console.log("result is null");
                    //store.put({id: userIDVal, uuid: macAddress});
                    if (fromCache != null) {
                        fromCache.value = "false";
                        console.log("after set false cache value:[" + fromCache.value + "]");
                    }
                }
            };
            getUUID.onerror = function () {
                console.log("Failed to getting uuid");
            };

            // Close the db when the transaction is done
            tx.oncomplete = function () {
                db.close();
            };
        }

        open.onblocked = function (event) {
            console.log("Your database version can't be upgraded because the app is open in createIndexedDBTable:[" + event + "]");
        }
    } catch (e) {
        console.log("Unable to open IndexedDB Exception in createIndexedDBTable:[" + e + "]");
    }
}

function checkNull(val) {
    var value = val + "";
    if (value == null || value == undefined || value === "undefined") {
        value = "";
    }
    return value.trim();
}

function getGeoLocation() {
    console.log("in getGeoLocation");
    if (navigator.geolocation) {
        console.log("in if");
        navigator.geolocation.getCurrentPosition(function (position) {
            console.log("in if :::");
            var pos = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
            console.log("geoLocation:[" + pos + "]");
            pos = checkNull(pos);
            if (pos.length > 0) {
                pos = pos.replace(")", "");
                pos = pos.replace("(", "");
            }
            console.log("geoLocation after remove bracket:[" + pos + "]");
            geoLocation = pos;
            var currentGeoPos = document.getElementById('CURRENT_GEO_POS');
            if (currentGeoPos != null) {
                currentGeoPos.value = geoLocation;
            }
        });
    } else {
        console.log("Geolocation not detected");
        alert('Geolocation not detected');
    }
}

function initLineGraph() {

    var paper = new Raphael(document.getElementById('line-graph'), $('#line-graph').width(), $('#line-graph')
        .height());
    graphData.paper = paper;


    var path = createPathString(graphData);

    var line = paper.path(path);


    line.attr(lineOptions);

    graphData.line = line;

    drawPoints(graphData, pointOptions);

    setInterval(function () {
        advanceGraph();
    }, 2500);

}
function advanceGraph() {
    if (graphData.current < graphData.charts.length - 1) {
        graphData.current++;
    } else {
        graphData.current = 1;
    }
    /* animate to new data positions */
    animatePoints(graphData, graphData.charts[graphData.current]);
}
/* draw initial points */
function drawPoints(data, options) {
    /* point radius */
    var radius = options.radius;
    /* set points to initial data set */
    var points = data.charts[0].points;
    /* iterate through points */
    for (var i = 0, length = points.length; i < length; i++) {
        var xPos = data.xOffset + (i * data.xDelta);
        var yPos = data.yOffset;
        /* draw */
        var circle = data.paper.circle(xPos, yPos, radius);
        circle.attr(pointOptions);
        /* store raphael.js point object in global data set */
        points[i].point = circle;
    }
}

function animatePoints(data, newData) {
    var newPath = '';
    var upperLimit = parseInt(newData.upper);
    if (isNaN(upperLimit)) {
        upperLimit = 1;
    }
    var lowerLimit = parseInt(newData.lower);
    if (isNaN(lowerLimit)) {
        lowerLimit = 0;
    }
    var scaleFactor = data.yOffset / (upperLimit - lowerLimit);
    var points = data.charts[0].points;

    for (var i = 0, length = points.length; i < length; i++) {
        if (i == 0) {

            newPath += 'M 0 291 L ';
            newX = data.xOffset + ' ';
            newPath += newX;
            newY = data.yOffset - ((newData.points[i].value - lowerLimit) * scaleFactor) + ' ';
            newPath += newY;
        } else {
            newPath += ' L ';
            newX = data.xOffset + (i * data.xDelta) + ' ';
            newPath += newX;
            newY = data.yOffset - ((newData.points[i].value - lowerLimit) * scaleFactor);
            newPath += newY;
        }

        /* animate raphael.js points to new positions */
        points[i].point.animate({
            cy: data.yOffset - ((newData.points[i].value - lowerLimit) * scaleFactor)
        },
            800,
            'ease-in-out'
        );
    }

    newPath += ' L w 291 Z';
    data.line.animate({
        path: newPath
    }, 800, 'ease-in-out');
}



function createPathString(data) {

    var points = data.charts[data.current].points;
    var path = 'M 0 291 L ' + data.xOffset + ' ' + (data.yOffset - points[0].value);
    var prevY = data.yOffset - points[0].value;
    for (var i = 1, length = points.length; i < length; i++) {
        path += ' L ';
        path += data.xOffset + (i * data.xDelta) + ' ';
        path += (data.yOffset - points[i].value);

        prevY = data.yOffset - points[i].value;
    }
    path += ' L w 291 Z';
    return path;
}

/**** Global Data Object *****/


//========Url Chage Code========//
function test() {
    var loginurl = window.location.href;
    const iframelement = document.createElement('iframe');
    iframelement.setAttribute("class", "main-frame");
    iframelement.setAttribute("frameborder", "0");
    console.log("url:", window.location.href);
    if (loginurl.indexOf("Test") > -1) {
        console.log("in if condition of vision");
        iframelement.setAttribute("src", "vision.html");
        iframelement.setAttribute("id", "vision-frame");
        document.getElementById("bg-img").className = "vision";
        document.getElementById("login-icon").className = "vision-user";
        document.getElementById("login-icon-p").className = "vision-user";
        document.getElementById("top-logo").className = "vision-logo";
        document.getElementById("container-login").className = "vision-sidepannel";
        if (document.getElementById("vision-frame") != null) {
            document.getElementById("vision-frame").style.display = "block";
        }

    }
    else if (loginurl.indexOf("insight") > -1) {
        console.log("in if condition of insight");

        iframelement.setAttribute("src", "insight.html");
        iframelement.setAttribute("id", "insight-frame");
        document.getElementById("login-icon").className = "insight-user";
        document.getElementById("login-icon-p").className = "insight-user";
        document.getElementById("forgot-ps").className = "insight-fps";
        document.getElementById("log-button").className = "insight-lg-btn ";
        document.getElementById("top-logo").className = "insight-logo";
        document.getElementById("input-bg").className = "input-bg";
        document.getElementById("input-bg-ps").className = "input-bg";
        document.getElementById("container-login").className = "insight-sidepannel";

        if (document.getElementById("insight-frame") != null) {
            document.getElementById("insight-frame").style.display = "block";
        }
    }

    else if (loginurl.indexOf("visionbooks") > -1) {
        console.log("in if condition of visionbooks");
        iframelement.setAttribute("src", "visionbooks.html");
        iframelement.setAttribute("id", "visionbooks-frame");
        document.getElementById("bg-img").className = "vision-books";
        document.getElementById("login-icon").className = "visionbooks-user";
        document.getElementById("login-icon-p").className = "visionbooks-user";
        document.getElementById("forgot-ps").className = "vbooks-fps";
        document.getElementById("log-button").className = "vbooks-lg-btn ";
        document.getElementById("top-logo").className = "vision-books-logo";
        document.getElementById("input-bg").className = "input-bg";
        document.getElementById("input-bg-ps").className = "input-bg";
        document.getElementById("container-login").className = "insight-sidepannel";

        if (document.getElementById("visionbooks-frame") != null) {
            document.getElementById("visionbooks-frame").style.display = "block";
        }
    }


    else if (loginurl.indexOf("presto") > -1) {
        console.log("in if condition of presto");
        iframelement.setAttribute("src", "presto.html");
        iframelement.setAttribute("id", "presto-frame");
        document.getElementById("bg-img").className = "presto";
        document.getElementById("login-icon").className = "presto-user";
        document.getElementById("login-icon-p").className = "presto-user";
        document.getElementById("forgot-ps").className = "presto-fps";
        document.getElementById("log-button").className = "presto-lg-btn ";
        document.getElementById("top-logo").className = "presto-logo";
        document.getElementById("input-bg").className = "input-bg";
        document.getElementById("input-bg-ps").className = "input-bg";
        document.getElementById("container-login").className = "insight-sidepannel";
        if (document.getElementById("presto-frame") != null) {
            document.getElementById("presto-frame").style.display = "block";
        }
    }

    else if (loginurl.indexOf("live-documents") > -1) {
        console.log("in if condition of live-documents");
        iframelement.setAttribute("src", "liveDocuments.html");
        iframelement.setAttribute("id", "live-documents-frame");
        document.getElementById("bg-img").className = "live-documents";
        document.getElementById("login-icon").className = "live-documents-user";
        document.getElementById("login-icon-p").className = "live-documents-user";
        document.getElementById("forgot-ps").className = "live-documents-fps";
        document.getElementById("log-button").className = "live-documents-lg-btn ";
        document.getElementById("top-logo").className = "live-documents-logo";
        document.getElementById("input-bg").className = "input-bg";
        document.getElementById("input-bg-ps").className = "input-bg";
        document.getElementById("container-login").className = "live-documents-sidepannel";
        if (document.getElementById("live-documents-frame") != null) {
            document.getElementById("live-documents-frame").style.display = "block";
        }
    }

    else if (loginurl.indexOf("proteus.") > -1) {
        console.log("in if condition of proteus");
        document.getElementById("bg-img").className = "vision-Ai";
        iframelement.setAttribute("src", "vision02.html");
        iframelement.setAttribute("id", "vision-frame");
        document.getElementById("login-icon").className = "visionAI-user";
        document.getElementById("login-icon-p").className = "visionAi-user";
        document.getElementById("top-logo").className = "visionAI-logo";
        document.getElementById("container-login").className = "visionAI-sidepannel";
        document.getElementById("log-button").className = "login_button-AI";
        document.getElementById("tab").style.display = "flex";

        if (document.getElementById("visionAI-frame") != null) {
            document.getElementById("visionAI-frame").style.display = "block";
            

        }
    }
    
    else {
        console.log("By default");
        document.getElementById("bg-img").className = "vision-Ai";
        iframelement.setAttribute("src", "visionAI.html");
        iframelement.setAttribute("id", "vision-frame");
        document.getElementById("login-icon").className = "visionAI-user";
        document.getElementById("login-icon-p").className = "visionAi-user";
        document.getElementById("top-logo").className = "visionAI-logo";
        document.getElementById("container-login").className = "visionAI-sidepannel";
        document.getElementById("log-button").className = "login_button-AI";
        

        if (document.getElementById("visionAI-frame") != null) {
            document.getElementById("visionAI-frame").style.display = "block";
            

        }
    }
    var ele = document.getElementById('my-iframe-div');
    ele.appendChild(iframelement);
}


/**** Tab Button *****/
function showTab(tabIndex) {
    const tabButtons = document.querySelectorAll('.tab-button');
   
    tabButtons.forEach((button, index) => {
        if (index === tabIndex) {
            button.classList.add('active');
        } else {
            button.classList.remove('active');
        }
    });

   
}
