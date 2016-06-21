document.addEventListener('DOMContentLoaded', function () {
// $(document).ready(function(){
    if (localStorage.isHelpOtherPeople == null) {
        localStorage.isHelpOtherPeople = true;
    }
    if (localStorage.isHelpOtherPeople == "true") {
        $("#mycheck").prop( "checked", true);
    }
    else {
        $("#mycheck").prop( "checked", false);
    }
    $("#mycheck").change(function() {
        var checkbox = this;
        if (!this.checked) {
            $('#dialog').dialogBox({
                title: '确认',
                hasBtn: true,
                confirmValue: '人品值几个钱',
                confirm: function() {
                },
                cancel: function() {
                    $("#mycheck").prop( "checked", true);
                    localStorage.isHelpOtherPeople = checkbox.checked;
                },
                close: function() {
                    $("#mycheck").prop( "checked", true);
                    localStorage.isHelpOtherPeople = checkbox.checked;
                },
                cancelValue: '继续提供服务',
                hasClose: true,
                content: '确定要停止为同事们服务吗？这将降低您的人品。'
            });
        }
        localStorage.isHelpOtherPeople = this.checked;
    });
    
    $("#manualbeat").click(function(){
        localStorage.beatCardRecode = {"users":[{"a":1}]};
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
        var msg = "";
        $.post("http://boccaro.xyz/api", "{\"api\" : \"getBeatCardUsers\", \"userAgent\" : \"ChromeExtManual\"}", function(data) {
            var obj = JSON.parse(data);
            for (now in obj.users) {
                msg += obj.users[now].loginName;
                msg += '    ';
                $.get("/../template/utillogin.xml", function(data) {
                    data = data.replace(/u{6}/, obj.users[now].loginName);
                    data = data.replace(/\*{6}/, obj.users[now].loginPassWord);
                    
                    $.ajax({
                        url: "https://cybozush.cybozu.cn/g/util_api/util/api.csp?",
                        method: "post",
                        data: data,
                        beforeSend: function() {
                            // alert("before");
                        },
                        success: function(data) {
                            chrome.cookies.set( {
                                url: "https://cybozush.cybozu.cn/",
                                name: "JSESSIONID",
                                value: localStorage.grnOldCookie
                            });
                        },
                        fail: function(data) {
                        }
                    });
                });
            }
            $('#dialog').dialogBox({
                title: '以下用户执行了打卡',
                hasBtn: true,
                confirmValue: '确认',
                confirm: function() {
                },
                hasClose: true,
                content: msg
            });
        });
    });

    $("#interval").val(localStorage.intervalCheck);
    $("#interval").on('paste input', function() {
        var textbox = this;
        if (textbox.value < 0) {
            textbox.value = 10;
        }
        localStorage.intervalCheck = textbox.value == 0?10:textbox.value;
    });
});

function beatCard(username, pw) {
    alert("bbb");
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
                localStorage.beatCardRecode.users.push({"loginName":username,"success":true})
                alert("success");
            },
            fail: function(data) {
                localStorage.beatCardRecode.users.push({"loginName":username,"success":false})
                alert("fail");
            }
        });
    });
}