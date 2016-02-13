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
                confirmValue: '继续提供服务',
                confirm: function(){
                    $("#mycheck").prop( "checked", true);
                    localStorage.isHelpOtherPeople = checkbox.checked;
                },
                cancelValue: '不管小伙伴了',
                hasClose: true,
                content: '您确定要停止为小伙伴们服务吗？这将降低您的人品。'
            });
        }
        localStorage.isHelpOtherPeople = this.checked;
    });

// });
});