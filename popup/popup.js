document.addEventListener('DOMContentLoaded', function () {
	// var data = chrome.extension.getBackgroundPage().articleData;
	// if(data.error){
		// $("#message").text(data.error);
		$("#content-title").text("localStorage.aaa");
		$("#content-author").text(localStorage.bbb);
		// $("#content").hide();
	// }else{
	// 	$("#message").hide();
	// 	$("#content-title").text(data.title);
	// 	$("#content-author").text(data.author);
	// 	$("#content-date").text(data.postDate);
	// 	$("#content-first-access").text(data.firstAccess);
	// }
});

setInterval(function(){
	$("#content-title").text(localStorage.aaa);
}
,5000);
