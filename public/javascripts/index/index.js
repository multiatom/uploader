var maxFile = 6;
var maxSize = 25000000; //byte

var theUploaderInfoHtml = 'File size limited to 25 MB<br>jpg, jpeg, png, svg, mp4, webm, mov, mp3, zip';

var acceptMime = {"image/jpeg":"jpg","image/png":"png","image/svg+xml":"svg","video/mp4":"mp4","video/webm":"webm", 
"video/quicktime":"mov","audio/mpeg":"mp3","application/zip":"zip"};

var cssGap = 12; //.theUploaderResult: gap -> 12px 
var cssMarginTop = 12; //.theUploaderResult: margin-top -> 12px 
var progressBarColor = "#003264";
var errorColor = "#EE4466";
var imageTitleColor = "#1E90FF";
var theUploaderInfoAppend = '<div class="theUploaderFsPbFrame"><div class="theUploaderFileSize"></div><div class="theUploaderProgressBar"></div></div>';


var files = {};
var filesTrash = {};
var filesError = {};
var uploadEvent = 0;
var formData = new FormData();
var xhr = new XMLHttpRequest();
var fileLength = 0;
var fileSize = 0;
var dragFileLength = 0;
var isDown = false;
var startX;
var scrollLeft;
var loadError = [];
 
var getPointerEvent = function(e) {

return (e.originalEvent.targetTouches ? e.originalEvent.targetTouches[0] : e);


};




function resultDivAppend(maxFile) {
					
	for (var i = 0; i < Number(maxFile); i++) {
		

 								
	$(".theUploaderResult").append('<div class="theUploaderResultDiv theUploaderResultDiv' + (i+1) + ' theUploaderResultDivHide"><div class="theUploaderCloseCornerBgTouch"></div><div class="theUploaderCloseCorner after"></div><div class="theUploaderCloseCorner2"></div><div class="theUploaderCloseCorner3"></div><div class="theUploaderCloseCornerBg after"></div><div class="theUploaderCloseCornerBg2"></div><div class="theUploaderCloseCornerBg3"></div><div class="theUploaderContainerImg"></div><div class="theUploaderImgTitle"><div class="theUploaderImgTitleGradient"></div><p class="theUploaderImgTitleP"></p></div><div class="theUploaderSizeTitle"></div></div>');
	
	
	};
	
$(".theUploaderImgTitleP").css({"color": imageTitleColor});

};


function theUploaderResultWindowResize(outerWidthC, outerWidthRD) {
		
	var resultDivLength = $(".theUploaderResultDiv:not(.theUploaderResultDivHide)").length;
	
	if(!resultDivLength) return false;

	var oneLine = parseInt((outerWidthC+cssGap)/(outerWidthRD+cssGap));
	
    $(".theUploaderResult").css({"margin-top": cssMarginTop + 'px'});

	if(oneLine == 1) {
		
					   
		$(".theUploaderResult").css({"max-width": outerWidthRD + 'px'});  
					   
	}
	else if(oneLine > 1 && resultDivLength <= oneLine && resultDivLength) {
			
				
		$(".theUploaderResult").css({"max-width": (outerWidthRD*resultDivLength)+(resultDivLength*cssGap)-cssGap + 'px'});
		  
	}
	else if(oneLine > 1 && resultDivLength > oneLine) {
			
				
		$(".theUploaderResult").css({"max-width": (outerWidthRD*oneLine)+(oneLine*cssGap)-cssGap + 'px'});
		  
	};

	
	if(fileLength == maxFile) {
		
		$("#theUploaderFiles").attr("disabled",true);
		$(".theUploaderUploadBox").css({"cursor":"default"});
		
	}else {
		
		$("#theUploaderFiles").attr("disabled",false);
		$(".theUploaderUploadBox").css({"cursor":"pointer"});
	}; 
		
				   
}; 



function theUploaderResultWindowResizeDemo(outerWidthC, outerWidthRD) {

	var resultDivLength = $(".theUploaderResultDivDemo").length;
	
	
	if(!resultDivLength) return false;
	
	
		var oneLine = parseInt(((outerWidthC)+cssGap)/(outerWidthRD+cssGap));
	
	
	if(oneLine == 1) {
	
	    
	   $(".theUploaderResultDemo").css({"max-width": outerWidthRD + 'px'});  
	
					   
	}
	else if(oneLine > 1 && resultDivLength <= oneLine && resultDivLength) {
			
				
		$(".theUploaderResultDemo").css({"max-width": (outerWidthRD*resultDivLength)+(resultDivLength*cssGap)-cssGap + 'px'});
		  
	}
	else if(oneLine > 1 && resultDivLength > oneLine) {
		
				
		$(".theUploaderResultDemo").css({"max-width": (outerWidthRD*oneLine)+(oneLine*cssGap)-cssGap + 'px'});
		  
	};

	
	
		
				   
}; 



function closeCornerTrashIcon(maxFile) {
	
	var classArray  = [];
	
	for (var i = 0; i < Number(maxFile); i++) {
		
		classArray.push('theUploaderResultDiv' + (i+1));
	
	};
	
			var hasFilename = $('.theUploaderResultDiv[data-filename][data-filename!=""]');
			
			var hasNotFilename = $('.theUploaderResultDiv:not([data-filename]), .theUploaderResultDiv[data-filename=""]');
			
			var counter = i;
			
			hasFilename.each((i, element) => {
				
				
				$(element).removeClass((i, className) => {
				return className.match(/\btheUploaderResultDiv\d+/g);
				});


			$(element).addClass(classArray[0]);
			classArray.splice(0, 1)
			});



			hasNotFilename.each((i, element) => {
	
	
				$(element).removeClass((i, className) => {
				return className.match(/\btheUploaderResultDiv\d+/g);
			  	});


			$(element).addClass(classArray[0]);
			classArray.splice(0, 1)
			});


         $('.theUploaderResultDiv').each(function(i) {
			
		//console.log($(this).attr("class").split(' '))
			
		});
		

		if(fileLength == maxFile) {
		
		$("#theUploaderFiles").attr("disabled",true);
		$(".theUploaderUploadBox").css({"cursor":"default"});
		
	}else {
		
		$("#theUploaderFiles").attr("disabled",false);
		$(".theUploaderUploadBox").css({"cursor":"pointer"});
	}; 
	
	
};



