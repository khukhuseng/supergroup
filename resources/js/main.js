var app_domain = "https://supergroup-app.trip4asia.com/";

function MENU_OPEN(){
	$('#modalMenu').fadeIn();	
}
function MENU_CLOSE(){
	$('#modalMenu').fadeOut();
}

function PAGE_LANDING(){
	var page_id = "landing";
	nav.resetToPage(page_id+".html",
		{ animation: "fade" }
	).then(function(){
		load_lang_pack("EN");
	});
}

function PAGE_LOGIN(){
	var page_id = "login";
	nav.resetToPage(page_id+".html",
		{ animation: "fade" }
	).then(function(){
		load_lang_pack("EN");
	});
}

function PAGE_LOGOUT(){
	var agent_id = $("#app_agent_id").val();
	var device_id = $("#app_device_id").val();
	var session = $("#app_session").val();

	$("#app_agent_id").val('');
	$("#app_session").val('');
	$("#app_ranking_id").val("");
	MENU_CLOSE();

	if(window.parent.ReactNativeWebView){
		window.parent.ReactNativeWebView.postMessage(JSON.stringify({
			action: "logout"
		}));
	}

	PAGE_LANDING();	

	var param = new Object();
	param["agent_id"] = agent_id;
	param["device_id"] = device_id;
	param["session"] = session;

	$.ajax({
		type: "POST",
		url: app_domain + "api/agent/logout.php",
		data: param		
	});
}

function PAGE_FORGET_PASSWORD(){
	var page_id = "forget-password";
	nav.pushPage(page_id+".html",
		{ animation: "slide" }
	).then(function(){
		var height = parseFloat($(window).height())-60;
		$('#resultContent-'+page_id).css("min-height",height+"px");
		load_lang_pack("EN");
	});
}

function PAGE_NEW_AGENT_ACTIVATION(){
	var page_id = "agent_account-activation-index";
	
	var data = new Object();
	data['agent_id'] = $('#app_agent_id').val();
	data['session'] = $('#app_session').val();
	data['device_id'] = $('#app_device_id').val();
	data['type'] = "new";
	
	nav.pushPage(app_domain + "content/api-page.php?page="+page_id,
		{ animation: "slide", delay: 1 }
	).then(function(){
		var height = parseFloat($(window).height())-60;
		$('#resultContent-'+page_id).css("min-height",height+"px");
		
		var page_header_content  = '';
		page_header_content    	+= '<ons-icon icon="fa-chevron-left" style="position:absolute; left:15px; line-height:60px !important; font-size:30px;z-index: 9999999999 !important; border-radius:0px; color:#fff;" onClick="onsen_pop_page();"></ons-icon>';
		page_header_content 	+= '<div style="position:absolute;z-index:9999;font-weight:700;line-height:60px;font-size:20px;text-align:center; width:100%;left:0px;">';
		page_header_content     += 'Agent Activation';
		page_header_content    	+= '</div>';
		
		$('#page-header-'+page_id).html(page_header_content);
		$.ajax({
			url: app_domain + "content/agent/api-old-activation.php",
			method: "GET",
			data: data,
			success: function(html){
				$("#resultContent-"+page_id).html(html);	
			}
		});
	});
}

function PAGE_OLD_AGENT_ACTIVATION(){
	var page_id = "agent_account-activation-old-agent"; 
	
	var data = new Object();
	data['agent_id'] = $('#app_agent_id').val();
	data['session'] = $('#app_session').val();
	data['device_id'] = $('#app_device_id').val();
	data['type'] = "old";
	
	nav.pushPage(app_domain + "content/api-page.php?page="+page_id,
		{ animation: "slide", delay: 1 }
	).then(function(){
		var height = parseFloat($(window).height())-60;
		$('#resultContent-'+page_id).css("min-height",height+"px");
		
		var page_header_content  = '';
		page_header_content    	+= '<ons-icon icon="fa-chevron-left" style="position:absolute; left:15px; line-height:60px !important; font-size:30px;z-index: 9999999999 !important; border-radius:0px; color:#fff;" onClick="onsen_pop_page();"></ons-icon>';
		page_header_content 	+= '<div style="position:absolute;z-index:9999;font-weight:700;line-height:60px;font-size:20px;text-align:center; width:100%;left:0px;">';
		page_header_content     += 'First Time Login';
		page_header_content    	+= '</div>';
		
		$('#page-header-'+page_id).html(page_header_content);
		$.ajax({
			url: app_domain + "content/agent/api-old-activation.php",
			method: "GET",
			data: data,
			success: function(html){
				$("#resultContent-"+page_id).html(html);	
			}
		});
	});
}

