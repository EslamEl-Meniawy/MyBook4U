/* 
* @Author: Eslam El-Meniawy
* @Date: 2015-10-15 13:32:46
* @Last Modified by: eslam
* @Last Modified time: 2015-10-19 13:53:06
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
	// Grid
	/*$('.grid-30').each(function() {
		$(this).width((($(window).width() - 48) * 0.3) + 'px');
	});
	$('.grid-70').each(function() {
		$(this).width((($(window).width() - 48) * 0.7) + 'px');
	});*/
	$('#search').click(function() {
		checkConnection();
		if (connected == 1) {
			if (!($('#author-name').val().length > 0 || $('#book-name').val().length > 0)) {
				createSnackbar("برجاء ادخال اسم الكاتب أو اسم الكتاب أولاً", 'إغلاق');
			} else {
				if ($('#author-name').val().length > 0 && $('#book-name').val().length > 0) {
					// Both
				} else {
					if ($('#author-name').val().length > 0) {
						// Author
					} else {
						// Book
					}
				}
			}
		} else {
			createSnackbar("لا يوجد اتصال بالانترنت", 'إغلاق');
		}
		/*$('#search-result-div').show();
		$('#search-div').hide();*/
	});
}
function onBackKeyDown() {
	if ($('.mdl-layout__drawer').hasClass('is-visible')) {
		$('.mdl-layout__drawer').removeClass('is-visible');
	} else {
		if ($("#search-result-number").length) {
			$('#search-div').show();
			$('#search-result-div').html('');
			$('#search-result-div').hide();
		} else {
			window.history.back();
		}
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