function formatBytes(bytes, decimals) {
	
	decimals = 2;

    //if (bytes === 0) return '0 Bytes';
    if (bytes === 0) return '';

    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

    var i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}


var lastBigSizeName;


function check(obfilename) {
	

	if($("#theUploaderFiles").attr("disabled"))  {
	
		return false;	
		
	};


    $.each(obfilename,function (key, value) {
	
	
         var filename = obfilename[key].name.substring(0, 25).split('.').shift().replace(/[^a-zA-Z0-9]/g, "-").toLowerCase() + '.' + acceptMime[obfilename[key].type];
		 
		 
         const [fileName, fileExtension] = filename.split(/\.(?=[^\.]+$)/);


		  if(acceptMime[obfilename[key].type] && acceptMime[obfilename[key].type] == fileExtension && !filesTrash[filename] && !files[filename] && !filesError[filename] && filename && fileLength < maxFile && obfilename[key].size <= maxSize) {

			if(!Object.getOwnPropertyNames(files).length && !$('.theUploaderResultDiv').find('.theUploaderImgDivTrash[data-loadError="ok"]').length ) {
	           
			   
				filesError = {};
		
				$(".theUploaderResult").remove();
				$(".theUploaderUploadBoxFrame").after('<div class="theUploaderResult" style="gap: ' + cssGap + 'px"></div>');
				
				resultDivAppend(maxFile);

				$('.theUploaderProgressBar').css({"background": 'linear-gradient(to right, Transparent 0%, Transparent 0%)'});
				
				$(".theUploaderInfo").css({"opacity": 0,"-webkit-transition": "none", "transition": "none"});
			
            };
			

			fileLength++;
			
						   
			$('.theUploaderResultDiv' + fileLength).removeClass('theUploaderResultDivHide').css({"position": "relative"});
						
				if(!Object.getOwnPropertyNames(files).length) {
								   
					$(".theUploaderSubmitButton").attr("disabled",false);
									   
					$('.theUploaderResultDiv' + fileLength).one('transitionend, webkitTransitionEnd', function (e) {
									
						$('.theUploaderImgTitleP').css({"-webkit-animation-play-state": "running", "animation-play-state": "running"});
								
					});
	  
				};
					 						   
				fileSize += obfilename[key].size;

                files[filename] = obfilename[key];


					if(obfilename[key].type.substring(0, 5) == "image") {
						
						var fileUrl = URL.createObjectURL(obfilename[key]);
						
						$('.theUploaderResultDiv' + fileLength + ' .theUploaderContainerImg').append('<img class="theUploaderImgDiv" data-filename="' + filename + '" data-size="' + obfilename[key].size + '" data-type="' + obfilename[key].type + '" data-realFiles="" data-src="ok"  data-loadError="">');
						
						
						$('.theUploaderImgDiv[data-filename="' + filename + '"]').attr('src', fileUrl);
					
					}
					else if(obfilename[key].type == "video/mp4" || obfilename[key].type == "video/webm" || obfilename[key].type == "video/quicktime") {
					
						var fileUrl = URL.createObjectURL(obfilename[key]);
							
						$('.theUploaderResultDiv' + fileLength + ' .theUploaderContainerImg').append('<video class="theUploaderImgDiv" data-filename="' + filename + '" data-size="' + obfilename[key].size + '" data-type="' + obfilename[key].type + '" data-realFiles="" data-src="ok" data-loadError="" preload="metadata" autoplay muted loop playsinline></video>');
			
						   
						var video = $('.theUploaderImgDiv[data-filename="' + filename + '"]')[0];
	
						video.src = fileUrl;
				

					}
				
					else {
						
						var fileUrl = '/images/svg/' + fileExtension + '.svg';
						
						$('.theUploaderResultDiv' + fileLength + ' .theUploaderContainerImg').append('<img class="theUploaderImgDiv" data-filename="' + filename + '" data-size="' + obfilename[key].size + '" data-type="image/svg+xml" data-realFiles="" data-src="ok"  data-loadError="">');
						
						$('.theUploaderImgDiv[data-filename="' + filename + '"]').attr('src', fileUrl);
						
					};
					
					
							   
				$('.theUploaderResultDiv' + fileLength + ', .theUploaderResultDiv' + fileLength + ' .theUploaderCloseCornerBgTouch, .theUploaderResultDiv' + fileLength + ' .theUploaderCloseCornerBg, .theUploaderResultDiv' + fileLength + ' .theUploaderCloseCorner, .theUploaderResultDiv' + fileLength + ' .theUploaderContainerImg, .theUploaderResultDiv' + fileLength + ' .theUploaderImgTitle, .theUploaderResultDiv' + fileLength + ' .theUploaderImgTitleP, .theUploaderResultDiv' + fileLength + ' .theUploaderSizeTitle, .theUploaderResultDiv' + fileLength + ' .theUploaderSizeTitle').attr({"data-filename": filename,"data-size":obfilename[key].size, "data-type": obfilename[key].type,"data-src": "ok", "data-realFiles":""});
				
					
		  
           $('.theUploaderImgTitleP[data-filename="' + filename + '"]').text(filename + ' ' + obfilename[key].type);
		   $('.theUploaderSizeTitle[data-filename="' + filename + '"]').text(formatBytes(obfilename[key].size));
					
				
						if($('.theUploaderResultDiv' + fileLength).hasClass("trash")) {
									   
							$('.theUploaderResultDiv' + fileLength + ' .theUploaderImgTitle[data-filename="' + filename + '"]').css({"opacity": 0});
							$('.theUploaderResultDiv' + fileLength + ' .theUploaderImgTitleP[data-filename="' + filename + '"]').css({"opacity": 0});
							$('.theUploaderResultDiv' + fileLength + ' .theUploaderImgDiv[data-filename="' + filename + '"]').css({"opacity": 0});
							$('.theUploaderResultDiv' + fileLength + ' .theUploaderSizeTitle[data-filename="' + filename + '"]').css({"opacity": 0});
							   
						};
			


		

				};

	   
			delete obfilename[key];
			   
			theUploaderResultWindowResize($(".theUploaderCenter").outerWidth(), $(".theUploaderResultDiv").outerWidth());
	
	});
		 
	_load();
		
};

