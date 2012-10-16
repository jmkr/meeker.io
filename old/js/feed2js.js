/**
* Feed2JS using the Google Feed API
* 
* Inspired by Feed2JS (http://feed2js.org)
* 
* Author: Richard Davies (http://www.richarddavies.us)
*
* Example Usage:
* 	<!-- Requires the Google Loader and API key from http://code.google.com/apis/loader/signup.html -->
* 	<script src="https://www.google.com/jsapi?key=YOUR_KEY_HERE"></script>
* 	<script src="feed2js.js" data-src="http://www.example.com/feed.xml" data-num="3" data-html="n" data-pc="y"></script>
* 
* Attributes 		* = default value
* 	data-src 	URL of feed
* 	data-chan 	Display channel?
* 		y* 		Display title and description
* 		title		Display title only
* 		n 		Don't Display title or description
* 	data-num 	Max number of feed items to display
* 		0* 		Display all items (max 100 items)
* 	data-desc 	Display item descriptions?
* 		y* 		Display description
* 		n 		No description
* 	data-html 	Use HTML in item description?
* 		y* 		Use HTML from feed, ignoring data-desc character limit
* 		n 		Use plain text description snippet (< 120 characters)
* 	data-date 	Display time and date for each item
* 		y 		Display date/time
* 		n*		No date/time
* 	pc 		Podcast (media) enclosures (for RSS 2.0 feeds with enclosures)
* 		y 		Display link to media files
* 		n* 		Don't display media files
* 
* Google Feed API Documentation
* 		http://code.google.com/apis/ajaxfeeds/documentation/reference.html
*/


// Get a reference to the currently executing <script> element
// Since scripts are executed sequentially the currently executing script is always the last script in the DOM so far.
// (Unless executing script adds any additional script elements, as google.load() does... so put it first)
var scripts = document.getElementsByTagName('script');
var thisScript = scripts[scripts.length - 1];


// If this is the first execution on the page initialize some global variables and load Google Feeds API  
if (typeof feed2js_idx === 'undefined') {
	var feed2js_idx = 0;					// Global var to track current index # (for multiple feeds on a page)
	var feed2js_DOMready = false;		// Global flag to signal when DOM has finished loading 

	google.load('feeds', '1');
	google.setOnLoadCallback(function() {
		feed2js_DOMready = true;
	});	// i.e. <body onload="...">
}


