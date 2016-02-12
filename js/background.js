function getDomainFromUrl(url) {
    var host = "null";
    if (typeof url == "undefined" || null == url)
        url = window.location.href;
    var regex = /.*\:\/\/([^\/]*).*/;
    var match = url.match(regex);
    if (typeof match != "undefined" && null != match)
        host = match[1];
    return host;
}

function checkForValidUrl(tabId, changeInfo, tab) {
    // if(getDomainFromUrl(tab.url).toLowerCase() == "extensions") {
    //     chrome.pageAction.show(tabId);
    // }
    // console.log((getDomainFromUrl(tab.url)));
    chrome.pageAction.show(tabId);
};

function noti() {
    if (chrome.notifications) {
        console.log("chrome notificatin is ready");
        var opt = {
            type: "basic",
            iconUrl: 'img/icon.png',
            title: "Hello",
            message: "您今天是" + localStorage.lastBeatTime + "打卡的",
            buttons: [{
                title: '查看考勤卡',
                iconUrl: 'img/icon.png'
            }, {
                title: '我知道了',
                iconUrl: 'img/icon.png'
            }]
        };
        chrome.notifications.create("", opt);
    }
}

function getsth() {
    $.get("https://cybozush.s.cybozu.cn/g/timecard/index.csp?", function(data) {
        data = data.replace(/\n/g, "");

        var patten = new RegExp("<title>登录</title>", "g");
        var result;
        if ((result = patten.exec(data)) != null) {
            return;
        }
        var patt = new RegExp("(\\d\\d:\\d\\d) *<div id=\"timecard_ip\" name=\"timecard_ip\" class=\"timecardIp-grn\" style=\"display:none;\">IP: \\d{1,3}\.\\d{1,3}\.\\d{1,3}\.\\d{1,3}</div> *</td> *<td nowrap class=\"s_today tAlignCenter-grn\"> *<input type=\"submit\" name=\"finish\"", "g");

        if ((result = patt.exec(data)) != null) {
            if (result.length == 2) {
                localStorage.lastBeatTime = result[1];
                noti();
            }
        }
    });
    // $.get("http://d3bookofcain.sinaapp.com/", function(data){
    //     console.log(data);
    //     $(data).find("title");
    // });
}

function getDate() {
    var myDate = new Date();
    return myDate.getFullYear() + myDate.getMonth().toString() + myDate.getDate().toString();
}


// test area ↓↓↓
// $.post("https://d3boctest.sinaapp.com/api", "{\"api\": \"getBeatCardUsersTest\", \"date\": \"2016-2-5\"}", function(data) {
//         console.log(data);
//         var obj = JSON.parse(data);
//         for (now in obj.users)
//         {
            // console.log(obj.users[now]);
            // console.log(obj.users[now].loginName);
            // console.log(obj.users[now].loginPassWord);
//         }
// });

// $.get("https://cybozush.s.cybozu.cn/g/?WSDL", function(data) {
//         console.log(data);
// });
$.get("/js/utillogin.xml", function(data) {
    data = data.replace(/u{6}/, "bxu");
    data = data.replace(/\*{6}/, "912912f912");
    $.post("https://cybozush.s.cybozu.cn/g/util_api/util/api.csp?", data, function(subdata, status) {
        if (status == "success") {
            console.log("ok!!");
            var doc = $(subdata);
            console.log(doc.find("cookie").text());
        }
        else {
            console.log(status);
        }
    });
});

// test area ↑↑↑

// accessStatus
// 0:不能访问网站，应该是用户还没登录，所以没有session。
// 1:可以访问网站，且已经访问成功，且用户点过按钮。

chrome.notifications.onButtonClicked.addListener(function(id, buttonIndex) {
    switch (buttonIndex) {
        case 0:
            chrome.tabs.create({
                url: "https://cybozush.s.cybozu.cn/g/timecard/index.csp?"
            });
            break;
        case 1:
            break;
    }
    localStorage.accessStatus = 1;
    chrome.notifications.clear(id);
});

chrome.tabs.onUpdated.addListener(checkForValidUrl);
chrome.tabs.onCreated.addListener(checkForValidUrl);
localStorage.accessStatus = 0;
localStorage.date = getDate();
setInterval(function() {
    if (localStorage.date == getDate() && localStorage.accessStatus == 1) {
        console.log("same date and accessed, so do nothing.");
        return;
    } else if (localStorage.date != getDate()) {
        console.log("date changed, should notify user.");
        //reset params
        localStorage.date = getDate();
        localStorage.accessStatus = 0;
    } else if (localStorage.date == getDate() && localStorage.accessStatus == 0) {
        console.log("attempt failed last time or unread, so try again.");
        var myDate = new Date();
        var h = myDate.getHours();
        var t = myDate.getMinutes();
        if (h > 8) {
            // getsth();
        }
    }

    //分布式打卡 ↓↓↓↓↓

}, 7000);