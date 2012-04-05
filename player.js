/**
 * Plugin: VICI Viewer
 * 
 * Version: 1.0
 * (c) Copyright 2010-2011, Gazow
 * 
 * Description: javascript plugin for display of RSS feeds via Google Feed API
 * 						for manipulation into gallery style format
 *
 **/
 
 	var defaults = { 	
	path			: '',			// rss path
	id				: 'gallery',			// Title of each gallery
	display		  	: "gallery" ,			// type of album display- options: gallery, list, block
	containerID  	: "protege" ,			// id of element to append gallery to ex: <div id = 'protege'>	
	network  		: "facebook" ,			// source of photo album- options: facebook, picasa, deviantArt, etsy, flikr 

	rows 			: 1 ,					// number of thumbs tall.  format: number
	collumns 		: 6 ,					// number of thumbs wide.  format: number
	cellWidth  		: 50 ,					// how wide each thumb image is. format: number
	cellHeight  	: 50 ,					// how tall each thumb image is. format: number
	cellSpacing  	: 6 ,					// spacing between thumb images. format: number( must be larger than padding )
	cellPadding  	: 3 ,					// padding around each thumb image(for highlight). format: number
	cellHighlight	: "#FFFFFF" ,			// color to highlith thumbs on mouseover format: "#999999"
	


	grow  				: 1.25 ,			// resize image multiplier on mouseover
	maxImgSize 			: 540 ,				// max size of large image in default gallery
	tallSpacer  		: 10 ,				//optional gaps for main image - must be larger than image padding
	wideSpacer  		: 10 ,				//optional gaps for main image - must be larger than image padding
	imagePadding  		: 5 , 				//padding around large image viewer. format: number
	imagePaddingColor  	: "#FFFFFF" , 		//color of large image padding format: "#999999"

	header				: true,
	titlefontColor  	: "white" ,
	titlefontFamily  	: 'arial' ,


//========================================================================================================================
//--------------------Overriding these Variables may cause problems with the application----------------------------------
//========================================================================================================================
	limit: 100,			proxy: false,		date: false,		showerror: true,	errormsg: '',		ssl: '',	
	};
 
//=======================================================================
//------------------Do not edit these variables--------------------------
//=======================================================================	
var settings, gallerySize, cellNumber, rowNumber, colNumber, listTitle, id;
var currentGallery="albums", tableCount=0, currentTable=0, rowCount=0,currentImg=0; 
var hashRefresh=false, lightboxCheck = false;		
var hash, feeds, currentXml, xmlImages;
var xmlMedia=new Array(); var xmlTitle= new Array();
var entry, xmlType;
	
	
var	albumTitle;
var	albumLink;
var	thumbnailPath = new Array();
var	imgPath= new Array();
var	imgTitle= new Array();
var	imgLink= new Array();
	
	
	
	
	
//=======================================================================
//------------------Do not edit these variables--------------------------
//=======================================================================
function gallery(albumIndex){	//RunOnce
	$(document).keydown(function(event){arrowKey(event.keyCode);});	
	$.history.init(function(hash){
		        if(hash == ""){
					hashRefresh=true;
					getRssXml(albumIndex);
				}else{
		            getHash(hashRefresh);
				}
	},{ unescape: ",/&=" });
}

function getRssXml(albumIndex){
settings=$.extend({},defaults,customVars[parseInt(albumIndex)]);
 	rowNumber=settings.rows;
	colNumber=settings.collumns;
	cellNumber=rowNumber*colNumber;	
	currentGallery=settings.id;
	
    var api = "http"+ settings.ssl +"://ajax.googleapis.com/ajax/services/feed/load?v=1.0&callback=?&q=" + encodeURIComponent(settings.path);
            if (settings.limit != null) api += "&num=" + settings.limit;
            api += "&output=json_xml"
	
	if(settings.network='facebook')
		api= "https://graph.facebook.com/"+settings.path+"/photos?callback=?";
	
	
    $.getJSON(api,  function(data){
       if (data.responseStatus == 200 || data.data != null) { // Check for error
			switch(settings.network){
				case 'picasa':
					getPicasaData(data, albumIndex);
					break;	
				case 'facebook':
					getFacebookData(data, albumIndex);
					break;	
				case 'deviantArt':
					getPicasaData(data, albumIndex);
					break;	
				case 'flcikr':
					getPicasaData(data, albumIndex);
					break;	
			}
		}else {
            if (settings.showerror)
                if (settings.errormsg != '') {
                    alert( settings.errormsg);
                } else {
                    alert( data.responseDetails);
                };
        };
    });
}

