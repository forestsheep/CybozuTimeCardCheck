String.format = function(src){
    if (arguments.length == 0) return null
    var args = Array.prototype.slice.call(arguments, 1)
    return src.replace(/\{(\d+)\}/g, function(m, i){
        return args[i]
    })
}

function slashgslash(delcookie) {
    $.ajax({
        url: "https://cybozush.cybozu.cn/g/",
        method: "get",
        async: true,
        success: function (data, textStatus, jqXHR ) {
            if (delcookie) {
                chrome.cookies.remove(
                    {
                        url : "https://cybozush.cybozu.cn/g/",
                        name : "JSESSIONID"
                    },
                    function(details){
                        console.log("remove cookie")
                    }
                )
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.log('error: ' +jqXHR.getAllResponseHeaders() + textStatus + errorThrown)
            console.log(jqXHR.responseText)
        }
    })
}

var loginin = function(token, loginname, pw, delcookie){
    var jsonFormatString = "{\"username\":\"{0}\",\"password\":\"{1}\"}"
    var sendInfo = String.format(jsonFormatString, loginname, pw)
    console.log(loginname + " start login")
    $.ajax({
        url: "https://cybozush.cybozu.cn/api/auth/login.json",
        method: "post",
        data: sendInfo,
        async: true,
        dataType:'json',
        contentType:"application/json",
        headers: {
            "Content-Type" : "application/json",
            "X-Cybozu-RequestToken" : token
        },
        beforeSend: function (request) {
        },
        success: function (data, textStatus, jqXHR ) {
            console.log("login result: " + loginname)
            console.log(data)
            if (data.success) {
                console.log("login success")
            } else {
                console.log("login fail")
            }
            // console.log(data)
            slashgslash(delcookie)
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.log('error: ' +jqXHR.getAllResponseHeaders() + textStatus + errorThrown)
            console.log(jqXHR.responseText)
        }
    })
}

function getken(loginname, pw, delcookie) {
    console.log("start get token: " + loginname)
    $.ajax({
        url: "https://cybozush.cybozu.cn/api/auth/getToken.json",
        method: "post",
        data: '',
        async: true,
        dataType:'json',
        contentType:"application/json charset=utf-8",
        beforeSend: function () {
        },
        xhrFields: {
            withCredentials: true
        },
        success: function (data, textStatus, jqXHR ) {
            console.log("get token success")
            var token = JSON.parse(jqXHR.responseText).result.token
            loginin(token, loginname, pw, delcookie)
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.log("get token fail")
        }
    })
}

function getallusers(){
    $.ajax({
        url: "http://xubing.win/api/getallusers",
        method: "get",
        async: true,
        dataType:'json',
        contentType:"application/json charset=utf-8",
        beforeSend: function () {
        },
        success: function (data, textStatus, jqXHR ) {
            localStorage.grnusers = JSON.stringify(data)
            var ps = JSON.parse(localStorage.grnusers)
            console.log("get users successful.")
            for (var ii in ps.users){
                console.log(ps.users[ii])
            }
        }
    })
}

function createBeatCardAlarms(minutesToday)
{
    // 9:08
    var timeStart900mins = 532
    var timeLimit900mins = 548
    // var timeStart900mins = 17 * 60 + 13
    // var timeLimit900mins = 17 * 60 + 35

    // 9:38
    var timeStart930mins = 532
    var timeLimit930mins = 578
    // var timeStart930mins = 17 * 60 + 40
    // var timeLimit930mins = 17 * 60 + 43

    if (minutesToday < timeLimit900mins) {
        // create 2 alarms every day from today
        // 帮今天9点的设定闹钟，时间为1分钟后
        chrome.alarms.create("beat900", {delayInMinutes: 1, periodInMinutes: 1440})
        // 帮今天9点的设定闹钟，时间为30分钟后
        chrome.alarms.create("beat930", {delayInMinutes: 1 + timeLimit930mins - timeLimit900mins, periodInMinutes: 1440})
    }
    else if (timeLimit900mins <= minutesToday && minutesToday < timeLimit930mins) {
        // create 1 alarm every day from today
        // create 1 alarm every day from tomorrow
        deltaMinutes = timeLimit930mins - minutesToday
        
        // 帮明天早上9点的设定闹钟，时间为8点52
        chrome.alarms.create("beat900", {delayInMinutes: 1440 - minutesToday + timeStart900mins, periodInMinutes: 1440})
        // 帮今天9点半的设定闹钟，时间为1分钟后
        chrome.alarms.create("beat930", {delayInMinutes: 1, periodInMinutes: 1440})
    }
    else {
        // create 2 alarms every day from tomorrow
        // 帮明天早上9点的设定闹钟，时间为8点52
        chrome.alarms.create("beat900", {delayInMinutes: 1440 - minutesToday + timeStart900mins, periodInMinutes: 1440})

        // 帮明天早上9点半的设定闹钟，时间为9点22
        chrome.alarms.create("beat900", {delayInMinutes: 1440 - minutesToday + timeStart930mins, periodInMinutes: 1440})
    }

    chrome.alarms.onAlarm.addListener(function(alarm) {
        if (alarm.name == "beat900") {
            getallusers()
            // 每人有多少leftmin时间余量可供随机
            setTimeout(() => {
                var myDate = new Date()
                var h = myDate.getHours()
                var t = myDate.getMinutes()
                leftmin = timeLimit900mins + 2 - (h * 60 + t)
                addtime = 0
                var ps = JSON.parse(localStorage.grnusers)
                countd = ps.users.length
                if (leftmin >= 9) {
                    console.log("9点随机策略")
                    for (var ii in ps.users){
                        at = getrandom(leftmin / countd)
                        console.log("间隔时间为：" + at)
                        setTimeout(loopbeat, at)
                    }
                    setTimeout(selfbeat, 5000 + addtime)
                    addtime = 0
                } else {
                    console.log("dayu 900")
                    for (var ii in ps.users){
                        setTimeout(loopbeat, 3000 * ii)
                    }
                    setTimeout(selfbeat, 3000 * ii)
                }
            }, 5000)
        }
        if (alarm.name == "beat930") {
            getallusers()
            // 每人有多少leftmin时间余量可供随机
            setTimeout(() => {
                var myDate = new Date()
                var h = myDate.getHours()
                var t = myDate.getMinutes()
                leftmin = timeLimit930mins + 2 - (h * 60 + t)
                addtime = 0
                var ps = JSON.parse(localStorage.grnusers)
                countd = ps.users.length
                if (leftmin >= 9) {
                    console.log("9点半随机策略")
                    for (var ii in ps.users){
                        at = getrandom(leftmin / countd)
                        setTimeout(loopbeat, at)
                    }
                    setTimeout(selfbeat, 5000 + addtime)
                    addtime = 0
                } else {
                    console.log("dayu 930")
                    for (var ii in ps.users){
                        setTimeout(loopbeat, 3000 * ii)
                    }
                    setTimeout(selfbeat, 3000 * ii)
                }
            }, 5000)
        }
    })
}

function execRightnow900() {
    console.log("start exec 900")
    getallusers()
    setTimeout(() => {
        var ps = JSON.parse(localStorage.grnusers)
        countd = ps.users.length
        for (var ii in ps.users){
            setTimeout(loopbeat, 3000 * (parseInt(ii) + 1))
        }
        setTimeout(selfbeat, 3000 * (countd + 1))
    }, 2000)
}

function execRightnow930() {
    console.log("start exec 930")
    getallusers()
    setTimeout(() => {
        var ps = JSON.parse(localStorage.grnusers)
        countd = ps.users.length
        for (var ii in ps.users){
            setTimeout(loopbeat, 3000 * (parseInt(ii) + 1))
        }
        setTimeout(selfbeat, 3000 * (countd + 1))
    }, 2000)
}

function loopbeat()
{
    if (countd > 0){
        console.log(Date())
        var ps = JSON.parse(localStorage.grnusers)
        var c = ps.users.length - countd
        // console.log("start save old cookie")
        // saveoldcookie()
        console.log("start beat")
        getken(ps.users[c].loginname, ps.users[c].pw, true)
        countd--
    }
}

function selfbeat()
{
    console.log("start self beat")
    var myinfo = JSON.parse(localStorage.realself)
    getken(myinfo.loginname, myinfo.password, false)
}

// 时间累加
var addtime = 0
function getrandom(x) {
    d = Math.round(Math.random() * 1000 * 60 * x)
    addtime += d
    return addtime
}

// 启动即取一次users信息
setTimeout(() => {
    getallusers()
}, 10000);

// 设定users计数器为0
var countd = 0

// 取得现在时间，传给创建闹钟方法
var myDate = new Date()
var h = myDate.getHours()
var t = myDate.getMinutes()
var nowmin = h * 60 + t
createBeatCardAlarms(nowmin)

// 立即执行
// 间于9:08至9:38的，立刻执行900
if (548 < nowmin && nowmin < 578) {
    execRightnow900()
}
// 间于9:38至10:08的，立刻执行930
if (578 < nowmin && nowmin < 608) {
    execRightnow930()
}