function PAGE_HOME(){
	$('#modalLoading').show();
	
	var data = new Object();
	data['agent_id'] = $('#app_agent_id').val();
	data['session'] = $('#app_session').val();
	data['device_id'] = $('#app_device_id').val();
		
	$.ajax({
		url: app_domain + "api/agent/auto_login.php",
		method: "GET",
		data: data,
		success: function(response){
			var data = $.parseJSON(response);

			if(data["status"] == "success"){
				if(data["data"]["id"]){		
					$("#app_ranking_id").val(data["data"]["ranking_id"]);
					
					nav.resetToPage("home.html",
						{ animation: "fade" }
					).then(function(){					
						if(data["data"]["name"]){
							$('#menu-profile-name').html(data["data"]["name"]);
						}

						if(data["data"]["cover_photo"]){
							$('.menu-profile-icon').attr("src", data["data"]["cover_photo"]);
							$(".page-left-home").append('<img class="menu-profile-icon" src="' + data["data"]["cover_photo"] + '" height="44" width="44" style="margin-top:8px;margin-left:5px;border-radius:50%;border:1px solid #fff;" onClick="MENU_OPEN();">');
						}

						var membership_status = "";

						if(data["data"]["new_member"] == 0){
							if(data["data"]["status"] == 9){
								switch(data["data"]["subscription"]["status"]){
									case 1 : membership_status = '<span style="color: blue;">(PENDING APPROVAL)</span>'; break;
									case 3 : membership_status = '<span style="color: orange;">(MEMBERSHIP EXPIRED)</span>'; break;
									default : membership_status = '<span style="color: red;">(PENDING PAYMENT)</span>'; break;
								}
							}else{ 
								if(data["data"]["subscription"]["status"] == 1){
									switch(data["data"]["status"]){
										case 0 : membership_status = '<span style="color: red;">(TERMINATED)</span>'; break;
										case 1 : membership_status = '<span style="color: green;">(ACTIVE)</span>'; break;
										case 2 : membership_status = '<span style="color: red;">(APPLICATION REJECTED)</span>'; break;
									}
								}else{
									membership_status = '<span style="color: orange;">(MEMBERSHIP EXPIRED)</span>';
								}
							}
						}else{ 
							if(data["data"]["status"] == 9){		
								membership_status = '<span style="color: blue;">(PENDING APPROVAL)</span>';
							}else if(data["data"]["status"] == 2){
								membership_status = '<span style="color: red;">(APPLICATION REJECTED)</span>';
							}else{
								if(data["data"]["subscription"]["status"] == 1){
									switch(data["data"]["status"]){
										case 0 : membership_status = '<span style="color: red;">(TERMINATED)</span>'; break;
										case 1 : membership_status = '<span style="color: green;">(ACTIVE)</span>'; break;
										case 2 : membership_status = '<span style="color: red;">(APPLICATION REJECTED)</span>'; break;
									}
								}else{
									membership_status = '<span style="color: orange;">(MEMBERSHIP EXPIRED)</span>';
								}
							}
						}

						$("#menu-profile-status").html(membership_status);
						
						$.ajax({
							url: app_domain + "content/banner/api-list.php",
							method: "GET",
							success: function(banner_html){
								$("#homepage-banner-div").html(banner_html);	
							}
						});
		
						$.ajax({
							url: app_domain + "content/event/api-list.php",
							method: "GET",
							success: function(course_html){
								$("#homepage-event-div").html(course_html);	
							}
						});
		
						$.ajax({
							url: app_domain + "content/course/api-list.php",
							method: "GET",
							success: function(course_html){
								$("#homepage-course-div").html(course_html);	
							}
						});

						REFRESH_HOME_ICON_NOTIFICATION();

						setInterval(function(){ 
							REFRESH_HOME_ICON_NOTIFICATION();
						}, 10000);

						load_lang_pack("EN");

						if(data["data"]["status"] == "0"){
							ons.notification.alert("Your account has been deactivated due to outstanding payment. Please clear the outstanding to activate your account.");
						}
					});
				}else{
					ons.notification.alert("Session Expired");
					PAGE_LANDING();
				}
			}else{
				ons.notification.alert("Session Expired");
				PAGE_LANDING();
			}
			$('#modalLoading').fadeOut();
		}
	});
}

