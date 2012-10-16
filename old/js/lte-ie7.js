/* Use this script if you need to support IE 7 and IE 6. */

window.onload = function() {
	function addIcon(el, entity) {
		var html = el.innerHTML;
		el.innerHTML = '<span style="font-family: \'icomoon\'">' + entity + '</span>' + html;
	}
	var icons = {
			'icon-tumblr' : '&#x21;',
			'icon-github' : '&#x22;',
			'icon-twitter' : '&#x23;',
			'icon-user' : '&#x25;',
			'icon-briefcase' : '&#x24;',
			'icon-user-2' : '&#x26;',
			'icon-home' : '&#x27;',
			'icon-search' : '&#x28;',
			'icon-map-pin-fill' : '&#x29;'
		},
		els = document.getElementsByTagName('*'),
		i, attr, html, c, el;
	for (i = 0; i < els.length; i += 1) {
		el = els[i];
		attr = el.getAttribute('data-icon');
		if (attr) {
			addIcon(el, attr);
		}
		c = el.className;
		c = c.match(/icon-[^\s'"]+/);
		if (c) {
			addIcon(el, icons[c[0]]);
		}
	}
};