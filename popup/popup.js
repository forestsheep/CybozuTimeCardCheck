document.addEventListener('DOMContentLoaded', function () {
    $("#checksid").click(function(){
        $("#ab").val("ininin");
        var bkg = chrome.extension.getBackgroundPage();
        bkg.console.log('foo bar');
        $("#level").show();
    });
    $("#level").hide();
});