function REFRESH_HOME_ICON_NOTIFICATION(){
	var param = new Object();
	param["agent_id"] = $("#app_agent_id").val();
	param["device_id"] = $("#app_device_id").val();
	param["session"] = $("#app_session").val();
	param["ranking_id"] = $("#app_ranking_id").val();

	$.ajax({
		url: app_domain + "api/icon_notification.php",
		method: "GET",
		data: param,
		success: function(response){
			var data = $.parseJSON(response);
			
			$(".notification-inbox").hide();
			$(".notification-bulletin").hide();
			$(".notification-application").hide();
			$(".notification-ticket").hide();
			$(".notification-activity").hide();

			if(data["status"] == "success"){
				if(parseInt(data["data"]["inbox"]) > 0){
					$(".notification-inbox").html(data["data"]["inbox"]);
					$(".notification-inbox").show();
				}

				if(parseInt(data["data"]["bulletin"]) > 0){
					$(".notification-bulletin").html(data["data"]["bulletin"]);
					$(".notification-bulletin").show();
				}

				if(parseInt(data["data"]["application"]) > 0){
					$(".notification-application").html(data["data"]["application"]);
					$(".notification-application").show();
				}

				if(parseInt(data["data"]["ticket"]) > 0){
					$(".notification-ticket").html(data["data"]["ticket"]);
					$(".notification-ticket").show();
				}

				if(parseInt(data["data"]["activity"]) > 0){
					$(".notification-activity").html(data["data"]["activity"]);
					$(".notification-activity").show();
				}
			}									
		}
	});
}

function PAGE_PROFILE(){
	var page_id = "agent_profile";
	 
	var data = new Object();
	data['agent_id'] = $('#app_agent_id').val();
	data['session'] = $('#app_session').val();
	data['device_id'] = $('#app_device_id').val();
	
	MENU_CLOSE();
	nav.pushPage(app_domain + "content/api-page.php?page="+page_id,
		{ animation: "slide", delay: 1 }
	).then(function(){
		var height = parseFloat($(window).height())-60;
		$('#resultContent-'+page_id).css("min-height",height+"px");
		
		var page_header_content  = '';
		page_header_content    	+= '<ons-icon icon="fa-chevron-left" style="position:absolute; left:15px; line-height:60px !important; font-size:30px;z-index: 9999999999 !important; border-radius:0px; color:#fff;" onClick="onsen_pop_page();"></ons-icon>';
		page_header_content 	+= '<div style="position:absolute;z-index:9999;font-weight:700;line-height:60px;font-size:20px;text-align:center; width:100%;left:0px;">';
		page_header_content     += 'My Profile';
		page_header_content    	+= '</div>';
		
		$('#page-header-'+page_id).html(page_header_content);
		$.ajax({
			url: app_domain + "content/agent/api-profile.php",
			method: "GET",
			data: data,
			success: function(html){
				$("#resultContent-"+page_id).html(html);	
			}
		});
	});
}

function PAGE_BULLENTIN_LIST(){
	var page_id = "announcement_list";
	
	MENU_CLOSE();
	nav.pushPage(app_domain + "content/api-page.php?page="+page_id,
		{ animation: "slide", delay: 1 }
	).then(function(){
		var height = parseFloat($(window).height())-60;
		$('#resultContent-'+page_id).css("min-height",height+"px");
		
		var page_header_content  = '';
		page_header_content    	+= '<ons-icon icon="fa-chevron-left" style="position:absolute; left:15px; line-height:60px !important; font-size:30px;z-index: 9999999999 !important; border-radius:0px; color:#fff;" onClick="onsen_pop_page();"></ons-icon>';
		page_header_content 	+= '<div style="position:absolute;z-index:9999;font-weight:700;line-height:60px;font-size:20px;text-align:center; width:100%;left:0px;">';
		page_header_content     += 'Bulletin';
		page_header_content    	+= '</div>';
		page_header_content    	+= '<ons-icon icon="fa-filter" style="position:absolute; right:15px; line-height:60px !important; font-size:22px;z-index: 9999999999 !important; border-radius:0px; color:#fff;" onClick="SHOW_FILTER();"></ons-icon>';
		
		$('#page-header-'+page_id).html(page_header_content);
		$.ajax({
			url: app_domain + "content/announcement/api-list.php",
			method: "GET",
			success: function(html){
				$("#resultContent-"+page_id).html(html);	
			}
		});
	});
}

