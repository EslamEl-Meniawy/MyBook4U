/* 
* @Author: Eslam El-Meniawy
* @Date: 2015-10-15 13:32:46
* @Last Modified by: eslam
* @Last Modified time: 2015-10-19 15:20:36
*
* Dear maintainer:
* When I wrote this, only God and I understood what I was doing
* Now, God only knows
* So, good luck maintaining the code :D
*/

var connected;
var temp = '<a class="tdn w100" href="details.html?id={{id}}"><div class="search-result-div rtl"><div class="grid-30 fr"><img class="search-result-img" src="{{img}}"></div><div class="grid-70 fr search-result-data-div"><h6 class="rtl nom mdl-color-text--black">{{title}}</h6><div class="rtl w100 mdl-color-text--black download-count">مرات التحميل: {{count}}</div><span class="author-name rtl mdl-color-text--red-700">{{author}}</span></div></div></a>';
document.addEventListener("deviceready", onDeviceReady, false);
function onDeviceReady() {
	$('.mdl-layout__drawer-button').html('<img class="material-icons" src="img/menu.png">');
	document.addEventListener("backbutton", onBackKeyDown, false);
	$('#search').click(function() {
		checkConnection();
		if (connected == 1) {
			if (!($('#author-name').val().length > 0 || $('#book-name').val().length > 0)) {
				createSnackbar("برجاء ادخال اسم الكاتب أو اسم الكتاب أولاً", 'إغلاق');
			} else {
				var link = '';
				if ($('#author-name').val().length > 0 && $('#book-name').val().length > 0) {
					link = 'http://192.168.1.2/books/index.php?option=com_mobile&view=search&auther=' + $('#author-name').val() + '&book=' + $('#book-name').val();
				} else {
					if ($('#author-name').val().length > 0) {
						link = 'http://192.168.1.2/books/index.php?option=com_mobile&view=search&auther=' + $('#author-name').val();
					} else {
						link = 'http://192.168.1.2/books/index.php?option=com_mobile&view=search&book=' + $('#book-name').val();
					}
				}
				$('#loading').show();
				$.ajax({
					type : 'GET',
					url : link,
					dataType : 'JSON'
				}).done(function(response) {
					if (response.length > 0) {
						var results = '<div class="mdl-shadow--2dp rtl" id="search-result-number">' + response.length + ' نتيجة بحث</div>';
						for (var i = 0; i < response.length; i++) {
							results += temp.replace(/{{id}}/g, response[i].bookid).replace(/{{img}}/g, 'http://192.168.1.2/books/' + response[i].bookimg).replace(/{{title}}/g, response[i].booktitle).replace(/{{count}}/g, response[i].downloads).replace(/{{author}}/g, response[i].name);
						}
						$('#search-result-div').html(results);
					} else {
						$('#search-result-div').html('<div class="mdl-shadow--2dp rtl" id="search-result-number">لم يتم العثور على نتائج بحث</div>');
					}
					$('#search-div').hide();
					$('#search-result-div').show();
					$('.grid-30').each(function() {
						$(this).width((($(window).width() - 48) * 0.3) + 'px');
					});
					$('.grid-70').each(function() {
						$(this).width((($(window).width() - 48) * 0.7) + 'px');
					});
					$('#loading').hide();
				}).fail(function() {
					$('#loading').hide();
					createSnackbar("حدث خطأ اثناء البحث برجاء المحاولة مرة آخرى", 'إغلاق');
				});
			}
		} else {
			createSnackbar("لا يوجد اتصال بالانترنت", 'إغلاق');
		}
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