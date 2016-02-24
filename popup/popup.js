document.addEventListener('DOMContentLoaded', function() {
    // $("#checksid").click(function(){
    //     $("#logintextbox").val("");
    //     // var bkg = chrome.extension.getBackgroundPage();
    //     // bkg.console.log('foo bar');
    //     $("#level").show();
    // });
    // $("#level").hide();

    // var v0 = new Vue({
    //     el: '#loginArea',
    //     data: {
    //         showLoginArea: true
    //     }
    // });
    var area1 = new Vue({
        el : '#loginArea',
        data : {
            name : 'Vue.js',
            showLoginArea : true
        },
        methods : {
            doSomething: function() {
                area1.showLoginArea = false;
                area2.showUserInfo = true;
            }
        }
    });

    var area2 = new Vue({
        el : '#contentArea',
        data : {
            yourname : "baka",
            status : "ON",
            time : "9:30",
            showUserInfo : false
        },
        methods : {
            doLogout : function() {
                area2.showUserInfo = false;
                area1.showLoginArea = true;
            }
        }
    });
});