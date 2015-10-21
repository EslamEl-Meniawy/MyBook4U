/* 
* @Author: Eslam El-Meniawy
* @Date: 2015-10-15 13:53:58
* @Last Modified by: eslam
* @Last Modified time: 2015-10-21 11:28:15
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
		loadDrawer();
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
				$("#frame").attr('src', 'http://11.11.11.12/comments/mybook4u.html?url=' + response.book_link);
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
		loadDrawerOffline();
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