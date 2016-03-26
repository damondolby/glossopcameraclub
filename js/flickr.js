$.ajaxSetup({
    beforeSend:function(){
        // show gif here, eg:
        $("#loading").show();
    },
    complete:function(){
        // hide gif here, eg:
        $("#loading").hide();
    }
});


function overImg(imgIdx){
		
	//$("#popupParis").popup('open');
		
	//var topicid = $('#topics option:selected').val();	
	//var item = photo_cache[current_cache][imgIdx];
	var item = currently_displayed[imgIdx];
	var imgSrc = "http://farm2.staticflickr.com/" + item.server + "/" + item.id + "_" + item.secret + ".jpg";	
	var link = "http://www.flickr.com/photos/" + item.owner + "/" + item.id + "/";
	
	$("#popup #flickrlink").attr("href", link);
	$("#popup span.desc").text(item.title);
	$("#popup img").attr("src", imgSrc);
	//$("#popup").popup('open');	
	//$("#popup").show();	
	
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
	
	//$("body").css("background-color", "grey");
	//$(".container").css("background-color", "blue");
	//http://stackoverflow.com/questions/5533171/fade-background-image-in-and-out-with-jquery
}

function closePopUp(){
	$("#popup").hide();
	$("#popup #flickrlink").attr("href", '');
	$("#popup span.desc").text('');
	$("#popup img").attr("src", '');
	//$("body").css("background-color", "white");
}

var photo_cache = {};
//var images;
var over = false;
var current_cache;
var currently_displayed = [];

//Cache calls from this client for 15 mins
setInterval(function(){ photo_cache = {}; }, 900000);

/*function getPhotos(tags){		
	var topicid = $('#topics option:selected').val();	
	current_cache = topicid;
	
	if (!photo_cache[topicid]){
		var arr = photo_cache[topicid]= [];
		//images = [];
		
		//Info
		//https://www.flickr.com/services/api/flickr.photos.search.html
		
		//Glossop Camera Club Account
		//var url = "https://api.flickr.com/services/rest/?per_page=20&format=json&method=flickr.photos.search&user_id=139185935@N04&sort=date-taken-desc&api_key=b9b545d8e702dd0aaefe231a06b1ce46&tags=" + tags;
		var url = "https://api.flickr.com/services/rest/?per_page=20&format=json&method=flickr.photos.search&user_id=139185935@N04&sort=date-taken-desc&api_key=b9b545d8e702dd0aaefe231a06b1ce46&extras=tags";
		callURL(url, arr);
		
		//Glossop Camera Club Group
		var url2 = "https://api.flickr.com/services/rest/?per_page=20&format=json&method=flickr.photos.search&group_id=1959874@N20&sort=date-taken-desc&api_key=b9b545d8e702dd0aaefe231a06b1ce46&tag_mode=all&tags=p52&extras=tags";
		callURL(url2, arr);
	}
		
	renderHTML(photo_cache[topicid]);
}*/

function getRecentClubPhotos(noOfPics){
	var url = "https://api.flickr.com/services/rest/?per_page=" + noOfPics + "&format=json&method=flickr.photos.search&group_id=1959874@N20&sort=date-taken-desc&api_key=b9b545d8e702dd0aaefe231a06b1ce46&tag_mode=all"
	current_cache = url;
	if (!photo_cache[url]){
		var arr = photo_cache[url]= [];
		callURL(url, arr, renderHTML);
	}
	
}

function callURL(url, arr, callBack){
	
	/*$.getJSON(url + "&jsoncallback=?", function(data){		
	    arr.push.apply(arr, data.photos.photo)		    	
		callBack(arr);
	});*/	
	
	$.ajax({
	    type: 'GET',
	    //url: url + "&jsoncallback=?",
	    //url: url,
	    url: url + "&nojsoncallback=1",
	    dataType: 'json',
	    success: function(data){		
			    arr.push.apply(arr, data.photos.photo)		    	
				callBack(arr);
			},
	    data: {},
	    async: false
	});
	
}

function renderHTML(arr){
	$( "#gallery" ).empty();
	currently_displayed = arr;
	$.each(arr, function(i,item){
		var title = item.title;
		var img = "http://farm2.staticflickr.com/" + item.server + "/" + item.id + "_" + item.secret + "_m.jpg";
		//var img = item.media.m;
		//var html = '<li><a href="javascript:overImg(' + i + ')"><img src="'+ img +'"  class="popphoto" /></a></li>' ;
		//$( "#gallery ul" ).append( $(html ) );	
		/*$( "#gallery" ).append( $('<div/>', {
							    
							    text: 'testadfkja;kldsfja;kdjf'
							}
							 .attr('text', 'tadfasdfext'); )
						);	*/
		
		//$( "#gallery ul" ).append( $('<li>heyheyhey</li>') );
		
		/*$( "#gallery" ).append( $('<div/>', {
							class: 'img'}
								).append( $('<a/>', {
									href: 'xxx'}).append( $('<img>', {
										src: img})
									).append( $('<div/>', {
										class: 'desc',
										text: 'desc goes here'})
									))
						);*/
		
		var html2 = '<div class="img">';
		html2 = html2 + '<a href="javascript:overImg(' + i + ')">';
		html2 = html2 + '<img src="' + img + '" alt="' + title	 + '" width="300" height="200">';
		html2 = html2 + '</a>';
		html2 = html2 + '<div class="desc">' + title + '</div>';
		html2 = html2 + '</div>';
		$( "#gallery" ).append( $(html2 ) );

		/*
		
		*/
	});
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