(function() {
	var idx = feed2js_idx++;
	var id = 'rss-box-' + (idx+1);

	var attributes = new Object();
	attributes.feedURL = thisScript.getAttribute('data-src');
	attributes.chan = thisScript.getAttribute('data-chan') || 'y';
	attributes.num = thisScript.getAttribute('data-num') || 0;
	attributes.desc = thisScript.getAttribute('data-desc') || 'y';
	attributes.html = thisScript.getAttribute('data-html') || 'y';
	attributes.date = thisScript.getAttribute('data-date') || 'n';
	attributes.pc = thisScript.getAttribute('data-pc') || 'n';

	if (attributes.num <= 0)
		attributes.num = 100;

	// Create container div element for feed and insert into DOM after current <script> element
	var container = document.createElement('div');
	container.id = id;
	container.className = 'rss-box';
	thisScript.parentNode.insertBefore(container, thisScript.nextSibling);

	// There is a new WHATWG proposal to add document.currentScript, but it only works in Firefox as of Oct. 2011
//	document.currentScript.parentNode.insertBefore(container, document.currentScript.nextSibling);

	// Wait unti feed2js_DOMready is true before proceeding
	var intervalID = setInterval(function() {
		if (feed2js_DOMready) {
			clearInterval(intervalID);

			// Create a Google Feed API instance that will grab RSS feed
			var feed = new google.feeds.Feed(attributes.feedURL);

			// Set number of feed items to load
			feed.setNumEntries(attributes.num);

			// Request the feed and call the callback function with the result
			feed.load(function(result) {
				// Grab the DOM container we will put the results into
				var container = document.getElementById(id);

				if (!result.error) {
					// Build feed title and description
					if (attributes.chan == 'y' || attributes.chan == 'title') {
						// Feed title
						var title = document.createElement('div');
						title.className = 'rss-title';
						title.innerHTML = '<a href="{url}">{title}</a>'.supplant({
							title: result.feed.title,
							url: result.feed.link
						});
						// Include feed description?
						if (attributes.chan == 'y')
							title.innerHTML += '<br />{desc}'.supplant({
								desc: result.feed.description
							});

						// Output title and description
						container.appendChild(title);
					}

					// Build list of feed items
					var ul = document.createElement('ul');
					ul.className = 'rss-items';
					for (var i = 0; i < result.feed.entries.length; i++) {
						var entry = result.feed.entries[i];
						var li = document.createElement('li');
						li.className = 'rss-item';
						//console.log("what is a? :" + entry.title);
						//Don't output "Photo" for pics that dont have captions
						if(entry.title == "Photo"){
							entry.title = "";
						}

						li.innerHTML = '<a href="{url}">{title}</a>'.supplant({
							title: entry.title,
							url: entry.link
						});
						// Include item timestamp?
						if (attributes.date == 'y') {
							var entryDate = new Date(entry.publishedDate);
							li.innerHTML += '<br /><span class="rss-date">{date}</span>'.supplant({
								date: entryDate.toLocaleString()
							});
						}
						// Include item description?
						if (attributes.desc == 'y')
							li.innerHTML += '<br />{desc}'.supplant({
								desc: attributes.html == 'y' ? entry.content : entry.contentSnippet
							});
						// Include media enclosures?
						if (attributes.pc == 'y' && entry.mediaGroups) {
							var media = document.createElement('div');
							media.className = 'rss-item-media';
							var p = document.createElement('p');
							p.innerHTML = 'Media files';
							media.appendChild(p);
							var ul2 = document.createElement('ul');
							media.appendChild(ul2);
							for (var prop1 in entry.mediaGroups)
								for (var prop2 in entry.mediaGroups[prop1].contents) {
									var mediaEnc = entry.mediaGroups[prop1].contents[prop2];
									var li2 = document.createElement('li');
									li2.innerHTML += '<a href="{url}" title="{type}">{title}</a> ({size})'.supplant({
										url: mediaEnc.url,
										title: (function() {
											// Extract filename from URL

											var matches = mediaEnc.url.match(/([^\/]*)$/);
											return RegExp.$1;
										})(),
										type: mediaEnc.type,
										size: (function() {
											// Convert file size in bytes to KB or MB
											var fileSizeKB = mediaEnc.fileSize/1024;
											if (fileSizeKB < 1000)
												return Math.round(fileSizeKB) + ' KB';
											else {
												var fileSizeMB = fileSizeKB/1024;
												return Math.round(fileSizeMB*10)/10 + ' MB';
											}
										})()
									});
									ul2.appendChild(li2);
								}
							li.appendChild(media);
						}

						ul.appendChild(li);
					}

					// Output list of feed items
					container.appendChild(ul);
				} else {		// Error loading feed
					container.className += ' rss-error';
					var errorHead = document.createElement('p');
					errorHead.innerHTML = '<strong>ERROR: The following error occurred while loading the feed <a href="{feedURL}">{feedURL}</a>:</strong>'.supplant({
						feedURL: attributes.feedURL
					});
					var errorMsg = document.createElement('p');
					errorMsg.innerHTML = '{code} {desc}'.supplant({
						code: result.error.code,
						desc: result.error.message
					});
					var errorHelp = document.createElement('p');
					errorHelp.innerHTML = 'Please verify that the <a href="{feedURL}">feed URL</a> works in your browser and that the feed passes a <a href="{validatorURL}">validator test</a>.'.supplant({
						feedURL: attributes.feedURL,
						validatorURL: 'http://feedvalidator.org/check.cgi?url=' + attributes.feedURL
					});

					// Output error message
					container.appendChild(errorHead);
					container.appendChild(errorMsg);
					container.appendChild(errorHelp);
				}
			});
		}
	}, 100);
})();



// Supplant function allows for variable substitution inside a string
// http://javascript.crockford.com/remedial.html
String.prototype.supplant = function (o) {
	return this.replace(/{([^{}]*)}/g,
		function (a, b) {
			var r = o[b];
			return typeof r === 'string' || typeof r === 'number' ? r : a;
		}
	);
};