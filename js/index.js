/* 
* @Author: Eslam El-Meniawy
* @Date: 2015-10-13 16:44:14
* @Last Modified by: eslam
* @Last Modified time: 2015-10-21 11:27:33
*
* Dear maintainer:
* When I wrote this, only God and I understood what I was doing
* Now, God only knows
* So, good luck maintaining the code :D
*/

var connected;
var swiperLink = 'http://192.168.1.2/books/index.php?option=com_mobile&view=choosen_slider',
	mostDownloadedLink = 'http://192.168.1.2/books/index.php?option=com_mobile&view=downloads&page=0',
	latestLink = 'http://192.168.1.2/books/index.php?option=com_mobile&view=recent&page=0';
var loadedSwiper = false, loadedMostDownloaded = false, loadedLatest = false;
var slideTemp = '<div class="swiper-slide"><a class="tdn" href="details.html?id={{id}}"><img class="swiper-img" src="{{img}}"><h6 class="rtl nom mdl-color-text--white">{{title}}</h6></a></div>',
	tabTemp = '<a class="tdn" href="details.html?id={{id}}"><div class="tab-book fr"><img src="{{img}}"><h6 class="rtl nom mdl-color-text--black">{{title}}</h6></div></a>';
document.addEventListener("deviceready", onDeviceReady, false);
function onDeviceReady() {
	$('.mdl-layout__drawer-button').html('<img class="material-icons" src="img/menu.png">');
	document.addEventListener("backbutton", onBackKeyDown, false);
	var ua = navigator.userAgent;
	if (ua.indexOf("Android") >= 0) {
		var androidversion = parseFloat(ua.slice(ua.indexOf("Android")+8));
		if (androidversion < 4.4) {
			$('.round-tab').each(function() {
				$(this).width(112);
			});
		}
	}
	checkConnection();
	if (connected == 1) {
		$('#loading').show();
		loadSwiper();
		loadMostDownloaded();
		loadLatest();
		loadDrawer();
	} else {
		createSnackbar("لا يوجد اتصال بالانترنت", 'إغلاق');
		loadSwiperOffline();
		loadMostDownloadedOffline();
		loadLatestOffline();
		loadDrawerOffline();
	}
}
function onBackKeyDown() {
	if ($('.mdl-layout__drawer').hasClass('is-visible')) {
		$('.mdl-layout__drawer').removeClass('is-visible');
	} else {
		navigator.app.exitApp();
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
function loadSwiper() {
	$.ajax({
		type : 'GET',
		url : swiperLink,
		dataType : 'JSON'
	}).done(function(response) {
		window.localStorage.setItem('savedSwiper', JSON.stringify(response));
		fillSwiper(response);
	}).fail(function() {
		loadedSwiper = true;
		if (loadedSwiper && loadedMostDownloaded && loadedLatest) {
			$('#loading').hide();
		}
		createSnackbar("حدث خطأ اثناء تحميل قائمة الكتب", 'إغلاق');
		loadSwiperOffline();
	});
}
function loadMostDownloaded() {
	$.ajax({
		type : 'GET',
		url : mostDownloadedLink,
		dataType : 'JSON'
	}).done(function(response) {
		window.localStorage.setItem('savedMostDownloaded', JSON.stringify(response));
		fillMostDownloaded(response);
	}).fail(function() {
		loadedMostDownloaded = true;
		if (loadedSwiper && loadedMostDownloaded && loadedLatest) {
			$('#loading').hide();
		}
		createSnackbar("حدث خطأ اثناء تحميل قائمة الكتب الأكثر تحميلاً ", 'إغلاق');
		loadMostDownloadedOffline();
	});
}
function loadLatest() {
	$.ajax({
		type : 'GET',
		url : latestLink,
		dataType : 'JSON'
	}).done(function(response) {
		window.localStorage.setItem('savedLatest', JSON.stringify(response));
		fillLatest(response);
	}).fail(function() {
		loadedLatest = true;
		if (loadedSwiper && loadedMostDownloaded && loadedLatest) {
			$('#loading').hide();
		}
		createSnackbar("حدث خطأ اثناء تحميل أحدث الكتب", 'إغلاق');
		loadLatestOffline();
	});
}
function loadSwiperOffline() {
	var savedSwiper = window.localStorage.getItem('savedSwiper');
	if (!(typeof savedSwiper === 'undefined' || savedSwiper === null)) {
		fillSwiper(JSON.parse(savedSwiper));
	}
}
function loadMostDownloadedOffline() {
	var savedMostDownloaded = window.localStorage.getItem('savedMostDownloaded');
	if (!(typeof savedMostDownloaded === 'undefined' || savedMostDownloaded === null)) {
		fillMostDownloaded(JSON.parse(savedMostDownloaded));
	}
}
function loadLatestOffline() {
	var savedLatest = window.localStorage.getItem('savedLatest');
	if (!(typeof savedLatest === 'undefined' || savedLatest === null)) {
		fillLatest(JSON.parse(savedLatest));
	}
}
function fillSwiper(response) {
	for (var i = 0; i < response.length; i++) {
		$('#slider').append(slideTemp.replace(/{{id}}/g, response[i].id).replace(/{{img}}/g, 'http://192.168.1.2/books/' + response[i].image2).replace(/{{title}}/g, response[i].title));
	}
	new Swiper('.swiper-container-main', {
		pagination: '.swiper-pagination',
		slidesPerView: 3,
		spaceBetween: 8,
		slidesPerGroup: 3,
		paginationClickable: true,
		loop: true
	});
	loadedSwiper = true;
	if (loadedSwiper && loadedMostDownloaded && loadedLatest) {
		$('#loading').hide();
	}
}
function fillMostDownloaded(response) {
	for (var i = 0; i < response.length; i++) {
		$('#most-downloaded').append(tabTemp.replace(/{{id}}/g, response[i].id).replace(/{{img}}/g, 'http://192.168.1.2/books/' + response[i].image).replace(/{{title}}/g, response[i].title));
	}
	$('.tab-book').each(function() {
		$(this).width((($(window).width() - 32) / 3) + 'px');
	});
	loadedMostDownloaded = true;
	if (loadedSwiper && loadedMostDownloaded && loadedLatest) {
		$('#loading').hide();
	}
}
function fillLatest(response) {
	for (var i = 0; i < response.length; i++) {
		$('#latest-books').append(tabTemp.replace(/{{id}}/g, response[i].id).replace(/{{img}}/g, 'http://192.168.1.2/books/' + response[i].image).replace(/{{title}}/g, response[i].title));
	}
	$('.tab-book').each(function() {
		$(this).width((($(window).width() - 32) / 3) + 'px');
	});
	loadedLatest = true;
	if (loadedSwiper && loadedMostDownloaded && loadedLatest) {
		$('#loading').hide();
	}
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