function PAGE_BULLENTIN(attachment){
	window.open(attachment, "_blank");
}

function PAGE_INBOX_LIST(){
	var page_id = "inbox_list";
	
	var data = new Object();
	data['agent_id'] = $('#app_agent_id').val();
	data['session'] = $('#app_session').val();
	data['device_id'] = $('#app_device_id').val();
	
	MENU_CLOSE();
	nav.pushPage(app_domain + "content/api-page.php?page="+page_id,
		{ animation: "slide", delay: 1 }
	).then(function(){
		var height = parseFloat($(window).height())-60;
		$('#resultContent-'+page_id).css("min-height",height+"px");
		
		var page_header_content  = '';
		page_header_content    	+= '<ons-icon icon="fa-chevron-left" style="position:absolute; left:15px; line-height:60px !important; font-size:30px;z-index: 9999999999 !important; border-radius:0px; color:#fff;" onClick="onsen_pop_page();"></ons-icon>';
		page_header_content 	+= '<div style="position:absolute;z-index:9999;font-weight:700;line-height:60px;font-size:20px;text-align:center; width:100%;left:0px;">';
		page_header_content     += 'Inbox';
		page_header_content    	+= '</div>';
		
		$('#page-header-'+page_id).html(page_header_content);
		$.ajax({
			url: app_domain + "content/inbox/api-list.php",
			method: "GET",
			data: data,
			success: function(html){
				$("#resultContent-"+page_id).html(html);	
			}
		});
	});
}

function PAGE_INBOX(inbox_id){
	var page_id = "inbox_detail";
	
	var data = new Object();
	data['agent_id'] = $('#app_agent_id').val();
	data['session'] = $('#app_session').val();
	data['device_id'] = $('#app_device_id').val();
	data['id'] = inbox_id;
	
	MENU_CLOSE();
	nav.pushPage(app_domain + "content/api-page.php?page="+page_id,
		{ animation: "slide" }
	).then(function(){
		var height = parseFloat($(window).height())-60;
		$('#resultContent-'+page_id).css("min-height",height+"px");
		
		var page_header_content  = '';
		page_header_content    	+= '<ons-icon icon="fa-chevron-left" style="position:absolute; left:15px; line-height:60px !important; font-size:30px;z-index: 9999999999 !important; border-radius:0px; color:#fff;" onClick="onsen_pop_page();"></ons-icon>';
		page_header_content 	+= '<div style="position:absolute;z-index:9999;font-weight:700;line-height:60px;font-size:20px;text-align:center; width:100%;left:0px;">';
		page_header_content     += 'Inbox';
		page_header_content    	+= '</div>';
		
		$('#page-header-'+page_id).html(page_header_content);
		$.ajax({
			url: app_domain + "content/inbox/api-detail.php",
			method: "GET",
			data: data,
			success: function(html){
				$("#resultContent-"+page_id).html(html);	
			}
		});
	});
}

function PAGE_ACTIVITY_LIST(){
	var page_id = "booking_list";
	
	var data = new Object();
	data['agent_id'] = $('#app_agent_id').val();
	data['session'] = $('#app_session').val();
	data['device_id'] = $('#app_device_id').val();
	
	MENU_CLOSE();
	nav.pushPage(app_domain + "content/api-page.php?page="+page_id,
		{ animation: "slide", delay: 1 }
	).then(function(){
		var height = parseFloat($(window).height())-60;
		$('#resultContent-'+page_id).css("min-height",height+"px");
		
		var page_header_content  = '';
		page_header_content    	+= '<ons-icon icon="fa-chevron-left" style="position:absolute; left:15px; line-height:60px !important; font-size:30px;z-index: 9999999999 !important; border-radius:0px; color:#fff;" onClick="onsen_pop_page();"></ons-icon>';
		page_header_content 	+= '<div style="position:absolute;z-index:9999;font-weight:700;line-height:60px;font-size:20px;text-align:center; width:100%;left:0px;">';
		page_header_content     += 'Activity';
		page_header_content    	+= '</div>';
		
		$('#page-header-'+page_id).html(page_header_content);
		$.ajax({
			url: app_domain + "content/booking/api-list.php",
			method: "GET",
			data: data,
			success: function(html){
				$("#resultContent-"+page_id).html(html);	
			}
		});
	});
}

