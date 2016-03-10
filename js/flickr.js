$(document).ready(function(){
   loadTopicsDropDown();
   getPhotosWithTags();   
	$("#popup").hide();
});

function overImg(imgIdx){
		
	//$("#popupParis").popup('open');
		
	var topicid = $('#topics option:selected').val();	
	var item = photo_cache[topicid][imgIdx];
	var imgSrc = "http://farm2.staticflickr.com/" + item.server + "/" + item.id + "_" + item.secret + ".jpg";	
	var link = "http://www.flickr.com/photos/" + item.owner + "/" + item.id + "/";
	
	$("#popup #flickrlink").attr("href", link);
	$("#popup span.desc").text(item.title);
	$("#popup img").attr("src", imgSrc);
	//$("#popup").popup('open');	
	$("#popup").show();	
	//$("body").css("background-color", "grey");
	//$(".container").css("background-color", "blue");
	//http://stackoverflow.com/questions/5533171/fade-background-image-in-and-out-with-jquery
}

function closePopUp(){
	$("#popup").hide();
	//$("body").css("background-color", "white");
}

var photo_cache = {};
//var images;
var over = false;

//Cache calls from this client for 15 mins
setInterval(function(){ photo_cache = {}; }, 900000);

function getPhotos(tags){		
	var topicid = $('#topics option:selected').val();	
	
	if (!photo_cache[topicid]){
		var arr = photo_cache[topicid]= [];
		//images = [];
		
		//Info
		//https://www.flickr.com/services/api/flickr.photos.search.html
		
		//Glossop Camera Club Account
		var url = "https://api.flickr.com/services/rest/?per_page=20&format=json&method=flickr.photos.search&user_id=139185935@N04&sort=date-taken-desc&api_key=b9b545d8e702dd0aaefe231a06b1ce46&tags=" + tags;
		callURL(url, arr);
		
		//Glossop Camera Club Group
		var url2 = "https://api.flickr.com/services/rest/?per_page=20&format=json&method=flickr.photos.search&group_id=1959874@N20&sort=date-taken-desc&api_key=b9b545d8e702dd0aaefe231a06b1ce46&tag_mode=all&tags=p52," + tags;
		callURL(url2, arr);
	}
	
	renderHTML(photo_cache[topicid]);
}

function callURL(url, arr){
	//$.getJSON(url + "&format=json&jsoncallback=?", function(data){
	$.getJSON(url + "&jsoncallback=?", function(data){
	//$.getJSON(url, function(data){
	    //images = data.photos.photo;
	    //var arrayStart = arr.length;
	    arr.push.apply(arr, data.photos.photo)	
	    renderHTML(arr);
	});
}

function renderHTML(arr){
	$( "#gallery ul" ).empty();
	$.each(arr, function(i,item){
		var title = item.title;
		var img = "http://farm2.staticflickr.com/" + item.server + "/" + item.id + "_" + item.secret + "_m.jpg";
		//var img = item.media.m;
		var html = '<li><a href="javascript:overImg(' + i + ')" data-rel="popup" data-position-to="window"  data-transition="fade"><img src="'+ img +'"  class="popphoto" /></a></li>' ;
		$( "#gallery ul" ).append( $(html ) );			
	});
}

function loadTopicsDropDown(){
	var topics =  ["Time", "Your Everyday", "Out of Focus", "Shadows", "Morning", "Unbalanced", "Love", "Outtake", "Black & White", "Self-Portrait", "Texture", "Silhouette", "Technology", "Hidden", "Far Away", "Water", "Framed", "Sky", "Laughter", "Nature", "Family", "Light", "Movement", "Below", "Food", "Haze", "Patriotic", "Animal", "Long Exposure", "Colourful", "Music", "Soft", "Hot", "Structure", "Bokeh", "Pattern", "Remember", "Above", "Negative Space", "Reflection", "Button", "Fall", "Together", "Disguise", "Macro", "Chaos", "Thankful", "Hobby", "Cold", "Sleep", "Details", "Joy"];
	
	for(var i = 0; i < topics.length; i++) {
	    //Do things with things[i]
	    //$( "#topics" ).append($('<option>' + topics[i] + '</option>'));
	    $('#topics').append($('<option>', {
		    value: i,
		    text: topics[i]
		}));
	}
	
	var week = getWeekOfYear();
	$('#topics option')[week-1].selected = true;
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

        return Math.ceil((firstThursday - target) /  (7 * 24 * 3600 * 1000)) + 1;
}