function changeBG(a){
	currentImg=a;
		
	hashRefresh=false;
	$.history.load("id="+currentGallery+"&img="+a);
	hashRefresh=true;

	$('#pic').stop(true, true).fadeOut(400, function(){
		$('#pic').attr('src' ,  imgPath[a]);     
		$('#pic').attr('class' , a);
	}).delay(100).fadeIn(300);
	
	$('#imgLink').stop(true, true).fadeOut(400, function(){
		$("#imgLink").html($("#cell"+a).attr("alt"));
		$("#imgLink").attr("href", imgLink[a]);
	}).delay(100).fadeIn(300);
	bubble(a);
} 

function loadThumbs(c){
	for(i=0; i<tableCount;i++)
		$("#thumbsTable"+i).css("display", "none");
	$("#thumbsTable"+c).css("display", "table");
	currentTable=c;
}

function prevIMG(){
	if((currentImg)%cellNumber==0)
		prevThumbs();
	else{
		currentImg--;
		changeBG(currentImg);
	}
}
	
function prevThumbs(){
	if(currentTable==0){
		currentImg=gallerySize-1;
		loadThumbs(tableCount-1);
		changeBG(currentImg);
	}else{
		currentImg=((currentTable*cellNumber)-1);
		loadThumbs(currentTable-1);
		changeBG(currentImg);
	}
}

function nextIMG(){
	if( (parseInt(currentImg)+1)%cellNumber==0 || (parseInt(currentImg)+1)==gallerySize)
		nextThumbs();
	else{
		currentImg++;
		(changeBG(currentImg));
	}
}

function nextThumbs(){	
	if((parseInt(currentTable)+1)==tableCount){
		currentImg=0;
		loadThumbs(0);
		changeBG(0);
		
	}else{
		currentImg=(parseInt(currentTable)+1)*cellNumber;
		loadThumbs(parseInt(currentTable)+1);
		changeBG(currentImg);
	}
}

//optional function to grow thumb image on mouseover
function bubble(c) {
	if(c==-500){
		$("#bubbleContainer").css('display', 'none');
	}else if (c==-1){
		changeBG($("#bubbleImg").attr("class"));
	}else{
		
		var thumbSize= (settings.cellWidth+(settings.cellSpacing*2)+(settings.cellPadding*2))*colNumber;
		var thumbHeight=((c-(c%colNumber)-(currentTable*cellNumber))/colNumber)*(settings.cellHeight+(settings.cellSpacing*2)+(settings.cellPadding*2));
		var x = (c%colNumber);//-(settings.cellWidth/8);
		var y = ((c-(c%colNumber))-(currentTable*cellNumber))/colNumber;
		
		$("#bubbleContainer").css('display', 'block');
		$("#bubbleContainer").css("z-index",51);///
		$("#bubbleContainer").css('margin-left', -thumbSize/2+"px");
		$("#bubbleThumb").css('width', thumbSize+"px");
			$("#bubbleImg").css("left", x*thumbSize/colNumber+"px");	
			$("#bubbleImg").css("top", y*thumbHeight+"px");				
			$("#bubbleImg").attr("src", $("#cell"+c).attr('src'));
			$("#bubbleImg").attr("class", c);
			$("#bubbleImg").css("width",(settings.cellWidth*settings.grow));
			$("#bubbleImg").css("height",(settings.cellHeight*settings.grow));
			$("#bubbleImg").css("padding",settings.cellPadding);
			$("#bubbleImg").css("background-color", settings.cellHighlight);	
	}
}