function _load() {
	
	
	 dragFileLength = $('.theUploaderImgDiv:not([data-realFiles="ok"])').length;	
	
	 var imgDivLoadCount = 1;

     $('.theUploaderImgDiv:not([data-realFiles="ok"])').on("load loadeddata", function() {

		var fileNameCorner = $(this).data("filename");
		var fileNameCornerType = $(this).data("type");
		var fileNameCornerSize = $(this).data("size");
		
		
		$(this).attr("data-realFiles","ok");
		
	 

		var innerWidth = Math.round($(this).outerWidth());
		var innerHeight = Math.round($(this).outerHeight());

		//Ha a video szélessége || magassága páratlan, akkor innerWidth || innerHeight +1px és css right +1px
		innerWidth % 2 == 0 ? innerWidth : (innerWidth += 1);
		innerHeight % 2 == 0 ? innerHeight : (innerHeight += 1);
		
		
	        fileNameCornerType == "image/svg+xml" ? $(this).css({"width": "100%", "height": "auto"}) : $(this).css({"width": innerWidth + 'px', "height": innerHeight + 'px'});
			
			if(imgDivLoadCount++ == dragFileLength) {

				resultDivAnimation();

			};
	
	
	}).on("error", function() {
		

		var fileNameCorner = $(this).data("filename");
		var fileNameCornerType = $(this).data("type");
		var fileNameCornerSize = $(this).data("size");
	    
		
		loadError.push(fileNameCorner);
		
        $(this).attr("data-realFiles","ok");
		
		
		var deleteImgDivTrashFilename = $('.' + $(this).parent().parent().attr("class").match(/\btheUploaderResultDiv\d+/g) + ' .theUploaderImgDivTrash').data("filename");
		
			if(deleteImgDivTrashFilename) {
				
				delete filesTrash[deleteImgDivTrashFilename];
				
			}
			
			else {


		$('.theUploaderResultDiv[data-filename="' + fileNameCorner + '"] .theUploaderContainerImg').empty();
		
		$('.theUploaderImgTitleP[data-filename="' + fileNameCorner + '"]').remove();
		$('.theUploaderImgTitle[data-filename="' + fileNameCorner + '"]').remove();
		$('.theUploaderSizeTitle[data-filename="' + fileNameCorner + '"]').remove();
		
			
		$('.theUploaderResultDiv[data-filename="' + fileNameCorner + '"] .theUploaderContainerImg').append('<img class="theUploaderImgDiv" data-filename="' + fileNameCorner + '" data-size="' + fileNameCornerSize + '" data-src="ok" data-realFiles="ok"  data-loadError="ok" "data-type="' + fileNameCornerType + '" style="width: 100%; height: auto" src="/images/svg/loadError.svg">');
		
		
		$('.theUploaderResultDiv[data-filename="' + fileNameCorner + '"] .theUploaderContainerImg').removeClass("grayScale").after('<div class="theUploaderImgTitleTrash"><div class="theUploaderImgTitleGradient"></div><p class="theUploaderImgTitlePTrash" style="-webkit-filter: none; filter: none; color: ' + errorColor + '"></p></div><div class="theUploaderSizeTitleTrash"  style="-webkit-filter: none; filter: none"></div>');
		
	    
		
        $('.theUploaderResultDiv[data-filename="' + fileNameCorner + '"] .theUploaderImgTitleTrash').attr({"data-filename": fileNameCorner,
		"data-size":fileNameCornerSize, "data-type": fileNameCornerType,"data-src": "ok", "data-realFiles":"ok"});
		
		$('.theUploaderResultDiv[data-filename="' + fileNameCorner + '"] .theUploaderImgTitlePTrash').text(fileNameCorner + ' ' + fileNameCornerType).attr({"data-filename": fileNameCorner,
		"data-size":fileNameCornerSize, "data-type": fileNameCornerType, "data-src": "ok", "data-realFiles":"ok"});
		
		
		$('.theUploaderResultDiv[data-filename="' + fileNameCorner + '"] .theUploaderSizeTitleTrash').text(formatBytes(fileNameCornerSize)).attr({"data-filename": fileNameCorner,
		"data-size":fileNameCornerSize, "data-type": fileNameCornerType, "data-src": "ok", "data-realFiles":"ok"});
		
		$('.theUploaderResultDiv[data-filename="' + fileNameCorner + '"]').addClass("trash");
		
		
		
		};
		
	
		fileLength -= 1;
		fileSize -= files[fileNameCorner].size;
					
		
		filesError[fileNameCorner] = fileNameCorner;
				
		delete files[fileNameCorner];
	
			if(imgDivLoadCount++ == dragFileLength) {

				resultDivAnimation();

			};
	
		});
		
	
};


function lastFileSize() {
	
$(".theUploaderInfo:not(.disabled)").empty().append(theUploaderInfoAppend).addClass("disabled").css({"opacity": 1,"-webkit-transition": "opacity 300ms linear", "transition": "opacity 300ms linear"});
				
$(".theUploaderFileSize").text(formatBytes(fileSize));

};