function PAGE_ACTIVITY(activity_id,activity_type){
	var page_id = "booking_detail"; 
	var data = new Object();
	data['agent_id'] = $('#app_agent_id').val();
	data['session'] = $('#app_session').val();
	data['device_id'] = $('#app_device_id').val();
	data['id'] = activity_id;
	data['type'] = activity_type;
	
	nav.pushPage(app_domain + "content/api-page.php?page="+page_id,
		{ animation: "slide", delay: 1 }
	).then(function(){
		var height = parseFloat($(window).height())-60;
		$('#resultContent-'+page_id).css("min-height",height+"px");
		
		var page_header_content  = '';
		page_header_content    	+= '<ons-icon icon="fa-chevron-left" style="position:absolute; left:15px; line-height:60px !important; font-size:30px;z-index: 9999999999 !important; border-radius:0px; color:#fff;" onClick="onsen_pop_page();"></ons-icon>';
		
		$('#page-header-'+page_id).html(page_header_content);
		$.ajax({
			url: app_domain + "content/booking/api-detail.php",
			method: "GET",
			data: data,
			success: function(html){
				$("#resultContent-"+page_id).html(html);	
			}
		});
	});
}

function PAGE_TICKET_LIST(){
	var page_id = "ticket_list";
	
	var data = new Object();
	data['agent_id'] = $('#app_agent_id').val();
	data['session'] = $('#app_session').val();
	data['device_id'] = $('#app_device_id').val();
	
	MENU_CLOSE();
	nav.pushPage(app_domain + "content/api-page.php?page="+page_id,
		{ animation: "slide", delay: 1 }
	).then(function(){
		var height = parseFloat($(window).height())-60;
		$('#resultContent-'+page_id).css("min-height",height+"px");
		
		var page_header_content  = '';
		page_header_content    	+= '<ons-icon icon="fa-chevron-left" style="position:absolute; left:15px; line-height:60px !important; font-size:30px;z-index: 9999999999 !important; border-radius:0px; color:#fff;" onClick="onsen_pop_page();"></ons-icon>';
		page_header_content 	+= '<div style="position:absolute;z-index:9999;font-weight:700;line-height:60px;font-size:20px;text-align:center; width:100%;left:0px;">';
		page_header_content     += 'Ticket';
		page_header_content    	+= '</div>';
		
		$('#page-header-'+page_id).html(page_header_content);
		$.ajax({
			url: app_domain + "content/ticket/api-list.php",
			method: "GET",
			data: data,
			success: function(html){
				$("#resultContent-"+page_id).html(html);	
			}
		});
	});
}

function PAGE_TICKET(id, type){
	var page_id = "ticket_detail"; 
	var data = new Object();
	data['agent_id'] = $('#app_agent_id').val();
	data['session'] = $('#app_session').val();
	data['device_id'] = $('#app_device_id').val();
	data['id'] = id;
	data['type'] = type;
	
	nav.pushPage(app_domain + "content/api-page.php?page="+page_id,
		{ animation: "slide", delay: 1 }
	).then(function(){
		var height = parseFloat($(window).height())-60;
		$('#resultContent-'+page_id).css("min-height",height+"px");
		
		var page_header_content  = '';
		page_header_content    	+= '<ons-icon icon="fa-chevron-left" style="position:absolute; left:15px; line-height:60px !important; font-size:30px;z-index: 9999999999 !important; border-radius:0px; color:#fff;" onClick="onsen_pop_page();"></ons-icon>';
		
		$('#page-header-'+page_id).html(page_header_content);
		$.ajax({
			url: app_domain + "content/ticket/api-detail.php",
			method: "GET",
			data: data,
			success: function(html){
				$("#resultContent-"+page_id).html(html);	
			}
		});
	});
}

