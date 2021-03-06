/* 
* @Author: Eslam El-Meniawy
* @Date: 2015-10-15 13:37:33
* @Last Modified by: eslam
* @Last Modified time: 2015-10-21 11:28:03
*
* Dear maintainer:
* When I wrote this, only God and I understood what I was doing
* Now, God only knows
* So, good luck maintaining the code :D
*/

var id = GetDataValue('id');
var connected;
var page = 0;
var temp = '<a class="tdn" href="details.html?id={{id}}"><div class="tab-book fr category-book"><img src="{{img}}"><h6 class="rtl nom mdl-color-text--black">{{title}}</h6></div></a>';
document.addEventListener("deviceready", onDeviceReady, false);
function onDeviceReady() {
	$('.mdl-layout__drawer-button').html('<img class="material-icons" src="img/menu.png">');
	document.addEventListener("backbutton", onBackKeyDown, false);
	checkConnection();
	if (connected == 1) {
		$('#loading').show();
		loadData();
		loadDrawer();
	} else {
		createSnackbar("لا يوجد اتصال بالانترنت", 'إغلاق');
		loadDataOffline();
		loadDrawerOffline();
	}
	$('#show-more').click(function() {
		checkConnection();
		if (connected == 1) {
			$('#loading').show();
			loadData();
		} else {
			createSnackbar("لا يوجد اتصال بالانترنت", 'إغلاق');
		}
	});
}
function onBackKeyDown() {
	if ($('.mdl-layout__drawer').hasClass('is-visible')) {
		$('.mdl-layout__drawer').removeClass('is-visible');
	} else {
		window.location = "index.html";
	}
}
function checkConnection() {
	var networkState = navigator.connection.type;
	if (networkState == Connection.NONE || networkState == Connection.UNKNOWN) {
		connected = 0;
	} else {
		connected = 1;
	}
}
function GetDataValue(VarSearch) {
	var SearchString = window.location.search.substring(1);
	var VariableArray = SearchString.split('&');
	for (var i = 0; i < VariableArray.length; i++) {
		var KeyValuePair = VariableArray[i].split('=');
		if (KeyValuePair[0] == VarSearch) {
			return KeyValuePair[1];
		}
	}
}
function loadData() {
	$.ajax({
		type : 'GET',
		url : 'http://192.168.1.2/books/index.php?option=com_mobile&view=catogery_books&catid=' + id + '&page=' + page,
		dataType : 'JSON'
	}).done(function(response) {
		if (page == 0) {
			window.localStorage.setItem('savedCategory' + id, JSON.stringify(response));
		}
		fillData(response);
		page ++;
		$('#loading').hide();
	}).fail(function() {
		$('#loading').hide();
		createSnackbar("حدث خطأ اثناء تحميل الكتب", 'إغلاق');
		if (page == 0) {
			loadDataOffline();
		}
	});
}
function loadDataOffline() {
	var data = window.localStorage.getItem('savedCategory' + id);
	if (!(typeof data === 'undefined' || data === null)) {
	    fillData(JSON.parse(data));
	}
}
function fillData(response) {
	for (var i = 0; i < response.length; i++) {
		$('#main-data').append(temp.replace(/{{id}}/g, response[i].id).replace(/{{img}}/g, 'http://192.168.1.2/books/' + response[i].image).replace(/{{title}}/g, response[i].title));
	}
	$('.tab-book').each(function() {
		$(this).width((($(window).width() - 32) / 3) + 'px');
	});
}
function loadDrawer() {
	var lastFetchDrawerlTime = window.localStorage.getItem('lastFetchDrawerlTime');
	if (typeof lastFetchDrawerlTime === 'undefined' || lastFetchDrawerlTime === null) {
		getDrawer();
	} else {
		var IntervalDiffMinutes = 5 * 60 * 1000;
		var oldDate = new Date(window.localStorage.getItem('lastFetchDrawerlTime'));
		var newDate = new Date();
		if ((newDate - oldDate) >= IntervalDiffMinutes) {
			getDrawer();
		} else {
			var savedDrawer = window.localStorage.getItem('savedDrawer');
			if (typeof savedDrawer === 'undefined' || savedDrawer === null) {
				getDrawer();
			} else {
				fillDrawer(JSON.parse(savedDrawer));
			}
		}
	}
}
function loadDrawerOffline() {
	var savedDrawer = window.localStorage.getItem('savedDrawer');
	if (typeof savedDrawer === 'undefined' || savedDrawer === null) {
		$('#drawer').append('<a class="mdl-navigation__link" id="reload-drawer" href="#" onclick="loadDrawer();$(\'#reload-drawer\').remove();"><div class="tac"><span class="mdl-color-text--white">برجاء الاتصال بالانترنت والضغط هنا لتحميل قائمة الأقسام</span></div></a>');
	} else {
		fillDrawer(JSON.parse(savedDrawer));
	}
}
function getDrawer() {
	$.ajax({
		type : 'GET',
		url : 'http://192.168.1.2/books/index.php?option=com_mobile&view=catogeries',
		dataType : 'JSON'
	}).done(function(response) {
		window.localStorage.setItem('savedDrawer', JSON.stringify(response));
		window.localStorage.setItem('lastFetchDrawerlTime', new Date());
		fillDrawer(response);
	}).fail(function() {
		loadDrawerOffline();
	});
}
function fillDrawer(response) {
	for (var i = 1; i < response.length; i++) {
		if (typeof response[i].subcat === 'undefined' || response[i].subcat === null) {
			$('#drawer').append('<a class="mdl-navigation__link" href="category.html?id=' + response[i].link + '"><div class="tac"><span class="mdl-color-text--white"><b>' + response[i].title + '</b></span></div></a><hr>');
		} else {
			var button = document.createElement('button');
			var div = document.createElement('div');
			var span = document.createElement('span');
			var b = document.createElement('b');
			var textNode = document.createTextNode(response[i].title);
			b.appendChild(textNode);
			span.appendChild(b);
			div.appendChild(span);
			button.appendChild(div);
			span.className = 'mdl-color-text--white';
			div.className = 'tac';
			button.id = 'category-drawer-' + response[i].id;
			button.className = 'mdl-button mdl-js-button drawer-button';
			componentHandler.upgradeElement(button);
			document.getElementById('drawer').appendChild(button);
			var ul = document.createElement('ul');
			for (var j = 0; j < response[i].subcat.length; j++) {
				var li = document.createElement('li');
				var a = document.createElement('a');
				var li_div = document.createElement('div');
				var li_span = document.createElement('span');
				var li_b = document.createElement('b');
				var li_textNode = document.createTextNode(response[i].subcat[j].title);
				li_b.appendChild(li_textNode);
				li_span.appendChild(li_b);
				li_div.appendChild(li_span);
				a.appendChild(li_div);
				li.appendChild(a);
				li_span.className = 'mdl-color-text--red-700';
				li_div.className = 'tac';
				a.setAttribute("href", "category.html?id=" + response[i].subcat[j].link);
				a.className = 'tdn';
				li.className = 'mdl-menu__item';
				ul.appendChild(li);
			}
			ul.setAttribute("for", "category-drawer-" + response[i].id);
			ul.className = 'mdl-menu mdl-menu--bottom-right mdl-js-menu mdl-js-ripple-effect drawer-menu';
			document.getElementById('drawer').appendChild(ul);
			componentHandler.upgradeDom('MaterialMenu', 'mdl-menu');
			$('#drawer').append('<hr>');
		}
	}
}