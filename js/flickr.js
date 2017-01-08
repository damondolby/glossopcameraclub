
var cat_name, days_per_cat;

function overImg(imgIdx){
		
	var item = photo_cache[current_cache][imgIdx];
	var imgSrc = "http://farm2.staticflickr.com/" + item.server + "/" + item.id + "_" + item.secret + ".jpg";	
	var link = "http://www.flickr.com/photos/" + item.owner + "/" + item.id + "/";
	
	$("#popup #flickrlink").attr("href", link);
	$("#popup span.desc").text(item.title);
	$("#popup img").attr("src", imgSrc);
	
	    $( "#popup" ).dialog({
		    
		      //autoOpen: false,
		      show: {
			effect: "blind",
			duration: 1000
		      },		      
		
		modal: true,
		resizable: false,
		height: 600,
		width: 600
	    });
}

function closePopUp(){
	$("#popup").hide();
	//$("body").css("background-color", "white");
}

var photo_cache = {};
//var images;
var over = false;
var current_cache;

//Cache calls from this client for 15 mins
setInterval(function(){ photo_cache = {}; }, 900000);

function getPhotos(tags){		
	var topicid = $('#topics option:selected').val();	
	current_cache = topicid;
	
	if (!photo_cache[topicid]){
		var arr = photo_cache[topicid]= [];
		//images = [];
		
		//Info
		//https://www.flickr.com/services/api/flickr.photos.search.html
		
		//Glossop Camera Club Account
		var url = "https://api.flickr.com/services/rest/?per_page=20&format=json&method=flickr.photos.search&user_id=139185935@N04&sort=date-taken-desc&api_key=b9b545d8e702dd0aaefe231a06b1ce46&tags=" + tags;
		callURL(url, arr);
		
		//Glossop Camera Club Group
		var url2 = "https://api.flickr.com/services/rest/?per_page=20&format=json&method=flickr.photos.search&group_id=1959874@N20&sort=date-taken-desc&api_key=b9b545d8e702dd0aaefe231a06b1ce46&tag_mode=all&tags=" + cat_name + "," + tags;
		callURL(url2, arr);
	}
		
	//renderHTML(photo_cache[topicid]);
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
	
	$.each(arr, function(i,item){
		var title = item.title;
		var img = "http://farm2.staticflickr.com/" + item.server + "/" + item.id + "_" + item.secret + "_m.jpg";
		
		var html2 = '<div class="img">';
		html2 = html2 + '<a href="javascript:overImg(' + i + ')">';
		html2 = html2 + '<img src="' + img + '" alt="' + title	 + '" width="300" height="200">';
		html2 = html2 + '</a>';
		html2 = html2 + '<div class="desc">' + title + '</div>';
		html2 = html2 + '</div>';
		$( "#gallery" ).append( $(html2 ) );
	});
}

function loadTopicsDropDown(topics){
	
	for(var i = 0; i < topics.length; i++) {
	    $('#topics').append($('<option>', {
		    value: i,
		    text: topics[i]
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
	getPhotos(tags);
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