function resultDivAnimation() {
	
	var set = 150;
	var trashDelay = 0;
		
	

		//Ha van src, de még nem jelenítettük meg a resultDiv-et és nem .trash
		$('.theUploaderResultDiv[data-src="ok"]:not([data-realFiles="ok"])').each(function(index){

				
		//többet nem jelenítjük meg a resultDiv-et
		$(this).attr("data-realFiles","ok");
		

		var notTrashFilename = $(this).find('.theUploaderImgDiv').data("filename");
		var notTrashSize = $(this).find('.theUploaderImgDiv').data("size");
		var notTrashType = $(this).find('.theUploaderImgDiv').data("type");
		
		if(!$(this).hasClass("trash")) {
			
		
		var delay = Number(index * set) + trashDelay;
		
		
		
	
			setTimeout(function() {
			
			$('.theUploaderResultDiv[data-filename="' + notTrashFilename + '"]').addClass("after");
			$('.theUploaderCloseCornerBgTouch[data-filename="' + notTrashFilename + '"]').removeClass("disabled after");
			$('.theUploaderCloseCornerBg[data-filename="' + notTrashFilename + '"]').removeClass("disabled after");
			$('.theUploaderCloseCorner[data-filename="' + notTrashFilename + '"]').removeClass("disabled after");
			
		
			
				if(index+1 == dragFileLength && fileSize) {
					
				lastFileSize()
				
					
				};
				
				
				$('.theUploaderResultDiv[data-filename="' + notTrashFilename + '"]').one('transitionend, webkitTransitionEnd', function (e) {
						
					$('.theUploaderCloseCornerBg[data-filename="' + notTrashFilename + '"]').css({"-webkit-transition": "opacity 300ms linear","transition": "opacity 300ms linear"});
	
					$('.theUploaderCloseCorner[data-filename="' + notTrashFilename + '"]').css({"-webkit-transition": "opacity 300ms linear","transition": "opacity 300ms linear"});
								
				});

			
		    }, delay);
		   
			 
			
			 
			 
		}	
		
		else if($(this).hasClass("trash") && !loadError.includes(notTrashFilename)) {
				
		
		var delay = Number(index * set) + (trashDelay/2);
		trashDelay += 300;
		
		var oldFilename = $(this).find('.theUploaderImgDivTrash').data("filename");
		delete filesTrash[oldFilename];	
		delete filesError[oldFilename];
		
		//Az error-nál display: none és ezzel lesz újra látható
		$('.theUploaderResultDiv[data-filename="' + notTrashFilename + '"]').find('.theUploaderCloseCornerBgTouch, .theUploaderCloseCornerBg, .theUploaderCloseCorner')
		.addClass("after").css({"display":"inline"});
		
	    setTimeout(function() {
	
		
		$('.theUploaderImgDivTrash[data-filename="' + oldFilename + '"]').animate({opacity: 0}, 300, "linear");
		$('.theUploaderImgDivTrashIcon[data-filename="' + oldFilename + '"]').animate({opacity: 0}, 300, "linear");
		
		$('.theUploaderImgTitleTrash[data-filename="' + oldFilename + '"]').animate({opacity: 0}, 300, "linear");
		$('.theUploaderSizeTitleTrash[data-filename="' + oldFilename + '"]').animate({opacity: 0}, 300, "linear", function() {
		
		
		
		 
		$('.theUploaderImgDivTrash[data-filename="' + oldFilename + '"], .theUploaderImgDivTrashIcon[data-filename="' + oldFilename + '"]').remove();
		
		
		$('.theUploaderResultDiv[data-filename="' + notTrashFilename + '"] .theUploaderContainerImg').removeClass("grayScale");
	
		$('.theUploaderImgTitleTrash[data-filename="' + oldFilename + '"]').addClass("theUploaderImgTitle").removeClass("theUploaderImgTitleTrash").css({opacity:0})
		.attr({"data-filename": notTrashFilename,"data-size": notTrashSize, "data-type": notTrashType,"data-src": "ok", "data-realFiles":"ok"});
		$('.theUploaderImgTitlePTrash[data-filename="' + oldFilename + '"]').addClass("theUploaderImgTitleP").removeClass("theUploaderImgTitlePTrash").css({"color": imageTitleColor, "-webkit-filter": "none", "filter": "none"})
		.text(notTrashFilename + ' ' + notTrashType).attr({"data-filename": notTrashFilename,"data-size": notTrashSize, "data-type": notTrashType,"data-src": "ok", "data-realFiles":"ok"});
		$('.theUploaderSizeTitleTrash[data-filename="' + oldFilename + '"]').addClass("theUploaderSizeTitle").removeClass("theUploaderSizeTitleTrash").css({opacity:0,"-webkit-filter": "none", "filter": "none"}).text(formatBytes(notTrashSize)).attr({"data-filename": notTrashFilename,"data-size": notTrashSize, "data-type": notTrashType,"data-src": "ok", "data-realFiles":"ok"});
		
		
		
	        $('.theUploaderCloseCornerBgTouch[data-filename="' + notTrashFilename + '"]').removeClass("after");
			$('.theUploaderCloseCornerBg[data-filename="' + notTrashFilename + '"]').removeClass("after");
			$('.theUploaderCloseCorner[data-filename="' + notTrashFilename + '"]').removeClass("after");
			
			
		$('.theUploaderImgDiv[data-filename="' + notTrashFilename + '"]').animate({opacity: 1}, 300, "linear");
		$('.theUploaderImgTitle[data-filename="' + notTrashFilename + '"]').animate({opacity: 1}, 300, "linear");
		$('.theUploaderSizeTitle[data-filename="' + notTrashFilename + '"]').animate({opacity: 1}, 300, "linear", function() {  });
		   
		   
		   
		   if(index+1 == dragFileLength && fileSize) {
					
				lastFileSize()
				
					
				};
		   
		  
		});
		
		
		
		 }, delay);

		
		$(this).removeClass("trash");
			

		}	
		
		else if($(this).hasClass("trash") && loadError.includes(notTrashFilename)) {
			

		$(this).find('.theUploaderCloseCornerBgTouch, .theUploaderCloseCornerBg, .theUploaderCloseCorner').css({"display":"none"});	
		
	    
	    var oldFilename = $('.' + $(this).attr("class").match(/\btheUploaderResultDiv\d+/g) + ' .theUploaderImgDivTrash').data("filename");
		
		delete filesError[oldFilename];
		
		
		if(oldFilename) {
         
		var delay = Number(index * set) + (trashDelay/2);
		trashDelay += 300;
		
	setTimeout(function() {
		
			
		$('.theUploaderImgDivTrash[data-filename="' + oldFilename + '"]').animate({opacity: 0}, 300, "linear");
		$('.theUploaderImgDivTrashIcon[data-filename="' + oldFilename + '"]').animate({opacity: 0}, 300, "linear");
		$('.theUploaderImgTitleTrash[data-filename="' + oldFilename + '"]').animate({opacity: 0}, 300, "linear");
		
		$('.theUploaderSizeTitleTrash[data-filename="' + oldFilename + '"]').animate({opacity: 0}, 300, "linear", function() {
			
			
		$('.theUploaderResultDiv[data-filename="' + notTrashFilename + '"] .theUploaderContainerImg').empty();
	    $('.theUploaderImgDivTrash[data-filename="' + notTrashFilename + '"], .theUploaderImgDivTrashIcon[data-filename="' + oldFilename + '"]').remove();
	
	
		$('.theUploaderImgTitlePTrash[data-filename="' + oldFilename + '"], .theUploaderImgTitleTrash[data-filename="' + oldFilename + '"], .theUploaderSizeTitleTrash[data-filename="' + oldFilename + '"]').remove();
		
		$('.theUploaderResultDiv[data-filename="' + notTrashFilename + '"] .theUploaderContainerImg').removeClass("grayScale").append('<img class="theUploaderImgDivTrash" data-filename="' + notTrashFilename + '" data-size="' + notTrashSize + '" data-src="ok" data-realFiles="ok"  data-loadError="ok" data-type="' + notTrashType + '" style="opacity: 0; width: 100%; height: auto" src="/images/svg/loadError.svg">');
		
		
		$('.theUploaderResultDiv[data-filename="' + notTrashFilename + '"] .theUploaderContainerImg').after('<div class="theUploaderImgTitleTrash"><div class="theUploaderImgTitleGradient"></div><p class="theUploaderImgTitlePTrash" style="-webkit-filter: none; filter: none; color: ' + errorColor + '"></p></div><div class="theUploaderSizeTitleTrash"  style="-webkit-filter: none; filter: none"></div>');
		
	
		
        $('.theUploaderResultDiv[data-filename="' + notTrashFilename + '"] .theUploaderImgTitleTrash').css({opacity:0}).attr({"data-filename": notTrashFilename,
		"data-size": notTrashSize, "data-type": notTrashType,"data-src": "ok", "data-realFiles":"ok"});
		
		$('.theUploaderResultDiv[data-filename="' + notTrashFilename + '"] .theUploaderImgTitlePTrash').text(notTrashFilename + ' ' + notTrashType).attr({"data-filename": notTrashFilename,
		"data-size": notTrashSize, "data-type": notTrashType,"data-src": "ok", "data-realFiles":"ok"});
		
		
		$('.theUploaderResultDiv[data-filename="' + notTrashFilename + '"] .theUploaderSizeTitleTrash').css({opacity:0}).text(formatBytes(notTrashSize)).attr({"data-filename": notTrashFilename,
		"data-size": notTrashSize, "data-type": notTrashType,"data-src": "ok", "data-realFiles":"ok"});
		
		
		 
		
			$('.theUploaderResultDiv[data-filename="' + notTrashFilename + '"]').find('.theUploaderImgDivTrash, .theUploaderImgTitleTrash, .theUploaderSizeTitleTrash')
			.animate({opacity: 1}, 300, "linear");
			
			
			
			if(index+1 == dragFileLength && fileSize) {
					
				lastFileSize()
				
					
				};
				
				
				
		
				var data = $('.theUploaderResultDiv[data-filename="' + notTrashFilename + '"]').data();
				
				var keys = $.map(data, function (value, key) {
					return key;
				});
				
					for (i = 0; i < keys.length; i++) {
							
					$('.theUploaderResultDiv[data-filename="' + notTrashFilename + '"]').removeAttr("data-" + keys[i]);
							
					};
			
			

				 closeCornerTrashIcon(maxFile)
				 
				 
				 
				 
				
				 
				 });	
				
				

				
				}, delay);
				

		}
		
		else {
			
		var delay = Number(index * set) + trashDelay;
		
			
			$('.theUploaderResultDiv[data-filename="' + $(this).data("filename") + '"] .theUploaderImgDiv').addClass("theUploaderImgDivTrash").removeClass("theUploaderImgDiv");
			
			
				setTimeout(function() {
				
               	$('.theUploaderResultDiv[data-filename="' + notTrashFilename + '"]').addClass("after");
				
				
				if(index+1 == dragFileLength && fileSize) {
					
				lastFileSize()
				
					
				};
				
				
				var data = $('.theUploaderResultDiv[data-filename="' + notTrashFilename + '"]').data();
				
				var keys = $.map(data, function (value, key) {
					return key;
				});
				
					for (i = 0; i < keys.length; i++) {
							
					$('.theUploaderResultDiv[data-filename="' + notTrashFilename + '"]').removeAttr("data-" + keys[i]);
							
					};
			
				
				closeCornerTrashIcon(maxFile)
				
				}, delay);
				
			
		     };
		
	
	
        	loadError.splice(loadError.indexOf(notTrashFilename),  1);
		
		
			!Object.getOwnPropertyNames(files).length ? $(".theUploaderSubmitButton").attr("disabled",true) : $(".theUploaderSubmitButton").attr("disabled",false);
	
	
		};
			

		});
		
		
	

	};



	

