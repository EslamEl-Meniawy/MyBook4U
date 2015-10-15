/* 
* @Author: Eslam El-Meniawy
* @Date: 2015-10-13 16:44:14
* @Last Modified by: eslam
* @Last Modified time: 2015-10-15 14:53:26
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
	// Swiper slide width swiper-img
	// Swiper
	new Swiper('.swiper-container-main', {
		pagination: '.swiper-pagination',
		slidesPerView: 3,
		spaceBetween: 8,
		slidesPerGroup: 3,
		paginationClickable: true,
		loop: true
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