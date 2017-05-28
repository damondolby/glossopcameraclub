
$(document).keydown(function(e) {
	
    if (img_idx <= -1)
	return;
    if(e.keyCode == 37){
	     prevImg();
    }
    else if(e.keyCode == 39){
	     nextImg();
    }
});

var cat_name, days_per_cat;
var img_idx = -1;
var popup_initialised = false;

function init_popup(){
	popup_initialised = true;
	$( "#popup" ).dialog({		    
		    
	      autoOpen: false,			
		modal: true,
		resizable: false,
		height: $(window).height(),
		width: $(window).width()
	    });
	    
	    $('#popup').on('dialogclose', function(event) {
		img_idx = -1;
	 });
}

function showPopUp(idx){
	img_idx = idx;	

	if (!popup_initialised){
		init_popup();
	}
	    
	$("#popup").dialog('open');
	showImg();
}

function prevImg(){
	img_idx = img_idx - 1;
	if (img_idx < 0)
		img_idx = photo_cache[current_cache].length-1;
	
	showImg();
}

function nextImg(){
	img_idx = img_idx + 1;
	
	if (img_idx > photo_cache[current_cache].length-1)
		img_idx = 0;
	
	showImg();
}

function showImg(){		
	
	var item = photo_cache[current_cache][img_idx];
	var imgSrc = "http://farm2.staticflickr.com/" + item.server + "/" + item.id + "_" + item.secret + ".jpg";	
	var link = "http://www.flickr.com/photos/" + item.owner + "/" + item.id + "/";
	
	$("#popup #flickrlink").attr("href", link);
	$("#popup span.desc").text(item.title);
	$("#popup img").attr("src", imgSrc);
	
	    
}

/*
function closePopUp(){
	$("#popup").hide();
	img_idx = -1;
	//$("body").css("background-color", "white");
}*/

var photo_cache = {};
//var images;
var over = false;
var current_cache;

//Cache calls from this client for 15 mins
setInterval(function(){ photo_cache = {}; }, 900000);

function getPhotos(calls, cacheKey){		
	//var topicid = $('#topics option:selected').val();	
	current_cache = cacheKey;
	
	if (!photo_cache[cacheKey]){
		var arr = photo_cache[cacheKey]= [];
		//images = [];
		
		//Info
		//https://www.flickr.com/services/api/flickr.photos.search.html
		
		//Glossop Camera Club Account
		//var url = "https://api.flickr.com/services/rest/?per_page=20&format=json&method=flickr.photos.search&user_id=139185935@N04&sort=date-taken-desc&api_key=b9b545d8e702dd0aaefe231a06b1ce46&tags=" + tags;
		/*var url = constructFlickrRestURL(20, null, '139185935@N04', tags);
		callURL(url, arr);
		
		//Glossop Camera Club Group
		//var url2 = "https://api.flickr.com/services/rest/?per_page=20&format=json&method=flickr.photos.search&group_id=1959874@N20&sort=date-taken-desc&api_key=b9b545d8e702dd0aaefe231a06b1ce46&extras=owner_name&tag_mode=all&tags=" + cat_name + "," + tags;
		var url2 = constructFlickrRestURL(20, '1959874@N20', null, cat_name + "," + tags);
		callURL(url2, arr);*/
		
		$.each(calls, function(i,item){
			callURL(item, arr);
		});
	}
	else
		renderHTML(photo_cache[cacheKey]);
}

function constructFlickrRestURL(pages, groupID, userID, tags){
	var url = "https://api.flickr.com/services/rest/?format=json&method=flickr.photos.search&sort=date-taken-desc&api_key=b9b545d8e702dd0aaefe231a06b1ce46&extras=owner_name";
	
	if (pages)
		url = url + "&per_page=" + pages;
	
	if (groupID)
		url = url + "&group_id=" + groupID;
	
	if (userID)
		url = url + "&user_id=" + userID;
	
	if (tags)
		url = url + "&tag_mode=all&tags=" + tags;
	
	return url;
}

function getRecentClubPhotos(noOfPics){
	var url = "https://api.flickr.com/services/rest/?per_page=" + noOfPics + "&format=json&method=flickr.photos.search&group_id=1959874@N20&sort=date-taken-desc&api_key=b9b545d8e702dd0aaefe231a06b1ce46&tag_mode=all"
	current_cache = url;
	if (!photo_cache[url]){
		var arr = photo_cache[url]= [];
		callURL(url, arr);
	}
}

function callURL(url, arr){
	$.getJSON(url + "&jsoncallback=?", function(data){
	    arr.push.apply(arr, data.photos.photo)	
	    renderHTML(arr);
	});
}

function renderHTML(arr){
	$( "#gallery" ).empty();
	
	if (arr.length == 0){
		$( "#gallery" ).append( $("<div class='regMsg'>No photos yet!</div>" ) );
	}
	
	var perRow = 4;
	
	$.each(arr, function(i,item){
		
		if (i % perRow == 0){
			
			if (i > 0){
				$( "#gallery" ).append( $('</div>' ) );
			}
			
			$( "#gallery" ).append( $('<div class="row">' ) );
			
		}
		
		var title = item.title;
		var img = "http://farm2.staticflickr.com/" + item.server + "/" + item.id + "_" + item.secret + "_m.jpg";
		
		var html2 = '<div class="img">';
		html2 = html2 + '<a href="javascript:showPopUp(' + i + ')">';
		html2 = html2 + '<img src="' + img + '" alt="' + title	 + '">';
		html2 = html2 + '</a>';
		html2 = html2 + '<div class="desc">' + title + " (by " + item.ownername + ')</div>';
		html2 = html2 + '</div>';
		$( "#gallery" ).append( $(html2 ) );
	});
	
	$( "#gallery" ).append( $('</div>' ) );
}

function loadTopicsDropDown(topics){
	
	for(var i = 0; i < topics.length; i++) {
		
		if (typeof topics[i] === 'object'){
			var id = topics[i].id;
			var text = topics[i].name;
		}
		else {
			var id = i;
			var text = topics[i];
		}
		
	    $('#topics').append($('<option>', {
		    value: id,
		    text: text
		}));
	}
	
	var week = getWeekOfYear();
	
	if (week > 0)
		week = week-1;
	
	$('#topics option')[week].selected = true;
}

function getPhotosWithTags(){
	var tags = $('#topics :selected').text();
        tags = tags.replace(" ", ","); 
	tags = tags.replace("&", ""); 
        tags = tags.replace("of", ""); 
	//console.log(tags);
	
	var gccUser = constructFlickrRestURL(20, null, '139185935@N04', cat_name + "," +tags);
	var gccGroup = constructFlickrRestURL(20, '1959874@N20', null, cat_name + "," + tags);
	
	var calls = [gccUser, gccGroup];
	var cacheKey = $('#topics option:selected').val();
	getPhotos(calls, cacheKey);
}

function getWeekOfYear () {
	var date = new Date();
        var target = new Date(date.valueOf()),
            dayNumber = (date.getUTCDay() + 6) % 7,
            firstThursday;

        target.setUTCDate(target.getUTCDate() - dayNumber + 3);
        firstThursday = target.valueOf();
        target.setUTCMonth(0, 1);

        if (target.getUTCDay() !== 4) {
            target.setUTCMonth(0, 1 + ((4 - target.getUTCDay()) + 7) % 7);
	}

        return Math.ceil((firstThursday - target) /  (days_per_cat * 24 * 3600 * 1000));
}