/* 
* @Author: Eslam El-Meniawy
* @Date: 2015-10-13 16:44:14
* @Last Modified by: eslam
* @Last Modified time: 2015-10-18 13:41:07
*
* Dear maintainer:
* When I wrote this, only God and I understood what I was doing
* Now, God only knows
* So, good luck maintaining the code :D
*/

var connected;
document.addEventListener("deviceready", onDeviceReady, false);
function onDeviceReady() {
	$('.mdl-layout__drawer-button').html('<img class="material-icons" src="img/menu.png">');
	document.addEventListener("backbutton", onBackKeyDown, false);
	// Swiper
	new Swiper('.swiper-container-main', {
		pagination: '.swiper-pagination',
		slidesPerView: 3,
		spaceBetween: 8,
		slidesPerGroup: 3,
		paginationClickable: true,
		loop: true
	});
	//Round tab
	$('.round-tab').each(function() {
		$(this).width((($(window).width() - 20) / 2) + 'px');
	});
	// Tab book
	$('.tab-book').each(function() {
		$(this).width((($(window).width() - 32) / 3) + 'px');
	});
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