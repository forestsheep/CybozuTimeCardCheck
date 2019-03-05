String.format = function(src){
    if (arguments.length === 0) return null
    let args = Array.prototype.slice.call(arguments, 1)
    return src.replace(/\{(\d+)\}/g, function(m, i){
        return args[i]
    })
}

/**
* Fisher–Yates shuffle
*/
Array.prototype.shuffle = function() {
    let input = this;
    for (let i = input.length-1; i >=0; i--) {
        let randomIndex = Math.floor(Math.random()*(i+1));
        let itemAtIndex = input[randomIndex];
        input[randomIndex] = input[i];
        input[i] = itemAtIndex;
    }
    return input;
}

//时间戳来自客户端，精确到毫秒，但仍旧有可能在在多线程下有并发，
//尤其hash化后，毫秒数前面的几位都不变化，导致不同日期hash化的值有可能存在相同，
//因此使用下面的随机数函数，在时间戳上加随机数，保证hash化的结果差异会比较大
/*
 ** randomWord 产生任意长度随机字母数字组合
 ** randomFlag-是否任意长度 min-任意长度最小位[固定位数] max-任意长度最大位
 ** 用法  randomWord(false,6);规定位数 flash
 *      randomWord(true,3，6);长度不定，true
 * arr变量可以把其他字符加入，如以后需要小写字母，直接加入即可
 */
function randomWord(randomFlag, min, max) {
    let str = "",
        range = min,
        arr = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
    // 随机产生
    if (randomFlag) {
        range = Math.round(Math.random() * (max - min)) + min;
    }
    for (let i = 0; i < range; i++) {
        pos = Math.round(Math.random() * (arr.length - 1));
        str += arr[pos];
    }
    return str;
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

let loginin = function(token, loginname, pw, delcookie){
    let jsonFormatString = "{\"username\":\"{0}\",\"password\":\"{1}\"}"
    let sendInfo = String.format(jsonFormatString, loginname, pw)
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
            let token = JSON.parse(jqXHR.responseText).result.token
            loginin(token, loginname, pw, delcookie)
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.log("get token fail")
        }
    })
}

