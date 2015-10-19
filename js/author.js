/* 
* @Author: Eslam El-Meniawy
* @Date: 2015-10-15 13:49:23
* @Last Modified by: eslam
* @Last Modified time: 2015-10-19 16:26:59
*
* Dear maintainer:
* When I wrote this, only God and I understood what I was doing
* Now, God only knows
* So, good luck maintaining the code :D
*/

var connected;
var temp = '<a class="tdn" href="details.html?id={{id}}"><div class="tab-book fr category-book"><img src="{{img}}"><h6 class="rtl nom mdl-color-text--black">{{title}}</h6></div></a>';
document.addEventListener("deviceready", onDeviceReady, false);
function onDeviceReady() {
	$('.mdl-layout__drawer-button').html('<img class="material-icons" src="img/menu.png">');
	document.addEventListener("backbutton", onBackKeyDown, false);
	$('.grid-30').each(function() {
		$(this).width((($(window).width() - 26) * 0.3) + 'px');
	});
	$('.grid-70').each(function() {
		$(this).width((($(window).width() - 26) * 0.7) + 'px');
	});
	checkConnection();
	if (connected == 1) {
		$('#loading').show();
		$.ajax({
			type : 'GET',
			url : 'http://192.168.1.2/books/index.php?option=com_mobile&view=auther&id=' + GetDataValue('id'),
			dataType : 'JSON'
		}).done(function(response) {
			$('#details-img').attr('src', 'http://192.168.1.2/books/' + response.auther_image);
			$('#about-author').html(response.description);
			for (var i = 0; i < response.books.length; i++) {
				$('#main-data').append(temp.replace(/{{id}}/g, response.books[i].bid).replace(/{{img}}/g, 'http://192.168.1.2/books/' + response.books[i].bimage).replace(/{{title}}/g, response.books[i].btitle));
			}
			$('.tab-book').each(function() {
				$(this).width((($(window).width() - 32) / 3) + 'px');
			});
			$('#loading').hide();
		}).fail(function() {
			$('#loading').hide();
			createSnackbar("حدث خطأ اثناء تحميل بيانات الكتاب", 'إغلاق');
		});
	} else {
		createSnackbar("لا يوجد اتصال بالانترنت", 'إغلاق');
	}
}
function onBackKeyDown() {
	if ($('.mdl-layout__drawer').hasClass('is-visible')) {
		$('.mdl-layout__drawer').removeClass('is-visible');
	} else {
		window.history.back();
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