function PAGE_APPLICATION_LIST(){
	var page_id = "application_list";
	
	var data = new Object();
	data['agent_id'] = $('#app_agent_id').val();
	data['session'] = $('#app_session').val();
	data['device_id'] = $('#app_device_id').val();
	
	MENU_CLOSE();
	nav.pushPage(app_domain + "content/api-page.php?page="+page_id,
		{ animation: "slide", delay: 1 }
	).then(function(){
		var height = parseFloat($(window).height())-60;
		$('#resultContent-'+page_id).css("min-height",height+"px");
		
		var page_header_content  = '';
		page_header_content    	+= '<ons-icon icon="fa-chevron-left" style="position:absolute; left:15px; line-height:60px !important; font-size:30px;z-index: 9999999999 !important; border-radius:0px; color:#fff;" onClick="onsen_pop_page();"></ons-icon>';
		page_header_content 	+= '<div style="position:absolute;z-index:9999;font-weight:700;line-height:60px;font-size:20px;text-align:center; width:100%;left:0px;">';
		page_header_content     += 'Awardees';
		page_header_content    	+= '</div>';
		
		$('#page-header-'+page_id).html(page_header_content);
		$.ajax({
			url: app_domain + "content/application/api-list.php",
			method: "GET",
			data: data,
			success: function(html){
				$("#resultContent-"+page_id).html(html);	
			}
		});
	});
}
function PAGE_APPLICATION(id){
	var page_id = "application-info";
	
	var data = new Object();
	data['agent_id'] = $('#app_agent_id').val();
	data['session'] = $('#app_session').val();
	data['device_id'] = $('#app_device_id').val();
	data['id'] = id;
	
	MENU_CLOSE();
	nav.pushPage(app_domain + "content/api-page.php?page="+page_id,
		{ animation: "slide" }
	).then(function(){
		var height = parseFloat($(window).height())-60;
		$('#resultContent-'+page_id).css("min-height",height+"px");
		
		var page_header_content  = '';
		page_header_content    	+= '<ons-icon icon="fa-chevron-left" style="position:absolute; left:15px; line-height:60px !important; font-size:30px;z-index: 9999999999 !important; border-radius:0px; color:#fff;" onClick="onsen_pop_page();"></ons-icon>';
		page_header_content 	+= '<div style="position:absolute;z-index:9999;font-weight:700;line-height:60px;font-size:20px;text-align:center; width:100%;left:0px;">';
		page_header_content     += 'Awardees';
		page_header_content    	+= '</div>';
		
		$('#page-header-'+page_id).html(page_header_content);
		$.ajax({
			url: app_domain + "content/application/api-detail.php",
			method: "GET",
			data: data,
			success: function(html){
				$("#resultContent-"+page_id).html(html);	
			}
		});
	});
}

function PAGE_PRODUCTION(){
	var page_id = "production_index";
	
	var data = new Object();
	data['agent_id'] = $('#app_agent_id').val();
	data['session'] = $('#app_session').val();
	data['device_id'] = $('#app_device_id').val();
	
	MENU_CLOSE();
	nav.pushPage(app_domain + "content/api-page.php?page="+page_id,
		{ animation: "slide", delay: 1 }
	).then(function(){
		var height = parseFloat($(window).height())-60;
		$('#resultContent-'+page_id).css("min-height",height+"px");
		
		var page_header_content  = '';
		page_header_content    	+= '<ons-icon icon="fa-chevron-left" style="position:absolute; left:15px; line-height:60px !important; font-size:30px;z-index: 9999999999 !important; border-radius:0px; color:#fff;" onClick="onsen_pop_page();"></ons-icon>';
		
		page_header_content 	+= '<div style="position:absolute;z-index:9999;font-weight:700;line-height:60px;font-size:20px;text-align:center; width:100%;left:0px;">';
		page_header_content     += 'My Production';
		page_header_content    	+= '</div>';
		
		$('#page-header-'+page_id).html(page_header_content);
		$.ajax({
			url: app_domain + "content/production/api-index.php",
			method: "GET",
			success: function(html){
				$("#resultContent-"+page_id).html(html);	
			}
		});
	});
}

function PAGE_EVENT(id){
	var page_id = "event_detail";
	
	var data = new Object();
	data['agent_id'] = $('#app_agent_id').val();
	data['session'] = $('#app_session').val();
	data['device_id'] = $('#app_device_id').val();
	data['id'] = id;
	
	MENU_CLOSE();

	nav.pushPage(app_domain + "content/api-page.php?page="+page_id,
		{ animation: "slide" }
	).then(function(){
		var height = parseFloat($(window).height())-60;
		$('#resultContent-'+page_id).css("min-height",height+"px");
		
		var page_header_content  = '';
		page_header_content    	+= '<ons-icon icon="fa-chevron-left" style="position:absolute; left:15px; line-height:60px !important; font-size:30px;z-index: 9999999999 !important; border-radius:0px; color:#fff;" onClick="onsen_pop_page();"></ons-icon>';
		
		page_header_content 	+= '<div style="position:absolute;z-index:9999;font-weight:700;line-height:60px;font-size:20px;text-align:center; width:100%;left:0px;">';
		page_header_content     += 'Event';
		page_header_content    	+= '</div>';
		
		$('#page-header-'+page_id).html(page_header_content);
		
		$.ajax({
			url: app_domain + "content/event/api-detail.php",
			method: "GET",
			data: data,
			success: function(html){
				$("#resultContent-"+page_id).html(html);	
			}
		});
	});
}

