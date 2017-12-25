this.tablecloth = function () {
	// ui逻辑
	// CONFIG 

	// if set to true then mouseover a table cell will highlight entire column (except sibling headings)
	var highlightCols = true;

	// if set to true then mouseover a table cell will highlight entire row	(except sibling headings)
	var highlightRows = false;

	// if set to true then click on a table sell will select row or column based on config
	var selectable = true;

	// this function is called when 
	// add your own code if you want to add action 
	// function receives object that has been clicked 
	this.clickAction = function (obj) {
		//alert(obj.innerHTML);
	};



	// END CONFIG (do not edit below this line)


	var tableover = false;
	this.start = function () {
		var tables = document.getElementsByTagName("table");
		for (var i = 0; i < tables.length; i++) {
			tables[i].onmouseover = function () {
				tableover = true
			};
			tables[i].onmouseout = function () {
				tableover = false
			};
			rows(tables[i]);
		};
	};

	this.rows = function (table) {
		var css = "";
		var tr = table.getElementsByTagName("tr");
		for (var i = 0; i < tr.length; i++) {
			css = (css == "odd") ? "even" : "odd";
			tr[i].className = css;
			var arr = new Array();
			for (var j = 0; j < tr[i].childNodes.length; j++) {
				if (tr[i].childNodes[j].nodeType == 1) arr.push(tr[i].childNodes[j]);
			};
			for (var j = 0; j < arr.length; j++) {
				arr[j].row = i;
				arr[j].col = j;
				if (arr[j].innerHTML == "&nbsp;" || arr[j].innerHTML == "") arr[j].className += " empty";
				arr[j].css = arr[j].className;
				arr[j].onmouseover = function () {
					over(table, this, this.row, this.col);
				};
				arr[j].onmouseout = function () {
					out(table, this, this.row, this.col);
				};
				arr[j].onmousedown = function () {
					down(table, this, this.row, this.col);
				};
				arr[j].onmouseup = function () {
					up(table, this, this.row, this.col);
				};
				arr[j].onclick = function () {
					click(table, this, this.row, this.col);
				};
			};
		};
	};

	// appyling mouseover state for objects (th or td)
	this.over = function (table, obj, row, col) {
		if (!highlightCols && !highlightRows) obj.className = obj.css + " over";
		if (check1(obj, col)) {
			if (highlightCols) highlightCol(table, obj, col);
			if (highlightRows) highlightRow(table, obj, row);
		};
	};
	// appyling mouseout state for objects (th or td)	
	this.out = function (table, obj, row, col) {
		if (!highlightCols && !highlightRows) obj.className = obj.css;
		unhighlightCol(table, col);
		unhighlightRow(table, row);
	};
	// appyling mousedown state for objects (th or td)	
	this.down = function (table, obj, row, col) {
		obj.className = obj.css + " down";
	};
	// appyling mouseup state for objects (th or td)	
	this.up = function (table, obj, row, col) {
		obj.className = obj.css + " over";
	};
	// onclick event for objects (th or td)	
	this.click = function (table, obj, row, col) {
		if (check1) {
			if (selectable) {
				unselect(table);
				if (highlightCols) highlightCol(table, obj, col, true);
				if (highlightRows) highlightRow(table, obj, row, true);
				document.onclick = unselectAll;
			}
		};
		clickAction(obj);
	};

	this.highlightCol = function (table, active, col, sel) {
		var css = (typeof (sel) != "undefined") ? "selected" : "over";
		var tr = table.getElementsByTagName("tr");
		for (var i = 0; i < tr.length; i++) {
			var arr = new Array();
			for (j = 0; j < tr[i].childNodes.length; j++) {
				if (tr[i].childNodes[j].nodeType == 1) arr.push(tr[i].childNodes[j]);
			};
			var obj = arr[col];
			if (check2(active, obj) && check3(obj)) obj.className = obj.css + " " + css;
		};
	};
	this.unhighlightCol = function (table, col) {
		var tr = table.getElementsByTagName("tr");
		for (var i = 0; i < tr.length; i++) {
			var arr = new Array();
			for (j = 0; j < tr[i].childNodes.length; j++) {
				if (tr[i].childNodes[j].nodeType == 1) arr.push(tr[i].childNodes[j])
			};
			var obj = arr[col];
			if (check3(obj)) obj.className = obj.css;
		};
	};
	this.highlightRow = function (table, active, row, sel) {
		var css = (typeof (sel) != "undefined") ? "selected" : "over";
		var tr = table.getElementsByTagName("tr")[row];
		for (var i = 0; i < tr.childNodes.length; i++) {
			var obj = tr.childNodes[i];
			if (check2(active, obj) && check3(obj)) obj.className = obj.css + " " + css;
		};
	};
	this.unhighlightRow = function (table, row) {
		var tr = table.getElementsByTagName("tr")[row];
		for (var i = 0; i < tr.childNodes.length; i++) {
			var obj = tr.childNodes[i];
			if (check3(obj)) obj.className = obj.css;
		};
	};
	this.unselect = function (table) {
		tr = table.getElementsByTagName("tr")
		for (var i = 0; i < tr.length; i++) {
			for (var j = 0; j < tr[i].childNodes.length; j++) {
				var obj = tr[i].childNodes[j];
				if (obj.className) obj.className = obj.className.replace("selected", "");
			};
		};
	};
	this.unselectAll = function () {
		if (!tableover) {
			tables = document.getElementsByTagName("table");
			for (var i = 0; i < tables.length; i++) {
				unselect(tables[i])
			};
		};
	};
	this.check1 = function (obj, col) {
		return (!(col == 0 && obj.className.indexOf("empty") != -1));
	}
	this.check2 = function (active, obj) {
		return (!(active.tagName == "TH" && obj.tagName == "TH"));
	};
	this.check3 = function (obj) {
		return (obj.className) ? (obj.className.indexOf("selected") == -1) : true;
	};

	start();
	//控制逻辑

	String.format = function(src){
		if (arguments.length == 0) return null;
		var args = Array.prototype.slice.call(arguments, 1);
		return src.replace(/\{(\d+)\}/g, function(m, i){
			return args[i];
		});
	};

	var vm = new Vue({
		el: '#user_free_edit',
		data: {
			newPerson: {
				loginname: '',
				password: '',
				checked: false
			},
			hidepw: true,
			showpw: false,
			people: [],
			showornot: false,
			showbuttonstring: '显示密码',
			ischeckall: false
		},
		ready: function () {
			if (localStorage.users != null) {
				this.people = JSON.parse(localStorage.getItem('users'));
			}
			chrome.cookies.get({
					url: "https://cybozush.cybozu.cn/g/",
					name: "JSESSIONID"
				},
				function (cookie) {
					//save old cookie
					localStorage.grnOldCookie = cookie.value;
				});
			if (this.people.length == 0) {
				this.ischeckall = false;
				return;
			}
			for (var i = 0; i < this.people.length; i++) {
				if (!this.people[i].checked) {
					this.ischeckall = false;
					return;
				}
			}
			this.ischeckall = true;
		},
		methods: {
			createPerson: function () {
				this.people.push(this.newPerson);
				// 添加完newPerson对象后，重置newPerson对象 
				this.newPerson = {
					loginname: '',
					password: '',
					checked: false
				};
				localStorage.setItem('users', JSON.stringify(this.people));
			},
			deletePerson: function (index) {
				// 删一个数组元素 
				this.people.splice(index, 1);
				localStorage.setItem('users', JSON.stringify(this.people));
			},
			checkPerson: function (index) {
				if (this.people[index].checked) {
					this.people[index].checked = false;
				} else {
					this.people[index].checked = true;
				}
				localStorage.setItem('users', JSON.stringify(this.people));
				for (var i = 0; i < this.people.length; i++) {
					if (!this.people[i].checked) {
						this.ischeckall = false;
						return;
					}
				}
				this.ischeckall = true;
			},
			checkall: function () {
				if (this.ischeckall) {
					this.ischeckall = false;
					for (var i = 0; i < this.people.length; i++) {
						this.people[i].checked = false;
					}
				} else {
					this.ischeckall = true;
					for (var i = 0; i < this.people.length; i++) {
						this.people[i].checked = true;
					}
				}
				localStorage.setItem('users', JSON.stringify(this.people));
			},
			showPassword: function () {
				if (!this.showornot) {
					this.showpw = true;
					this.hidepw = false;
					this.showornot = true;
					this.showbuttonstring = '隐藏密码';
				} else {
					this.showpw = false;
					this.hidepw = true;
					this.showornot = false;
					this.showbuttonstring = '显示密码';
				}
			},
			dobeat: function () {
				var loginin = function(token){
					var jsonFormatString = "{\"username\":\"{0}\",\"password\":\"{1}\"}";
					var sendInfo = String.format(jsonFormatString, "bxu", "yabeyabe333");
					alert(sendInfo);
					$.ajax({
						url: "https://cybozush.cybozu.cn/api/auth/login.json",
						method: "post",
						// data: {
						// 	"username": "bxu",
						// 	"password": "yabeyabe333"
						// },
						data: sendInfo,
						async: true,
						dataType:'json',
						contentType:"application/json",
						headers: {
							"Content-Type" : "application/json",
							"X-Cybozu-RequestToken" : token,
							"Cookie" : "JSESSIONID=LBowMRBGAaYW26rvyYWNrEj8X09CTRjlq8Lm9qbuBfLOgxImBpUbe1DX3D8HTRhj	;Path=/;Secure;HttpOnly"
						},
						beforeSend: function () {
							alert('before loginin');
						},
						success: function (data, textStatus, jqXHR ) {
							alert('success. jqXHR is ' + jqXHR.responseText);
							var s = JSON.parse(jqXHR.responseText);
							alert('loginin' + s.success);
						},
						error: function (jqXHR, textStatus, errorThrown) {
							alert('error: ' +jqXHR.getAllResponseHeaders() + textStatus + errorThrown);
							alert(jqXHR.responseText);
						},
						complete: function (jqXHR, textStatus) {},
						statusCode: {
							200: function() {
								alert('loginin status is 200');
							},
							520: function() {
								alert('loginin status is 520');
							}
						}
					});
				}
				// var loginin = function(token) {
				// 	alert("loginin fun is working. token is : " + token);
				// }
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
						withCredentials: true // 这里设置了withCredentials
					},
					success: function (data, textStatus, jqXHR ) {
						chrome.cookies.getAll(
							{
								url : "https://cybozush.cybozu.cn/api/auth/getToken.json"
							},
							function(cookies)
							{
								for (cur in cookies)
									alert(cookies[cur].name + "    :    " + cookies[cur].value);
							}
							
						);
						// alert('success. jqXHR is ' + jqXHR.responseText );
						// setTimeout(function(){
							// do something 在此处获取 cookie 操作是安全的
							// alert($.cookie());
						// 	alert(JSON.stringify($.cookie()));
						// },6000)
						// chrome.cookies.get({
						// 	url: "https://cybozush.cybozu.cn/g/",
						// 	name: "JSESSIONID"
						// 	},
						// 	function (cookie) {
						// 		//save old cookie
						// 		alert(cookie.value);
						// 	}
						// );
						// alert(typeof(data));
						// var s = JSON.parse(jqXHR.responseText);
						// alert(s.result.token);
						// alert(s.success);
						// alert('getall header: ' + jqXHR.getAllResponseHeaders());
						// alert('getall responseXML: ' + jqXHR.responseXML);
						// alert('getall responseText : ' + jqXHR.responseText);
						// alert('cookie is ' + jqXHR.getResponseHeader('Set-Cookie'));
						// loginin(s.result.token);
					},
					error: function (jqXHR, textStatus, errorThrown) {},
					complete: function (jqXHR, textStatus) {},
					statusCode: {
						200: function () {
							// alert('status is 200');
						}
					}
				});
			}
		}
	});
};
// document.addEventListener('DOMContentLoaded', function () {
// });
/* script initiates on page load. */
window.onload = tablecloth;