function adjust(){
	$('#albumTitle').css("height", 50+"px");
	$('#albumTitle').css("min-width", settings.maxImgSize+"px");
	$('#albumTitle').css("text-align","center");
	$('#albumTitle').css("background-color","black");
		
	$('#imageDiv').css("height", settings.maxImgSize+settings.imagePadding*2+settings.tallSpacer*2+"px");
	$('#imageDiv').css("width", settings.maxImgSize+"px");
		$('#pic').css("max-width", settings.maxImgSize+"px");
		$('#pic').css("max-height", settings.maxImgSize+"px");
		$('#pic').css("padding",settings.imagePadding);
		$('#pic').css("background-color",settings.imagePaddingColor);

	$("#imgTitle").css("margin", settings.tallSpacer+"px");
	$('#imgTitle').css("min-height", "30px");
	$('#imgTitle').css("z-index", 16);
		$('#imgLink').css("font-size", 24);
		$('#imgLink').css("color", settings.titlefontColor);
		$('#imgLink').css("font-family", settings.titlefontFamily);
		$("#imgLink").html($("#cell"+currentImg).attr("alt"));
		$("#imgLink").attr("href", imgLink[currentImg]);
	
	$("#thumbsTable"+currentTable).css('display', 'table');
	$(".thumbsRow div").css('display', "table");
	$(".thumbsRow div").css('width', ((settings.cellWidth+(settings.cellSpacing*2)+(settings.cellPadding*2))*colNumber)+"px");
		$('.thumbsCell').css("padding", settings.cellSpacing);
		$('.thumbsCell').css('display', "table-cell");
			$('.thumbsImage').css("height", settings.cellHeight);
			$('.thumbsImage').css("width", settings.cellWidth);
			$('.thumbsImage').css("border", ""+settings.cellPadding+"px solid "+ settings.cellHighlight);

			$('.noThumbsImage').css("height", settings.cellHeight);
			$('.noThumbsImage').css("width", settings.cellWidth);
			$('.noThumbsImage').css("border", ""+settings.cellPadding+"px solid transparent");

	$("#prevThumbsArrow").css("height", $("#thumbsContainer").css("height"));
	$("#nextThumbsArrow").css("height", $("#thumbsContainer").css("height"));
	loadThumbs(currentTable);
	bubble(currentImg);
}

function lightBox(check){
	if(lightboxCheck){
		$("#lightBox").attr("id","nullBox");		
		$("#thumbsContainer").css("z-index",50);
	}
	else{				
		$("#nullBox").attr("id","lightBox");
		$("#thumbsContainer").css("z-index",5);	
	}
	lightboxCheck = !lightboxCheck;
}

  



function getFacebookData(albumIndex, data){
		var api2= "https://graph.facebook.com/"+settings.path+"/photos?callback=?";
	$.getJSON(api2, function(data) {
		var facebookInfo = data.data;
		albumLink="http://www.facebook.com/media/set/?set"+facebookInfo[0].link.split("set")[1];	
		albumTitle=settings.title;
		gallerySize=0;
		for(i in facebookInfo){
			imgPath[gallerySize]		=facebookInfo[gallerySize].source;
			imgTitle[gallerySize] 	=facebookInfo[gallerySize].name;
			if (imgTitle[gallerySize]== undefined) imgTitle[gallerySize]=gallerySize+".jpg";
			imgLink[gallerySize] 		=facebookInfo[gallerySize].link;
			thumbnailPath[gallerySize]=facebookInfo[gallerySize].picture; 
			gallerySize++;
		}	
		getDisplay(albumIndex);
	});
}

function getPicasaData(data, albumIndex){	
	albumTitle=data.responseData.feed.title;
	albumLink=data.responseData.feed.link;	 
	gallerySize=data.responseData.feed.entries.length;
	//for(i in data.responseData.feed.entries[0].mediaGroups[0].contents[0].url)
	//console.log( data.responseData.feed.entries[0].mediaGroups[0].contents[0].url);
	for(i=0; i<gallerySize; i++){
		var picasaInfo=data.responseData.feed.entries[i];
		//	mediaGroups,title,link,contentSnippet,content,categories
			imgPath[i]= picasaInfo.mediaGroups[0].contents[0].url;
			
			imgTitle[i]=picasaInfo.title;
			imgLink[i]=picasaInfo.link;
			thumbnailPath[i]=picasaInfo.mediaGroups[0].contents[0].thumbnails[1].url; 		
	}
	getDisplay(albumIndex);
}

function getDeviantData(){
	
	
	albumLink="www."+feeds.title.split(':')[2].split('/')[0]+".deviantart.com/gallery/"+feeds.title.split('/')[1];
for(i=0; i<facebookInfo.length(); i++){
			imgPath[i]= xmlImages[i].getElementsByTagName('content')[0].getAttribute("url");
			imgTitle[i]=feeds.entries[i].title;
			//imgLink[i] 		=facebookInfo[i].link;
			//thumbnailPath[i]=facebookInfo[i].picture; 
			
	}

	
}
function getDisplay(albumIndex){
	switch(settings.display){
		case "gallery":	
			createGallery(albumIndex);	
			break;
		case "list":
			createList(albumIndex);	
			break;
		case "shop":
			createShop(albumIndex);	
			break;
		case "lightbox":
			createLightBox(albumIndex);	
			break;			
	}
}