function PAGE_COURSE(id){
	var page_id = "course_detail";
	
	var data = new Object();
	data['agent_id'] = $('#app_agent_id').val();
	data['session'] = $('#app_session').val();
	data['device_id'] = $('#app_device_id').val();
	data['id'] = id;
	
	MENU_CLOSE();
	nav.pushPage(app_domain + "content/api-page.php?page="+page_id,
		{ animation: "slide" }
	).then(function(){
		var height = parseFloat($(window).height())-60;
		$('#resultContent-'+page_id).css("min-height",height+"px");
		
		var page_header_content  = '';
		page_header_content    	+= '<ons-icon icon="fa-chevron-left" style="position:absolute; left:15px; line-height:60px !important; font-size:30px;z-index: 9999999999 !important; border-radius:0px; color:#fff;" onClick="onsen_pop_page();"></ons-icon>';
		
		page_header_content 	+= '<div style="position:absolute;z-index:9999;font-weight:700;line-height:60px;font-size:20px;text-align:center; width:100%;left:0px;">';
		page_header_content     += 'Course';
		page_header_content    	+= '</div>';
		
		$('#page-header-'+page_id).html(page_header_content);
		$.ajax({
			url: app_domain + "content/course/api-detail.php",
			method: "GET",
			data: data,
			success: function(html){
				$("#resultContent-"+page_id).html(html);	
			}
		});
	});
}


function PAGE_CHANGE_PASSWORD(){
	var page_id = "agent_change-password";
	
	var data = new Object();
	data['agent_id'] = $('#app_agent_id').val();
	data['session'] = $('#app_session').val();
	data['device_id'] = $('#app_device_id').val();
	
	MENU_CLOSE();
	nav.pushPage(app_domain + "content/api-page.php?page="+page_id,
		{ animation: "slide" }
	).then(function(){
		
		var height = parseFloat($(window).height())-60;
		$('#resultContent-'+page_id).css("min-height",height+"px");
		
		var page_header_content  = '';

		page_header_content    	+= '<ons-icon icon="fa-chevron-left" style="position:absolute; left:15px; line-height:60px !important; font-size:30px;z-index: 9999999999 !important; border-radius:0px; color:#fff;" onClick="onsen_pop_page();"></ons-icon>';

		page_header_content 	+= '<div style="position:absolute;z-index:9999;font-weight:700;line-height:60px;font-size:20px;text-align:center; width:100%;left:0px;">';
		page_header_content     += 'Change Password';
		page_header_content    	+= '</div>';

		$('#page-header-'+page_id).html(page_header_content);
		$.ajax({
			url: app_domain + "content/agent/api-change-password.php",
			method: "GET",
			data: data,
			success: function(html){
				$("#resultContent-"+page_id).html(html);	
			}
		});
	});
}

