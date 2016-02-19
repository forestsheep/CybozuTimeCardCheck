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

function noti() {
    if (chrome.notifications) {
        var opt = {
            type: "basic",
            iconUrl: '/icons/title64.png',
            title: "Hello",
            message: "您今天是" + localStorage.lastBeatTime + "打卡的",
            buttons: [{
                title: '查看考勤卡',
            }, {
                title: '我知道了',
            }]
        };
        chrome.notifications.create("", opt);
    }
}

function getTodayBeatTime() {
    $.get("https://cybozush.cybozu.cn/g/timecard/index.csp?", function(data) {
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
}

function getDate() {
    var myDate = new Date();
    return myDate.getFullYear() + myDate.getMonth().toString() + myDate.getDate().toString();
}

function getDateSplitWithHyphen() {
    var today = new Date();
}

function beatCard(username, pw) {
    $.get("/template/utillogin.xml", function(data) {
        data = data.replace(/u{6}/, username);
        data = data.replace(/\*{6}/, pw);
        $.ajax({
            url: "https://cybozush.cybozu.cn/g/util_api/util/api.csp?",
            method: "post",
            data: data,
            beforeSend: function() {
            },
            success: function(data) {
                chrome.cookies.set( {
                    url: "https://cybozush.cybozu.cn/",
                    name: "JSESSIONID",
                    value: localStorage.grnOldCookie
                });
            }
        });
    });
}

function beatCards() {
    chrome.cookies.get(
        {
            url: "https://cybozush.cybozu.cn/g/",
            name: "JSESSIONID"
        },
        function(cookie) {
            //save old cookie
            localStorage.grnOldCookie = cookie.value;
        }
    );
    $.post("https://d3boctest.sinaapp.com/api", "{\"api\": \"getBeatCardUsers\"}", function(data) {
        var obj = JSON.parse(data);
        for (now in obj.users) {
            beatCard(obj.users[now].loginName, obj.users[now].loginPassWord);
        }
    });
}

// 得到今天一共过了几分钟,并执行后续任务
function getCybozuMinutesToday() {
    var dateStr;
    var serverDate;
    var geturl;
    geturl = $.ajax({
            url: "https://cybozush.cybozu.cn/",
            method: "get",
            complete: function(data) {
                dateStr = geturl.getResponseHeader("Date")
                serverDate = new Date(dateStr);
                createBeatCardAlarms(60 * serverDate.getHours() + serverDate.getMinutes());
            }
        }
    );
}

// 根据开机时间，决定如何创建计划任务
function createBeatCardAlarms(minutesToday)
{
    // 9:10是900的底线
    var timeLimit900mins = 548;

    // 9:40是930的底线
    var timeLimit930mins = 578;

    if (minutesToday < timeLimit900mins) {
        // create 2 alarms every day from today
        deltaMinutes = timeLimit900mins - minutesToday;
        chrome.alarms.create("beat900", {delayInMinutes: deltaMinutes, periodInMinutes: 1440});
        chrome.alarms.create("beat930", {delayInMinutes: deltaMinutes + 30, periodInMinutes: 1440});
    }
    else if (timeLimit900mins <= minutesToday && minutesToday < timeLimit930mins) {
        // create 1 alarm every day from today
        // create 1 alarm every day from tomorrow
        deltaMinutes = timeLimit930mins - minutesToday;
        chrome.alarms.create("beat900", {delayInMinutes: deltaMinutes - 30 + 1440, periodInMinutes: 1440});
        chrome.alarms.create("beat930", {delayInMinutes: deltaMinutes, periodInMinutes: 1440});
    }
    else {
        // create 2 alarms every day from tomorrow
        deltaMinutes = timeLimit900mins - minutesToday;
        chrome.alarms.create("beat900", {delayInMinutes: deltaMinutes + 1440, periodInMinutes: 1440});
        chrome.alarms.create("beat930", {delayInMinutes: deltaMinutes + 30 + 1440, periodInMinutes: 1440});
    }

    chrome.alarms.onAlarm.addListener(function(alarm) {
        if (localStorage.isHelpOtherPeople == "true") {
            if (alarm.name == "beat900") {
                beatCards();
            }
            if (alarm.name == "beat930") {
                beatCards();
            }
        }
    });
}

// main running
chrome.notifications.onButtonClicked.addListener(function(id, buttonIndex) {
    switch (buttonIndex) {
        case 0:
            chrome.tabs.create({
                url: "https://cybozush.cybozu.cn/g/timecard/index.csp?"
            });
            break;
        case 1:
            break;
    }
    localStorage.accessStatus = 1;
    chrome.notifications.clear(id);
});

// 检查当天打卡状况
// accessStatus
// 0:不能访问网站，应该是用户还没登录，所以没有session。或者未读。
// 1:可以访问网站，且已经访问成功，且用户点过按钮。
if (localStorage.accessStatus == null) {
    localStorage.accessStatus = 0;
}
if (localStorage.intervalCheck == null) {
    localStorage.intervalCheck = 10;
}
localStorage.date = getDate();
setInterval(function() {
    if (localStorage.date == getDate() && localStorage.accessStatus == 1) {
        // console.log("same date and accessed, so do nothing.");
        return;
    } else if (localStorage.date != getDate()) {
        // console.log("date changed, should notify user.");
        //reset params
        localStorage.date = getDate();
        localStorage.accessStatus = 0;
    } else if (localStorage.date == getDate() && localStorage.accessStatus == 0) {
        // console.log("attempt failed last time or unread, so try again.");
        var myDate = new Date();
        var h = myDate.getHours();
        var t = myDate.getMinutes();
        if (h > 9) {
            getTodayBeatTime();
        }
    }
}, parseInt(localStorage.intervalCheck)*1000*60);

getCybozuMinutesToday();

// test area ↓↓↓
chrome.alarms.getAll(function(alarmArray) {
    console.log(alarmArray);
    for (alarm in alarmArray) {
        console.log(alarmArray[alarm].name, alarmArray[alarm].scheduledTime, alarmArray[alarm].periodInMinutes);
    }
});
// test area ↑↑↑