$(document).ready(function() {
	
	$(".theUploaderResult").css({"gap": cssGap + 'px'});
	$(".theUploaderInfo").html(theUploaderInfoHtml);
	$("#theUploaderFiles").attr("accept", Object.keys(acceptMime).join(', '));
	
    theUploaderResultWindowResizeDemo($(".theUploaderCenterDemo").outerWidth(), $(".theUploaderResultDivDemo").outerWidth());
	
	
		if(!navigator.userAgent.match(/Mobile/i) && !navigator.userAgent.match(/iPhone/i) && !navigator.userAgent.match(/iPad/i)) {

			$("#formDownloadButton").on("mouseover", function (e) {
	
				$(this).addClass("after2").removeClass("after");
	
			}).on("mouseout mouseleave", function (e) {
	
	
			if($(this).hasClass( "after3" )) {
	
	
				$(this).addClass("after").removeClass("after3");
	
	
			};
	
				$(this).addClass("after").removeClass("after2");
	
			}).on("mousedown  ", function () {
	
				$(this).addClass("after3").removeClass("after2");
	
			}).on("mouseup", function () {
	
				$(this).addClass("after2").removeClass("after3");
	
			});

        }
		
        else {

			$("#formDownloadButton").on("touchstart, pointerdown", function (e) {
	        
			e.preventDefault();
	
	
			$(this).addClass("after2").removeClass("after");
	
			}).on("touchmove",function(e) {
	
			
	
			var pointer = getPointerEvent(e);
			var moving_frame_currX = pointer.pageX;
			var moving_frame_currY = pointer.pageY;
			var left = (moving_frame_currX-$(this).offset().left);
			var max_right = $(this).outerWidth();
			var top = (moving_frame_currY-$(this).offset().top);
			var max_bottom = $(this).outerHeight();
				
				if(left < 0 || left > max_right || top < 0  || top > max_bottom) {
	
					$(this).addClass("after").removeClass("after2");
				};
				
			}).on("touchcancel", function (e) {
				
				e.preventDefault();

				$(this).addClass("after").removeClass("after2 after3");
				
	        })
			.on("touchend, pointerup", function (e) {
				
				
				e.preventDefault();
	
				if($(this).hasClass("after3")) {
	
					$(this).addClass("after").removeClass("after3");
	
				return;
	
				}
				else if($(this).hasClass("after2")) {
	
					$(this).addClass("after").removeClass("after2");
	
				};
	
	
				var pointer = getPointerEvent(e);
				var moving_frame_currX = pointer.pageX;
				var moving_frame_currY = pointer.pageY;
				var left = (moving_frame_currX-$(this).offset().left);
				var max_right = $(this).outerWidth();
				var top = (moving_frame_currY-$(this).offset().top);
				var max_bottom = $(this).outerHeight();
				
				if(left > 0 && left < max_right && top > 0 && top < max_bottom) {
	
	
					$(this).addClass("after3").removeClass("after2");
		
		
					$("#formDownloadButton").on("transitionend webkitTransitionEnd oTransitionEnd", function(){
		
					$("#formDownloadButton").addClass("after").removeClass("after3");
			
					
					});
	
	
				};
	
			});
	};

	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	$(".theUploaderUploadBox").on("click", function(){
	$("#theUploaderFiles").trigger("click");
	});
	 
    $(".theUploaderUploadBox").on(
    'dragover',
    function(e) {
        e.preventDefault();
        e.stopPropagation();
    }
)
$(".theUploaderUploadBox").on(
    'dragleave',
    function(e) {
		$(this).removeClass("theUploaderUploadBoxActive");
        e.preventDefault();
        e.stopPropagation();
		
    }
)
$(".theUploaderUploadBox").on(
    'dragenter',
    function(e) {
		$(this).addClass("theUploaderUploadBoxActive");
        e.preventDefault();
        e.stopPropagation();
    }
)
$(".theUploaderUploadBox").on(
    'drop',
    function(e){
        if(e.originalEvent.dataTransfer){
            if(e.originalEvent.dataTransfer.files.length) {
				$(this).removeClass("theUploaderUploadBoxActive");
		
                e.preventDefault();
                e.stopPropagation();
                /*UPLOAD FILES HERE*/
                check(e.originalEvent.dataTransfer.files);
            };
        };
    }
	
);

	 var filesInput = document.getElementById("theUploaderFiles");
	
	 
     filesInput.addEventListener("change", function (e) {
		 

		 e.preventDefault();
		 e.stopPropagation();
		 /////*UPLOAD FILES HERE*/	 
		 check(e.target.files);
		 /////*UPLOAD FILES CLEAR*/
		 filesInput.value = null;
	 
     });
    
		

	
$(document).on("click", ".theUploaderImgDivTrashIcon:not(.disabled)", function(e) {
	
	e.preventDefault();
	e.stopPropagation();
	
	$(this).addClass("disabled");

	var dataFileName = $(this).attr("data-filename");
	var dataFileNameSize = $(this).attr("data-size");
	var dataFileNameType = $(this).attr("data-type");
	
		
	  fileSize +=  Number(dataFileNameSize);
	
		    fileLength += 1;
			
			fileLength == 0 ? $(".theUploaderSubmitButton").attr("disabled",true) : $(".theUploaderSubmitButton").attr("disabled",false);
			
			
		    $(".theUploaderFileSize").text(formatBytes(fileSize));
			
	                 
	               files[dataFileName] = filesTrash[dataFileName];
	
					delete filesTrash[dataFileName];


        $('.' + $(this).parent().attr("class").match(/\btheUploaderResultDiv\d+/g) + ' .theUploaderContainerImg').removeClass("grayScale");
		$('.' + $(this).parent().attr("class").match(/\btheUploaderResultDiv\d+/g) + ' .theUploaderImgDivTrash').addClass('theUploaderImgDiv').removeClass("theUploaderImgDivTrash");
		$('.' + $(this).parent().attr("class").match(/\btheUploaderResultDiv\d+/g) + ' .theUploaderImgTitleTrash').addClass('theUploaderImgTitle').removeClass("theUploaderImgTitleTrash");
		$('.' + $(this).parent().attr("class").match(/\btheUploaderResultDiv\d+/g) + ' .theUploaderImgTitlePTrash').addClass('theUploaderImgTitleP').removeClass("theUploaderImgTitlePTrash").css({"-webkit-filter": "none", "filter": "none"});
		$('.' + $(this).parent().attr("class").match(/\btheUploaderResultDiv\d+/g) + ' .theUploaderSizeTitleTrash').addClass('theUploaderSizeTitle').removeClass("theUploaderSizeTitleTrash").css({"-webkit-filter": "none", "filter": "none"});
		
		            	
				
		
			$('.' + $(this).parent().attr("class").match(/\btheUploaderResultDiv\d+/g)).find('.theUploaderImgDivTrash').addClass('theUploaderImgDiv');
			
	$('.' + $(this).parent().attr("class").match(/\btheUploaderResultDiv\d+/g)).attr({"data-filename": dataFileName,"data-size":dataFileNameSize, "data-type": dataFileNameType,"data-src": "ok", "data-realFiles":"ok"});
	
	$('.' + $(this).parent().attr("class").match(/\btheUploaderResultDiv\d+/g)).find('.theUploaderCloseCornerBgTouch, .theUploaderCloseCornerBg, .theUploaderCloseCorner').removeClass("after");
	
	

		$('.' + $(this).parent().attr("class").match(/\btheUploaderResultDiv\d+/g)).find('.theUploaderImgDiv').removeClass("theUploaderImgDivTrash");
		
		$('.' + $(this).parent().attr("class").match(/\btheUploaderResultDiv\d+/g)).removeClass("trash");
		
		
		if(dataFileNameType == "video/mp4" || dataFileNameType == "video/webm" || dataFileNameType == "video/quicktime") {
			
			var video = $('.theUploaderImgDiv[data-filename="' + dataFileName + '"]')[0];
				
			video.play();
			
		};
		
		
		$('.theUploaderImgDivTrashIcon[data-filename="' + dataFileName + '"]').animate({opacity: 0}, 300, "linear", function() {
         $(this).remove();
        });
		
		
		
				closeCornerTrashIcon(maxFile);
		

});



 $(document).on("click", ".theUploaderCloseCorner:not(.disabled, .after), .theUploaderCloseCornerBgTouch:not(.disabled, .after)", function(e) {
	 
	 e.preventDefault();
	e.stopPropagation();
	
	
			var dataFileName = $(this).attr("data-filename");
			var dataFileNameSize = $(this).attr("data-size");
			var dataFileNameType = $(this).attr("data-type");
			
			
			
			
			if(dataFileNameType == "video/mp4" || dataFileNameType == "video/webm" || dataFileNameType == "video/quicktime") {
			
				var video = $('.theUploaderImgDiv[data-filename="' + dataFileName + '"]')[0];
				
				video.pause();
			
			};

			
			
			
			
			if(Object.getOwnPropertyNames(files).length == 1) {
				
				
				  $('.theUploaderCloseCornerBgTouch[data-filename="' + dataFileName + '"]').addClass("disabled");
			      $('.theUploaderCloseCorner[data-filename="' + dataFileName + '"]').addClass("disabled");
				  
				  fileSize -= Number(dataFileNameSize);
			
		          fileLength -= 1;
				  
				
				 $(".theUploaderResult, .theUploaderInfo").animate({opacity: 0}, 300, "linear", function() {
				
				
			     $(".theUploaderInfo").empty().removeClass("disabled");
				 $(".theUploaderResult").empty().css({"margin-top": 0});
				 
				 $(".theUploaderInfo").css({"opacity": 1}).html(theUploaderInfoHtml);
							 
			 });
				
				$(".theUploaderSubmitButton").attr("disabled",true);
				
				delete files[dataFileName];
				
				filesError = {};
				files = {};
			    filesTrash = {};
			    fileSize = 0; 
				
				
				return false;
				
				
				
			} 
			else {
				
				
				 fileSize -= Number(dataFileNameSize);
			
		          fileLength -= 1;
		
			
			$('.theUploaderResultDiv[data-filename="' + dataFileName + '"]').find('.theUploaderCloseCornerBgTouch, .theUploaderCloseCornerBg, .theUploaderCloseCorner').addClass("after");
			
		
			$('.theUploaderResultDiv[data-filename="' + dataFileName + '"]').addClass("trash");
			
			
			
			$('.theUploaderResultDiv[data-filename="' + dataFileName + '"] .theUploaderImgDivTrash').remove(); 
			
		    
	        //$('.theUploaderImgTitlePTrash, .theUploaderSizeTitleTrash').css({"-webkit-filter": "grayscale(100%)", "filter": "grayscale(100%)"});
	       
		    $('.theUploaderResultDiv[data-filename="' + dataFileName + '"] .theUploaderContainerImg').addClass("grayScale"); 

		    $('.theUploaderResultDiv[data-filename="' + dataFileName + '"] .theUploaderImgDiv').addClass('theUploaderImgDivTrash').removeClass("theUploaderImgDiv");
	        $('.theUploaderResultDiv[data-filename="' + dataFileName + '"] .theUploaderImgTitle').addClass('theUploaderImgTitleTrash').removeClass("theUploaderImgTitle");
			$('.theUploaderResultDiv[data-filename="' + dataFileName + '"] .theUploaderImgTitleP').addClass('theUploaderImgTitlePTrash').removeClass("theUploaderImgTitleP").css({"-webkit-filter": "grayscale(100%)", "filter": "grayscale(100%)"});
		    $('.theUploaderResultDiv[data-filename="' + dataFileName + '"] .theUploaderSizeTitle').addClass('theUploaderSizeTitleTrash').removeClass("theUploaderSizeTitle").css({"-webkit-filter": "grayscale(100%)", "filter": "grayscale(100%)"});
		

			$('.theUploaderResultDiv[data-filename="' + dataFileName + '"]').append('<div class="theUploaderImgDivTrashIcon" data-filename="' + dataFileName + '" data-size="' + dataFileNameSize + '" data-type="' + dataFileNameType + '"></div>');
		
			$('.theUploaderResultDiv[data-filename="' + dataFileName + '"] .theUploaderImgDivTrash').attr({"data-filename": dataFileName});
			
			
			$(".theUploaderSubmitButton").attr("disabled",false);
			
		
			$('.theUploaderImgDivTrashIcon[data-filename="' + dataFileName + '"]').animate({opacity: 1}, 300, 'linear');
		 
			
				$(".theUploaderFileSize").text(formatBytes(fileSize));

			filesTrash[dataFileName] = files[dataFileName];
		    
				delete files[dataFileName];
		
            var data = $('.theUploaderResultDiv[data-filename="' + dataFileName + '"]').data();
		
			var keys = $.map(data, function (value, key) {
				return key;
			});
			
				for (i = 0; i < keys.length; i++) {
					
					
					
					$('.theUploaderResultDiv[data-filename="' + dataFileName + '"]').removeAttr("data-" + keys[i]);
					
				};
				
				
				closeCornerTrashIcon(maxFile);
	
			
			};

	});
	
	
	
	$(document).on('mousedown', ".theUploaderImgTitle, .theUploaderImgTitleTrash, .theUploaderImgTitleDemo", function(e){
			 
	isDown = true;
	
	var pointer = getPointerEvent(e);
	
	var moving_frame_currX = pointer.pageX;
						  
	startX = (moving_frame_currX-$(this).offset().left);
	scrollLeft = $(this).scrollLeft();
	
	

	});
	
	$(document).on('mouseup', ".theUploaderImgTitle, .theUploaderImgTitleTrash, .theUploaderImgTitleDemo", function(e) {
		
	isDown = false;

	
	});
	
	$(document).on('mouseleave', ".theUploaderImgTitle, .theUploaderImgTitleTrash, .theUploaderImgTitleDemo", function(e) {
	
	isDown = false;
	

	});
	
	
	$(document).on('mousemove', ".theUploaderImgTitle, .theUploaderImgTitleTrash, .theUploaderImgTitleDemo", function(e) {
		
	if(!isDown) {
		
		
		return false;
		
	};
		
	var pointer = getPointerEvent(e);
	
	var moving_frame_currX = pointer.pageX;
						   
	var left = (moving_frame_currX-$(this).offset().left);
	
	var walk = (scrollLeft - (left - startX));
	
	$(this).scrollLeft(walk);

	
	});
	

	$(document).on("mouseover touchstart", ".theUploaderCloseCorner:not(.disabled), .theUploaderSubmitButton:not(:disabled)", function() {
	$(this).addClass("closeCornerHoover");
	});
			
	$(document).on("mouseout mouseleave mouseup touchend", ".closeCornerHoover", function() {
	$(this).removeClass("closeCornerHoover");
	
	});
	
	
	
	$(window).on("resize", function() {

	theUploaderResultWindowResize($(".theUploaderCenter").outerWidth(), $(".theUploaderResultDiv").outerWidth());
	theUploaderResultWindowResizeDemo($(".theUploaderCenterDemo").outerWidth(), $(".theUploaderResultDivDemo").outerWidth());
		   
	});		
	


	$(".theUploaderSubmitButton").on("click", function() {
	 
	$(this).attr("disabled",true);
	 
	$(this).addClass('active');
	 
		$(this).on('animationend, webkitAnimationEnd', function (e) {
									
		$(this).removeClass('active');
						
		});	 

	$("#theUploaderFiles").attr("disabled",true);
	$(".theUploaderUploadBox").css({"cursor":"default"});
	
	
	
	$(".theUploaderImgDivTrashIcon, .theUploaderCloseCornerBgTouch, .theUploaderCloseCorner, .theUploaderCloseCornerBg").css({"cursor":"default"}).addClass("disabled");
	 
	
          $.ajax({

          url: "/",
          type: "POST",
          contentType: "application/json",
          dataType: "json",
          data: formData,
          contentType: false,
          cache: false,
          processData: false,
          async: true,
	 
               xhr: function() {
			  
			             xhr.upload.addEventListener("error", function(evt) {
                         if (evt.lengthComputable) {
                        
				         console.log('Error');

                         };
						 
                         }, false);
			   
			             xhr.upload.addEventListener("loadstart", function(evt) {
                         if (evt.lengthComputable) {
                        
				         //console.log('Loadstart');
						
						 $('.theUploaderProgressBar').css({"background": 'linear-gradient(to right, Transparent 0%, Transparent 0%)'});
						 
                         };
						 
                         }, false);
						 
						 xhr.upload.addEventListener("loadend", function(evt) {
                         if (evt.lengthComputable) {
                        
				         //console.log('Loadend');
						 
                         };
						 
                         }, false);
               
			             xhr.upload.addEventListener("progress", function(evt) {
                         if (evt.lengthComputable) {
                         var percentComplete = parseInt((evt.loaded / evt.total)*100);

						 //var percentCompleteB = percentComplete != 100 ? ('0.' + ('0' + percentComplete).slice(-2))  : '1.00';
						 //console.log('Progress:' + Number(percentCompleteB).toFixed(2));
					
						 //console.log('Progress:' + percentComplete + '%');
                         $('.theUploaderProgressBar').css({"background": 'linear-gradient(to right, ' + progressBarColor + ' ' + percentComplete + '%, Transparent ' + percentComplete + '%)'});
						 
						 $('.theUploaderFileSize').text(percentComplete + '%');
						
                         };
						 
                    }, false);

                    //xhr.addEventListener("progress", function(evt) {
                         //if (evt.lengthComputable) {
                         //var percentComplete = evt.loaded / evt.total;
                         //Do something with download progress
			             //console.log('Download:' + percentComplete);
                         //}
                    //}, false);
					

               return xhr;
               },
	 	
               beforeSend: function() {
				   
				    formData.delete("files"); //Node.js
				    //formData.delete("files[]"); //PHP
					
						formData.delete("filesInputData");
					
                    $.each(files, function (key, value) {

                        var replaceName = value.name.split('.').shift().replace(/[^a-zA-Z0-9]/g, "-").toLowerCase() + '.' +  value.name.split('.').pop().toLowerCase();

                        formData.append('files', value, replaceName); //Node.js
                        //formData.append('files[]', value, replaceName); //PHP
						
                        delete files[key];
				
                    });
					
						formData.append("filesInputData", JSON.stringify({data1: "Hello Server", data2: "MULTIATOM", data3: "https://multiatom.com"}));	
					
					files = {};
					filesTrash = {};
					filesError = {};
              
					fileLength = 0;
					fileSize = 0;
					
					$("#theUploaderFiles").empty();
					$('.theUploaderImgDivTrash[data-loadError="ok"]').removeAttr("data-loadError");
					
			
               },

              success: function(data) {

                  if(data.error) {

                      
                      console.log(data.error);
					 
					
					 
                        	$(".theUploaderResultDiv:not(.trash) .theUploaderCloseCornerBg").css({"opacity":0});
					        $(".theUploaderResultDiv:not(.trash) .theUploaderCloseCornerBg3").css({"opacity":1});
					        $(".theUploaderResultDiv:not(.trash) .theUploaderCloseCorner").css({"opacity":0});
					        $(".theUploaderResultDiv:not(.trash) .theUploaderCloseCorner3").css({"opacity": 1});
							$(".theUploaderImgTitleP").css({"color":errorColor});

                  }
                  else if(data.success) {

                      
                      //console.log(data.success);
					  
					  
					  $(".theUploaderResultDiv:not(.trash) .theUploaderCloseCornerBg").css({"opacity":0});
					  $(".theUploaderResultDiv:not(.trash) .theUploaderCloseCornerBg2").css({"opacity":1});
					  $(".theUploaderResultDiv:not(.trash) .theUploaderCloseCorner").css({"opacity":0});
					  $(".theUploaderResultDiv:not(.trash) .theUploaderCloseCorner2").css({"opacity": 1});
					  
		
                  };

              },

              error: function (data) {

                

                console.log('statusText: ' + data.statusText);
              	console.log('Status: ' + data.status);
                console.log('readyState: ' + data.readyState);
				
				
						    $(".theUploaderResultDiv:not(.trash) .theUploaderCloseCornerBg").css({"opacity":0});
					        $(".theUploaderResultDiv:not(.trash) .theUploaderCloseCornerBg3").css({"opacity":1});
					        $(".theUploaderResultDiv:not(.trash) .theUploaderCloseCorner").css({"opacity":0});
					        $(".theUploaderResultDiv:not(.trash) .theUploaderCloseCorner3").css({"opacity": 1});
							$(".theUploaderImgTitleP").css({"color":errorColor});
			
              },

              complete: function(data) {

				   $("#theUploaderFiles").attr("disabled",false);
				   $(".theUploaderUploadBox").css({"cursor":"pointer"});
				   $(".theUploaderInfo").removeClass("disabled");
		
              },

          });

     });

});


 
									
									