function PAGE_ABOUT_SG(){	
	/*nav.pushPage("about-us.html",
		{ animation: "slide" }
	).then(function(){
		MENU_CLOSE();
	});*/

	MENU_CLOSE();

	var page_id = "about-sg";	

	nav.pushPage(app_domain + "content/api-page.php?page="+page_id,
		{ animation: "slide", delay: 1 }
	).then(function(){
		var height = parseFloat($(window).height())-60;
		$('#resultContent-'+page_id).css("min-height",height+"px");
		
		var page_header_content  = '';

		page_header_content    	+= '<ons-icon icon="fa-chevron-left" style="position:absolute; left:15px; line-height:60px !important; font-size:30px;z-index: 9999999999 !important; border-radius:0px; color:#fff;" onClick="onsen_pop_page();"></ons-icon>';

		page_header_content 	+= '<div style="position:absolute;z-index:9999;font-weight:700;line-height:60px;font-size:20px;text-align:center; width:100%;left:0px;">';
		page_header_content     += 'About SG';
		page_header_content    	+= '</div>';

		$('#page-header-'+page_id).html(page_header_content);
		$.ajax({
			url: app_domain + "content/general/api-about-sg.php",
			method: "GET",
			success: function(html){
				$("#resultContent-"+page_id).html(html);	
			}
		});
	});		
}
function PAGE_WHY_SG(){
	/*
	MENU_CLOSE();
	nav.pushPage("why-sg.html",
		{ animation: "slide" }
	).then(function(){
	});
	*/

	MENU_CLOSE();

	var page_id = "why-sg";	

	nav.pushPage(app_domain + "content/api-page.php?page="+page_id,
		{ animation: "slide", delay: 1 }
	).then(function(){
		var height = parseFloat($(window).height())-60;
		$('#resultContent-'+page_id).css("min-height",height+"px");
		
		var page_header_content  = '';

		page_header_content    	+= '<ons-icon icon="fa-chevron-left" style="position:absolute; left:15px; line-height:60px !important; font-size:30px;z-index: 9999999999 !important; border-radius:0px; color:#fff;" onClick="onsen_pop_page();"></ons-icon>';

		page_header_content 	+= '<div style="position:absolute;z-index:9999;font-weight:700;line-height:60px;font-size:20px;text-align:center; width:100%;left:0px;">';
		page_header_content     += 'Why SG';
		page_header_content    	+= '</div>';

		$('#page-header-'+page_id).html(page_header_content);
		$.ajax({
			url: app_domain + "content/general/api-why-sg.php",
			method: "GET",
			success: function(html){
				$("#resultContent-"+page_id).html(html);	
			}
		});
	});	
}
function PAGE_REFUND_POLICY(){
	MENU_CLOSE();

	/*
	nav.pushPage("refund-policy.html",
		{ animation: "slide" }
	).then(function(){
	});

	*/

	var page_id = "refund-policy";	

	nav.pushPage(app_domain + "content/api-page.php?page="+page_id,
		{ animation: "slide", delay: 1 }
	).then(function(){
		var height = parseFloat($(window).height())-60;
		$('#resultContent-'+page_id).css("min-height",height+"px");
		
		var page_header_content  = '';

		page_header_content    	+= '<ons-icon icon="fa-chevron-left" style="position:absolute; left:15px; line-height:60px !important; font-size:30px;z-index: 9999999999 !important; border-radius:0px; color:#fff;" onClick="onsen_pop_page();"></ons-icon>';

		page_header_content 	+= '<div style="position:absolute;z-index:9999;font-weight:700;line-height:60px;font-size:20px;text-align:center; width:100%;left:0px;">';
		page_header_content     += 'Refund Policy';
		page_header_content    	+= '</div>';

		$('#page-header-'+page_id).html(page_header_content);
		$.ajax({
			url: app_domain + "content/general/api-refund-policy.php",
			method: "GET",
			success: function(html){
				$("#resultContent-"+page_id).html(html);	
			}
		});
	});		
}
function PAGE_SG_NETWORK(){
	var page_id = "sg-network";
	
	MENU_CLOSE();
	nav.pushPage(app_domain + "content/api-page.php?page="+page_id,
		{ animation: "slide", delay: 1 }
	).then(function(){
		var height = parseFloat($(window).height())-60;
		$('#resultContent-'+page_id).css("min-height",height+"px");
		
		var page_header_content  = '';

		page_header_content    	+= '<ons-icon icon="fa-chevron-left" style="position:absolute; left:15px; line-height:60px !important; font-size:30px;z-index: 9999999999 !important; border-radius:0px; color:#fff;" onClick="onsen_pop_page();"></ons-icon>';

		page_header_content 	+= '<div style="position:absolute;z-index:9999;font-weight:700;line-height:60px;font-size:20px;text-align:center; width:100%;left:0px;">';
		page_header_content     += 'SG Network';
		page_header_content    	+= '</div>';

		$('#page-header-'+page_id).html(page_header_content);
		$.ajax({
			url: app_domain + "content/general/api-sg-network.php",
			method: "GET",
			success: function(html){
				$("#resultContent-"+page_id).html(html);	
			}
		});
	});
}

function WINDOW_OPEN(url,title){
	if(window.parent.ReactNativeWebView){
		window.parent.ReactNativeWebView.postMessage(JSON.stringify({
			action: "windowopen="+encodeURI(url)+"@+@"+encodeURI(title)
		}));
	}
}