function createGallery(albumIndex){	
			
	currentGallery=settings.id;
	hashRefresh=true;
	

	if (settings.header)
		$("<div id='albumTitle'><div class='verticalCenter' ><a href='index.html'> Albums &#62; </a><a href='"+
			albumLink+"'> "+ albumTitle +"</a></div></div>").appendTo("#"+settings.containerID);
		
	$("<div id='nullBox' onclick='lightBox(0); return false;'></div>").appendTo("body");
	$("<div id='imageDiv'  ></div>").appendTo("#"+settings.containerID);
		
		$("<div id='prevArrow' class='arrow'><a class='verticalCenter'><img src='images/Arrow-Left.png' onClick='prevIMG()' /></a></div>").appendTo("#imageDiv");
		$("<div id='nextArrow' class='arrow'><a class='verticalCenter'><img src='images/Arrow-Right.png' onClick='nextIMG()' /></a></div>").appendTo("#imageDiv");

	$("<div id='imgTitle'><a id='imgLink' href='"+imgLink[currentImg]+"' alt='"+imgTitle[currentImg]+"'></a></div>").appendTo("#"+settings.containerID);
		$("<a href='"+imgLink[currentImg]+"'><img src='images/comments.png' height='25px' /></a>").appendTo("#imgTitle");
	$("<div id='thumbsContainer'></div>").appendTo("#"+settings.containerID);
	if(imgPath.length>cellNumber){
			$("<div id='prevThumbsArrow' class='arrow'><a class='verticalCenter'>"+
				"<img src='images/Arrow-Left.png' onClick='prevThumbs()' /></a></div>").appendTo("#thumbsContainer");
			$("<div id='nextThumbsArrow' class='arrow'><a class='verticalCenter'>"+
				"<img src='images/Arrow-Right.png' onClick='nextThumbs()' /></a></div>").appendTo("#thumbsContainer");
	}
	$("<div id='bubbleContainer'><div id='bubbleThumb'><img id='bubbleImg' onmouseout='bubble(-500)' onClick='bubble(-1)' /></div></div>").appendTo("#thumbsContainer");
	for (var i=0; i<imgPath.length; i++) { // For Each Image
		
		
		
		if (i==0 || i%cellNumber==0){
			$("<div class='thumbTable' id='thumbsTable"+tableCount+"' style='display:none' ></div>").appendTo("#thumbsContainer");
			tableCount++;
		}	
		if (i%colNumber==0){
			$("<div  id='thumbsRow"+rowCount+"' class='thumbsRows'>").appendTo("#thumbsTable"+(tableCount-1));
			rowCount++;
		}
		
		
		
		
		if(i==currentImg)
			$("<a class='verticalCenter' onclick='lightBox(1)' style='z-index:55;'><img  id='pic' src='"+imgPath[i]+"' class='"+currentImg+"' /></a>").appendTo("#imageDiv");
		$("<div id='thumbTableTD0"+i+"' class='thumbsCell' onclick='changeBG("+i+")' onmouseover='bubble("+i+")'></div>").appendTo("#thumbsRow"+(rowCount-1));
		$("<img id='cell"+i+"' class='thumbsImage' src='"+ thumbnailPath[i] +"' alt='"+imgTitle[i]+"'/>").appendTo("#thumbTableTD0"+i);		
	
	
		
	}	
	if (rowCount>0 && gallerySize%cellNumber!=0 && (gallerySize%cellNumber<colNumber || gallerySize<cellNumber)){
		for(i=0; i+gallerySize%cellNumber<cellNumber;i++){
			$("<div id='thumbTableTD0"+(gallerySize+i)+"' class='thumbsCell' onclick='' onmouseover=''></div>").appendTo("#thumbsRow"+(rowCount-1));
			$("<div id='cell"+(gallerySize+i)+"' class='noThumbsImage'></div>").appendTo("#thumbTableTD0"+(gallerySize+i));		
		}		
	}
	currentTable= (currentImg-(currentImg%cellNumber))/cellNumber;
	//preload(currentImg);
	adjust();
	$.history.load("id="+currentGallery+"&img="+currentImg);

}
        
