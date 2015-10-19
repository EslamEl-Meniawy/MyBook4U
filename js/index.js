/* 
* @Author: Eslam El-Meniawy
* @Date: 2015-10-13 16:44:14
* @Last Modified by: eslam
* @Last Modified time: 2015-10-19 11:53:33
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
				$(this).width(110);
			});
		}
	}
	checkConnection();
	if (connected == 1) {
		$('#loading').show();
		loadSwiper();
		loadMostDownloaded();
		loadLatest();
	} else {
		createSnackbar("لا يوجد اتصال بالانترنت", 'إغلاق');
		loadSwiperOffline();
		loadMostDownloadedOffline();
		loadLatestOffline();
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