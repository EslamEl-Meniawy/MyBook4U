/* 
* @Author: Eslam El-Meniawy
* @Date: 2015-10-15 13:53:58
* @Last Modified by: eslam
* @Last Modified time: 2015-10-20 12:08:10
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
	$('.grid-30').each(function() {
		$(this).width((($(window).width() - 48) * 0.3) + 'px');
	});
	$('.grid-70').each(function() {
		$(this).width((($(window).width() - 48) * 0.7) + 'px');
	});
	checkConnection();
	if (connected == 1) {
		$('#loading').show();
		$.ajax({
			type : 'GET',
			url : 'http://192.168.1.2/books/index.php?option=com_mobile&view=book&id=' + GetDataValue('id'),
			dataType : 'JSON'
		}).done(function(response) {
			$('#details-img').attr('src', 'http://192.168.1.2/books/' + response.image);
			$('#details-title').html(response.book_title);
			$('#details-download-count').html('مرات التحميل: ' + response.downloads);
			$('#details-author').attr('href', 'author.html?id=' + response.auther_id);
			$('#details-author').html(response.auther_name);
			$('#download').show();
			$('#download').click(function() {
				cordova.InAppBrowser.open('https://docs.google.com/uc?id=' + response.url + '&export=download', '_system');
			});
			$('#book-details').html(response.description);
			$('#add-comment').show();
			$('#add-comment').click(function() {
				$('#loading').show();
				$('#add-comment').hide();
				$('#frame').show();
				$("#frame").attr('src', 'http://11.11.11.9/comments/mybook4u.html?url=' + response.id);
				$('#frame').load(function(){
					$('#loading').hide();
				});
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