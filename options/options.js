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
                confirmValue: '狠心不管同事',
                confirm: function() {
                },
                cancel: function() {
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

    $("#interval").val(localStorage.intervalCheck);
    $("#interval").on('paste input', function() {
        var textbox = this;
        if (textbox.value < 0) {
            textbox.value = 10;
        }
        localStorage.intervalCheck = textbox.value == 0?10:textbox.value;
    });
});