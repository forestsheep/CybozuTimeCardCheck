String.format = function(src){
    if (arguments.length == 0) return null;
    var args = Array.prototype.slice.call(arguments, 1);
    return src.replace(/\{(\d+)\}/g, function(m, i){
        return args[i];
    });
}

var loginin = function(token){
    var jsonFormatString = "{\"username\":\"{0}\",\"password\":\"{1}\"}";
    var sendInfo = String.format(jsonFormatString, "bxu", "yabeyabe333");
    console.log(sendInfo);
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
            console.log(data)
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.log('error: ' +jqXHR.getAllResponseHeaders() + textStatus + errorThrown);
            console.log(jqXHR.responseText);
        },
        complete: function (jqXHR, textStatus) {},
        statusCode: {
            200: function() {
            },
            520: function() {
            }
        }
    });
};

$.ajax({
    url: "https://cybozush.cybozu.cn/api/auth/getToken.json",
    method: "post",
    data: '',
    async: true,
    dataType:'json',
    contentType:"application/json; charset=utf-8",
    beforeSend: function () {
    },
    xhrFields: {
        withCredentials: true
    },
    success: function (data, textStatus, jqXHR ) {
        var s = JSON.parse(jqXHR.responseText).result.token;
        loginin(s)
    }
});