function getDomainFromUrl(url){
	var host = "null";
	if(typeof url == "undefined" || null == url)
		url = window.location.href;
	var regex = /.*\:\/\/([^\/]*).*/;
	var match = url.match(regex);
	if(typeof match != "undefined" && null != match)
		host = match[1];
	return host;
}

function checkForValidUrl(tabId, changeInfo, tab) {
	if(getDomainFromUrl(tab.url).toLowerCase() == "extensions") {
		chrome.pageAction.show(tabId);
	}
};

// function noti() {
//     var time = /(..)(:..)/.exec(new Date());     // The prettyprinted time.
//     var hour = time[1] % 12 || 12;               // The prettyprinted hour.
//     var period = time[1] < 12 ? 'a.m.' : 'p.m.'; // The period of the day.
//     var nf = new Notification(hour + time[2] + ' ' + period, {
//     icon: 'mm.png',
//     body: 'Time to make the toast.'
//     });
//     nf.addEventListener('close', function () {alert("noti closed");}, false);
// }

function noti(){
	if (chrome.notifications) {
		console.log("chrome notificatin is ready");
		var opt = {
			type: "basic",
			iconUrl: 'img/icon.png',
			title: "Hello",
			message: "my message",
			buttons: [
            	{title: '先生是个大坏蛋',iconUrl: 'img/icon.png'},
            	{title: '先生是个大好蛋',iconUrl: 'img/icon.png'}
        	]
		};
		chrome.notifications.create("", opt, alertss);
		// getsth();
	}
}

function alertss(id) {
	// alert(id);
}

function getsth() {
	$.get("https://cybozush.cybozu.cn/g/timecard/index.csp?", function(data){
		data.getElementsByTagName("title");
	});
	// $.get("http://d3bookofcain.sinaapp.com/", function(data){
	// 	console.log(data);
	// 	$(data).find("title");
	// });
}

localStorage.aaa = 5;

chrome.tabs.onUpdated.addListener(checkForValidUrl);
getsth();

setInterval(function () {
		localStorage.aaa++;
		// noti();
	}, 5000);