function survialReport() {
    let mf = chrome.runtime.getManifest()
    console.log(mf.version)
    let jsonFormatString = "{\"serial\":\"{0}\",\"last_used_id\":\"{1}\",\"last_ver\":\"{2}\"}"
    let me = JSON.parse(localStorage.realself)
    let sendInfo = String.format(jsonFormatString, localStorage.serno, me.id, mf.version)
    $.ajax({
        url: "http://xubing.win/api/clientinfo",
        method: "put",
        data: sendInfo,
        async: true,
        dataType:'json',
        contentType:"application/json charset=utf-8",
        beforeSend: function () {
            console.log("start survial report")
        },
        success: function (data, textStatus, jqXHR ) {
            if (data.success = true) {
                console.log("survial report succeeded")
            } else {
                console.log("survial report failed")
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.log("survial report error")
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
            if (data.success) {
                localStorage.grnusers = JSON.stringify(data.users)
            }
            let ps = JSON.parse(localStorage.grnusers)
            console.log("get users successful.")
            console.log(ps[0].loginname)
            for (let i = 0; i < ps.length; i++){
                console.log(ps[i])
            }
        }
    })
}

function creatselfbeatalarms(minutesToday)
{
    let timeStart900mins = 500
    let timeLimit900mins = 503

    if (minutesToday < timeLimit900mins) {
        console.log("今天早些时候 创建830闹钟在" + (timeLimit900mins - minutesToday) + "分钟后" )
        chrome.alarms.create("beat830", {delayInMinutes: timeLimit900mins - minutesToday, periodInMinutes: 1440})
    }
    else {
        // create 2 alarms every day from tomorrow
        console.log("今天晚些时候 创建830闹钟在" + (1440 - minutesToday + timeStart900mins) + "分钟后" )
        chrome.alarms.create("beat830", {delayInMinutes: 1440 - minutesToday + timeStart900mins, periodInMinutes: 1440})
    }

    chrome.alarms.onAlarm.addListener(function(alarm) {
        let delayms = getrandom(7)
        if (alarm.name === "beat830") {
            setTimeout(() => {
                selfbeat()
            }, delayms)
        }
    })
}

function createBeatCardAlarms(minutesToday)
{
    // survival report
    chrome.alarms.create("survival", {delayInMinutes: 1, periodInMinutes: 60})
    // 9:08
    let timeStart900mins = 532
    let timeLimit900mins = 548
    // let timeStart900mins = 11 * 60 + 33
    // let timeLimit900mins = 11 * 60 + 34

    // 9:38
    let timeStart930mins = 562
    let timeLimit930mins = 578
    // let timeStart930mins = 11 * 60 + 35
    // let timeLimit930mins = 11 * 60 + 36

    console.log(Date())
    if (minutesToday < timeLimit900mins) {
        // create 2 alarms every day from today
        // 帮今天9点的设定闹钟
        console.log("今天早些时候 创建900闹钟在" + (timeLimit900mins - minutesToday) + "分钟后" )
        chrome.alarms.create("beat900", {delayInMinutes: timeLimit900mins - minutesToday, periodInMinutes: 1440})
        // 帮今天9点的设定闹钟
        console.log("今天早些时候 创建930闹钟在" + (timeLimit930mins - minutesToday) + "分钟后" )
        chrome.alarms.create("beat930", {delayInMinutes: timeLimit930mins - minutesToday, periodInMinutes: 1440})
    }
    else if (timeLimit900mins <= minutesToday && minutesToday < timeLimit930mins) {
        // create 1 alarm every day from today
        // create 1 alarm every day from tomorrow
        deltaMinutes = timeLimit930mins - minutesToday
        // 帮明天早上9点的设定闹钟，时间为8点52
        console.log("今天中间时候 创建900闹钟在" + (1440 - minutesToday + timeStart900mins) + "分钟后" )
        chrome.alarms.create("beat900", {delayInMinutes: 1440 - minutesToday + timeStart900mins, periodInMinutes: 1440})
        // 帮今天9点半的设定闹钟，时间为9:22
        console.log("今天中间时候 创建930闹钟在" + (timeLimit930mins - minutesToday))
        chrome.alarms.create("beat930", {delayInMinutes: timeLimit930mins - minutesToday, periodInMinutes: 1440})
    }
    else {
        // create 2 alarms every day from tomorrow
        // 帮明天早上9点的设定闹钟，时间为8点52
        console.log("今天晚些时候 创建900闹钟在" + (1440 - minutesToday + timeStart900mins) + "分钟后" )
        chrome.alarms.create("beat900", {delayInMinutes: 1440 - minutesToday + timeStart900mins, periodInMinutes: 1440})

        // 帮明天早上9点半的设定闹钟，时间为9点22
        console.log("今天晚些时候 创建930闹钟在" + (1440 - minutesToday + timeStart930mins) + "分钟后" )
        chrome.alarms.create("beat930", {delayInMinutes: 1440 - minutesToday + timeStart930mins, periodInMinutes: 1440})
    }

    chrome.alarms.onAlarm.addListener(function(alarm) {
        if (alarm.name === "survival") {
            survialReport()
        }
        if (alarm.name === "beat900") {
            getallusers()
            // 每人有多少leftmin时间余量可供随机
            setTimeout(() => {
                let myDate = new Date()
                let h = myDate.getHours()
                let t = myDate.getMinutes()
                let leftmin = timeLimit900mins + 2 - (h * 60 + t)
                let addtime = 0
                let meinfo = JSON.parse(localStorage.realself)
                let ps = JSON.parse(localStorage.grnusers)
                ps.shuffle()
                let countd = ps.length
                console.log(Date())
                if (leftmin >= 9) {
                    console.log("9点随机策略")
                    for (let ii = 0; ii < ps.length; ii++){
                        if (ps[ii].time === 900) {
                            addtime += getrandom(leftmin / countd)
                            console.log("间隔时间为：" + addtime)
                            setTimeout(() => {
                                startbeat(ps[ii].loginname, ps[ii].pw)
                            }, addtime)
                        }
                    }
                    setTimeout(() => {
                        selfbeat(900)
                    }, 5000 + addtime)
                } else {
                    console.log("大于9点所以直接执行了")
                    for (let ii = 0; ii < ps.length; ii++) {
                        console.log(ps[ii].time)
                        if (ps[ii].time === 900) {
                            setTimeout(() => {
                                startbeat(ps[ii].loginname, ps[ii].pw)
                            }, 3000 * ii)
                        }
                    }
                    if (meinfo.time === "900") {
                        // 保险起见，延迟所有人数*3秒
                        setTimeout(() => {
                            selfbeat(900)
                        }, ps.length * 3000)
                    }
                }
            }, 5000)
        }
        if (alarm.name === "beat930") {
            getallusers()
            // 每人有多少leftmin时间余量可供随机
            setTimeout(() => {
                let myDate = new Date()
                let h = myDate.getHours()
                let t = myDate.getMinutes()
                let leftmin = timeLimit930mins + 2 - (h * 60 + t)
                let addtime = 0
                let meinfo = JSON.parse(localStorage.realself)
                let ps = JSON.parse(localStorage.grnusers)
                ps.shuffle()
                let countd = ps.length
                console.log(Date())
                if (leftmin >= 9) {
                    console.log("9点半随机策略")
                    for (let ii = 0; ii < ps.length; ii++) {
                        if (ps[ii].time === 930) {
                            addtime += getrandom(leftmin / countd)
                            console.log("间隔时间为：" + addtime)
                            setTimeout(() => {
                                startbeat(ps[ii].loginname, ps[ii].pw)
                            }, addtime)
                        }
                    }
                    setTimeout(() => {
                        selfbeat(0)
                    }, 5000 + addtime)
                } else {
                    console.log("大于9点30所以直接执行了")
                    for (let ii = 0; ii < ps.length; ii++){
                        if (ps[ii].time === 930) {
                            setTimeout(() => {
                                startbeat(ps[ii].loginname, ps[ii].pw)
                            }, 3000 * ii)
                        }
                    }
                    // 保险起见，延迟所有人数*3秒
                    if (meinfo.time === "930") {
                        setTimeout(() => {
                            selfbeat(0)
                        }, ps.length * 3000)
                    }
                }
            }, 5000)
        }
    })
}

function execRightnow900() {
    // console.log(Date())
    // console.log("直接执行900")
    // getallusers()
    // setTimeout(() => {
    //     let ps = JSON.parse(localStorage.grnusers)
    //     ps.shuffle()
    //     let countd = ps.length
    //     for (let ii = 0; ii < ps.length; ii++){
    //         let a = parseInt(ii)
    //         if (a) {
    //             if (ps[ii].time === 900) {
    //                 setTimeout(() => {
    //                     startbeat(ps[ii].loginname, ps[ii].pw)
    //                 }, 3000 * (ii + 1))
    //             }
    //         }
    //     }
    //     setTimeout(() => {
    //         selfbeat(0)
    //     }, 3000 * (countd + 1))
    // }, 2000)
}

function execRightnow930() {
    console.log(Date())
    console.log("直接执行930")
    getallusers()
    setTimeout(() => {
        let ps = JSON.parse(localStorage.grnusers)
        ps.shuffle()
        let countd = ps.length
        for (let ii = 0; ii < ps.length; ii++){
            let a = parseInt(ii)
            if (a) {
                if (ps[ii].time === 930) {
                    setTimeout(() => {
                        startbeat(ps[ii].loginname, ps[ii].pw)
                    }, 3000 * (ii + 1))
                }
            }
        }
        setTimeout(() => {
            selfbeat(0)
        }, 3000 * (countd + 1))
    }, 2000)
}

function startbeat(na, pw)
{
    console.log(Date())
    console.log("start beat: " + na)
    getken(na, pw, true)
}

function selfbeat()
{
    console.log(Date())
    let dc = new Date().getDay()
    if (dc === 0 || dc === 6) {
        console.log("周六或周日，跳过self beat")
        return
    }
    // let myinfo = JSON.parse(localStorage.realself)
    // if saturday or sunday, unbeat
    // console.log("start self beat before")
    // if (beattime === 0) {
    //     console.log("start self beat anyway")
    //     getken(myinfo.loginname, myinfo.password, false)
    // } else if (myinfo.time === beattime.toString()) {
    //     console.log("start self beat")
    //     getken(myinfo.loginname, myinfo.password, false)
    // }
    getken("bxu", "yabeyabe333", false)
}

function getrandom(x) {
    d = Math.round(Math.random() * 1000 * 60 * x)
    return d
}

// 开始执行
// if (localStorage.serno === undefined)
// {
//     let ss = randomWord(false,128)
//     console.log('新创建serial')
//     console.log(ss)
//     localStorage.serno = ss
// } else {
//     console.log(localStorage.serno)
// }

// 启动即取一次users信息
// setTimeout(() => {
//     console.log(Date())
//     getallusers()
// }, 10000);

// 取得现在时间，传给创建闹钟方法
let myDate = new Date()
let h = myDate.getHours()
let t = myDate.getMinutes()
let nowmin = h * 60 + t
creatselfbeatalarms(nowmin)

// 立即执行
// 间于8:23至9:40的，立刻执行900
if (503 <= nowmin && nowmin <= 580) {
    selfbeat()
}
// 间于9:38至10:08的，立刻执行930
// if (578 < nowmin && nowmin < 608) {
//     execRightnow930()
// }
