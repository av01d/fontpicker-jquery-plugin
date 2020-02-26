/**
 * jQuery.fontpicker - A font picker for Google Web Fonts and local fonts.
 *
 * Made by Arjan Haverkamp, https://www.webgear.nl
 * Copyright 2020 Arjan Haverkamp
 * MIT Licensed
 * @version 0.2 - 2020-02-26
 * @url https://github.com/av01d/fontpicker-jquery-plugin
 */

(function($){

	var pluginName = 'fontpicker';
	var fontsLoaded = {};

	var googleFontLangs = {
		'arabic': 'Arabic',
		'bengali': 'Bengali',
		'chinese-hongkong': 'Chinese (Hong Kong)',
		'chinese-simplified': 'Chinese (Simplified',
		'chinese-traditional': 'Chinese (Traditional)',
		'cyrillic': 'Cyrillic',
		'cyrillic-ext': 'Cyrillic Extended',
		'devanagari': 'Devanagari',
		'greek': 'Greek',
		'greek-ext': 'Greek Extended',
		'gujarati': 'Gujarati',
		'gurmukhi': 'Gurmukhi',
		'hebrew': 'Hebrew',
		'japanese': 'Japanese',
		'kannada': 'Kannada',
		'khmer': 'Khmer',
		'korean': 'Korean',
		'latin': 'Latin',
		'latin-ext': 'Latin Extended',
		'malayalam': 'Malayalam',
		'myanmar': 'Myanmar',
		'oriya': 'Oriya',
		'sinhala': 'Sinhala',
		'tamil': 'Tamil',
		'telugu': 'Telugu',
		'thai': 'Thai',
		'tibetan': 'Tibetan',
		'vietnamese': 'Vietnamese'
	};

	var googleFontCats = ['serif', 'sans-serif', 'display', 'handwriting', 'monospace'];

	$.fn.fontpicker = function(options) {
		var __scrollIntoViewIfNeeded = function(elem) {
			var container = elem.parentElement;
			var rectElem = elem.getBoundingClientRect(), rectContainer = container.getBoundingClientRect();
			if (rectElem.bottom > rectContainer.bottom) { elem.scrollIntoView(false); }
			if (rectElem.top < rectContainer.top) { elem.scrollIntoView(); }
		};

		/**
		 * Utility function for getting/setting cookies.
		 * This function stores multiple values in one single cookie: max efficiency!
		 * Also: this function gets/sets cookies that PHP can also get/set (static Cookie class).
		 * Cookies are valid for 365 days.
		 *
		 * @param {string} key Name of the value to store.
		 * @param {string} value Value to store. Omit to get a cookie, provide to set a cookie.
		 * @return {string} The value for a cookie (when value is omitted, of course).
		 */
		var __cookie = function(key, value) {
			var cookieName = 'jqfs', cookieDays = 365, result, date = new Date(), jar = {}, expires = '', x, pts, pt;
			result = (result = new RegExp('(?:^|; )'+cookieName+'=([^;]*)').exec(document.cookie)) ? decodeURIComponent(result[1]) : null;

			if (null !== result) {
				pts = result.split('||');
				for (x in pts) {
					try {
						pt = pts[x].split('|',2);
						jar[pt[0]] = pt[1];
					} catch (e) {}
				}
			}

			// Get cookie:
			if (1 === arguments.length) {
				return jar[key];
			}

			// Set cookie
			if (null === value || false === value) {
				delete jar[key];
			}
			else {
				jar[key] = value;
			}

			pts = [];
			for (x in jar) {
				pts.push(x+'|'+jar[x]);
			}

			if (cookieDays > 0) {
				date.setTime(date.getTime()+(cookieDays*24*60*60*1000));
				expires = '; expires='+date.toGMTString();
			}
			document.cookie = cookieName + '=' + encodeURIComponent(pts.join('||')) + expires + '; path=/';
		};

		var __googleFonts = {
			// Fetched from https://developers.google.com/fonts/docs/developer_api @ feb. 2020
			"ABeeZee": {
				"category": "sans-serif",
				"variants": "400,400i",
				"subsets": "latin"
			},
			"Abel": {
				"category": "sans-serif",
				"variants": "400",
				"subsets": "latin"
			},
			"Abhaya Libre": {
				"category": "serif",
				"variants": "400,500,600,700,800",
				"subsets": "sinhala,latin-ext,latin"
			},
			"Abril Fatface": {
				"category": "display",
				"variants": "400",
				"subsets": "latin-ext,latin"
			},
			"Aclonica": {
				"category": "sans-serif",
				"variants": "400",
				"subsets": "latin"
			},
			"Acme": {
				"category": "sans-serif",
				"variants": "400",
				"subsets": "latin"
			},
			"Actor": {
				"category": "sans-serif",
				"variants": "400",
				"subsets": "latin"
			},
			"Adamina": {
				"category": "serif",
				"variants": "400",
				"subsets": "latin"
			},
			"Advent Pro": {
				"category": "sans-serif",
				"variants": "100,200,300,400,500,600,700",
				"subsets": "greek,latin-ext,latin"
			},
			"Aguafina Script": {
				"category": "handwriting",
				"variants": "400",
				"subsets": "latin-ext,latin"
			},
			"Akronim": {
				"category": "display",
				"variants": "400",
				"subsets": "latin-ext,latin"
			},
			"Aladin": {
				"category": "handwriting",
				"variants": "400",
				"subsets": "latin-ext,latin"
			},
			"Alata": {
				"category": "sans-serif",
				"variants": "400",
				"subsets": "latin-ext,latin,vietnamese"
			},
			"Alatsi": {
				"category": "sans-serif",
				"variants": "400",
				"subsets": "latin-ext,latin,vietnamese"
			},
			"Aldrich": {
				"category": "sans-serif",
				"variants": "400",
				"subsets": "latin"
			},
			"Alef": {
				"category": "sans-serif",
				"variants": "400,700",
				"subsets": "hebrew,latin"
			},
			"Alegreya": {
				"category": "serif",
				"variants": "400,400i,500,500i,700,700i,800,800i,900,900i",
				"subsets": "cyrillic-ext,greek,greek-ext,latin-ext,latin,vietnamese,cyrillic"
			},
			"Alegreya SC": {
				"category": "serif",
				"variants": "400,400i,500,500i,700,700i,800,800i,900,900i",
				"subsets": "cyrillic-ext,greek,greek-ext,latin-ext,latin,vietnamese,cyrillic"
			},
			"Alegreya Sans": {
				"category": "sans-serif",
				"variants": "100,100i,300,300i,400,400i,500,500i,700,700i,800,800i,900,900i",
				"subsets": "cyrillic-ext,greek,greek-ext,latin-ext,latin,vietnamese,cyrillic"
			},
			"Alegreya Sans SC": {
				"category": "sans-serif",
				"variants": "100,100i,300,300i,400,400i,500,500i,700,700i,800,800i,900,900i",
				"subsets": "cyrillic-ext,greek,greek-ext,latin-ext,latin,vietnamese,cyrillic"
			},
			"Aleo": {
				"category": "serif",
				"variants": "300,300i,400,400i,700,700i",
				"subsets": "latin-ext,latin"
			},
			"Alex Brush": {
				"category": "handwriting",
				"variants": "400",
				"subsets": "latin-ext,latin"
			},
			"Alfa Slab One": {
				"category": "display",
				"variants": "400",
				"subsets": "latin-ext,latin,vietnamese"
			},
			"Alice": {
				"category": "serif",
				"variants": "400",
				"subsets": "cyrillic-ext,latin,cyrillic"
			},
			"Alike": {
				"category": "serif",
				"variants": "400",
				"subsets": "latin"
			},
			"Alike Angular": {
				"category": "serif",
				"variants": "400",
				"subsets": "latin"
			},
			"Allan": {
				"category": "display",
				"variants": "400,700",
				"subsets": "latin-ext,latin"
			},
			"Allerta": {
				"category": "sans-serif",
				"variants": "400",
				"subsets": "latin"
			},
			"Allerta Stencil": {
				"category": "sans-serif",
				"variants": "400",
				"subsets": "latin"
			},
			"Allura": {
				"category": "handwriting",
				"variants": "400",
				"subsets": "latin-ext,latin"
			},
			"Almarai": {
				"category": "sans-serif",
				"variants": "300,400,700,800",
				"subsets": "arabic"
			},
			"Almendra": {
				"category": "serif",
				"variants": "400,400i,700,700i",
				"subsets": "latin-ext,latin"
			},
			"Almendra Display": {
				"category": "display",
				"variants": "400",
				"subsets": "latin-ext,latin"
			},
			"Almendra SC": {
				"category": "serif",
				"variants": "400",
				"subsets": "latin"
			},
			"Amarante": {
				"category": "display",
				"variants": "400",
				"subsets": "latin-ext,latin"
			},
			"Amaranth": {
				"category": "sans-serif",
				"variants": "400,400i,700,700i",
				"subsets": "latin"
			},
			"Amatic SC": {
				"category": "handwriting",
				"variants": "400,700",
				"subsets": "hebrew,latin-ext,latin,vietnamese,cyrillic"
			},
			"Amethysta": {
				"category": "serif",
				"variants": "400",
				"subsets": "latin"
			},
			"Amiko": {
				"category": "sans-serif",
				"variants": "400,600,700",
				"subsets": "devanagari,latin-ext,latin"
			},
			"Amiri": {
				"category": "serif",
				"variants": "400,400i,700,700i",
				"subsets": "latin-ext,latin,arabic"
			},
			"Amita": {
				"category": "handwriting",
				"variants": "400,700",
				"subsets": "devanagari,latin-ext,latin"
			},
			"Anaheim": {
				"category": "sans-serif",
				"variants": "400",
				"subsets": "latin-ext,latin"
			},
			"Andada": {
				"category": "serif",
				"variants": "400",
				"subsets": "latin-ext,latin"
			},
			"Andika": {
				"category": "sans-serif",
				"variants": "400",
				"subsets": "cyrillic-ext,latin-ext,latin,vietnamese,cyrillic"
			},
			"Angkor": {
				"category": "display",
				"variants": "400",
				"subsets": "khmer"
			},
			"Annie Use Your Telescope": {
				"category": "handwriting",
				"variants": "400",
				"subsets": "latin"
			},
			"Anonymous Pro": {
				"category": "monospace",
				"variants": "400,400i,700,700i",
				"subsets": "greek,latin-ext,latin,cyrillic"
			},
			"Antic": {
				"category": "sans-serif",
				"variants": "400",
				"subsets": "latin"
			},
			"Antic Didone": {
				"category": "serif",
				"variants": "400",
				"subsets": "latin"
			},
			"Antic Slab": {
				"category": "serif",
				"variants": "400",
				"subsets": "latin"
			},
			"Anton": {
				"category": "sans-serif",
				"variants": "400",
				"subsets": "latin-ext,latin,vietnamese"
			},
			"Arapey": {
				"category": "serif",
				"variants": "400,400i",
				"subsets": "latin"
			},
			"Arbutus": {
				"category": "display",
				"variants": "400",
				"subsets": "latin-ext,latin"
			},
			"Arbutus Slab": {
				"category": "serif",
				"variants": "400",
				"subsets": "latin-ext,latin"
			},
			"Architects Daughter": {
				"category": "handwriting",
				"variants": "400",
				"subsets": "latin"
			},
			"Archivo": {
				"category": "sans-serif",
				"variants": "400,400i,500,500i,600,600i,700,700i",
				"subsets": "latin-ext,latin,vietnamese"
			},
			"Archivo Black": {
				"category": "sans-serif",
				"variants": "400",
				"subsets": "latin-ext,latin"
			},
			"Archivo Narrow": {
				"category": "sans-serif",
				"variants": "400,400i,500,500i,600,600i,700,700i",
				"subsets": "latin-ext,latin,vietnamese"
			},
			"Aref Ruqaa": {
				"category": "serif",
				"variants": "400,700",
				"subsets": "latin,arabic"
			},
			"Arima Madurai": {
				"category": "display",
				"variants": "100,200,300,400,500,700,800,900",
				"subsets": "latin-ext,latin,vietnamese,tamil"
			},
			"Arimo": {
				"category": "sans-serif",
				"variants": "400,400i,700,700i",
				"subsets": "cyrillic-ext,greek,hebrew,greek-ext,latin-ext,latin,vietnamese,cyrillic"
			},
			"Arizonia": {
				"category": "handwriting",
				"variants": "400",
				"subsets": "latin-ext,latin"
			},
			"Armata": {
				"category": "sans-serif",
				"variants": "400",
				"subsets": "latin-ext,latin"
			},
			"Arsenal": {
				"category": "sans-serif",
				"variants": "400,400i,700,700i",
				"subsets": "cyrillic-ext,latin-ext,latin,vietnamese,cyrillic"
			},
			"Artifika": {
				"category": "serif",
				"variants": "400",
				"subsets": "latin"
			},
			"Arvo": {
				"category": "serif",
				"variants": "400,400i,700,700i",
				"subsets": "latin"
			},
			"Arya": {
				"category": "sans-serif",
				"variants": "400,700",
				"subsets": "devanagari,latin-ext,latin"
			},
			"Asap": {
				"category": "sans-serif",
				"variants": "400,400i,500,500i,600,600i,700,700i",
				"subsets": "latin-ext,latin,vietnamese"
			},
			"Asap Condensed": {
				"category": "sans-serif",
				"variants": "400,400i,500,500i,600,600i,700,700i",
				"subsets": "latin-ext,latin,vietnamese"
			},
			"Asar": {
				"category": "serif",
				"variants": "400",
				"subsets": "devanagari,latin-ext,latin"
			},
			"Asset": {
				"category": "display",
				"variants": "400",
				"subsets": "latin"
			},
			"Assistant": {
				"category": "sans-serif",
				"variants": "200,300,400,600,700,800",
				"subsets": "hebrew,latin"
			},
			"Astloch": {
				"category": "display",
				"variants": "400,700",
				"subsets": "latin"
			},
			"Asul": {
				"category": "sans-serif",
				"variants": "400,700",
				"subsets": "latin"
			},
			"Athiti": {
				"category": "sans-serif",
				"variants": "200,300,400,500,600,700",
				"subsets": "thai,latin-ext,latin,vietnamese"
			},
			"Atma": {
				"category": "display",
				"variants": "300,400,500,600,700",
				"subsets": "bengali,latin-ext,latin"
			},
			"Atomic Age": {
				"category": "display",
				"variants": "400",
				"subsets": "latin"
			},
			"Aubrey": {
				"category": "display",
				"variants": "400",
				"subsets": "latin"
			},
			"Audiowide": {
				"category": "display",
				"variants": "400",
				"subsets": "latin-ext,latin"
			},
			"Autour One": {
				"category": "display",
				"variants": "400",
				"subsets": "latin-ext,latin"
			},
			"Average": {
				"category": "serif",
				"variants": "400",
				"subsets": "latin-ext,latin"
			},
			"Average Sans": {
				"category": "sans-serif",
				"variants": "400",
				"subsets": "latin-ext,latin"
			},
			"Averia Gruesa Libre": {
				"category": "display",
				"variants": "400",
				"subsets": "latin-ext,latin"
			},
			"Averia Libre": {
				"category": "display",
				"variants": "300,300i,400,400i,700,700i",
				"subsets": "latin"
			},
			"Averia Sans Libre": {
				"category": "display",
				"variants": "300,300i,400,400i,700,700i",
				"subsets": "latin"
			},
			"Averia Serif Libre": {
				"category": "display",
				"variants": "300,300i,400,400i,700,700i",
				"subsets": "latin"
			},
			"B612": {
				"category": "sans-serif",
				"variants": "400,400i,700,700i",
				"subsets": "latin"
			},
			"B612 Mono": {
				"category": "monospace",
				"variants": "400,400i,700,700i",
				"subsets": "latin"
			},
			"Bad Script": {
				"category": "handwriting",
				"variants": "400",
				"subsets": "latin,cyrillic"
			},
			"Bahiana": {
				"category": "display",
				"variants": "400",
				"subsets": "latin-ext,latin"
			},
			"Bahianita": {
				"category": "display",
				"variants": "400",
				"subsets": "latin-ext,latin,vietnamese"
			},
			"Bai Jamjuree": {
				"category": "sans-serif",
				"variants": "200,200i,300,300i,400,400i,500,500i,600,600i,700,700i",
				"subsets": "thai,latin-ext,latin,vietnamese"
			},
			"Baloo": {
				"category": "display",
				"variants": "400",
				"subsets": "devanagari,latin-ext,latin,vietnamese"
			},
			"Baloo Bhai": {
				"category": "display",
				"variants": "400",
				"subsets": "gujarati,latin-ext,latin,vietnamese"
			},
			"Baloo Bhaijaan": {
				"category": "display",
				"variants": "400",
				"subsets": "latin-ext,latin,vietnamese,arabic"
			},
			"Baloo Bhaina": {
				"category": "display",
				"variants": "400",
				"subsets": "latin-ext,oriya,latin,vietnamese"
			},
			"Baloo Chettan": {
				"category": "display",
				"variants": "400",
				"subsets": "malayalam,latin-ext,latin,vietnamese"
			},
			"Baloo Da": {
				"category": "display",
				"variants": "400",
				"subsets": "bengali,latin-ext,latin,vietnamese"
			},
			"Baloo Paaji": {
				"category": "display",
				"variants": "400",
				"subsets": "gurmukhi,latin-ext,latin,vietnamese"
			},
			"Baloo Tamma": {
				"category": "display",
				"variants": "400",
				"subsets": "kannada,latin-ext,latin,vietnamese"
			},
			"Baloo Tammudu": {
				"category": "display",
				"variants": "400",
				"subsets": "latin-ext,latin,telugu,vietnamese"
			},
			"Baloo Thambi": {
				"category": "display",
				"variants": "400",
				"subsets": "latin-ext,latin,vietnamese,tamil"
			},
			"Balthazar": {
				"category": "serif",
				"variants": "400",
				"subsets": "latin"
			},
			"Bangers": {
				"category": "display",
				"variants": "400",
				"subsets": "latin-ext,latin,vietnamese"
			},
			"Barlow": {
				"category": "sans-serif",
				"variants": "100,100i,200,200i,300,300i,400,400i,500,500i,600,600i,700,700i,800,800i,900,900i",
				"subsets": "latin-ext,latin,vietnamese"
			},
			"Barlow Condensed": {
				"category": "sans-serif",
				"variants": "100,100i,200,200i,300,300i,400,400i,500,500i,600,600i,700,700i,800,800i,900,900i",
				"subsets": "latin-ext,latin,vietnamese"
			},
			"Barlow Semi Condensed": {
				"category": "sans-serif",
				"variants": "100,100i,200,200i,300,300i,400,400i,500,500i,600,600i,700,700i,800,800i,900,900i",
				"subsets": "latin-ext,latin,vietnamese"
			},
			"Barriecito": {
				"category": "display",
				"variants": "400",
				"subsets": "latin-ext,latin,vietnamese"
			},
			"Barrio": {
				"category": "display",
				"variants": "400",
				"subsets": "latin-ext,latin"
			},
			"Basic": {
				"category": "sans-serif",
				"variants": "400",
				"subsets": "latin-ext,latin"
			},
			"Baskervville": {
				"category": "serif",
				"variants": "400,400i",
				"subsets": "latin-ext,latin"
			},
			"Battambang": {
				"category": "display",
				"variants": "400,700",
				"subsets": "khmer"
			},
			"Baumans": {
				"category": "display",
				"variants": "400",
				"subsets": "latin"
			},
			"Bayon": {
				"category": "display",
				"variants": "400",
				"subsets": "khmer"
			},
			"Be Vietnam": {
				"category": "sans-serif",
				"variants": "100,100i,300,300i,400,400i,500,500i,600,600i,700,700i,800,800i",
				"subsets": "latin-ext,latin,vietnamese"
			},
			"Bebas Neue": {
				"category": "display",
				"variants": "400",
				"subsets": "latin-ext,latin"
			},
			"Belgrano": {
				"category": "serif",
				"variants": "400",
				"subsets": "latin"
			},
			"Bellefair": {
				"category": "serif",
				"variants": "400",
				"subsets": "hebrew,latin-ext,latin"
			},
			"Belleza": {
				"category": "sans-serif",
				"variants": "400",
				"subsets": "latin-ext,latin"
			},
			"BenchNine": {
				"category": "sans-serif",
				"variants": "300,400,700",
				"subsets": "latin-ext,latin"
			},
			"Bentham": {
				"category": "serif",
				"variants": "400",
				"subsets": "latin"
			},
			"Berkshire Swash": {
				"category": "handwriting",
				"variants": "400",
				"subsets": "latin-ext,latin"
			},
			"Beth Ellen": {
				"category": "handwriting",
				"variants": "400",
				"subsets": "latin"
			},
			"Bevan": {
				"category": "display",
				"variants": "400",
				"subsets": "latin-ext,latin,vietnamese"
			},
			"Big Shoulders Display": {
				"category": "display",
				"variants": "100,300,400,500,600,700,800,900",
				"subsets": "latin-ext,latin,vietnamese"
			},
			"Big Shoulders Text": {
				"category": "display",
				"variants": "100,300,400,500,600,700,800,900",
				"subsets": "latin-ext,latin,vietnamese"
			},
			"Bigelow Rules": {
				"category": "display",
				"variants": "400",
				"subsets": "latin-ext,latin"
			},
			"Bigshot One": {
				"category": "display",
				"variants": "400",
				"subsets": "latin"
			},
			"Bilbo": {
				"category": "handwriting",
				"variants": "400",
				"subsets": "latin-ext,latin"
			},
			"Bilbo Swash Caps": {
				"category": "handwriting",
				"variants": "400",
				"subsets": "latin-ext,latin"
			},
			"BioRhyme": {
				"category": "serif",
				"variants": "200,300,400,700,800",
				"subsets": "latin-ext,latin"
			},
			"BioRhyme Expanded": {
				"category": "serif",
				"variants": "200,300,400,700,800",
				"subsets": "latin-ext,latin"
			},
			"Biryani": {
				"category": "sans-serif",
				"variants": "200,300,400,600,700,800,900",
				"subsets": "devanagari,latin-ext,latin"
			},
			"Bitter": {
				"category": "serif",
				"variants": "400,400i,700",
				"subsets": "latin-ext,latin"
			},
			"Black And White Picture": {
				"category": "sans-serif",
				"variants": "400",
				"subsets": "latin,korean"
			},
			"Black Han Sans": {
				"category": "sans-serif",
				"variants": "400",
				"subsets": "latin,korean"
			},
			"Black Ops One": {
				"category": "display",
				"variants": "400",
				"subsets": "latin-ext,latin"
			},
			"Blinker": {
				"category": "sans-serif",
				"variants": "100,200,300,400,600,700,800,900",
				"subsets": "latin-ext,latin"
			},
			"Bokor": {
				"category": "display",
				"variants": "400",
				"subsets": "khmer"
			},
			"Bonbon": {
				"category": "handwriting",
				"variants": "400",
				"subsets": "latin"
			},
			"Boogaloo": {
				"category": "display",
				"variants": "400",
				"subsets": "latin"
			},
			"Bowlby One": {
				"category": "display",
				"variants": "400",
				"subsets": "latin"
			},
			"Bowlby One SC": {
				"category": "display",
				"variants": "400",
				"subsets": "latin-ext,latin"
			},
			"Brawler": {
				"category": "serif",
				"variants": "400",
				"subsets": "latin"
			},
			"Bree Serif": {
				"category": "serif",
				"variants": "400",
				"subsets": "latin-ext,latin"
			},
			"Bubblegum Sans": {
				"category": "display",
				"variants": "400",
				"subsets": "latin-ext,latin"
			},
			"Bubbler One": {
				"category": "sans-serif",
				"variants": "400",
				"subsets": "latin-ext,latin"
			},
			"Buda": {
				"category": "display",
				"variants": "300",
				"subsets": "latin"
			},
			"Buenard": {
				"category": "serif",
				"variants": "400,700",
				"subsets": "latin-ext,latin"
			},
			"Bungee": {
				"category": "display",
				"variants": "400",
				"subsets": "latin-ext,latin,vietnamese"
			},
			"Bungee Hairline": {
				"category": "display",
				"variants": "400",
				"subsets": "latin-ext,latin,vietnamese"
			},
			"Bungee Inline": {
				"category": "display",
				"variants": "400",
				"subsets": "latin-ext,latin,vietnamese"
			},
			"Bungee Outline": {
				"category": "display",
				"variants": "400",
				"subsets": "latin-ext,latin,vietnamese"
			},
			"Bungee Shade": {
				"category": "display",
				"variants": "400",
				"subsets": "latin-ext,latin,vietnamese"
			},
			"Butcherman": {
				"category": "display",
				"variants": "400",
				"subsets": "latin-ext,latin"
			},
			"Butterfly Kids": {
				"category": "handwriting",
				"variants": "400",
				"subsets": "latin-ext,latin"
			},
			"Cabin": {
				"category": "sans-serif",
				"variants": "400,400i,500,500i,600,600i,700,700i",
				"subsets": "latin-ext,latin,vietnamese"
			},
			"Cabin Condensed": {
				"category": "sans-serif",
				"variants": "400,500,600,700",
				"subsets": "latin-ext,latin,vietnamese"
			},
			"Cabin Sketch": {
				"category": "display",
				"variants": "400,700",
				"subsets": "latin"
			},
			"Caesar Dressing": {
				"category": "display",
				"variants": "400",
				"subsets": "latin"
			},
			"Cagliostro": {
				"category": "sans-serif",
				"variants": "400",
				"subsets": "latin"
			},
			"Cairo": {
				"category": "sans-serif",
				"variants": "200,300,400,600,700,900",
				"subsets": "latin-ext,latin,arabic"
			},
			"Calistoga": {
				"category": "display",
				"variants": "400",
				"subsets": "latin-ext,latin,vietnamese"
			},
			"Calligraffitti": {
				"category": "handwriting",
				"variants": "400",
				"subsets": "latin"
			},
			"Cambay": {
				"category": "sans-serif",
				"variants": "400,400i,700,700i",
				"subsets": "devanagari,latin-ext,latin"
			},
			"Cambo": {
				"category": "serif",
				"variants": "400",
				"subsets": "latin"
			},
			"Candal": {
				"category": "sans-serif",
				"variants": "400",
				"subsets": "latin"
			},
			"Cantarell": {
				"category": "sans-serif",
				"variants": "400,400i,700,700i",
				"subsets": "latin"
			},
			"Cantata One": {
				"category": "serif",
				"variants": "400",
				"subsets": "latin-ext,latin"
			},
			"Cantora One": {
				"category": "sans-serif",
				"variants": "400",
				"subsets": "latin-ext,latin"
			},
			"Capriola": {
				"category": "sans-serif",
				"variants": "400",
				"subsets": "latin-ext,latin"
			},
			"Cardo": {
				"category": "serif",
				"variants": "400,400i,700",
				"subsets": "greek,greek-ext,latin-ext,latin"
			},
			"Carme": {
				"category": "sans-serif",
				"variants": "400",
				"subsets": "latin"
			},
			"Carrois Gothic": {
				"category": "sans-serif",
				"variants": "400",
				"subsets": "latin"
			},
			"Carrois Gothic SC": {
				"category": "sans-serif",
				"variants": "400",
				"subsets": "latin"
			},
			"Carter One": {
				"category": "display",
				"variants": "400",
				"subsets": "latin"
			},
			"Catamaran": {
				"category": "sans-serif",
				"variants": "100,200,300,400,500,600,700,800,900",
				"subsets": "latin-ext,latin,tamil"
			},
			"Caudex": {
				"category": "serif",
				"variants": "400,400i,700,700i",
				"subsets": "greek,greek-ext,latin-ext,latin"
			},
			"Caveat": {
				"category": "handwriting",
				"variants": "400,700",
				"subsets": "cyrillic-ext,latin-ext,latin,cyrillic"
			},
			"Caveat Brush": {
				"category": "handwriting",
				"variants": "400",
				"subsets": "latin-ext,latin"
			},
			"Cedarville Cursive": {
				"category": "handwriting",
				"variants": "400",
				"subsets": "latin"
			},
			"Ceviche One": {
				"category": "display",
				"variants": "400",
				"subsets": "latin-ext,latin"
			},
			"Chakra Petch": {
				"category": "sans-serif",
				"variants": "300,300i,400,400i,500,500i,600,600i,700,700i",
				"subsets": "thai,latin-ext,latin,vietnamese"
			},
			"Changa": {
				"category": "sans-serif",
				"variants": "200,300,400,500,600,700,800",
				"subsets": "latin-ext,latin,arabic"
			},
			"Changa One": {
				"category": "display",
				"variants": "400,400i",
				"subsets": "latin"
			},
			"Chango": {
				"category": "display",
				"variants": "400",
				"subsets": "latin-ext,latin"
			},
			"Charm": {
				"category": "handwriting",
				"variants": "400,700",
				"subsets": "thai,latin-ext,latin,vietnamese"
			},
			"Charmonman": {
				"category": "handwriting",
				"variants": "400,700",
				"subsets": "thai,latin-ext,latin,vietnamese"
			},
			"Chathura": {
				"category": "sans-serif",
				"variants": "100,300,400,700,800",
				"subsets": "latin,telugu"
			},
			"Chau Philomene One": {
				"category": "sans-serif",
				"variants": "400,400i",
				"subsets": "latin-ext,latin"
			},
			"Chela One": {
				"category": "display",
				"variants": "400",
				"subsets": "latin-ext,latin"
			},
			"Chelsea Market": {
				"category": "display",
				"variants": "400",
				"subsets": "latin-ext,latin"
			},
			"Chenla": {
				"category": "display",
				"variants": "400",
				"subsets": "khmer"
			},
			"Cherry Cream Soda": {
				"category": "display",
				"variants": "400",
				"subsets": "latin"
			},
			"Cherry Swash": {
				"category": "display",
				"variants": "400,700",
				"subsets": "latin-ext,latin"
			},
			"Chewy": {
				"category": "display",
				"variants": "400",
				"subsets": "latin"
			},
			"Chicle": {
				"category": "display",
				"variants": "400",
				"subsets": "latin-ext,latin"
			},
			"Chilanka": {
				"category": "handwriting",
				"variants": "400",
				"subsets": "malayalam,latin"
			},
			"Chivo": {
				"category": "sans-serif",
				"variants": "300,300i,400,400i,700,700i,900,900i",
				"subsets": "latin-ext,latin"
			},
			"Chonburi": {
				"category": "display",
				"variants": "400",
				"subsets": "thai,latin-ext,latin,vietnamese"
			},
			"Cinzel": {
				"category": "serif",
				"variants": "400,700,900",
				"subsets": "latin-ext,latin"
			},
			"Cinzel Decorative": {
				"category": "display",
				"variants": "400,700,900",
				"subsets": "latin"
			},
			"Clicker Script": {
				"category": "handwriting",
				"variants": "400",
				"subsets": "latin-ext,latin"
			},
			"Coda": {
				"category": "display",
				"variants": "400,800",
				"subsets": "latin-ext,latin"
			},
			"Coda Caption": {
				"category": "sans-serif",
				"variants": "800",
				"subsets": "latin-ext,latin"
			},
			"Codystar": {
				"category": "display",
				"variants": "300,400",
				"subsets": "latin-ext,latin"
			},
			"Coiny": {
				"category": "display",
				"variants": "400",
				"subsets": "latin-ext,latin,vietnamese,tamil"
			},
			"Combo": {
				"category": "display",
				"variants": "400",
				"subsets": "latin-ext,latin"
			},
			"Comfortaa": {
				"category": "display",
				"variants": "300,400,500,600,700",
				"subsets": "cyrillic-ext,greek,latin-ext,latin,vietnamese,cyrillic"
			},
			"Coming Soon": {
				"category": "handwriting",
				"variants": "400",
				"subsets": "latin"
			},
			"Concert One": {
				"category": "display",
				"variants": "400",
				"subsets": "latin-ext,latin"
			},
			"Condiment": {
				"category": "handwriting",
				"variants": "400",
				"subsets": "latin-ext,latin"
			},
			"Content": {
				"category": "display",
				"variants": "400,700",
				"subsets": "khmer"
			},
			"Contrail One": {
				"category": "display",
				"variants": "400",
				"subsets": "latin"
			},
			"Convergence": {
				"category": "sans-serif",
				"variants": "400",
				"subsets": "latin"
			},
			"Cookie": {
				"category": "handwriting",
				"variants": "400",
				"subsets": "latin"
			},
			"Copse": {
				"category": "serif",
				"variants": "400",
				"subsets": "latin"
			},
			"Corben": {
				"category": "display",
				"variants": "400,700",
				"subsets": "latin-ext,latin"
			},
			"Cormorant": {
				"category": "serif",
				"variants": "300,300i,400,400i,500,500i,600,600i,700,700i",
				"subsets": "cyrillic-ext,latin-ext,latin,vietnamese,cyrillic"
			},
			"Cormorant Garamond": {
				"category": "serif",
				"variants": "300,300i,400,400i,500,500i,600,600i,700,700i",
				"subsets": "cyrillic-ext,latin-ext,latin,vietnamese,cyrillic"
			},
			"Cormorant Infant": {
				"category": "serif",
				"variants": "300,300i,400,400i,500,500i,600,600i,700,700i",
				"subsets": "cyrillic-ext,latin-ext,latin,vietnamese,cyrillic"
			},
			"Cormorant SC": {
				"category": "serif",
				"variants": "300,400,500,600,700",
				"subsets": "cyrillic-ext,latin-ext,latin,vietnamese,cyrillic"
			},
			"Cormorant Unicase": {
				"category": "serif",
				"variants": "300,400,500,600,700",
				"subsets": "cyrillic-ext,latin-ext,latin,vietnamese,cyrillic"
			},
			"Cormorant Upright": {
				"category": "serif",
				"variants": "300,400,500,600,700",
				"subsets": "latin-ext,latin,vietnamese"
			},
			"Courgette": {
				"category": "handwriting",
				"variants": "400",
				"subsets": "latin-ext,latin"
			},
			"Courier Prime": {
				"category": "monospace",
				"variants": "400,400i,700,700i",
				"subsets": "latin-ext,latin"
			},
			"Cousine": {
				"category": "monospace",
				"variants": "400,400i,700,700i",
				"subsets": "cyrillic-ext,greek,hebrew,greek-ext,latin-ext,latin,vietnamese,cyrillic"
			},
			"Coustard": {
				"category": "serif",
				"variants": "400,900",
				"subsets": "latin"
			},
			"Covered By Your Grace": {
				"category": "handwriting",
				"variants": "400",
				"subsets": "latin"
			},
			"Crafty Girls": {
				"category": "handwriting",
				"variants": "400",
				"subsets": "latin"
			},
			"Creepster": {
				"category": "display",
				"variants": "400",
				"subsets": "latin"
			},
			"Crete Round": {
				"category": "serif",
				"variants": "400,400i",
				"subsets": "latin-ext,latin"
			},
			"Crimson Pro": {
				"category": "serif",
				"variants": "200,300,400,500,600,700,800,900,200i,300i,400i,500i,600i,700i,800i,900i",
				"subsets": "latin-ext,latin,vietnamese"
			},
			"Crimson Text": {
				"category": "serif",
				"variants": "400,400i,600,600i,700,700i",
				"subsets": "latin"
			},
			"Croissant One": {
				"category": "display",
				"variants": "400",
				"subsets": "latin-ext,latin"
			},
			"Crushed": {
				"category": "display",
				"variants": "400",
				"subsets": "latin"
			},
			"Cuprum": {
				"category": "sans-serif",
				"variants": "400,400i,700,700i",
				"subsets": "cyrillic-ext,latin-ext,latin,vietnamese,cyrillic"
			},
			"Cute Font": {
				"category": "display",
				"variants": "400",
				"subsets": "latin,korean"
			},
			"Cutive": {
				"category": "serif",
				"variants": "400",
				"subsets": "latin-ext,latin"
			},
			"Cutive Mono": {
				"category": "monospace",
				"variants": "400",
				"subsets": "latin-ext,latin"
			},
			"DM Sans": {
				"category": "sans-serif",
				"variants": "400,400i,500,500i,700,700i",
				"subsets": "latin-ext,latin"
			},
			"DM Serif Display": {
				"category": "serif",
				"variants": "400,400i",
				"subsets": "latin-ext,latin"
			},
			"DM Serif Text": {
				"category": "serif",
				"variants": "400,400i",
				"subsets": "latin-ext,latin"
			},
			"Damion": {
				"category": "handwriting",
				"variants": "400",
				"subsets": "latin"
			},
			"Dancing Script": {
				"category": "handwriting",
				"variants": "400,500,600,700",
				"subsets": "latin-ext,latin,vietnamese"
			},
			"Dangrek": {
				"category": "display",
				"variants": "400",
				"subsets": "khmer"
			},
			"Darker Grotesque": {
				"category": "sans-serif",
				"variants": "300,400,500,600,700,800,900",
				"subsets": "latin-ext,latin,vietnamese"
			},
			"David Libre": {
				"category": "serif",
				"variants": "400,500,700",
				"subsets": "hebrew,latin-ext,latin,vietnamese"
			},
			"Dawning of a New Day": {
				"category": "handwriting",
				"variants": "400",
				"subsets": "latin"
			},
			"Days One": {
				"category": "sans-serif",
				"variants": "400",
				"subsets": "latin"
			},
			"Dekko": {
				"category": "handwriting",
				"variants": "400",
				"subsets": "devanagari,latin-ext,latin"
			},
			"Delius": {
				"category": "handwriting",
				"variants": "400",
				"subsets": "latin"
			},
			"Delius Swash Caps": {
				"category": "handwriting",
				"variants": "400",
				"subsets": "latin"
			},
			"Delius Unicase": {
				"category": "handwriting",
				"variants": "400,700",
				"subsets": "latin"
			},
			"Della Respira": {
				"category": "serif",
				"variants": "400",
				"subsets": "latin"
			},
			"Denk One": {
				"category": "sans-serif",
				"variants": "400",
				"subsets": "latin-ext,latin"
			},
			"Devonshire": {
				"category": "handwriting",
				"variants": "400",
				"subsets": "latin-ext,latin"
			},
			"Dhurjati": {
				"category": "sans-serif",
				"variants": "400",
				"subsets": "latin,telugu"
			},
			"Didact Gothic": {
				"category": "sans-serif",
				"variants": "400",
				"subsets": "cyrillic-ext,greek,greek-ext,latin-ext,latin,cyrillic"
			},
			"Diplomata": {
				"category": "display",
				"variants": "400",
				"subsets": "latin-ext,latin"
			},
			"Diplomata SC": {
				"category": "display",
				"variants": "400",
				"subsets": "latin-ext,latin"
			},
			"Do Hyeon": {
				"category": "sans-serif",
				"variants": "400",
				"subsets": "latin,korean"
			},
			"Dokdo": {
				"category": "handwriting",
				"variants": "400",
				"subsets": "latin,korean"
			},
			"Domine": {
				"category": "serif",
				"variants": "400,700",
				"subsets": "latin-ext,latin"
			},
			"Donegal One": {
				"category": "serif",
				"variants": "400",
				"subsets": "latin-ext,latin"
			},
			"Doppio One": {
				"category": "sans-serif",
				"variants": "400",
				"subsets": "latin-ext,latin"
			},
			"Dorsa": {
				"category": "sans-serif",
				"variants": "400",
				"subsets": "latin"
			},
			"Dosis": {
				"category": "sans-serif",
				"variants": "200,300,400,500,600,700,800",
				"subsets": "latin-ext,latin,vietnamese"
			},
			"Dr Sugiyama": {
				"category": "handwriting",
				"variants": "400",
				"subsets": "latin-ext,latin"
			},
			"Duru Sans": {
				"category": "sans-serif",
				"variants": "400",
				"subsets": "latin-ext,latin"
			},
			"Dynalight": {
				"category": "display",
				"variants": "400",
				"subsets": "latin-ext,latin"
			},
			"EB Garamond": {
				"category": "serif",
				"variants": "400,500,600,700,800,400i,500i,600i,700i,800i",
				"subsets": "cyrillic-ext,greek,greek-ext,latin-ext,latin,vietnamese,cyrillic"
			},
			"Eagle Lake": {
				"category": "handwriting",
				"variants": "400",
				"subsets": "latin-ext,latin"
			},
			"East Sea Dokdo": {
				"category": "handwriting",
				"variants": "400",
				"subsets": "latin,korean"
			},
			"Eater": {
				"category": "display",
				"variants": "400",
				"subsets": "latin-ext,latin"
			},
			"Economica": {
				"category": "sans-serif",
				"variants": "400,400i,700,700i",
				"subsets": "latin-ext,latin"
			},
			"Eczar": {
				"category": "serif",
				"variants": "400,500,600,700,800",
				"subsets": "devanagari,latin-ext,latin"
			},
			"El Messiri": {
				"category": "sans-serif",
				"variants": "400,500,600,700",
				"subsets": "latin,arabic,cyrillic"
			},
			"Electrolize": {
				"category": "sans-serif",
				"variants": "400",
				"subsets": "latin"
			},
			"Elsie": {
				"category": "display",
				"variants": "400,900",
				"subsets": "latin-ext,latin"
			},
			"Elsie Swash Caps": {
				"category": "display",
				"variants": "400,900",
				"subsets": "latin-ext,latin"
			},
			"Emblema One": {
				"category": "display",
				"variants": "400",
				"subsets": "latin-ext,latin"
			},
			"Emilys Candy": {
				"category": "display",
				"variants": "400",
				"subsets": "latin-ext,latin"
			},
			"Encode Sans": {
				"category": "sans-serif",
				"variants": "100,200,300,400,500,600,700,800,900",
				"subsets": "latin-ext,latin,vietnamese"
			},
			"Encode Sans Condensed": {
				"category": "sans-serif",
				"variants": "100,200,300,400,500,600,700,800,900",
				"subsets": "latin-ext,latin,vietnamese"
			},
			"Encode Sans Expanded": {
				"category": "sans-serif",
				"variants": "100,200,300,400,500,600,700,800,900",
				"subsets": "latin-ext,latin,vietnamese"
			},
			"Encode Sans Semi Condensed": {
				"category": "sans-serif",
				"variants": "100,200,300,400,500,600,700,800,900",
				"subsets": "latin-ext,latin,vietnamese"
			},
			"Encode Sans Semi Expanded": {
				"category": "sans-serif",
				"variants": "100,200,300,400,500,600,700,800,900",
				"subsets": "latin-ext,latin,vietnamese"
			},
			"Engagement": {
				"category": "handwriting",
				"variants": "400",
				"subsets": "latin"
			},
			"Englebert": {
				"category": "sans-serif",
				"variants": "400",
				"subsets": "latin-ext,latin"
			},
			"Enriqueta": {
				"category": "serif",
				"variants": "400,500,600,700",
				"subsets": "latin-ext,latin"
			},
			"Erica One": {
				"category": "display",
				"variants": "400",
				"subsets": "latin-ext,latin"
			},
			"Esteban": {
				"category": "serif",
				"variants": "400",
				"subsets": "latin-ext,latin"
			},
			"Euphoria Script": {
				"category": "handwriting",
				"variants": "400",
				"subsets": "latin-ext,latin"
			},
			"Ewert": {
				"category": "display",
				"variants": "400",
				"subsets": "latin-ext,latin"
			},
			"Exo": {
				"category": "sans-serif",
				"variants": "100,100i,200,200i,300,300i,400,400i,500,500i,600,600i,700,700i,800,800i,900,900i",
				"subsets": "latin-ext,latin,vietnamese"
			},
			"Exo 2": {
				"category": "sans-serif",
				"variants": "100,100i,200,200i,300,300i,400,400i,500,500i,600,600i,700,700i,800,800i,900,900i",
				"subsets": "cyrillic-ext,latin-ext,latin,vietnamese,cyrillic"
			},
			"Expletus Sans": {
				"category": "display",
				"variants": "400,400i,500,500i,600,600i,700,700i",
				"subsets": "latin"
			},
			"Fahkwang": {
				"category": "sans-serif",
				"variants": "200,200i,300,300i,400,400i,500,500i,600,600i,700,700i",
				"subsets": "thai,latin-ext,latin,vietnamese"
			},
			"Fanwood Text": {
				"category": "serif",
				"variants": "400,400i",
				"subsets": "latin"
			},
			"Farro": {
				"category": "sans-serif",
				"variants": "300,400,500,700",
				"subsets": "latin-ext,latin"
			},
			"Farsan": {
				"category": "display",
				"variants": "400",
				"subsets": "gujarati,latin-ext,latin,vietnamese"
			},
			"Fascinate": {
				"category": "display",
				"variants": "400",
				"subsets": "latin"
			},
			"Fascinate Inline": {
				"category": "display",
				"variants": "400",
				"subsets": "latin"
			},
			"Faster One": {
				"category": "display",
				"variants": "400",
				"subsets": "latin"
			},
			"Fasthand": {
				"category": "serif",
				"variants": "400",
				"subsets": "khmer"
			},
			"Fauna One": {
				"category": "serif",
				"variants": "400",
				"subsets": "latin-ext,latin"
			},
			"Faustina": {
				"category": "serif",
				"variants": "400,500,600,700,400i,500i,600i,700i",
				"subsets": "latin-ext,latin,vietnamese"
			},
			"Federant": {
				"category": "display",
				"variants": "400",
				"subsets": "latin"
			},
			"Federo": {
				"category": "sans-serif",
				"variants": "400",
				"subsets": "latin"
			},
			"Felipa": {
				"category": "handwriting",
				"variants": "400",
				"subsets": "latin-ext,latin"
			},
			"Fenix": {
				"category": "serif",
				"variants": "400",
				"subsets": "latin-ext,latin"
			},
			"Finger Paint": {
				"category": "display",
				"variants": "400",
				"subsets": "latin"
			},
			"Fira Code": {
				"category": "monospace",
				"variants": "300,400,500,600,700",
				"subsets": "cyrillic-ext,greek,greek-ext,latin-ext,latin,cyrillic"
			},
			"Fira Mono": {
				"category": "monospace",
				"variants": "400,500,700",
				"subsets": "cyrillic-ext,greek,greek-ext,latin-ext,latin,cyrillic"
			},
			"Fira Sans": {
				"category": "sans-serif",
				"variants": "100,100i,200,200i,300,300i,400,400i,500,500i,600,600i,700,700i,800,800i,900,900i",
				"subsets": "cyrillic-ext,greek,greek-ext,latin-ext,latin,vietnamese,cyrillic"
			},
			"Fira Sans Condensed": {
				"category": "sans-serif",
				"variants": "100,100i,200,200i,300,300i,400,400i,500,500i,600,600i,700,700i,800,800i,900,900i",
				"subsets": "cyrillic-ext,greek,greek-ext,latin-ext,latin,vietnamese,cyrillic"
			},
			"Fira Sans Extra Condensed": {
				"category": "sans-serif",
				"variants": "100,100i,200,200i,300,300i,400,400i,500,500i,600,600i,700,700i,800,800i,900,900i",
				"subsets": "cyrillic-ext,greek,greek-ext,latin-ext,latin,vietnamese,cyrillic"
			},
			"Fjalla One": {
				"category": "sans-serif",
				"variants": "400",
				"subsets": "latin-ext,latin"
			},
			"Fjord One": {
				"category": "serif",
				"variants": "400",
				"subsets": "latin"
			},
			"Flamenco": {
				"category": "display",
				"variants": "300,400",
				"subsets": "latin"
			},
			"Flavors": {
				"category": "display",
				"variants": "400",
				"subsets": "latin-ext,latin"
			},
			"Fondamento": {
				"category": "handwriting",
				"variants": "400,400i",
				"subsets": "latin-ext,latin"
			},
			"Fontdiner Swanky": {
				"category": "display",
				"variants": "400",
				"subsets": "latin"
			},
			"Forum": {
				"category": "display",
				"variants": "400",
				"subsets": "cyrillic-ext,latin-ext,latin,cyrillic"
			},
			"Francois One": {
				"category": "sans-serif",
				"variants": "400",
				"subsets": "latin-ext,latin,vietnamese"
			},
			"Frank Ruhl Libre": {
				"category": "serif",
				"variants": "300,400,500,700,900",
				"subsets": "hebrew,latin-ext,latin"
			},
			"Freckle Face": {
				"category": "display",
				"variants": "400",
				"subsets": "latin-ext,latin"
			},
			"Fredericka the Great": {
				"category": "display",
				"variants": "400",
				"subsets": "latin-ext,latin"
			},
			"Fredoka One": {
				"category": "display",
				"variants": "400",
				"subsets": "latin"
			},
			"Freehand": {
				"category": "display",
				"variants": "400",
				"subsets": "khmer"
			},
			"Fresca": {
				"category": "sans-serif",
				"variants": "400",
				"subsets": "latin-ext,latin"
			},
			"Frijole": {
				"category": "display",
				"variants": "400",
				"subsets": "latin"
			},
			"Fruktur": {
				"category": "display",
				"variants": "400",
				"subsets": "latin-ext,latin"
			},
			"Fugaz One": {
				"category": "display",
				"variants": "400",
				"subsets": "latin"
			},
			"GFS Didot": {
				"category": "serif",
				"variants": "400",
				"subsets": "greek"
			},
			"GFS Neohellenic": {
				"category": "sans-serif",
				"variants": "400,400i,700,700i",
				"subsets": "greek"
			},
			"Gabriela": {
				"category": "serif",
				"variants": "400",
				"subsets": "cyrillic-ext,latin,cyrillic"
			},
			"Gaegu": {
				"category": "handwriting",
				"variants": "300,400,700",
				"subsets": "latin,korean"
			},
			"Gafata": {
				"category": "sans-serif",
				"variants": "400",
				"subsets": "latin-ext,latin"
			},
			"Galada": {
				"category": "display",
				"variants": "400",
				"subsets": "bengali,latin"
			},
			"Galdeano": {
				"category": "sans-serif",
				"variants": "400",
				"subsets": "latin"
			},
			"Galindo": {
				"category": "display",
				"variants": "400",
				"subsets": "latin-ext,latin"
			},
			"Gamja Flower": {
				"category": "handwriting",
				"variants": "400",
				"subsets": "latin,korean"
			},
			"Gayathri": {
				"category": "sans-serif",
				"variants": "100,400,700",
				"subsets": "malayalam,latin"
			},
			"Gelasio": {
				"category": "serif",
				"variants": "400,400i,500,500i,600,600i,700,700i",
				"subsets": "latin-ext,latin,vietnamese"
			},
			"Gentium Basic": {
				"category": "serif",
				"variants": "400,400i,700,700i",
				"subsets": "latin-ext,latin"
			},
			"Gentium Book Basic": {
				"category": "serif",
				"variants": "400,400i,700,700i",
				"subsets": "latin-ext,latin"
			},
			"Geo": {
				"category": "sans-serif",
				"variants": "400,400i",
				"subsets": "latin"
			},
			"Geostar": {
				"category": "display",
				"variants": "400",
				"subsets": "latin"
			},
			"Geostar Fill": {
				"category": "display",
				"variants": "400",
				"subsets": "latin"
			},
			"Germania One": {
				"category": "display",
				"variants": "400",
				"subsets": "latin"
			},
			"Gidugu": {
				"category": "sans-serif",
				"variants": "400",
				"subsets": "latin,telugu"
			},
			"Gilda Display": {
				"category": "serif",
				"variants": "400",
				"subsets": "latin-ext,latin"
			},
			"Girassol": {
				"category": "display",
				"variants": "400",
				"subsets": "latin-ext,latin"
			},
			"Give You Glory": {
				"category": "handwriting",
				"variants": "400",
				"subsets": "latin"
			},
			"Glass Antiqua": {
				"category": "display",
				"variants": "400",
				"subsets": "latin-ext,latin"
			},
			"Glegoo": {
				"category": "serif",
				"variants": "400,700",
				"subsets": "devanagari,latin-ext,latin"
			},
			"Gloria Hallelujah": {
				"category": "handwriting",
				"variants": "400",
				"subsets": "latin"
			},
			"Goblin One": {
				"category": "display",
				"variants": "400",
				"subsets": "latin"
			},
			"Gochi Hand": {
				"category": "handwriting",
				"variants": "400",
				"subsets": "latin"
			},
			"Gorditas": {
				"category": "display",
				"variants": "400,700",
				"subsets": "latin"
			},
			"Gothic A1": {
				"category": "sans-serif",
				"variants": "100,200,300,400,500,600,700,800,900",
				"subsets": "latin,korean"
			},
			"Goudy Bookletter 1911": {
				"category": "serif",
				"variants": "400",
				"subsets": "latin"
			},
			"Graduate": {
				"category": "display",
				"variants": "400",
				"subsets": "latin"
			},
			"Grand Hotel": {
				"category": "handwriting",
				"variants": "400",
				"subsets": "latin-ext,latin"
			},
			"Gravitas One": {
				"category": "display",
				"variants": "400",
				"subsets": "latin"
			},
			"Great Vibes": {
				"category": "handwriting",
				"variants": "400",
				"subsets": "latin-ext,latin"
			},
			"Grenze": {
				"category": "serif",
				"variants": "100,100i,200,200i,300,300i,400,400i,500,500i,600,600i,700,700i,800,800i,900,900i",
				"subsets": "latin-ext,latin,vietnamese"
			},
			"Griffy": {
				"category": "display",
				"variants": "400",
				"subsets": "latin-ext,latin"
			},
			"Gruppo": {
				"category": "display",
				"variants": "400",
				"subsets": "latin-ext,latin"
			},
			"Gudea": {
				"category": "sans-serif",
				"variants": "400,400i,700",
				"subsets": "latin-ext,latin"
			},
			"Gugi": {
				"category": "display",
				"variants": "400",
				"subsets": "latin,korean"
			},
			"Gupter": {
				"category": "serif",
				"variants": "400,500,700",
				"subsets": "latin"
			},
			"Gurajada": {
				"category": "serif",
				"variants": "400",
				"subsets": "latin,telugu"
			},
			"Habibi": {
				"category": "serif",
				"variants": "400",
				"subsets": "latin-ext,latin"
			},
			"Halant": {
				"category": "serif",
				"variants": "300,400,500,600,700",
				"subsets": "devanagari,latin-ext,latin"
			},
			"Hammersmith One": {
				"category": "sans-serif",
				"variants": "400",
				"subsets": "latin-ext,latin"
			},
			"Hanalei": {
				"category": "display",
				"variants": "400",
				"subsets": "latin-ext,latin"
			},
			"Hanalei Fill": {
				"category": "display",
				"variants": "400",
				"subsets": "latin-ext,latin"
			},
			"Handlee": {
				"category": "handwriting",
				"variants": "400",
				"subsets": "latin"
			},
			"Hanuman": {
				"category": "serif",
				"variants": "400,700",
				"subsets": "khmer"
			},
			"Happy Monkey": {
				"category": "display",
				"variants": "400",
				"subsets": "latin-ext,latin"
			},
			"Harmattan": {
				"category": "sans-serif",
				"variants": "400",
				"subsets": "latin,arabic"
			},
			"Headland One": {
				"category": "serif",
				"variants": "400",
				"subsets": "latin-ext,latin"
			},
			"Heebo": {
				"category": "sans-serif",
				"variants": "100,300,400,500,700,800,900",
				"subsets": "hebrew,latin"
			},
			"Henny Penny": {
				"category": "display",
				"variants": "400",
				"subsets": "latin"
			},
			"Hepta Slab": {
				"category": "serif",
				"variants": "100,200,300,400,500,600,700,800,900",
				"subsets": "latin-ext,latin,vietnamese"
			},
			"Herr Von Muellerhoff": {
				"category": "handwriting",
				"variants": "400",
				"subsets": "latin-ext,latin"
			},
			"Hi Melody": {
				"category": "handwriting",
				"variants": "400",
				"subsets": "latin,korean"
			},
			"Hind": {
				"category": "sans-serif",
				"variants": "300,400,500,600,700",
				"subsets": "devanagari,latin-ext,latin"
			},
			"Hind Guntur": {
				"category": "sans-serif",
				"variants": "300,400,500,600,700",
				"subsets": "latin-ext,latin,telugu"
			},
			"Hind Madurai": {
				"category": "sans-serif",
				"variants": "300,400,500,600,700",
				"subsets": "latin-ext,latin,tamil"
			},
			"Hind Siliguri": {
				"category": "sans-serif",
				"variants": "300,400,500,600,700",
				"subsets": "bengali,latin-ext,latin"
			},
			"Hind Vadodara": {
				"category": "sans-serif",
				"variants": "300,400,500,600,700",
				"subsets": "gujarati,latin-ext,latin"
			},
			"Holtwood One SC": {
				"category": "serif",
				"variants": "400",
				"subsets": "latin"
			},
			"Homemade Apple": {
				"category": "handwriting",
				"variants": "400",
				"subsets": "latin"
			},
			"Homenaje": {
				"category": "sans-serif",
				"variants": "400",
				"subsets": "latin"
			},
			"IBM Plex Mono": {
				"category": "monospace",
				"variants": "100,100i,200,200i,300,300i,400,400i,500,500i,600,600i,700,700i",
				"subsets": "cyrillic-ext,latin-ext,latin,vietnamese,cyrillic"
			},
			"IBM Plex Sans": {
				"category": "sans-serif",
				"variants": "100,100i,200,200i,300,300i,400,400i,500,500i,600,600i,700,700i",
				"subsets": "cyrillic-ext,greek,latin-ext,latin,vietnamese,cyrillic"
			},
			"IBM Plex Sans Condensed": {
				"category": "sans-serif",
				"variants": "100,100i,200,200i,300,300i,400,400i,500,500i,600,600i,700,700i",
				"subsets": "latin-ext,latin,vietnamese"
			},
			"IBM Plex Serif": {
				"category": "serif",
				"variants": "100,100i,200,200i,300,300i,400,400i,500,500i,600,600i,700,700i",
				"subsets": "cyrillic-ext,latin-ext,latin,vietnamese,cyrillic"
			},
			"IM Fell DW Pica": {
				"category": "serif",
				"variants": "400,400i",
				"subsets": "latin"
			},
			"IM Fell DW Pica SC": {
				"category": "serif",
				"variants": "400",
				"subsets": "latin"
			},
			"IM Fell Double Pica": {
				"category": "serif",
				"variants": "400,400i",
				"subsets": "latin"
			},
			"IM Fell Double Pica SC": {
				"category": "serif",
				"variants": "400",
				"subsets": "latin"
			},
			"IM Fell English": {
				"category": "serif",
				"variants": "400,400i",
				"subsets": "latin"
			},
			"IM Fell English SC": {
				"category": "serif",
				"variants": "400",
				"subsets": "latin"
			},
			"IM Fell French Canon": {
				"category": "serif",
				"variants": "400,400i",
				"subsets": "latin"
			},
			"IM Fell French Canon SC": {
				"category": "serif",
				"variants": "400",
				"subsets": "latin"
			},
			"IM Fell Great Primer": {
				"category": "serif",
				"variants": "400,400i",
				"subsets": "latin"
			},
			"IM Fell Great Primer SC": {
				"category": "serif",
				"variants": "400",
				"subsets": "latin"
			},
			"Ibarra Real Nova": {
				"category": "serif",
				"variants": "400,400i,600,600i,700,700i",
				"subsets": "latin-ext,latin"
			},
			"Iceberg": {
				"category": "display",
				"variants": "400",
				"subsets": "latin"
			},
			"Iceland": {
				"category": "display",
				"variants": "400",
				"subsets": "latin"
			},
			"Imprima": {
				"category": "sans-serif",
				"variants": "400",
				"subsets": "latin-ext,latin"
			},
			"Inconsolata": {
				"category": "monospace",
				"variants": "400,700",
				"subsets": "latin-ext,latin,vietnamese"
			},
			"Inder": {
				"category": "sans-serif",
				"variants": "400",
				"subsets": "latin-ext,latin"
			},
			"Indie Flower": {
				"category": "handwriting",
				"variants": "400",
				"subsets": "latin"
			},
			"Inika": {
				"category": "serif",
				"variants": "400,700",
				"subsets": "latin-ext,latin"
			},
			"Inknut Antiqua": {
				"category": "serif",
				"variants": "300,400,500,600,700,800,900",
				"subsets": "devanagari,latin-ext,latin"
			},
			"Inria Serif": {
				"category": "serif",
				"variants": "300,300i,400,400i,700,700i",
				"subsets": "latin-ext,latin"
			},
			"Irish Grover": {
				"category": "display",
				"variants": "400",
				"subsets": "latin"
			},
			"Istok Web": {
				"category": "sans-serif",
				"variants": "400,400i,700,700i",
				"subsets": "cyrillic-ext,latin-ext,latin,cyrillic"
			},
			"Italiana": {
				"category": "serif",
				"variants": "400",
				"subsets": "latin"
			},
			"Italianno": {
				"category": "handwriting",
				"variants": "400",
				"subsets": "latin-ext,latin"
			},
			"Itim": {
				"category": "handwriting",
				"variants": "400",
				"subsets": "thai,latin-ext,latin,vietnamese"
			},
			"Jacques Francois": {
				"category": "serif",
				"variants": "400",
				"subsets": "latin"
			},
			"Jacques Francois Shadow": {
				"category": "display",
				"variants": "400",
				"subsets": "latin"
			},
			"Jaldi": {
				"category": "sans-serif",
				"variants": "400,700",
				"subsets": "devanagari,latin-ext,latin"
			},
			"Jim Nightshade": {
				"category": "handwriting",
				"variants": "400",
				"subsets": "latin-ext,latin"
			},
			"Jockey One": {
				"category": "sans-serif",
				"variants": "400",
				"subsets": "latin-ext,latin"
			},
			"Jolly Lodger": {
				"category": "display",
				"variants": "400",
				"subsets": "latin-ext,latin"
			},
			"Jomhuria": {
				"category": "display",
				"variants": "400",
				"subsets": "latin-ext,latin,arabic"
			},
			"Jomolhari": {
				"category": "serif",
				"variants": "400",
				"subsets": "tibetan,latin"
			},
			"Josefin Sans": {
				"category": "sans-serif",
				"variants": "100,100i,300,300i,400,400i,600,600i,700,700i",
				"subsets": "latin-ext,latin,vietnamese"
			},
			"Josefin Slab": {
				"category": "serif",
				"variants": "100,100i,300,300i,400,400i,600,600i,700,700i",
				"subsets": "latin"
			},
			"Joti One": {
				"category": "display",
				"variants": "400",
				"subsets": "latin-ext,latin"
			},
			"Jua": {
				"category": "sans-serif",
				"variants": "400",
				"subsets": "latin,korean"
			},
			"Judson": {
				"category": "serif",
				"variants": "400,400i,700",
				"subsets": "latin-ext,latin,vietnamese"
			},
			"Julee": {
				"category": "handwriting",
				"variants": "400",
				"subsets": "latin"
			},
			"Julius Sans One": {
				"category": "sans-serif",
				"variants": "400",
				"subsets": "latin-ext,latin"
			},
			"Junge": {
				"category": "serif",
				"variants": "400",
				"subsets": "latin"
			},
			"Jura": {
				"category": "sans-serif",
				"variants": "300,400,500,600,700",
				"subsets": "cyrillic-ext,greek,greek-ext,latin-ext,latin,vietnamese,cyrillic"
			},
			"Just Another Hand": {
				"category": "handwriting",
				"variants": "400",
				"subsets": "latin"
			},
			"Just Me Again Down Here": {
				"category": "handwriting",
				"variants": "400",
				"subsets": "latin-ext,latin"
			},
			"K2D": {
				"category": "sans-serif",
				"variants": "100,100i,200,200i,300,300i,400,400i,500,500i,600,600i,700,700i,800,800i",
				"subsets": "thai,latin-ext,latin,vietnamese"
			},
			"Kadwa": {
				"category": "serif",
				"variants": "400,700",
				"subsets": "devanagari,latin"
			},
			"Kalam": {
				"category": "handwriting",
				"variants": "300,400,700",
				"subsets": "devanagari,latin-ext,latin"
			},
			"Kameron": {
				"category": "serif",
				"variants": "400,700",
				"subsets": "latin"
			},
			"Kanit": {
				"category": "sans-serif",
				"variants": "100,100i,200,200i,300,300i,400,400i,500,500i,600,600i,700,700i,800,800i,900,900i",
				"subsets": "thai,latin-ext,latin,vietnamese"
			},
			"Kantumruy": {
				"category": "sans-serif",
				"variants": "300,400,700",
				"subsets": "khmer"
			},
			"Karla": {
				"category": "sans-serif",
				"variants": "400,400i,700,700i",
				"subsets": "latin-ext,latin"
			},
			"Karma": {
				"category": "serif",
				"variants": "300,400,500,600,700",
				"subsets": "devanagari,latin-ext,latin"
			},
			"Katibeh": {
				"category": "display",
				"variants": "400",
				"subsets": "latin-ext,latin,arabic"
			},
			"Kaushan Script": {
				"category": "handwriting",
				"variants": "400",
				"subsets": "latin-ext,latin"
			},
			"Kavivanar": {
				"category": "handwriting",
				"variants": "400",
				"subsets": "latin-ext,latin,tamil"
			},
			"Kavoon": {
				"category": "display",
				"variants": "400",
				"subsets": "latin-ext,latin"
			},
			"Kdam Thmor": {
				"category": "display",
				"variants": "400",
				"subsets": "khmer"
			},
			"Keania One": {
				"category": "display",
				"variants": "400",
				"subsets": "latin-ext,latin"
			},
			"Kelly Slab": {
				"category": "display",
				"variants": "400",
				"subsets": "latin-ext,latin,cyrillic"
			},
			"Kenia": {
				"category": "display",
				"variants": "400",
				"subsets": "latin"
			},
			"Khand": {
				"category": "sans-serif",
				"variants": "300,400,500,600,700",
				"subsets": "devanagari,latin-ext,latin"
			},
			"Khmer": {
				"category": "display",
				"variants": "400",
				"subsets": "khmer"
			},
			"Khula": {
				"category": "sans-serif",
				"variants": "300,400,600,700,800",
				"subsets": "devanagari,latin-ext,latin"
			},
			"Kirang Haerang": {
				"category": "display",
				"variants": "400",
				"subsets": "latin,korean"
			},
			"Kite One": {
				"category": "sans-serif",
				"variants": "400",
				"subsets": "latin"
			},
			"Knewave": {
				"category": "display",
				"variants": "400",
				"subsets": "latin-ext,latin"
			},
			"KoHo": {
				"category": "sans-serif",
				"variants": "200,200i,300,300i,400,400i,500,500i,600,600i,700,700i",
				"subsets": "thai,latin-ext,latin,vietnamese"
			},
			"Kodchasan": {
				"category": "sans-serif",
				"variants": "200,200i,300,300i,400,400i,500,500i,600,600i,700,700i",
				"subsets": "thai,latin-ext,latin,vietnamese"
			},
			"Kosugi": {
				"category": "sans-serif",
				"variants": "400",
				"subsets": "latin,japanese,cyrillic"
			},
			"Kosugi Maru": {
				"category": "sans-serif",
				"variants": "400",
				"subsets": "latin,japanese,cyrillic"
			},
			"Kotta One": {
				"category": "serif",
				"variants": "400",
				"subsets": "latin-ext,latin"
			},
			"Koulen": {
				"category": "display",
				"variants": "400",
				"subsets": "khmer"
			},
			"Kranky": {
				"category": "display",
				"variants": "400",
				"subsets": "latin"
			},
			"Kreon": {
				"category": "serif",
				"variants": "300,400,500,600,700",
				"subsets": "latin-ext,latin"
			},
			"Kristi": {
				"category": "handwriting",
				"variants": "400",
				"subsets": "latin"
			},
			"Krona One": {
				"category": "sans-serif",
				"variants": "400",
				"subsets": "latin-ext,latin"
			},
			"Krub": {
				"category": "sans-serif",
				"variants": "200,200i,300,300i,400,400i,500,500i,600,600i,700,700i",
				"subsets": "thai,latin-ext,latin,vietnamese"
			},
			"Kulim Park": {
				"category": "sans-serif",
				"variants": "200,200i,300,300i,400,400i,600,600i,700,700i",
				"subsets": "latin-ext,latin"
			},
			"Kumar One": {
				"category": "display",
				"variants": "400",
				"subsets": "gujarati,latin-ext,latin"
			},
			"Kumar One Outline": {
				"category": "display",
				"variants": "400",
				"subsets": "gujarati,latin-ext,latin"
			},
			"Kurale": {
				"category": "serif",
				"variants": "400",
				"subsets": "cyrillic-ext,devanagari,latin-ext,latin,cyrillic"
			},
			"La Belle Aurore": {
				"category": "handwriting",
				"variants": "400",
				"subsets": "latin"
			},
			"Lacquer": {
				"category": "sans-serif",
				"variants": "400",
				"subsets": "latin"
			},
			"Laila": {
				"category": "serif",
				"variants": "300,400,500,600,700",
				"subsets": "devanagari,latin-ext,latin"
			},
			"Lakki Reddy": {
				"category": "handwriting",
				"variants": "400",
				"subsets": "latin,telugu"
			},
			"Lalezar": {
				"category": "display",
				"variants": "400",
				"subsets": "latin-ext,latin,vietnamese,arabic"
			},
			"Lancelot": {
				"category": "display",
				"variants": "400",
				"subsets": "latin-ext,latin"
			},
			"Lateef": {
				"category": "handwriting",
				"variants": "400",
				"subsets": "latin,arabic"
			},
			"Lato": {
				"category": "sans-serif",
				"variants": "100,100i,300,300i,400,400i,700,700i,900,900i",
				"subsets": "latin-ext,latin"
			},
			"League Script": {
				"category": "handwriting",
				"variants": "400",
				"subsets": "latin"
			},
			"Leckerli One": {
				"category": "handwriting",
				"variants": "400",
				"subsets": "latin"
			},
			"Ledger": {
				"category": "serif",
				"variants": "400",
				"subsets": "latin-ext,latin,cyrillic"
			},
			"Lekton": {
				"category": "sans-serif",
				"variants": "400,400i,700",
				"subsets": "latin-ext,latin"
			},
			"Lemon": {
				"category": "display",
				"variants": "400",
				"subsets": "latin"
			},
			"Lemonada": {
				"category": "display",
				"variants": "300,400,500,600,700",
				"subsets": "latin-ext,latin,vietnamese,arabic"
			},
			"Lexend Deca": {
				"category": "sans-serif",
				"variants": "400",
				"subsets": "latin-ext,latin,vietnamese"
			},
			"Lexend Exa": {
				"category": "sans-serif",
				"variants": "400",
				"subsets": "latin-ext,latin,vietnamese"
			},
			"Lexend Giga": {
				"category": "sans-serif",
				"variants": "400",
				"subsets": "latin-ext,latin,vietnamese"
			},
			"Lexend Mega": {
				"category": "sans-serif",
				"variants": "400",
				"subsets": "latin-ext,latin,vietnamese"
			},
			"Lexend Peta": {
				"category": "sans-serif",
				"variants": "400",
				"subsets": "latin-ext,latin,vietnamese"
			},
			"Lexend Tera": {
				"category": "sans-serif",
				"variants": "400",
				"subsets": "latin-ext,latin,vietnamese"
			},
			"Lexend Zetta": {
				"category": "sans-serif",
				"variants": "400",
				"subsets": "latin-ext,latin,vietnamese"
			},
			"Libre Barcode 128": {
				"category": "display",
				"variants": "400",
				"subsets": "latin"
			},
			"Libre Barcode 128 Text": {
				"category": "display",
				"variants": "400",
				"subsets": "latin"
			},
			"Libre Barcode 39": {
				"category": "display",
				"variants": "400",
				"subsets": "latin"
			},
			"Libre Barcode 39 Extended": {
				"category": "display",
				"variants": "400",
				"subsets": "latin"
			},
			"Libre Barcode 39 Extended Text": {
				"category": "display",
				"variants": "400",
				"subsets": "latin"
			},
			"Libre Barcode 39 Text": {
				"category": "display",
				"variants": "400",
				"subsets": "latin"
			},
			"Libre Baskerville": {
				"category": "serif",
				"variants": "400,400i,700",
				"subsets": "latin-ext,latin"
			},
			"Libre Caslon Display": {
				"category": "serif",
				"variants": "400",
				"subsets": "latin-ext,latin"
			},
			"Libre Caslon Text": {
				"category": "serif",
				"variants": "400,400i,700",
				"subsets": "latin-ext,latin"
			},
			"Libre Franklin": {
				"category": "sans-serif",
				"variants": "100,100i,200,200i,300,300i,400,400i,500,500i,600,600i,700,700i,800,800i,900,900i",
				"subsets": "latin-ext,latin"
			},
			"Life Savers": {
				"category": "display",
				"variants": "400,700,800",
				"subsets": "latin-ext,latin"
			},
			"Lilita One": {
				"category": "display",
				"variants": "400",
				"subsets": "latin-ext,latin"
			},
			"Lily Script One": {
				"category": "display",
				"variants": "400",
				"subsets": "latin-ext,latin"
			},
			"Limelight": {
				"category": "display",
				"variants": "400",
				"subsets": "latin-ext,latin"
			},
			"Linden Hill": {
				"category": "serif",
				"variants": "400,400i",
				"subsets": "latin"
			},
			"Literata": {
				"category": "serif",
				"variants": "400,500,600,700,400i,500i,600i,700i",
				"subsets": "greek,greek-ext,latin-ext,latin,vietnamese,cyrillic"
			},
			"Liu Jian Mao Cao": {
				"category": "handwriting",
				"variants": "400",
				"subsets": "latin,chinese-simplified"
			},
			"Livvic": {
				"category": "sans-serif",
				"variants": "100,100i,200,200i,300,300i,400,400i,500,500i,600,600i,700,700i,900,900i",
				"subsets": "latin-ext,latin,vietnamese"
			},
			"Lobster": {
				"category": "display",
				"variants": "400",
				"subsets": "cyrillic-ext,latin-ext,latin,vietnamese,cyrillic"
			},
			"Lobster Two": {
				"category": "display",
				"variants": "400,400i,700,700i",
				"subsets": "latin"
			},
			"Londrina Outline": {
				"category": "display",
				"variants": "400",
				"subsets": "latin"
			},
			"Londrina Shadow": {
				"category": "display",
				"variants": "400",
				"subsets": "latin"
			},
			"Londrina Sketch": {
				"category": "display",
				"variants": "400",
				"subsets": "latin"
			},
			"Londrina Solid": {
				"category": "display",
				"variants": "100,300,400,900",
				"subsets": "latin"
			},
			"Long Cang": {
				"category": "handwriting",
				"variants": "400",
				"subsets": "latin,chinese-simplified"
			},
			"Lora": {
				"category": "serif",
				"variants": "400,400i,700,700i",
				"subsets": "cyrillic-ext,latin-ext,latin,vietnamese,cyrillic"
			},
			"Love Ya Like A Sister": {
				"category": "display",
				"variants": "400",
				"subsets": "latin"
			},
			"Loved by the King": {
				"category": "handwriting",
				"variants": "400",
				"subsets": "latin"
			},
			"Lovers Quarrel": {
				"category": "handwriting",
				"variants": "400",
				"subsets": "latin-ext,latin"
			},
			"Luckiest Guy": {
				"category": "display",
				"variants": "400",
				"subsets": "latin"
			},
			"Lusitana": {
				"category": "serif",
				"variants": "400,700",
				"subsets": "latin"
			},
			"Lustria": {
				"category": "serif",
				"variants": "400",
				"subsets": "latin"
			},
			"M PLUS 1p": {
				"category": "sans-serif",
				"variants": "100,300,400,500,700,800,900",
				"subsets": "cyrillic-ext,greek,hebrew,greek-ext,latin-ext,latin,japanese,vietnamese,cyrillic"
			},
			"M PLUS Rounded 1c": {
				"category": "sans-serif",
				"variants": "100,300,400,500,700,800,900",
				"subsets": "cyrillic-ext,greek,hebrew,greek-ext,latin-ext,latin,japanese,vietnamese,cyrillic"
			},
			"Ma Shan Zheng": {
				"category": "handwriting",
				"variants": "400",
				"subsets": "latin,chinese-simplified"
			},
			"Macondo": {
				"category": "display",
				"variants": "400",
				"subsets": "latin"
			},
			"Macondo Swash Caps": {
				"category": "display",
				"variants": "400",
				"subsets": "latin"
			},
			"Mada": {
				"category": "sans-serif",
				"variants": "200,300,400,500,600,700,900",
				"subsets": "latin,arabic"
			},
			"Magra": {
				"category": "sans-serif",
				"variants": "400,700",
				"subsets": "latin-ext,latin"
			},
			"Maiden Orange": {
				"category": "display",
				"variants": "400",
				"subsets": "latin"
			},
			"Maitree": {
				"category": "serif",
				"variants": "200,300,400,500,600,700",
				"subsets": "thai,latin-ext,latin,vietnamese"
			},
			"Major Mono Display": {
				"category": "monospace",
				"variants": "400",
				"subsets": "latin-ext,latin,vietnamese"
			},
			"Mako": {
				"category": "sans-serif",
				"variants": "400",
				"subsets": "latin"
			},
			"Mali": {
				"category": "handwriting",
				"variants": "200,200i,300,300i,400,400i,500,500i,600,600i,700,700i",
				"subsets": "thai,latin-ext,latin,vietnamese"
			},
			"Mallanna": {
				"category": "sans-serif",
				"variants": "400",
				"subsets": "latin,telugu"
			},
			"Mandali": {
				"category": "sans-serif",
				"variants": "400",
				"subsets": "latin,telugu"
			},
			"Manjari": {
				"category": "sans-serif",
				"variants": "100,400,700",
				"subsets": "malayalam,latin"
			},
			"Mansalva": {
				"category": "handwriting",
				"variants": "400",
				"subsets": "latin"
			},
			"Manuale": {
				"category": "serif",
				"variants": "400,500,600,700,400i,500i,600i,700i",
				"subsets": "latin-ext,latin,vietnamese"
			},
			"Marcellus": {
				"category": "serif",
				"variants": "400",
				"subsets": "latin-ext,latin"
			},
			"Marcellus SC": {
				"category": "serif",
				"variants": "400",
				"subsets": "latin-ext,latin"
			},
			"Marck Script": {
				"category": "handwriting",
				"variants": "400",
				"subsets": "latin-ext,latin,cyrillic"
			},
			"Margarine": {
				"category": "display",
				"variants": "400",
				"subsets": "latin-ext,latin"
			},
			"Markazi Text": {
				"category": "serif",
				"variants": "400,500,600,700",
				"subsets": "latin-ext,latin,vietnamese,arabic"
			},
			"Marko One": {
				"category": "serif",
				"variants": "400",
				"subsets": "latin"
			},
			"Marmelad": {
				"category": "sans-serif",
				"variants": "400",
				"subsets": "latin-ext,latin,cyrillic"
			},
			"Martel": {
				"category": "serif",
				"variants": "200,300,400,600,700,800,900",
				"subsets": "devanagari,latin-ext,latin"
			},
			"Martel Sans": {
				"category": "sans-serif",
				"variants": "200,300,400,600,700,800,900",
				"subsets": "devanagari,latin-ext,latin"
			},
			"Marvel": {
				"category": "sans-serif",
				"variants": "400,400i,700,700i",
				"subsets": "latin"
			},
			"Mate": {
				"category": "serif",
				"variants": "400,400i",
				"subsets": "latin"
			},
			"Mate SC": {
				"category": "serif",
				"variants": "400",
				"subsets": "latin"
			},
			"Maven Pro": {
				"category": "sans-serif",
				"variants": "400,500,600,700,800,900",
				"subsets": "latin-ext,latin,vietnamese"
			},
			"McLaren": {
				"category": "display",
				"variants": "400",
				"subsets": "latin-ext,latin"
			},
			"Meddon": {
				"category": "handwriting",
				"variants": "400",
				"subsets": "latin"
			},
			"MedievalSharp": {
				"category": "display",
				"variants": "400",
				"subsets": "latin-ext,latin"
			},
			"Medula One": {
				"category": "display",
				"variants": "400",
				"subsets": "latin"
			},
			"Meera Inimai": {
				"category": "sans-serif",
				"variants": "400",
				"subsets": "latin,tamil"
			},
			"Megrim": {
				"category": "display",
				"variants": "400",
				"subsets": "latin"
			},
			"Meie Script": {
				"category": "handwriting",
				"variants": "400",
				"subsets": "latin-ext,latin"
			},
			"Merienda": {
				"category": "handwriting",
				"variants": "400,700",
				"subsets": "latin-ext,latin"
			},
			"Merienda One": {
				"category": "handwriting",
				"variants": "400",
				"subsets": "latin"
			},
			"Merriweather": {
				"category": "serif",
				"variants": "300,300i,400,400i,700,700i,900,900i",
				"subsets": "cyrillic-ext,latin-ext,latin,vietnamese,cyrillic"
			},
			"Merriweather Sans": {
				"category": "sans-serif",
				"variants": "300,300i,400,400i,700,700i,800,800i",
				"subsets": "latin-ext,latin"
			},
			"Metal": {
				"category": "display",
				"variants": "400",
				"subsets": "khmer"
			},
			"Metal Mania": {
				"category": "display",
				"variants": "400",
				"subsets": "latin-ext,latin"
			},
			"Metamorphous": {
				"category": "display",
				"variants": "400",
				"subsets": "latin-ext,latin"
			},
			"Metrophobic": {
				"category": "sans-serif",
				"variants": "400",
				"subsets": "latin-ext,latin,vietnamese"
			},
			"Michroma": {
				"category": "sans-serif",
				"variants": "400",
				"subsets": "latin"
			},
			"Milonga": {
				"category": "display",
				"variants": "400",
				"subsets": "latin-ext,latin"
			},
			"Miltonian": {
				"category": "display",
				"variants": "400",
				"subsets": "latin"
			},
			"Miltonian Tattoo": {
				"category": "display",
				"variants": "400",
				"subsets": "latin"
			},
			"Mina": {
				"category": "sans-serif",
				"variants": "400,700",
				"subsets": "bengali,latin-ext,latin"
			},
			"Miniver": {
				"category": "display",
				"variants": "400",
				"subsets": "latin"
			},
			"Miriam Libre": {
				"category": "sans-serif",
				"variants": "400,700",
				"subsets": "hebrew,latin-ext,latin"
			},
			"Mirza": {
				"category": "display",
				"variants": "400,500,600,700",
				"subsets": "latin-ext,latin,arabic"
			},
			"Miss Fajardose": {
				"category": "handwriting",
				"variants": "400",
				"subsets": "latin-ext,latin"
			},
			"Mitr": {
				"category": "sans-serif",
				"variants": "200,300,400,500,600,700",
				"subsets": "thai,latin-ext,latin,vietnamese"
			},
			"Modak": {
				"category": "display",
				"variants": "400",
				"subsets": "devanagari,latin-ext,latin"
			},
			"Modern Antiqua": {
				"category": "display",
				"variants": "400",
				"subsets": "latin-ext,latin"
			},
			"Mogra": {
				"category": "display",
				"variants": "400",
				"subsets": "gujarati,latin-ext,latin"
			},
			"Molengo": {
				"category": "sans-serif",
				"variants": "400",
				"subsets": "latin-ext,latin"
			},
			"Molle": {
				"category": "handwriting",
				"variants": "400i",
				"subsets": "latin-ext,latin"
			},
			"Monda": {
				"category": "sans-serif",
				"variants": "400,700",
				"subsets": "latin-ext,latin"
			},
			"Monofett": {
				"category": "display",
				"variants": "400",
				"subsets": "latin"
			},
			"Monoton": {
				"category": "display",
				"variants": "400",
				"subsets": "latin"
			},
			"Monsieur La Doulaise": {
				"category": "handwriting",
				"variants": "400",
				"subsets": "latin-ext,latin"
			},
			"Montaga": {
				"category": "serif",
				"variants": "400",
				"subsets": "latin"
			},
			"Montez": {
				"category": "handwriting",
				"variants": "400",
				"subsets": "latin"
			},
			"Montserrat": {
				"category": "sans-serif",
				"variants": "100,100i,200,200i,300,300i,400,400i,500,500i,600,600i,700,700i,800,800i,900,900i",
				"subsets": "cyrillic-ext,latin-ext,latin,vietnamese,cyrillic"
			},
			"Montserrat Alternates": {
				"category": "sans-serif",
				"variants": "100,100i,200,200i,300,300i,400,400i,500,500i,600,600i,700,700i,800,800i,900,900i",
				"subsets": "cyrillic-ext,latin-ext,latin,vietnamese,cyrillic"
			},
			"Montserrat Subrayada": {
				"category": "sans-serif",
				"variants": "400,700",
				"subsets": "latin"
			},
			"Moul": {
				"category": "display",
				"variants": "400",
				"subsets": "khmer"
			},
			"Moulpali": {
				"category": "display",
				"variants": "400",
				"subsets": "khmer"
			},
			"Mountains of Christmas": {
				"category": "display",
				"variants": "400,700",
				"subsets": "latin"
			},
			"Mouse Memoirs": {
				"category": "sans-serif",
				"variants": "400",
				"subsets": "latin-ext,latin"
			},
			"Mr Bedfort": {
				"category": "handwriting",
				"variants": "400",
				"subsets": "latin-ext,latin"
			},
			"Mr Dafoe": {
				"category": "handwriting",
				"variants": "400",
				"subsets": "latin-ext,latin"
			},
			"Mr De Haviland": {
				"category": "handwriting",
				"variants": "400",
				"subsets": "latin-ext,latin"
			},
			"Mrs Saint Delafield": {
				"category": "handwriting",
				"variants": "400",
				"subsets": "latin-ext,latin"
			},
			"Mrs Sheppards": {
				"category": "handwriting",
				"variants": "400",
				"subsets": "latin-ext,latin"
			},
			"Mukta": {
				"category": "sans-serif",
				"variants": "200,300,400,500,600,700,800",
				"subsets": "devanagari,latin-ext,latin"
			},
			"Mukta Mahee": {
				"category": "sans-serif",
				"variants": "200,300,400,500,600,700,800",
				"subsets": "gurmukhi,latin-ext,latin"
			},
			"Mukta Malar": {
				"category": "sans-serif",
				"variants": "200,300,400,500,600,700,800",
				"subsets": "latin-ext,latin,tamil"
			},
			"Mukta Vaani": {
				"category": "sans-serif",
				"variants": "200,300,400,500,600,700,800",
				"subsets": "gujarati,latin-ext,latin"
			},
			"Muli": {
				"category": "sans-serif",
				"variants": "200,300,400,500,600,700,800,900,200i,300i,400i,500i,600i,700i,800i,900i",
				"subsets": "latin-ext,latin,vietnamese"
			},
			"Mystery Quest": {
				"category": "display",
				"variants": "400",
				"subsets": "latin-ext,latin"
			},
			"NTR": {
				"category": "sans-serif",
				"variants": "400",
				"subsets": "latin,telugu"
			},
			"Nanum Brush Script": {
				"category": "handwriting",
				"variants": "400",
				"subsets": "latin,korean"
			},
			"Nanum Gothic": {
				"category": "sans-serif",
				"variants": "400,700,800",
				"subsets": "latin,korean"
			},
			"Nanum Gothic Coding": {
				"category": "monospace",
				"variants": "400,700",
				"subsets": "latin,korean"
			},
			"Nanum Myeongjo": {
				"category": "serif",
				"variants": "400,700,800",
				"subsets": "latin,korean"
			},
			"Nanum Pen Script": {
				"category": "handwriting",
				"variants": "400",
				"subsets": "latin,korean"
			},
			"Neucha": {
				"category": "handwriting",
				"variants": "400",
				"subsets": "latin,cyrillic"
			},
			"Neuton": {
				"category": "serif",
				"variants": "200,300,400,400i,700,800",
				"subsets": "latin-ext,latin"
			},
			"New Rocker": {
				"category": "display",
				"variants": "400",
				"subsets": "latin-ext,latin"
			},
			"News Cycle": {
				"category": "sans-serif",
				"variants": "400,700",
				"subsets": "latin-ext,latin"
			},
			"Niconne": {
				"category": "handwriting",
				"variants": "400",
				"subsets": "latin-ext,latin"
			},
			"Niramit": {
				"category": "sans-serif",
				"variants": "200,200i,300,300i,400,400i,500,500i,600,600i,700,700i",
				"subsets": "thai,latin-ext,latin,vietnamese"
			},
			"Nixie One": {
				"category": "display",
				"variants": "400",
				"subsets": "latin"
			},
			"Nobile": {
				"category": "sans-serif",
				"variants": "400,400i,500,500i,700,700i",
				"subsets": "latin-ext,latin"
			},
			"Nokora": {
				"category": "serif",
				"variants": "400,700",
				"subsets": "khmer"
			},
			"Norican": {
				"category": "handwriting",
				"variants": "400",
				"subsets": "latin-ext,latin"
			},
			"Nosifer": {
				"category": "display",
				"variants": "400",
				"subsets": "latin-ext,latin"
			},
			"Notable": {
				"category": "sans-serif",
				"variants": "400",
				"subsets": "latin"
			},
			"Nothing You Could Do": {
				"category": "handwriting",
				"variants": "400",
				"subsets": "latin"
			},
			"Noticia Text": {
				"category": "serif",
				"variants": "400,400i,700,700i",
				"subsets": "latin-ext,latin,vietnamese"
			},
			"Noto Sans": {
				"category": "sans-serif",
				"variants": "400,400i,700,700i",
				"subsets": "cyrillic-ext,devanagari,greek,greek-ext,latin-ext,latin,vietnamese,cyrillic"
			},
			"Noto Sans HK": {
				"category": "sans-serif",
				"variants": "100,300,400,500,700,900",
				"subsets": "chinese-hongkong,latin"
			},
			"Noto Sans JP": {
				"category": "sans-serif",
				"variants": "100,300,400,500,700,900",
				"subsets": "latin,japanese"
			},
			"Noto Sans KR": {
				"category": "sans-serif",
				"variants": "100,300,400,500,700,900",
				"subsets": "latin,korean"
			},
			"Noto Sans SC": {
				"category": "sans-serif",
				"variants": "100,300,400,500,700,900",
				"subsets": "latin,chinese-simplified"
			},
			"Noto Sans TC": {
				"category": "sans-serif",
				"variants": "100,300,400,500,700,900",
				"subsets": "chinese-traditional,latin"
			},
			"Noto Serif": {
				"category": "serif",
				"variants": "400,400i,700,700i",
				"subsets": "cyrillic-ext,greek,greek-ext,latin-ext,latin,vietnamese,cyrillic"
			},
			"Noto Serif JP": {
				"category": "serif",
				"variants": "200,300,400,500,600,700,900",
				"subsets": "latin,japanese"
			},
			"Noto Serif KR": {
				"category": "serif",
				"variants": "200,300,400,500,600,700,900",
				"subsets": "latin,korean"
			},
			"Noto Serif SC": {
				"category": "serif",
				"variants": "200,300,400,500,600,700,900",
				"subsets": "latin,chinese-simplified"
			},
			"Noto Serif TC": {
				"category": "serif",
				"variants": "200,300,400,500,600,700,900",
				"subsets": "chinese-traditional,latin"
			},
			"Nova Cut": {
				"category": "display",
				"variants": "400",
				"subsets": "latin"
			},
			"Nova Flat": {
				"category": "display",
				"variants": "400",
				"subsets": "latin"
			},
			"Nova Mono": {
				"category": "monospace",
				"variants": "400",
				"subsets": "greek,latin"
			},
			"Nova Oval": {
				"category": "display",
				"variants": "400",
				"subsets": "latin"
			},
			"Nova Round": {
				"category": "display",
				"variants": "400",
				"subsets": "latin"
			},
			"Nova Script": {
				"category": "display",
				"variants": "400",
				"subsets": "latin"
			},
			"Nova Slim": {
				"category": "display",
				"variants": "400",
				"subsets": "latin"
			},
			"Nova Square": {
				"category": "display",
				"variants": "400",
				"subsets": "latin"
			},
			"Numans": {
				"category": "sans-serif",
				"variants": "400",
				"subsets": "latin"
			},
			"Nunito": {
				"category": "sans-serif",
				"variants": "200,200i,300,300i,400,400i,600,600i,700,700i,800,800i,900,900i",
				"subsets": "cyrillic-ext,latin-ext,latin,vietnamese,cyrillic"
			},
			"Nunito Sans": {
				"category": "sans-serif",
				"variants": "200,200i,300,300i,400,400i,600,600i,700,700i,800,800i,900,900i",
				"subsets": "latin-ext,latin,vietnamese"
			},
			"Odibee Sans": {
				"category": "display",
				"variants": "400",
				"subsets": "latin"
			},
			"Odor Mean Chey": {
				"category": "display",
				"variants": "400",
				"subsets": "khmer"
			},
			"Offside": {
				"category": "display",
				"variants": "400",
				"subsets": "latin"
			},
			"Old Standard TT": {
				"category": "serif",
				"variants": "400,400i,700",
				"subsets": "cyrillic-ext,latin-ext,latin,vietnamese,cyrillic"
			},
			"Oldenburg": {
				"category": "display",
				"variants": "400",
				"subsets": "latin-ext,latin"
			},
			"Oleo Script": {
				"category": "display",
				"variants": "400,700",
				"subsets": "latin-ext,latin"
			},
			"Oleo Script Swash Caps": {
				"category": "display",
				"variants": "400,700",
				"subsets": "latin-ext,latin"
			},
			"Open Sans": {
				"category": "sans-serif",
				"variants": "300,300i,400,400i,600,600i,700,700i,800,800i",
				"subsets": "cyrillic-ext,greek,greek-ext,latin-ext,latin,vietnamese,cyrillic"
			},
			"Open Sans Condensed": {
				"category": "sans-serif",
				"variants": "300,300i,700",
				"subsets": "cyrillic-ext,greek,greek-ext,latin-ext,latin,vietnamese,cyrillic"
			},
			"Oranienbaum": {
				"category": "serif",
				"variants": "400",
				"subsets": "cyrillic-ext,latin-ext,latin,cyrillic"
			},
			"Orbitron": {
				"category": "sans-serif",
				"variants": "400,500,600,700,800,900",
				"subsets": "latin"
			},
			"Oregano": {
				"category": "display",
				"variants": "400,400i",
				"subsets": "latin-ext,latin"
			},
			"Orienta": {
				"category": "sans-serif",
				"variants": "400",
				"subsets": "latin-ext,latin"
			},
			"Original Surfer": {
				"category": "display",
				"variants": "400",
				"subsets": "latin"
			},
			"Oswald": {
				"category": "sans-serif",
				"variants": "200,300,400,500,600,700",
				"subsets": "cyrillic-ext,latin-ext,latin,vietnamese,cyrillic"
			},
			"Over the Rainbow": {
				"category": "handwriting",
				"variants": "400",
				"subsets": "latin"
			},
			"Overlock": {
				"category": "display",
				"variants": "400,400i,700,700i,900,900i",
				"subsets": "latin-ext,latin"
			},
			"Overlock SC": {
				"category": "display",
				"variants": "400",
				"subsets": "latin-ext,latin"
			},
			"Overpass": {
				"category": "sans-serif",
				"variants": "100,100i,200,200i,300,300i,400,400i,600,600i,700,700i,800,800i,900,900i",
				"subsets": "latin-ext,latin"
			},
			"Overpass Mono": {
				"category": "monospace",
				"variants": "300,400,600,700",
				"subsets": "latin-ext,latin"
			},
			"Ovo": {
				"category": "serif",
				"variants": "400",
				"subsets": "latin"
			},
			"Oxygen": {
				"category": "sans-serif",
				"variants": "300,400,700",
				"subsets": "latin-ext,latin"
			},
			"Oxygen Mono": {
				"category": "monospace",
				"variants": "400",
				"subsets": "latin-ext,latin"
			},
			"PT Mono": {
				"category": "monospace",
				"variants": "400",
				"subsets": "cyrillic-ext,latin-ext,latin,cyrillic"
			},
			"PT Sans": {
				"category": "sans-serif",
				"variants": "400,400i,700,700i",
				"subsets": "cyrillic-ext,latin-ext,latin,cyrillic"
			},
			"PT Sans Caption": {
				"category": "sans-serif",
				"variants": "400,700",
				"subsets": "cyrillic-ext,latin-ext,latin,cyrillic"
			},
			"PT Sans Narrow": {
				"category": "sans-serif",
				"variants": "400,700",
				"subsets": "cyrillic-ext,latin-ext,latin,cyrillic"
			},
			"PT Serif": {
				"category": "serif",
				"variants": "400,400i,700,700i",
				"subsets": "cyrillic-ext,latin-ext,latin,cyrillic"
			},
			"PT Serif Caption": {
				"category": "serif",
				"variants": "400,400i",
				"subsets": "cyrillic-ext,latin-ext,latin,cyrillic"
			},
			"Pacifico": {
				"category": "handwriting",
				"variants": "400",
				"subsets": "cyrillic-ext,latin-ext,latin,vietnamese,cyrillic"
			},
			"Padauk": {
				"category": "sans-serif",
				"variants": "400,700",
				"subsets": "latin,myanmar"
			},
			"Palanquin": {
				"category": "sans-serif",
				"variants": "100,200,300,400,500,600,700",
				"subsets": "devanagari,latin-ext,latin"
			},
			"Palanquin Dark": {
				"category": "sans-serif",
				"variants": "400,500,600,700",
				"subsets": "devanagari,latin-ext,latin"
			},
			"Pangolin": {
				"category": "handwriting",
				"variants": "400",
				"subsets": "cyrillic-ext,latin-ext,latin,vietnamese,cyrillic"
			},
			"Paprika": {
				"category": "display",
				"variants": "400",
				"subsets": "latin"
			},
			"Parisienne": {
				"category": "handwriting",
				"variants": "400",
				"subsets": "latin-ext,latin"
			},
			"Passero One": {
				"category": "display",
				"variants": "400",
				"subsets": "latin-ext,latin"
			},
			"Passion One": {
				"category": "display",
				"variants": "400,700,900",
				"subsets": "latin-ext,latin"
			},
			"Pathway Gothic One": {
				"category": "sans-serif",
				"variants": "400",
				"subsets": "latin-ext,latin"
			},
			"Patrick Hand": {
				"category": "handwriting",
				"variants": "400",
				"subsets": "latin-ext,latin,vietnamese"
			},
			"Patrick Hand SC": {
				"category": "handwriting",
				"variants": "400",
				"subsets": "latin-ext,latin,vietnamese"
			},
			"Pattaya": {
				"category": "sans-serif",
				"variants": "400",
				"subsets": "thai,latin-ext,latin,vietnamese,cyrillic"
			},
			"Patua One": {
				"category": "display",
				"variants": "400",
				"subsets": "latin"
			},
			"Pavanam": {
				"category": "sans-serif",
				"variants": "400",
				"subsets": "latin-ext,latin,tamil"
			},
			"Paytone One": {
				"category": "sans-serif",
				"variants": "400",
				"subsets": "latin-ext,latin,vietnamese"
			},
			"Peddana": {
				"category": "serif",
				"variants": "400",
				"subsets": "latin,telugu"
			},
			"Peralta": {
				"category": "display",
				"variants": "400",
				"subsets": "latin-ext,latin"
			},
			"Permanent Marker": {
				"category": "handwriting",
				"variants": "400",
				"subsets": "latin"
			},
			"Petit Formal Script": {
				"category": "handwriting",
				"variants": "400",
				"subsets": "latin-ext,latin"
			},
			"Petrona": {
				"category": "serif",
				"variants": "400",
				"subsets": "latin"
			},
			"Philosopher": {
				"category": "sans-serif",
				"variants": "400,400i,700,700i",
				"subsets": "cyrillic-ext,latin,vietnamese,cyrillic"
			},
			"Piedra": {
				"category": "display",
				"variants": "400",
				"subsets": "latin-ext,latin"
			},
			"Pinyon Script": {
				"category": "handwriting",
				"variants": "400",
				"subsets": "latin"
			},
			"Pirata One": {
				"category": "display",
				"variants": "400",
				"subsets": "latin-ext,latin"
			},
			"Plaster": {
				"category": "display",
				"variants": "400",
				"subsets": "latin-ext,latin"
			},
			"Play": {
				"category": "sans-serif",
				"variants": "400,700",
				"subsets": "cyrillic-ext,greek,latin-ext,latin,vietnamese,cyrillic"
			},
			"Playball": {
				"category": "display",
				"variants": "400",
				"subsets": "latin-ext,latin"
			},
			"Playfair Display": {
				"category": "serif",
				"variants": "400,500,600,700,800,900,400i,500i,600i,700i,800i,900i",
				"subsets": "latin-ext,latin,vietnamese,cyrillic"
			},
			"Playfair Display SC": {
				"category": "serif",
				"variants": "400,400i,700,700i,900,900i",
				"subsets": "latin-ext,latin,vietnamese,cyrillic"
			},
			"Podkova": {
				"category": "serif",
				"variants": "400,500,600,700,800",
				"subsets": "cyrillic-ext,latin-ext,latin,vietnamese,cyrillic"
			},
			"Poiret One": {
				"category": "display",
				"variants": "400",
				"subsets": "latin-ext,latin,cyrillic"
			},
			"Poller One": {
				"category": "display",
				"variants": "400",
				"subsets": "latin"
			},
			"Poly": {
				"category": "serif",
				"variants": "400,400i",
				"subsets": "latin"
			},
			"Pompiere": {
				"category": "display",
				"variants": "400",
				"subsets": "latin"
			},
			"Pontano Sans": {
				"category": "sans-serif",
				"variants": "400",
				"subsets": "latin-ext,latin"
			},
			"Poor Story": {
				"category": "display",
				"variants": "400",
				"subsets": "latin,korean"
			},
			"Poppins": {
				"category": "sans-serif",
				"variants": "100,100i,200,200i,300,300i,400,400i,500,500i,600,600i,700,700i,800,800i,900,900i",
				"subsets": "devanagari,latin-ext,latin"
			},
			"Port Lligat Sans": {
				"category": "sans-serif",
				"variants": "400",
				"subsets": "latin"
			},
			"Port Lligat Slab": {
				"category": "serif",
				"variants": "400",
				"subsets": "latin"
			},
			"Pragati Narrow": {
				"category": "sans-serif",
				"variants": "400,700",
				"subsets": "devanagari,latin-ext,latin"
			},
			"Prata": {
				"category": "serif",
				"variants": "400",
				"subsets": "cyrillic-ext,latin,vietnamese,cyrillic"
			},
			"Preahvihear": {
				"category": "display",
				"variants": "400",
				"subsets": "khmer"
			},
			"Press Start 2P": {
				"category": "display",
				"variants": "400",
				"subsets": "cyrillic-ext,greek,latin-ext,latin,cyrillic"
			},
			"Pridi": {
				"category": "serif",
				"variants": "200,300,400,500,600,700",
				"subsets": "thai,latin-ext,latin,vietnamese"
			},
			"Princess Sofia": {
				"category": "handwriting",
				"variants": "400",
				"subsets": "latin-ext,latin"
			},
			"Prociono": {
				"category": "serif",
				"variants": "400",
				"subsets": "latin"
			},
			"Prompt": {
				"category": "sans-serif",
				"variants": "100,100i,200,200i,300,300i,400,400i,500,500i,600,600i,700,700i,800,800i,900,900i",
				"subsets": "thai,latin-ext,latin,vietnamese"
			},
			"Prosto One": {
				"category": "display",
				"variants": "400",
				"subsets": "latin-ext,latin,cyrillic"
			},
			"Proza Libre": {
				"category": "sans-serif",
				"variants": "400,400i,500,500i,600,600i,700,700i,800,800i",
				"subsets": "latin-ext,latin"
			},
			"Public Sans": {
				"category": "sans-serif",
				"variants": "100,200,300,400,500,600,700,800,900,100i,200i,300i,400i,500i,600i,700i,800i,900i",
				"subsets": "latin-ext,latin"
			},
			"Puritan": {
				"category": "sans-serif",
				"variants": "400,400i,700,700i",
				"subsets": "latin"
			},
			"Purple Purse": {
				"category": "display",
				"variants": "400",
				"subsets": "latin-ext,latin"
			},
			"Quando": {
				"category": "serif",
				"variants": "400",
				"subsets": "latin-ext,latin"
			},
			"Quantico": {
				"category": "sans-serif",
				"variants": "400,400i,700,700i",
				"subsets": "latin"
			},
			"Quattrocento": {
				"category": "serif",
				"variants": "400,700",
				"subsets": "latin-ext,latin"
			},
			"Quattrocento Sans": {
				"category": "sans-serif",
				"variants": "400,400i,700,700i",
				"subsets": "latin-ext,latin"
			},
			"Questrial": {
				"category": "sans-serif",
				"variants": "400",
				"subsets": "latin"
			},
			"Quicksand": {
				"category": "sans-serif",
				"variants": "300,400,500,600,700",
				"subsets": "latin-ext,latin,vietnamese"
			},
			"Quintessential": {
				"category": "handwriting",
				"variants": "400",
				"subsets": "latin-ext,latin"
			},
			"Qwigley": {
				"category": "handwriting",
				"variants": "400",
				"subsets": "latin-ext,latin"
			},
			"Racing Sans One": {
				"category": "display",
				"variants": "400",
				"subsets": "latin-ext,latin"
			},
			"Radley": {
				"category": "serif",
				"variants": "400,400i",
				"subsets": "latin-ext,latin"
			},
			"Rajdhani": {
				"category": "sans-serif",
				"variants": "300,400,500,600,700",
				"subsets": "devanagari,latin-ext,latin"
			},
			"Rakkas": {
				"category": "display",
				"variants": "400",
				"subsets": "latin-ext,latin,arabic"
			},
			"Raleway": {
				"category": "sans-serif",
				"variants": "100,100i,200,200i,300,300i,400,400i,500,500i,600,600i,700,700i,800,800i,900,900i",
				"subsets": "latin-ext,latin"
			},
			"Raleway Dots": {
				"category": "display",
				"variants": "400",
				"subsets": "latin-ext,latin"
			},
			"Ramabhadra": {
				"category": "sans-serif",
				"variants": "400",
				"subsets": "latin,telugu"
			},
			"Ramaraja": {
				"category": "serif",
				"variants": "400",
				"subsets": "latin,telugu"
			},
			"Rambla": {
				"category": "sans-serif",
				"variants": "400,400i,700,700i",
				"subsets": "latin-ext,latin"
			},
			"Rammetto One": {
				"category": "display",
				"variants": "400",
				"subsets": "latin-ext,latin"
			},
			"Ranchers": {
				"category": "display",
				"variants": "400",
				"subsets": "latin-ext,latin"
			},
			"Rancho": {
				"category": "handwriting",
				"variants": "400",
				"subsets": "latin"
			},
			"Ranga": {
				"category": "display",
				"variants": "400,700",
				"subsets": "devanagari,latin-ext,latin"
			},
			"Rasa": {
				"category": "serif",
				"variants": "300,400,500,600,700",
				"subsets": "gujarati,latin-ext,latin"
			},
			"Rationale": {
				"category": "sans-serif",
				"variants": "400",
				"subsets": "latin"
			},
			"Ravi Prakash": {
				"category": "display",
				"variants": "400",
				"subsets": "latin,telugu"
			},
			"Red Hat Display": {
				"category": "sans-serif",
				"variants": "400,400i,500,500i,700,700i,900,900i",
				"subsets": "latin-ext,latin"
			},
			"Red Hat Text": {
				"category": "sans-serif",
				"variants": "400,400i,500,500i,700,700i",
				"subsets": "latin-ext,latin"
			},
			"Redressed": {
				"category": "handwriting",
				"variants": "400",
				"subsets": "latin"
			},
			"Reem Kufi": {
				"category": "sans-serif",
				"variants": "400",
				"subsets": "latin,arabic"
			},
			"Reenie Beanie": {
				"category": "handwriting",
				"variants": "400",
				"subsets": "latin"
			},
			"Revalia": {
				"category": "display",
				"variants": "400",
				"subsets": "latin-ext,latin"
			},
			"Rhodium Libre": {
				"category": "serif",
				"variants": "400",
				"subsets": "devanagari,latin-ext,latin"
			},
			"Ribeye": {
				"category": "display",
				"variants": "400",
				"subsets": "latin-ext,latin"
			},
			"Ribeye Marrow": {
				"category": "display",
				"variants": "400",
				"subsets": "latin-ext,latin"
			},
			"Righteous": {
				"category": "display",
				"variants": "400",
				"subsets": "latin-ext,latin"
			},
			"Risque": {
				"category": "display",
				"variants": "400",
				"subsets": "latin-ext,latin"
			},
			"Roboto": {
				"category": "sans-serif",
				"variants": "100,100i,300,300i,400,400i,500,500i,700,700i,900,900i",
				"subsets": "cyrillic-ext,greek,greek-ext,latin-ext,latin,vietnamese,cyrillic"
			},
			"Roboto Condensed": {
				"category": "sans-serif",
				"variants": "300,300i,400,400i,700,700i",
				"subsets": "cyrillic-ext,greek,greek-ext,latin-ext,latin,vietnamese,cyrillic"
			},
			"Roboto Mono": {
				"category": "monospace",
				"variants": "100,100i,300,300i,400,400i,500,500i,700,700i",
				"subsets": "cyrillic-ext,greek,greek-ext,latin-ext,latin,vietnamese,cyrillic"
			},
			"Roboto Slab": {
				"category": "serif",
				"variants": "100,200,300,400,500,600,700,800,900",
				"subsets": "cyrillic-ext,greek,greek-ext,latin-ext,latin,vietnamese,cyrillic"
			},
			"Rochester": {
				"category": "handwriting",
				"variants": "400",
				"subsets": "latin"
			},
			"Rock Salt": {
				"category": "handwriting",
				"variants": "400",
				"subsets": "latin"
			},
			"Rokkitt": {
				"category": "serif",
				"variants": "100,200,300,400,500,600,700,800,900",
				"subsets": "latin-ext,latin,vietnamese"
			},
			"Romanesco": {
				"category": "handwriting",
				"variants": "400",
				"subsets": "latin-ext,latin"
			},
			"Ropa Sans": {
				"category": "sans-serif",
				"variants": "400,400i",
				"subsets": "latin-ext,latin"
			},
			"Rosario": {
				"category": "sans-serif",
				"variants": "300,400,500,600,700,300i,400i,500i,600i,700i",
				"subsets": "latin-ext,latin,vietnamese"
			},
			"Rosarivo": {
				"category": "serif",
				"variants": "400,400i",
				"subsets": "latin-ext,latin"
			},
			"Rouge Script": {
				"category": "handwriting",
				"variants": "400",
				"subsets": "latin"
			},
			"Rozha One": {
				"category": "serif",
				"variants": "400",
				"subsets": "devanagari,latin-ext,latin"
			},
			"Rubik": {
				"category": "sans-serif",
				"variants": "300,300i,400,400i,500,500i,700,700i,900,900i",
				"subsets": "hebrew,latin-ext,latin,cyrillic"
			},
			"Rubik Mono One": {
				"category": "sans-serif",
				"variants": "400",
				"subsets": "latin-ext,latin,cyrillic"
			},
			"Ruda": {
				"category": "sans-serif",
				"variants": "400,700,900",
				"subsets": "latin-ext,latin"
			},
			"Rufina": {
				"category": "serif",
				"variants": "400,700",
				"subsets": "latin-ext,latin"
			},
			"Ruge Boogie": {
				"category": "handwriting",
				"variants": "400",
				"subsets": "latin-ext,latin"
			},
			"Ruluko": {
				"category": "sans-serif",
				"variants": "400",
				"subsets": "latin-ext,latin"
			},
			"Rum Raisin": {
				"category": "sans-serif",
				"variants": "400",
				"subsets": "latin-ext,latin"
			},
			"Ruslan Display": {
				"category": "display",
				"variants": "400",
				"subsets": "latin-ext,latin,cyrillic"
			},
			"Russo One": {
				"category": "sans-serif",
				"variants": "400",
				"subsets": "latin-ext,latin,cyrillic"
			},
			"Ruthie": {
				"category": "handwriting",
				"variants": "400",
				"subsets": "latin-ext,latin"
			},
			"Rye": {
				"category": "display",
				"variants": "400",
				"subsets": "latin-ext,latin"
			},
			"Sacramento": {
				"category": "handwriting",
				"variants": "400",
				"subsets": "latin-ext,latin"
			},
			"Sahitya": {
				"category": "serif",
				"variants": "400,700",
				"subsets": "devanagari,latin"
			},
			"Sail": {
				"category": "display",
				"variants": "400",
				"subsets": "latin-ext,latin"
			},
			"Saira": {
				"category": "sans-serif",
				"variants": "100,200,300,400,500,600,700,800,900",
				"subsets": "latin-ext,latin,vietnamese"
			},
			"Saira Condensed": {
				"category": "sans-serif",
				"variants": "100,200,300,400,500,600,700,800,900",
				"subsets": "latin-ext,latin,vietnamese"
			},
			"Saira Extra Condensed": {
				"category": "sans-serif",
				"variants": "100,200,300,400,500,600,700,800,900",
				"subsets": "latin-ext,latin,vietnamese"
			},
			"Saira Semi Condensed": {
				"category": "sans-serif",
				"variants": "100,200,300,400,500,600,700,800,900",
				"subsets": "latin-ext,latin,vietnamese"
			},
			"Saira Stencil One": {
				"category": "display",
				"variants": "400",
				"subsets": "latin-ext,latin,vietnamese"
			},
			"Salsa": {
				"category": "display",
				"variants": "400",
				"subsets": "latin"
			},
			"Sanchez": {
				"category": "serif",
				"variants": "400,400i",
				"subsets": "latin-ext,latin"
			},
			"Sancreek": {
				"category": "display",
				"variants": "400",
				"subsets": "latin-ext,latin"
			},
			"Sansita": {
				"category": "sans-serif",
				"variants": "400,400i,700,700i,800,800i,900,900i",
				"subsets": "latin-ext,latin"
			},
			"Sarabun": {
				"category": "sans-serif",
				"variants": "100,100i,200,200i,300,300i,400,400i,500,500i,600,600i,700,700i,800,800i",
				"subsets": "thai,latin-ext,latin,vietnamese"
			},
			"Sarala": {
				"category": "sans-serif",
				"variants": "400,700",
				"subsets": "devanagari,latin-ext,latin"
			},
			"Sarina": {
				"category": "display",
				"variants": "400",
				"subsets": "latin-ext,latin"
			},
			"Sarpanch": {
				"category": "sans-serif",
				"variants": "400,500,600,700,800,900",
				"subsets": "devanagari,latin-ext,latin"
			},
			"Satisfy": {
				"category": "handwriting",
				"variants": "400",
				"subsets": "latin"
			},
			"Sawarabi Gothic": {
				"category": "sans-serif",
				"variants": "400",
				"subsets": "latin-ext,latin,japanese,vietnamese,cyrillic"
			},
			"Sawarabi Mincho": {
				"category": "sans-serif",
				"variants": "400",
				"subsets": "latin-ext,latin,japanese"
			},
			"Scada": {
				"category": "sans-serif",
				"variants": "400,400i,700,700i",
				"subsets": "cyrillic-ext,latin-ext,latin,cyrillic"
			},
			"Scheherazade": {
				"category": "serif",
				"variants": "400,700",
				"subsets": "latin,arabic"
			},
			"Schoolbell": {
				"category": "handwriting",
				"variants": "400",
				"subsets": "latin"
			},
			"Scope One": {
				"category": "serif",
				"variants": "400",
				"subsets": "latin-ext,latin"
			},
			"Seaweed Script": {
				"category": "display",
				"variants": "400",
				"subsets": "latin-ext,latin"
			},
			"Secular One": {
				"category": "sans-serif",
				"variants": "400",
				"subsets": "hebrew,latin-ext,latin"
			},
			"Sedgwick Ave": {
				"category": "handwriting",
				"variants": "400",
				"subsets": "latin-ext,latin,vietnamese"
			},
			"Sedgwick Ave Display": {
				"category": "handwriting",
				"variants": "400",
				"subsets": "latin-ext,latin,vietnamese"
			},
			"Sevillana": {
				"category": "display",
				"variants": "400",
				"subsets": "latin-ext,latin"
			},
			"Seymour One": {
				"category": "sans-serif",
				"variants": "400",
				"subsets": "latin-ext,latin,cyrillic"
			},
			"Shadows Into Light": {
				"category": "handwriting",
				"variants": "400",
				"subsets": "latin"
			},
			"Shadows Into Light Two": {
				"category": "handwriting",
				"variants": "400",
				"subsets": "latin-ext,latin"
			},
			"Shanti": {
				"category": "sans-serif",
				"variants": "400",
				"subsets": "latin"
			},
			"Share": {
				"category": "display",
				"variants": "400,400i,700,700i",
				"subsets": "latin-ext,latin"
			},
			"Share Tech": {
				"category": "sans-serif",
				"variants": "400",
				"subsets": "latin"
			},
			"Share Tech Mono": {
				"category": "monospace",
				"variants": "400",
				"subsets": "latin"
			},
			"Shojumaru": {
				"category": "display",
				"variants": "400",
				"subsets": "latin-ext,latin"
			},
			"Short Stack": {
				"category": "handwriting",
				"variants": "400",
				"subsets": "latin"
			},
			"Shrikhand": {
				"category": "display",
				"variants": "400",
				"subsets": "gujarati,latin-ext,latin"
			},
			"Siemreap": {
				"category": "display",
				"variants": "400",
				"subsets": "khmer"
			},
			"Sigmar One": {
				"category": "display",
				"variants": "400",
				"subsets": "latin-ext,latin,vietnamese"
			},
			"Signika": {
				"category": "sans-serif",
				"variants": "300,400,600,700",
				"subsets": "latin-ext,latin"
			},
			"Signika Negative": {
				"category": "sans-serif",
				"variants": "300,400,600,700",
				"subsets": "latin-ext,latin"
			},
			"Simonetta": {
				"category": "display",
				"variants": "400,400i,900,900i",
				"subsets": "latin-ext,latin"
			},
			"Single Day": {
				"category": "display",
				"variants": "400",
				"subsets": "korean"
			},
			"Sintony": {
				"category": "sans-serif",
				"variants": "400,700",
				"subsets": "latin-ext,latin"
			},
			"Sirin Stencil": {
				"category": "display",
				"variants": "400",
				"subsets": "latin"
			},
			"Six Caps": {
				"category": "sans-serif",
				"variants": "400",
				"subsets": "latin"
			},
			"Skranji": {
				"category": "display",
				"variants": "400,700",
				"subsets": "latin-ext,latin"
			},
			"Slabo 13px": {
				"category": "serif",
				"variants": "400",
				"subsets": "latin-ext,latin"
			},
			"Slabo 27px": {
				"category": "serif",
				"variants": "400",
				"subsets": "latin-ext,latin"
			},
			"Slackey": {
				"category": "display",
				"variants": "400",
				"subsets": "latin"
			},
			"Smokum": {
				"category": "display",
				"variants": "400",
				"subsets": "latin"
			},
			"Smythe": {
				"category": "display",
				"variants": "400",
				"subsets": "latin"
			},
			"Sniglet": {
				"category": "display",
				"variants": "400,800",
				"subsets": "latin-ext,latin"
			},
			"Snippet": {
				"category": "sans-serif",
				"variants": "400",
				"subsets": "latin"
			},
			"Snowburst One": {
				"category": "display",
				"variants": "400",
				"subsets": "latin-ext,latin"
			},
			"Sofadi One": {
				"category": "display",
				"variants": "400",
				"subsets": "latin"
			},
			"Sofia": {
				"category": "handwriting",
				"variants": "400",
				"subsets": "latin"
			},
			"Solway": {
				"category": "serif",
				"variants": "300,400,500,700,800",
				"subsets": "latin"
			},
			"Song Myung": {
				"category": "serif",
				"variants": "400",
				"subsets": "latin,korean"
			},
			"Sonsie One": {
				"category": "display",
				"variants": "400",
				"subsets": "latin-ext,latin"
			},
			"Sorts Mill Goudy": {
				"category": "serif",
				"variants": "400,400i",
				"subsets": "latin-ext,latin"
			},
			"Source Code Pro": {
				"category": "monospace",
				"variants": "200,200i,300,300i,400,400i,500,500i,600,600i,700,700i,900,900i",
				"subsets": "cyrillic-ext,greek,latin-ext,latin,vietnamese,cyrillic"
			},
			"Source Sans Pro": {
				"category": "sans-serif",
				"variants": "200,200i,300,300i,400,400i,600,600i,700,700i,900,900i",
				"subsets": "cyrillic-ext,greek,greek-ext,latin-ext,latin,vietnamese,cyrillic"
			},
			"Source Serif Pro": {
				"category": "serif",
				"variants": "400,600,700",
				"subsets": "latin-ext,latin"
			},
			"Space Mono": {
				"category": "monospace",
				"variants": "400,400i,700,700i",
				"subsets": "latin-ext,latin,vietnamese"
			},
			"Special Elite": {
				"category": "display",
				"variants": "400",
				"subsets": "latin"
			},
			"Spectral": {
				"category": "serif",
				"variants": "200,200i,300,300i,400,400i,500,500i,600,600i,700,700i,800,800i",
				"subsets": "latin-ext,latin,vietnamese,cyrillic"
			},
			"Spectral SC": {
				"category": "serif",
				"variants": "200,200i,300,300i,400,400i,500,500i,600,600i,700,700i,800,800i",
				"subsets": "latin-ext,latin,vietnamese,cyrillic"
			},
			"Spicy Rice": {
				"category": "display",
				"variants": "400",
				"subsets": "latin"
			},
			"Spinnaker": {
				"category": "sans-serif",
				"variants": "400",
				"subsets": "latin-ext,latin"
			},
			"Spirax": {
				"category": "display",
				"variants": "400",
				"subsets": "latin"
			},
			"Squada One": {
				"category": "display",
				"variants": "400",
				"subsets": "latin"
			},
			"Sree Krushnadevaraya": {
				"category": "serif",
				"variants": "400",
				"subsets": "latin,telugu"
			},
			"Sriracha": {
				"category": "handwriting",
				"variants": "400",
				"subsets": "thai,latin-ext,latin,vietnamese"
			},
			"Srisakdi": {
				"category": "display",
				"variants": "400,700",
				"subsets": "thai,latin-ext,latin,vietnamese"
			},
			"Staatliches": {
				"category": "display",
				"variants": "400",
				"subsets": "latin-ext,latin"
			},
			"Stalemate": {
				"category": "handwriting",
				"variants": "400",
				"subsets": "latin-ext,latin"
			},
			"Stalinist One": {
				"category": "display",
				"variants": "400",
				"subsets": "latin-ext,latin,cyrillic"
			},
			"Stardos Stencil": {
				"category": "display",
				"variants": "400,700",
				"subsets": "latin"
			},
			"Stint Ultra Condensed": {
				"category": "display",
				"variants": "400",
				"subsets": "latin-ext,latin"
			},
			"Stint Ultra Expanded": {
				"category": "display",
				"variants": "400",
				"subsets": "latin-ext,latin"
			},
			"Stoke": {
				"category": "serif",
				"variants": "300,400",
				"subsets": "latin-ext,latin"
			},
			"Strait": {
				"category": "sans-serif",
				"variants": "400",
				"subsets": "latin"
			},
			"Stylish": {
				"category": "sans-serif",
				"variants": "400",
				"subsets": "latin,korean"
			},
			"Sue Ellen Francisco": {
				"category": "handwriting",
				"variants": "400",
				"subsets": "latin"
			},
			"Suez One": {
				"category": "serif",
				"variants": "400",
				"subsets": "hebrew,latin-ext,latin"
			},
			"Sulphur Point": {
				"category": "sans-serif",
				"variants": "300,400,700",
				"subsets": "latin-ext,latin"
			},
			"Sumana": {
				"category": "serif",
				"variants": "400,700",
				"subsets": "devanagari,latin-ext,latin"
			},
			"Sunflower": {
				"category": "sans-serif",
				"variants": "300,500,700",
				"subsets": "latin,korean"
			},
			"Sunshiney": {
				"category": "handwriting",
				"variants": "400",
				"subsets": "latin"
			},
			"Supermercado One": {
				"category": "display",
				"variants": "400",
				"subsets": "latin"
			},
			"Sura": {
				"category": "serif",
				"variants": "400,700",
				"subsets": "devanagari,latin-ext,latin"
			},
			"Suranna": {
				"category": "serif",
				"variants": "400",
				"subsets": "latin,telugu"
			},
			"Suravaram": {
				"category": "serif",
				"variants": "400",
				"subsets": "latin,telugu"
			},
			"Suwannaphum": {
				"category": "display",
				"variants": "400",
				"subsets": "khmer"
			},
			"Swanky and Moo Moo": {
				"category": "handwriting",
				"variants": "400",
				"subsets": "latin"
			},
			"Syncopate": {
				"category": "sans-serif",
				"variants": "400,700",
				"subsets": "latin"
			},
			"Tajawal": {
				"category": "sans-serif",
				"variants": "200,300,400,500,700,800,900",
				"subsets": "latin,arabic"
			},
			"Tangerine": {
				"category": "handwriting",
				"variants": "400,700",
				"subsets": "latin"
			},
			"Taprom": {
				"category": "display",
				"variants": "400",
				"subsets": "khmer"
			},
			"Tauri": {
				"category": "sans-serif",
				"variants": "400",
				"subsets": "latin-ext,latin"
			},
			"Taviraj": {
				"category": "serif",
				"variants": "100,100i,200,200i,300,300i,400,400i,500,500i,600,600i,700,700i,800,800i,900,900i",
				"subsets": "thai,latin-ext,latin,vietnamese"
			},
			"Teko": {
				"category": "sans-serif",
				"variants": "300,400,500,600,700",
				"subsets": "devanagari,latin-ext,latin"
			},
			"Telex": {
				"category": "sans-serif",
				"variants": "400",
				"subsets": "latin-ext,latin"
			},
			"Tenali Ramakrishna": {
				"category": "sans-serif",
				"variants": "400",
				"subsets": "latin,telugu"
			},
			"Tenor Sans": {
				"category": "sans-serif",
				"variants": "400",
				"subsets": "latin-ext,latin,cyrillic"
			},
			"Text Me One": {
				"category": "sans-serif",
				"variants": "400",
				"subsets": "latin-ext,latin"
			},
			"Thasadith": {
				"category": "sans-serif",
				"variants": "400,400i,700,700i",
				"subsets": "thai,latin-ext,latin,vietnamese"
			},
			"The Girl Next Door": {
				"category": "handwriting",
				"variants": "400",
				"subsets": "latin"
			},
			"Tienne": {
				"category": "serif",
				"variants": "400,700,900",
				"subsets": "latin"
			},
			"Tillana": {
				"category": "handwriting",
				"variants": "400,500,600,700,800",
				"subsets": "devanagari,latin-ext,latin"
			},
			"Timmana": {
				"category": "sans-serif",
				"variants": "400",
				"subsets": "latin,telugu"
			},
			"Tinos": {
				"category": "serif",
				"variants": "400,400i,700,700i",
				"subsets": "cyrillic-ext,greek,hebrew,greek-ext,latin-ext,latin,vietnamese,cyrillic"
			},
			"Titan One": {
				"category": "display",
				"variants": "400",
				"subsets": "latin-ext,latin"
			},
			"Titillium Web": {
				"category": "sans-serif",
				"variants": "200,200i,300,300i,400,400i,600,600i,700,700i,900",
				"subsets": "latin-ext,latin"
			},
			"Tomorrow": {
				"category": "sans-serif",
				"variants": "100,100i,200,200i,300,300i,400,400i,500,500i,600,600i,700,700i,800,800i,900,900i",
				"subsets": "latin-ext,latin"
			},
			"Trade Winds": {
				"category": "display",
				"variants": "400",
				"subsets": "latin"
			},
			"Trirong": {
				"category": "serif",
				"variants": "100,100i,200,200i,300,300i,400,400i,500,500i,600,600i,700,700i,800,800i,900,900i",
				"subsets": "thai,latin-ext,latin,vietnamese"
			},
			"Trocchi": {
				"category": "serif",
				"variants": "400",
				"subsets": "latin-ext,latin"
			},
			"Trochut": {
				"category": "display",
				"variants": "400,400i,700",
				"subsets": "latin"
			},
			"Trykker": {
				"category": "serif",
				"variants": "400",
				"subsets": "latin-ext,latin"
			},
			"Tulpen One": {
				"category": "display",
				"variants": "400",
				"subsets": "latin"
			},
			"Turret Road": {
				"category": "display",
				"variants": "200,300,400,500,700,800",
				"subsets": "latin-ext,latin"
			},
			"Ubuntu": {
				"category": "sans-serif",
				"variants": "300,300i,400,400i,500,500i,700,700i",
				"subsets": "cyrillic-ext,greek,greek-ext,latin-ext,latin,cyrillic"
			},
			"Ubuntu Condensed": {
				"category": "sans-serif",
				"variants": "400",
				"subsets": "cyrillic-ext,greek,greek-ext,latin-ext,latin,cyrillic"
			},
			"Ubuntu Mono": {
				"category": "monospace",
				"variants": "400,400i,700,700i",
				"subsets": "cyrillic-ext,greek,greek-ext,latin-ext,latin,cyrillic"
			},
			"Ultra": {
				"category": "serif",
				"variants": "400",
				"subsets": "latin"
			},
			"Uncial Antiqua": {
				"category": "display",
				"variants": "400",
				"subsets": "latin"
			},
			"Underdog": {
				"category": "display",
				"variants": "400",
				"subsets": "latin-ext,latin,cyrillic"
			},
			"Unica One": {
				"category": "display",
				"variants": "400",
				"subsets": "latin-ext,latin"
			},
			"UnifrakturCook": {
				"category": "display",
				"variants": "700",
				"subsets": "latin"
			},
			"UnifrakturMaguntia": {
				"category": "display",
				"variants": "400",
				"subsets": "latin"
			},
			"Unkempt": {
				"category": "display",
				"variants": "400,700",
				"subsets": "latin"
			},
			"Unlock": {
				"category": "display",
				"variants": "400",
				"subsets": "latin"
			},
			"Unna": {
				"category": "serif",
				"variants": "400,400i,700,700i",
				"subsets": "latin-ext,latin"
			},
			"VT323": {
				"category": "monospace",
				"variants": "400",
				"subsets": "latin-ext,latin,vietnamese"
			},
			"Vampiro One": {
				"category": "display",
				"variants": "400",
				"subsets": "latin-ext,latin"
			},
			"Varela": {
				"category": "sans-serif",
				"variants": "400",
				"subsets": "latin-ext,latin"
			},
			"Varela Round": {
				"category": "sans-serif",
				"variants": "400",
				"subsets": "hebrew,latin-ext,latin,vietnamese"
			},
			"Vast Shadow": {
				"category": "display",
				"variants": "400",
				"subsets": "latin"
			},
			"Vesper Libre": {
				"category": "serif",
				"variants": "400,500,700,900",
				"subsets": "devanagari,latin-ext,latin"
			},
			"Vibes": {
				"category": "display",
				"variants": "400",
				"subsets": "latin,arabic"
			},
			"Vibur": {
				"category": "handwriting",
				"variants": "400",
				"subsets": "latin"
			},
			"Vidaloka": {
				"category": "serif",
				"variants": "400",
				"subsets": "latin"
			},
			"Viga": {
				"category": "sans-serif",
				"variants": "400",
				"subsets": "latin-ext,latin"
			},
			"Voces": {
				"category": "display",
				"variants": "400",
				"subsets": "latin-ext,latin"
			},
			"Volkhov": {
				"category": "serif",
				"variants": "400,400i,700,700i",
				"subsets": "latin"
			},
			"Vollkorn": {
				"category": "serif",
				"variants": "400,400i,600,600i,700,700i,900,900i",
				"subsets": "cyrillic-ext,greek,latin-ext,latin,vietnamese,cyrillic"
			},
			"Vollkorn SC": {
				"category": "serif",
				"variants": "400,600,700,900",
				"subsets": "cyrillic-ext,latin-ext,latin,vietnamese,cyrillic"
			},
			"Voltaire": {
				"category": "sans-serif",
				"variants": "400",
				"subsets": "latin"
			},
			"Waiting for the Sunrise": {
				"category": "handwriting",
				"variants": "400",
				"subsets": "latin"
			},
			"Wallpoet": {
				"category": "display",
				"variants": "400",
				"subsets": "latin"
			},
			"Walter Turncoat": {
				"category": "handwriting",
				"variants": "400",
				"subsets": "latin"
			},
			"Warnes": {
				"category": "display",
				"variants": "400",
				"subsets": "latin-ext,latin"
			},
			"Wellfleet": {
				"category": "display",
				"variants": "400",
				"subsets": "latin-ext,latin"
			},
			"Wendy One": {
				"category": "sans-serif",
				"variants": "400",
				"subsets": "latin-ext,latin"
			},
			"Wire One": {
				"category": "sans-serif",
				"variants": "400",
				"subsets": "latin"
			},
			"Work Sans": {
				"category": "sans-serif",
				"variants": "100,200,300,400,500,600,700,800,900",
				"subsets": "latin-ext,latin"
			},
			"Yanone Kaffeesatz": {
				"category": "sans-serif",
				"variants": "200,300,400,500,600,700",
				"subsets": "latin-ext,latin,vietnamese,cyrillic"
			},
			"Yantramanav": {
				"category": "sans-serif",
				"variants": "100,300,400,500,700,900",
				"subsets": "devanagari,latin-ext,latin"
			},
			"Yatra One": {
				"category": "display",
				"variants": "400",
				"subsets": "devanagari,latin-ext,latin"
			},
			"Yellowtail": {
				"category": "handwriting",
				"variants": "400",
				"subsets": "latin"
			},
			"Yeon Sung": {
				"category": "display",
				"variants": "400",
				"subsets": "latin,korean"
			},
			"Yeseva One": {
				"category": "display",
				"variants": "400",
				"subsets": "cyrillic-ext,latin-ext,latin,vietnamese,cyrillic"
			},
			"Yesteryear": {
				"category": "handwriting",
				"variants": "400",
				"subsets": "latin"
			},
			"Yrsa": {
				"category": "serif",
				"variants": "300,400,500,600,700",
				"subsets": "latin-ext,latin"
			},
			"ZCOOL KuaiLe": {
				"category": "display",
				"variants": "400",
				"subsets": "latin,chinese-simplified"
			},
			"ZCOOL QingKe HuangYou": {
				"category": "display",
				"variants": "400",
				"subsets": "latin,chinese-simplified"
			},
			"ZCOOL XiaoWei": {
				"category": "serif",
				"variants": "400",
				"subsets": "latin,chinese-simplified"
			},
			"Zeyada": {
				"category": "handwriting",
				"variants": "400",
				"subsets": "latin"
			},
			"Zhi Mang Xing": {
				"category": "handwriting",
				"variants": "400",
				"subsets": "latin,chinese-simplified"
			},
			"Zilla Slab": {
				"category": "serif",
				"variants": "300,300i,400,400i,500,500i,600,600i,700,700i",
				"subsets": "latin-ext,latin"
			},
			"Zilla Slab Highlight": {
				"category": "display",
				"variants": "400,700",
				"subsets": "latin-ext,latin"
			}
		};

		var dictionaries = {
			'en': {
				'selectFont': 'Select a font',
				'search': 'Search',
				'allLangs': 'All languages',
				'favFonts': 'Favorite fonts',
				'localFonts': 'Local fonts',
				'googleFonts': 'Google fonts',
				'select': 'Select',
				'styles': 'styles',
				'sampleText': 'The quick brown fox jumps over the lazy dog.',
				'sampleTextEditable': 'Sample text, editable'
			},
			'nl': {
				'selectFont': 'Kies een lettertype',
				'search': 'Zoek',
				'allLangs': 'Alle talen',
				'favFonts': 'Favoriete lettertypen',
				'localFonts': 'Lokale lettertypen',
				'googleFonts': 'Google lettertypen',
				'select': 'Kies',
				'styles': 'stijlen',
				'sampleText': 'Wazig tv-filmpje rond chique skybox.',
				'sampleTextEditable': 'Voorbeeldtekst, bewerkbaar'
			},
			'de': {
				'selectFont': 'Schriftart wählen',
				'search': 'Suchen',
				'allLangs': 'Alle Sprachen',
				'favFonts': 'Favorisierte Schriftarten',
				'localFonts': 'Lokale Schriftarten',
				'googleFonts': 'Google Schriftarten',
				'select': 'Wählen',
				'styles': 'stile',
				'sampleText': 'Vogel Quax zwickt Johnys Pferd Bim.',
				'sampleTextEditable': 'Beispieltext, editierbar'
			}
		};

		var settings = {
			lang: 'en', // Interface language
			variants: true, // Whether or not to show font variants
			lookahead: 0, // Either false, 0 or a positive integer
			debug: false, // Debugging shows some useful info in console
			localFontsUrl: '/fonts/', // Where .woff files (for local fonts) reside
			parentElement: 'body', // What element to attach the fontpicker to

			localFonts: {// Default: web safe fonts available on all platforms
				"Arial": {
					"category": "sans-serif",
					"variants": "400,400i,600,600i"
				},
				"Courier New": {
					"category": "monospace",
					"variants": "400,400i,600,600i"
				},
				"Georgia": {
					"category": "serif",
					"variants": "400,400i,600,600i"
				},
				"Tahoma": {
					"category": "sans-serif",
					"variants": "400,400i,600,600i"
				},
				"Times New Roman": {
					"category": "serif",
					"variants": "400,400i,600,600i"
				},
				"Trebuchet MS": {
					"category": "sans-serif",
					"variants": "400,400i,600,600i"
				},
				"Verdana": {
					"category": "sans-serif",
					"variants": "400,400i,600,600i",
				}
			}
		}; // End settings

		var Fontpicker = (function() {

			function Fontpicker(original, options) {
				if (options.googleFonts && Array.isArray(options.googleFonts)) {
					// User supplied an array of Google fonts.
					var googleFonts = {}, fontFamily;
					for (var f = 0; f < options.googleFonts.length; f++) {
						fontFamily = options.googleFonts[f];
						googleFonts[fontFamily] = __googleFonts[fontFamily];
					}
					options.googleFonts = googleFonts;
				}
				else if (false !== options.googleFonts) {
					// If user did not supply a subset of Google Fonts, list them all
					options.googleFonts = __googleFonts;
				}

				if (!options.localFonts) { options.localFonts = []; }

				if (!dictionaries[options.lang]) { options.lang = 'en'; }
				this.dictionary = dictionaries[options.lang];

				this.allFonts = {'google':options.googleFonts, 'local':options.localFonts};
				this.options = options;
				this.$original = $(original);
				this.setupHtml();
				this.bindEvents();
				this.fontActive = null;
			}

			Fontpicker.prototype = {

				/**
				 * Load font, either from Google or from local url.
				 *
				 * @param {string} type Font type, either 'google' or 'local'.
				 * @param {string} font Font family name. F.e: 'Chakra', 'Zilla Slab'.
				 */
				loadFont: function(type, font) {
					if (fontsLoaded[font]) { return; }
					fontsLoaded[font] = true;

					switch(type) {
						case 'google':
							var url = 'https://fonts.googleapis.com/css?family=' + font.replace(/ /g,'+') + ':' + this.options.googleFonts[font].variants + '&display=swap';
							this.options.debug && console.log('Loading Google font ' + font + ' from ' + url);
							$('head').append($('<link>', {href:url, rel:'stylesheet', type:'text/css'}));
							break;

						case 'local':
							this.options.debug && console.log('Loading local font ' + font);
							$('head').append("<style> @font-face { font-family:'" + font + "'; src:local('" + font + "'), url('" + this.options.localFontsUrl + font + ".woff') format('woff'); } </style>");
							break;
					}
				},

				/**
				 * Show an (editable) font sample.
				 *
				 * @param {object} $li jQuery list object to extract font spec from (stored in data attributes).
				 */
				showSample: function($li) {
					$('.fp-sample', this.$element).css({
						fontFamily: "'" + $li.data('font-family') + "'",
						fontStyle: $li.data('font-italic') ? 'italic' : 'normal',
						fontWeight: $li.data('font-weight') || 400
					});
				},

				/**
				 * Handle key presses.
				 *
				 * @param {object} e Event.
				 * @param {object} el Element that received the event.
				 */
				keyDown: function(e, el) {
					function stop(e) {
						e.preventDefault();
						e.stopPropagation();
					}

					var $activeLi = $('li.fp-active:visible', this.$results);

					switch(e.keyCode) {
						case 38: // Cursor up
							stop(e);
							$prevLi = $activeLi.prevAll(':not(.fp-divider):visible:first');
							if ($prevLi.length == 0) {
								$prevLi = $('li:not(.fp-divider):visible:last', this.$results);
							}
							$prevLi.trigger('mouseenter').trigger('click');

							__scrollIntoViewIfNeeded($prevLi[0]);
							break;

						case 40: // Cursor down
							stop(e);
							$nextLi = $activeLi.nextAll(':not(.fp-divider):visible:first');
							if ($nextLi.length == 0) {
								$nextLi = $('li:not(.fp-divider):visible:first', this.$results);
							}
							$nextLi.trigger('mouseenter').trigger('click');

							__scrollIntoViewIfNeeded($nextLi[0]);
							break;

						case 13: // Enter
							stop(e);
							$('li.fp-active', this.$results).find('button.apply').trigger('click');
							break;

						case 27: // Esc
							stop(e);
							$('.fp-close', this.$modal).trigger('click');
							break;
					}
				},

				/**
				 * Handle mouse enter events on items in the font list.
				 *
				 * @param {object} e Event.
				 * @param {object} el Element that received the event.
				 */
				mouseEnter: function(e, el) {
					var $li = $(el);
					$('li.fp-hover', this.$results).removeClass('fp-hover');
					$li.addClass('fp-hover');

					this.loadFont($li.data('font-type'), $li.data('font-family'));
					this.showSample($li);
				},

				/**
				 * Handle clicks on items in the font list.
				 * @param {object} e Event.
				 * @param {object} el Element that received the event.
				 */
				click: function(e, el) {
					var $li = $(el), self = this;
					var fontType = $li.data('font-type');
					var fontFamily = $li.data('font-family');
					var	italic = $li.data('font-italic') || false;
					var weight = $li.data('font-weight') || 400;

					if (this.fontActive && this.fontActive == fontFamily) { return; }
					this.fontActive = fontFamily;

					$('li.fp-active', this.$results).removeClass('fp-active').find('.fp-variants,.fp-btns').remove();

					$li.addClass('fp-active');

					var $btns = $('<div class="fp-btns">');

					var isFav = self.favFonts.indexOf(fontType + ':' + fontFamily) != -1;

					$btns.append(
						$('<span class="fp-favorite' + (isFav ? ' checked' : '') + '"></span>')
						.on('click', function(e) {
							e.stopPropagation();
							var idx = self.favFonts.indexOf(fontType + ':' + fontFamily);
							if ($(this).is('.checked')) {
								// Remove from favs
								if (idx != -1) {
									self.favFonts.splice(idx, 1);
								}
							}
							else {
								// Add to favs
								if (-1 == idx) {
									self.favFonts.push(fontType + ':' + fontFamily);
								}
							}
							$(this).toggleClass('checked');
							__cookie('favs', self.favFonts.join(','));
						}),

						$('<button type="button" class="fp-btn apply">')
						.html(this.dictionary['select'])
						.on('click', function(e) {
							e.stopPropagation();

							italic = $li.data('font-italic');
							weight = $li.data('font-weight') || 400;

							var value = fontFamily;
							if (self.options.variants) {
								value += ':' + weight + (italic ? 'i':'');
							}

							self.$select.css({
								fontFamily: fontFamily,
								fontStyle: italic ? 'italic' : 'normal',
								fontWeight: weight
							}).find('span').html(value);

							self.$original.val(value).change(); // Update original <input> element
							self.toggleModal('hide');
						})
					)
					$btns.appendTo($li);

					var font = this.allFonts[fontType][fontFamily];
					var variants = font.variants ? font.variants.split(',') : [];

					if (this.options.variants && variants.length > 1) {
						var $variants = $('<div class="fp-variants">');
						var hasItalic = false;

						for (var v = 0; v < variants.length; v++) {
							if (/i$/.test(variants[v])) {
								if (!hasItalic) { hasItalic = true; }
								continue;
							}

							let variant = variants[v];
							let fontWeight = +variant.replace(/i$/,'');

							if (v > 0) {
								$variants.append(' ');
							}

							$('<span data-font-weight="' + fontWeight + '" class="fp-pill weight' + (weight == fontWeight ? ' checked' : '') + '">')
							.html(variant)
							.on('click', function(e) {
								e.stopPropagation();
								$('span.fp-pill.weight', $li).removeClass('checked');
								$(this).addClass('checked');
								$li.data('font-weight', fontWeight);
								self.showSample($li);
							})
							.appendTo($variants);
						}

						if (hasItalic) {
							$variants.append(' ');
							$('<span class="fp-pill italic ' + (italic ? ' checked' : '') + '">').html('italic').on('click', function(e) {
								e.stopPropagation();
								italic = !italic;
								$(this).toggleClass('checked');
								$li.data('font-italic', italic);
								self.showSample($li);
							}).appendTo($variants);
						}

						$li.append($variants);
					}
				},

				/**
				 * Turn a font spec (Arial:700i, Canga:400) into its components: family, weight and italic.
				 *
				 * @param {string} fontSpec The font specification to split into components.
				 * @return {object} An object containing 3 items: family (string), weight (int) and italic (bool).
				 */
				fontSpecToComponents: function(fontSpec) {
					var tmp = fontSpec.split(':'),
						family = tmp[0],
						variant = tmp[1] || '400',
						italic = false, weight = 400;

					if (/(\d+)i$/.test(variant)) {
						italic = true;
						weight = +RegExp.$1;
					}
					else {
						weight = +variant;
					}

					return {
						family: family,
						weight: weight,
						italic: italic
					}
				},

				/**
				 * Style the original input element with a font.
				 *
				 * @param {string} fontSpec The font specification, f.e: 'Changa:400i' or 'Arial'.
				 */
				applyFontToOriginalInput: function(fontSpec) {
					var font = this.fontSpecToComponents(fontSpec);
					this.loadFont(__googleFonts[font.family] ? 'google' : 'local', font.family);

					this.$select.css({
						fontFamily: font.family,
						fontStyle: font.italic ? 'italic' : 'normal',
						fontWeight: font.weight
					})
					.find('span').html(fontSpec);
				},

				/**
				 * Bind all events.
				 */
				bindEvents: function() {
					var self = this;

					this.$results
					.on('keydown', function(e) {
						self.keyDown(e, this);
					})
					.on('mouseenter', 'li:not(.fp-divider):visible', function(e) {
						self.mouseEnter(e, this);
					})
					.on('click', 'li:not(.fp-divider):visible', function(e) {
						self.click(e, this);
					})
					.on('dblclick', 'li:not(.fp-divider):visible', function(e) {
						$('li.fp-active', this.$results).find('button.apply').trigger('click');
					});

					this.$original.on('change', function(e) {
						self.applyFontToOriginalInput(this.value);
						//self.$original.val(this.value);
					});
				},

				/**
				 * Automatically load fonts as they come in to view.
				 * The lookahead can be controlled via options.lookahead
				 * If options.lookahead === false, fonts will not load automatically.
				 */
				scrollSpy: function() {
					var self = this,
						cb = this.$results[0].getBoundingClientRect(),
						top = cb.top,
						bottom = cb.top + cb.height;

					if (this.options.lookahead > 0) {
						bottom += $('li:not(.fp-divider):visible:first', this.$results).height() * this.options.lookahead;
					}

					$('li:not(.fp-divider):visible', this.$results).each(function() {
						var box = this.getBoundingClientRect();
						var ft = box.top + top - cb.top;
						var fb = ft + box.height;
						var $li = $(this);

						if ((fb >= top) && (ft <= bottom)){
							self.loadFont($li.data('font-type'), $li.data('font-family'));
							$li.css('fontFamily', "'" + $li.data('font-family') + "'");
						}
					});
				},

				/**
				 * Show or hide the fontpicker modal window.
				 *
				 * @param {string} state Either 'hide' or 'show'. When omitted visibility of the modal is toggled.
				 */
				toggleModal: function(state) {
					var self = this;

					if (!state) {
						state = this.$modal.is(':visible') ? 'hide' : 'show';
					}

					if ('hide' == state) {
						// Hide modal
						if (false !== this.options.lookahead) {
							clearInterval(this.lookaheadInterval);
						}

						$('.fp-fav', this.$results).remove();

						this.$modal.css('display','none');
						$('.fp-modal-backdrop', this.$element).remove();
						$(this.options.parentElement).removeClass('fp-modal-open');
					}
					else {
						// Show modal
						this.fontActive = null;

						var fontSpec = this.$original.val();

						$(this.options.parentElement).addClass('fp-modal-open');

						this.$element.append(
							$('<div class="fp-modal-backdrop">')
							.on('click', function() {
								// Click outside modal window closes the modal
								$('.fp-close', this.$modal).trigger('click');
							})
						);

						this.$modal.css('display','flex');

						if (false !== this.options.lookahead) {
							// Lookahead enabled, init scroll spy
							self.scrollSpy();
							self.lookaheadInterval = setInterval(function() { self.scrollSpy() }, 500);
						}

						// Re-list favorites:
						var favs = __cookie('favs');
						this.favFonts = favs ? favs.split(',') : [];
						this.getFavorites(this.favFonts);

						if (fontSpec) {
							var font = self.fontSpecToComponents(fontSpec),
								$li = $("[data-font-family='" + font.family + "']", this.$results);
							$li.trigger('mouseenter').trigger('click');

							$('span.fp-pill', $li).removeClass('checked');
							$("span[data-font-weight='" + font.weight + "']", $li).addClass('checked');
							font.italic && $('span.italic', self.$results).addClass('checked');

							__scrollIntoViewIfNeeded($li[0]);
						}
						else {
							this.$results.scrollTop(0);
						}

						this.$results.focus(); // Make keyboard work
					}
				},

				/**
				 * Apply user filters to font list: language, categories and search term.
				 */
				applyFilter: function() {
					var lang = this.$lang.val(),
						searchTerm = this.$search.val().trim(),
						cats = [];

					$('.fp-category', this.$filter).each(function() {
						if ($(this).hasClass('checked')) {
							cats.push($(this).data('category'));
						}
					});

					// Remember lang and cats
					__cookie('lang', '' === lang ? false : lang);
					__cookie('cats', cats.join(','));

					for (var c in this.allFonts) {
						for (var f in this.allFonts[c]) {
							var item = this.allFonts[c][f];
							var langs = item.subsets ? item.subsets.split(',') : [];
							var $li = $("li[data-font-family='" + f + "']", this.$results);
							var cat = item.category || 'other';

							if ( ('' == lang || langs.indexOf(lang) != -1) &&
								 (cats.indexOf(cat) != -1) &&
								 ('' == searchTerm || f.toLowerCase().indexOf(searchTerm.toLowerCase()) != -1) ) {
								$li.show();
							}
							else {
								$li.hide();
							}
						}
					}
				},

				/**
				 * Construct filter UI.
				 */
				getFilterUI: function() {
					var self = this;

					this.$filter = $('<div class="fp-filter">');

					this.$search = $('<input>', {'class':'fp-search',type:'text', placeholder:this.dictionary['search']}).on('keyup', function() {
						self.applyFilter();
					});

					var opts = ['<option value="">' + this.dictionary['allLangs'] + '</option>'];
					for (var l in googleFontLangs) {
						opts.push('<option value="' + l + '">' + googleFontLangs[l] + '</option>');
					}

					this.$lang = $('<select class="fp-lang">').on('change', function() {
						self.applyFilter();
					}).html(opts.join(''));

					this.$filter.append(
						$('<div class="fp-row">').append(
							this.$search,
							this.$lang
						)
					);

					$('<div class="hr">').appendTo(this.$filter);

					var gFontCats = googleFontCats.slice(0); // Clone
					gFontCats.push('other');
					for (var g = 0; g < gFontCats.length; g++) {
						$('<span class="fp-category fp-pill checked">')
						.data('category', gFontCats[g])
						.text(gFontCats[g])
						.on('click', function() {
							$(this).toggleClass('checked');
							self.applyFilter();
						})
						.appendTo(this.$filter);
					}
				},

				/**
				 * Construct font list.
				 */
				getFontsList: function() {
					var self = this,
						frag = document.createDocumentFragment(), // Use a document fragment to increase performance.
						$li,
						fontFamily;

					function append(fontType, fontFamily) {
						var font = self.allFonts[fontType][fontFamily], small = '';

						if (font.category || font.variants) {
							var items = [];
							if (font.category) { items.push(font.category); }
							if (self.options.variants && font.variants) {
								var nr = font.variants.split(',').length;
								if (nr > 1) {
									items.push(nr + ' ' + self.dictionary['styles']);
								}
							}
							small = ' <small>' + items.join(', ') + '</small>';
						}

						$li = $('<li>', {'data-font-type':fontType, 'data-font-family':fontFamily})
						.html(fontFamily + small);

						frag.append($li[0]);
					}

					// Local fonts
					if (Object.keys(this.options.localFonts).length > 0) {
						$li = $('<li class="fp-divider">' + this.dictionary['localFonts'] + '</li>');
						frag.append($li[0]);
						for (fontFamily in this.options.localFonts) {
							append('local', fontFamily);
						}
					}

					// Google fonts
					if (Object.keys(this.options.googleFonts).length > 0) {
						$li = $('<li class="fp-divider">' + this.dictionary['googleFonts'] + '</li>');
						frag.append($li[0]);
						for (fontFamily in this.options.googleFonts) {
							append('google', fontFamily);
						}
					}

					this.$results = $('<ul>', {'class':'fp-results', tabindex:0}).append(frag);
				},

				/**
				 * Construct list of favorited fonts
				 *
				 * @param {array} favFonts Array of favorite fonts, like: ['Arial:400', 'Pacifico:400']
				 */
				getFavorites: function(favFonts) {
					var frag = document.createDocumentFragment(), $li = null;

					for (var f = 0; f < favFonts.length; f++) {
						var tmp = favFonts[f].split(':'), fontType = tmp[0], fontFamily = tmp[1], font = this.allFonts[fontType][fontFamily];
						if (!font) { continue; }
						$li = $('<li>', {'class':'fp-fav', 'data-font-type':fontType, 'data-font-family':fontFamily})
						.html(fontFamily + (font.category ? ' <small>' + font.category + '</small>' : ''));
						frag.append($li[0]);
					}

					if (null !== $li) {
						frag.prepend($('<li class="fp-fav fp-divider">' + this.dictionary['favFonts'] + '</li>')[0]);
						this.$results.prepend(frag);
					}
				},

				/**
				 * Setup HTML structure for the font picker.
				 */
				setupHtml: function() {
					var self = this;

					var fontSpec = this.$original.val();

					this.$original.hide();

					this.$select =
						$('<div class="font-picker fp-select">')
						.on('click', function() {
							self.toggleModal('show');
						})
						.append($('<span tabindex="0">' + (fontSpec ? fontSpec : this.dictionary['selectFont']) + '</span>'));

					this.$original.after(this.$select);

					this.$element = $('<div>', {'class': 'font-picker'});

					this.$modal = $('<div class="fp-modal">').appendTo(this.$element);

					this.$modal.append(
						$('<div class="fp-header">').append(
							$('<div class="fp-icons">').append(
								$('<span class="fp-close">&times</span>').on('click', function() {
									self.toggleModal('hide');
								})
							),
							$('<h5>').text(this.dictionary['selectFont'])
						)
					);

					this.getFilterUI();
					this.$modal.append(this.$filter);

					this.$sample = $('<div>', {'class':'fp-sample', contenteditable:true, spellcheck:false, title:this.dictionary['sampleTextEditable']})
						.html(this.dictionary['sampleText'])
						.appendTo(this.$modal);

					this.getFontsList();
					this.$modal.append(this.$results);

					var lang = __cookie('lang'), cats = __cookie('cats');

					if (lang) {
						this.$lang.val(lang);
					}

					if (cats) {
						cats = cats.split(',');
						$('.fp-category', this.$filter).each(function() {
							if (-1 == cats.indexOf($(this).data('category'))) {
								$(this).removeClass('checked');
							}
							else {
								$(this).addClass('checked');
							}
						});
					}

					if (lang || cats) {
						self.applyFilter();
					}

					fontSpec && self.applyFontToOriginalInput(fontSpec);

					$(this.options.parentElement).append(this.$element);
				},

				//
				// Public Methods, via $element.fontpicker(method)
				//

				/**
				 * Show the fontpicker.
				 */
				show: function() {
					var el = $(this).data('plugin_' + pluginName);
					el.toggleModal('show');
				},

				/**
				 * Hide the fontpicker.
				 */
				hide: function() {
					var el = $(this).data('plugin_' + pluginName);
					el.toggleModal('hide');
				},

				/**
				 * Destroy the fontpicker plugin, revert element back to original.
				 */
				destroy: function() {
					var el = $(this).data('plugin_' + pluginName);
					el.toggleModal('hide');
					el.$select.remove();
					el.$element.remove();
					el.$original.off('setFont');
					el.$original.show();
					$(el).removeData('plugin_' + pluginName);
				}
			}; // End prototype

			return Fontpicker;
		})();

		if (typeof arguments[0] === 'string') {
			var methodName = arguments[0],
				args = Array.prototype.slice.call(arguments, 1),
				returnVal;

			this.each(function() {
				if ($.data(this, 'plugin_' + pluginName) && typeof $.data(this, 'plugin_' + pluginName)[methodName] === 'function') {
					returnVal = $.data(this, 'plugin_' + pluginName)[methodName].apply(this, args);
				}
				else {
					throw new Error('Method ' +  methodName + ' does not exist on jQuery.' + pluginName);
				}
			});

			return returnVal !== undefined ? returnVal : this; // Preserve chainablility
		}

		return this.each(function() {
			if (!$.data(this, 'plugin_'+pluginName)) {
				// If options exist, merge them
				options && $.extend(settings, options);
				$.data(this, 'plugin_'+pluginName, new Fontpicker(this, settings));
			}
		});
	};
})(jQuery);
