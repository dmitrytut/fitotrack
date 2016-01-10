/**
 * @fileOverview
 * common.js
 * Common scripts for web site.
 */


/**
 * @function
 * setTimezoneCookie
 * Function for storing current user timezone in the cookies.
 */
function setTimezoneCookie() {

	var timezone_cookie = "tz";
	// Invert tz
	var timezone_offset = (new Date().getTimezoneOffset())*(-1);

	// if the timezone cookie not exists create one.
	if (!$.cookie(timezone_cookie)) {
		// check if the browser supports cookie
		var isCookiesEnabled = 'isCookiesEnabled';
		$.cookie(isCookiesEnabled, true);
		// browser supports cookie
		if ($.cookie(isCookiesEnabled)) {
			// delete the test cookie
			//$.cookie(isCookiesEnabled, null);
			$.removeCookie(isCookiesEnabled, { path: '/' });
			// create a new cookie 
			$.cookie(timezone_cookie, timezone_offset, { path: '/' });
		}
	}
	else {
		// if the current timezone and the one stored in cookie are different
		// then store the new timezone in the cookie and refresh the page.

		var storedOffset = parseInt($.cookie(timezone_cookie));
		var currentOffset = timezone_offset;

		// user may have changed the timezone
		if (storedOffset !== currentOffset) {
		    $.cookie(timezone_cookie, timezone_offset, { path: '/' });
		}
	}
}

$(document).ready(function () {
	//Setting current timezone cookie.
	setTimezoneCookie();
});

