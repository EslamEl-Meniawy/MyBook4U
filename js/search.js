/* 
* @Author: Eslam El-Meniawy
* @Date: 2015-10-15 13:32:46
* @Last Modified by: eslam
* @Last Modified time: 2015-10-15 13:34:18
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