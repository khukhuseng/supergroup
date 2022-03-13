var app_domain = "https://supergroup-app.trip4asia.com/";

Date.prototype.addDays = function(days) {
	var date = new Date(this.valueOf());
	date.setDate(date.getDate() + days);
	return date;
}

function onsen_push_page(page, data, animation){	
	var page_data = page.split("/");
	var page_id = page_data.join("_");
	var load_page = "";
	var module = "";
	var index_id = "";
	
	if(page_data.length >= 2){
		module = page_data[0];
		load_page = page_data[1];
	}else{
		load_page = page_data[0]; 
	}
	
	if(!data){
		data = {};
	}
	
	if(!animation){
		animation = "slide";
	}
	
	$('#modalLoading').show();
	//alert(load_page);alert(page);
	nav.pushPage("page.html?page=" + encodeURIComponent(load_page) + "&module=" + encodeURIComponent(module),
			{ animation: animation, delay: 0.4 }
	).then(function(){
			$.ajax({
				url: page + '.html',
				type: 'GET',
				data: data, 
				success: function(html) {
					//console.log(html);
					$('#resultContent-' + page_id).html(html);
					$('#resultContent-' + page_id).fadeIn('300');
					//$('#modalLoading').hide();
				}
			});
	});	
	
}

function onsen_popup(msg){
	ons.notification.toast(msg, { timeout: 2000, animation: 'lift' });	
}

function onsen_pop_page(){
	nav.popPage();
}

function convert_js_date_to_php_date(date){
	var year = date.getFullYear();
	var month = date.getMonth() + 1;
	var day = date.getDate();
	
	if(month < 10){
		month = "0" + month;
	}
	
	if(day < 10){
		day = "0" + day;
	}
	
	return year + "-" + month + "-" + day;
}

function setInputFilter(textbox, inputFilter) {
  	["input", "keydown", "keyup", "mousedown", "mouseup", "select", "contextmenu", "drop"].forEach(function(event) {
    textbox.addEventListener(event, function() {
    	if (inputFilter(this.value)) {
        	this.oldValue = this.value;
        	this.oldSelectionStart = this.selectionStart;
        	this.oldSelectionEnd = this.selectionEnd;
      	} else if (this.hasOwnProperty("oldValue")) {
        	this.value = this.oldValue;
        	this.setSelectionRange(this.oldSelectionStart, this.oldSelectionEnd);
      	} else {
        	this.value = "";
      	}
    });
  	});
}

function OPEN_PDF(url){
	if(window.parent.ReactNativeWebView){
		window.parent.ReactNativeWebView.postMessage(JSON.stringify({
			id: url,
			target: "blank"
		}));
	}else{
		location.href = url;
	}
}

function check_password_format(password){
	if(password.search(/\d/) >= 0 && password.search(/[a-zA-Z]/) >= 0){
		return true;
	}else{
		return false;
	}
}

function load_lang_pack(lang){
	var data = new Object();
	data["lang"] = lang;

	$.ajax({		
		url: app_domain + "api/get_lang.php",
		type: "GET",
		data: data,
		success: function (response) {
			var data = $.parseJSON(response);

			$(".lang").each(function(index, element){
				$(this).html(data[$(this).data("lang")]);

				//console.log(lang_var);
			});
		}
	});

}