function createList(){ 
	currentGallery=0;
	hashRefresh=true;
	
    if (settings.header)
        $("<div id='albumTitle'></div>").appendTo("#"+settings.containerID);
    $("<ul id='galleryList' ></ul>").appendTo("#"+settings.containerID);
    for (var i=0; i<gallerySize > 0; i++) { // For Each Image
        $("<li id='galleryListItem"+i+"' class='galleryListItem'></li>").appendTo("#galleryList");
            $("<a  id='galleryAlbumAnchor"+i+"' class='noDecoration' onClick='newGallery("+(i+1)+",false)'  >").appendTo("#galleryListItem"+i+"");
				$("<span class='textFix' ></span>").appendTo("#galleryAlbumAnchor"+i+"");
                $("<img class='galleryAlbumImage' src='"+imgPath[i]+"'  />").appendTo("#galleryAlbumAnchor"+i+"");              
                $("<h4 class='galleryAlbumText' >"+imgTitle[i]+"</h4>").appendTo("#galleryAlbumAnchor"+i+"");               
    }
	tableCount++;
	rowCount++;
}

function createShop(){ 
	//currentGallery=0;
	hashRefresh=true;
	
    if (settings.header)
        $("<div id='albumTitle'></div>").appendTo("#"+settings.containerID);
    $("<ul id='etsyShop' ></ul>").appendTo("#"+settings.containerID);
    for (var i=0; i<feeds.entries.length && xmlImages.length > 0; i++) { // For Each Image
			getEtsyData(i);
        $("<li id='galleryListItem"+i+"' class='galleryListItem'></li>").appendTo("#etsyShop");
            $("<a  id='galleryAlbumAnchor"+i+"' class='noDecoration' href='"+imgLink[i]+"' >").appendTo("#galleryListItem"+i+"");
				$("<div id='etsyItem"+i+"'></div>").appendTo("#galleryAlbumAnchor"+i+"");
				var etsyStr = thumbnailPath.split('<br />');
				
					$("#etsyItem"+i).html(etsyStr[0]);
					$("#etsyItem"+i).children().first().attr('id', 'etsyImg'+i);
					$("#etsyItem"+i).children().first().attr('class', 'etsyImg');
					       
               		$("<p class='price' >"+entry.title+"-"+etsyStr[1]+"</p>").appendTo("#etsyItem"+i);    
					
					for	(p=3; p<etsyStr.length; p++)
			 			etsyStr[2]+="<br />"+etsyStr[p];

					$("<p class='price'>"+etsyStr[2]+"</p>").appendTo("#etsyItem"+i);                
    }
}
function getEtsyData(i){
	
	imgLink[i] = feeds.entries[i].link;
	xmlImages 	= currentXml.getElementsByTagName('item');
	entry = feeds.entries[i];
	thumbnailPath=currentXml.getElementsByTagName('item')[i].getElementsByTagName('description')[0].childNodes[0].nodeValue;
}


function newGallery(str, check){
	for(i=0; i<customVars.length; i++){
		if (customVars[i].id==str)
			str=i;
	}
	$('#'+settings.containerID).empty();
	$("#lightBox").remove();
	$("#nullBox").remove();
	tableCount=0; 
	rowCount=0;
	hashRefresh=true;
	lightboxCheck = false;
	imgLink= new Array();
	
	if(check)
		str=0;	
	getRssXml(str);	

}

function getHash(checkLoad) {
	var newHash=window.location.hash.split('&');
	var checkCell=0, checkTable=0, checkID=0;

	if(newHash){
		checkID=newHash[0].split('=')[1];
		if(newHash[1]){
			checkCell=parseInt(newHash[1].split('=')[1]);
			//checkTable= (checkCell-(checkCell%cellNumber))/cellNumber;
			//alert(cellNumber);
		}
	}


//	if(newHash){
//		checkID=parseInt(newHash[1].split('=')[1]);
//		if(newHash[2] && newHash[3]){
//			checkTable= parseInt(newHash[2].split('=')[1]);	
//			checkCell=parseInt(newHash[3].split('=')[1]);
//		}
//	}
	if(checkID==undefined || checkCell==undefined){
		window.location = 'index.html'
	}else if(currentGallery==checkID && checkID!=0){	
//		if (checkTable != currentTable)
//			loadThumbs(checkTable);
		if (checkCell != currentImg)
			changeBG(checkCell);	
		if (checkID != currentGallery){
			newGallery(checkID);				
		}
	}else if (!checkLoad){
//			currentTable=checkTable;
			currentImg=checkCell;	
		newGallery(checkID);
		if(currentImg>gallerySize){
			alert('bad size');
			currentImg=0;
			}
	}else{
//		currentTable=checkTable;
		currentImg=checkCell;	
		newGallery(checkID);
		if(currentImg>gallerySize){
			alert('bad size');
			currentImg=0;
		}
	}
}

function arrowKey(k){
	if (k==37)
		prevIMG();
	else if (k==39)
		nextIMG();
	else if (k==32)
		lightBox(1);

}

