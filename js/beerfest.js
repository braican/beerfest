
//
// BEERFEST - namespace
//
(function(BEERFEST, $){

	BEERFEST.name = "ebf-2015";

	

	/* --------------------------------------------
	 * --rendering
	 * -------------------------------------------- */

	function renderBeers(data){

		$.each(data, function(brewery, breweryData){
			var breweryHtml = '<li data-brewery="' + brewery + '"><span class="breweryname">' + brewery + '</span><ul class="beers">';

			$.each(breweryData.beers, function(index, beerObj){
				var beer = beerObj.name,
					rating = $.cookie(beer),
					possibleRatings = [5, 4.5, 4, 3.5, 3, 2.5, 2, 1.5, 1, .5];
					input = rating ? '<input type="checkbox" checked>' : '<input type="checkbox">',
					checkedClass = rating ? ' class="checked"' : '';
				breweryHtml +=  '<li data-beer="' + beer + '"' + checkedClass + '>' + input + '<div class="name-and-rating"><span class="beername">' + beer + '</span>' +
									'<select>';

				$.each(possibleRatings, function(i, r){
					var v = rating == r ? '<option value="' + r + '" selected>' + r + '</option>' : '<option value="' + r + '">' + r + '</option>';
					breweryHtml += v;
				});

				breweryHtml +=	'</select></div></li>';
			});
			breweryHtml += '</ul></li>';
			$('#beerlist').append(breweryHtml);
		});	
	}



	/* --------------------------------------------
	 * --UX
	 * -------------------------------------------- */

	/**
	 * scrollToLetter
	 *
	 * scroll the page to the selected letter
	 * @param event: the object from the click
	 */
	function scrollToLetter(event){
		event.preventDefault();
		var letter = $(this).attr('id');

		$('#beerlist > li').each(function(i, e){
			var breweryname = $(e).data('brewery');
			if(letter == breweryname.charAt(0).toLowerCase()){
				$('body, html').animate({
					'scrollTop': $(e).offset().top
				});
				return false;
			}
		});
	}


	/**
	 * deleteAllCookies 
	 * 
	 * remove all the cookies
	 */
	function deleteAllCookies() {
	    var cookies = document.cookie.split(";");

	    for (var i = 0; i < cookies.length; i++) {
	    	var cookie = cookies[i];
	    	var eqPos = cookie.indexOf("=");
	    	var name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
	    	document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT";
	    }
	}

	/**
	 * clearAllData 
	 * 
	 * clear all markings and remove all the cookies
	 * @param event: object from the click
	 */
	function clearAllData(event){
		event.preventDefault();
		deleteAllCookies();
		$('input[type="checkbox"]').removeProp('checked');
		$('li li').removeClass('checked');		
	}



	/* --------------------------------------------
	 * --beer interactions
	 * -------------------------------------------- */

	/**
	 * saveBeerRating 
	 * 
	 * save the selected rating to a cookie
	 * @param event: the object from the change event
	 */
	function saveBeerRating(event){
		event.preventDefault();
		var beername = $(this).parents('li').data('beer'),
			rating = $(this).val();
		
		if($.cookie(beername)){
			$.cookie(beername, rating);
		}
	}


	// =========================

	BEERFEST.init = function(festName){
		//
		// set up cookies to expire after a year
		//
		$.cookie.defaults = {
		    expires: 365
		}

		//
		// get the beers
		//
		$.getJSON('data/' + festName + '.json', function(data){
			renderBeers(data);
			// console.log(data);
		});



		$('#beerlist').on('click', '.beername', function(event){
			event.preventDefault();
			$(this).parent().siblings('input[type="checkbox"]').prop("checked", function(i, val){
				return !val;
			}).trigger('change');
		});

		$('#beerlist').on('change', 'input[type="checkbox"]', function(event){
			event.preventDefault();
			var beername = $(this).parent().data('beer'),
				rating = $(this).parent().find('select').val();
			if($(this).prop('checked')){
				$.cookie(beername, rating);
			} else {
				$.removeCookie(beername);
			}
			$(this).parent().toggleClass('checked');
		});

		$('#beerlist').on('change', 'select', saveBeerRating);

		$('#clearall').on('click', clearAllData);

		$('#scrollit li').on('click', scrollToLetter);
	}

	$(document).ready(function(){
		// initialize the drinking!	
		BEERFEST.init(BEERFEST.name);
	});

})(window.BEERFEST = window.BEERFEST || {}, jQuery, undefined);
