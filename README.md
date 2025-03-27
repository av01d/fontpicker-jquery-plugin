# Deprecation notice

***This FontPicker is deprecated and no longer maintained as of April 1st, 2025. Don't worry though, we've created a very capable replacement:
[JSFontPicker](https://www.jsfontpicker.com). This new plugin does no longer depend on jQuery (it's vanilla JS) and is much more modern.
Please make the switch, you won't regret it!***

# Fontpicker jQuery Plugin

A component to quickly choose fonts from Google Web Fonts, custom fonts you (the web developer) provide, as well as system fonts.
Lets users easily select and preview a font from Google's large range of free fonts, and optionally select a font weight and font style (normal or italics).
This plugin is the successor of the [Fontselect jQuery plugin](https://github.com/av01d/fontselect-jquery-plugin).

<img src="https://av01d.github.io/fontpicker-jquery-plugin/img/fontpicker.png" width="200" height="256">

## [Live Demo](https://av01d.github.io/fontpicker-jquery-plugin/index.html)

## Table of contents
- [Features](#features)
- [Demo](#demo)
- [Getting started](#getting-started)
- [Options](#options)
- [Methods](#methods)
- [Events](#events)
- [Browser support](#browser-support)
- [Real world examples](#real-world-examples)
- [Donations](#donations)
- [License](#license)

## Features

- Quickly preview and select any Google font family.
- Lazy loading of fonts as they come into view (uses [`IntersectionObserver`](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API))
- Optionally present system and local fonts (`.woff`, `.ttf`) as well.
- Optionally choose font weight and font style.
- Find fonts by name, language and category (serif, sans-serif, display, handwriting, monospace).
- Users can favor fonts (stored in a cookie). Favored fonts are listed in the *Favorite fonts* section upon re-opening the picker.
- Remembers users last picked fonts, listing them on top in the *Favorite fonts* section upon re-opening the picker.
- Editable sample text (default: *The quick brown fox jumps over the lazy dog*)
- Keyboard navigation to the extend that the component can be fully controlled by keyboard only (mouse/touch is optional):
  - `Spacebar` opens the modal (when input element is focused).
  - `Up/Down` cursor keys navigate through options.
  - `Enter` selects on option, double-clicking does too.
  - `Esc` closes the picker.
  - `1-9` selects a font weight in an active item. `1` = font-weight `100` ... `4` = font-weight `400` ... `9` = font-weight `900`.
  - `i` toggles italics in an active item.
- Drop-in replacement for a regular input element.

## Demo

[Live demo](https://av01d.github.io/fontpicker-jquery-plugin/index.html).

## Getting started

### Installation

This is a jQuery plugin, so... make sure you load jQuery before you include this plugin.

With a copy on your server:
```html
<link href="/path/to/dist/jquery.fontpicker.min.css" rel="stylesheet">
<script src="https://code.jquery.com/jquery-3.5.1.slim.min.js"></script>
<script src="/path/to/dist/jquery.fontpicker.min.js"></script>
```

You can also load it from jsDelivr:
```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/av01d/fontpicker-jquery-plugin@1.5/dist/jquery.fontpicker.min.css" integrity="sha256-urFh3EMgi9s3j3w+TsAP1TfUQiE0yUZmmLX7JRyvjqE=" crossorigin="anonymous">
<script src="https://cdn.jsdelivr.net/npm/jquery@3.6.0/dist/jquery.slim.min.js" integrity="sha256-u7e5khyithlIdTpu22PHhENmPcRdFiHRjhAuHcs05RI=" crossorigin="anonymous"></script>
<script src="https://cdn.jsdelivr.net/gh/av01d/fontpicker-jquery-plugin@1.5/dist/jquery.fontpicker.min.js" integrity="sha256-+UHNQaPSVoGbGqqvjreSLWm7Zm6k+hQh2lbfwATpQEY=" crossorigin="anonymous"></script>
```

### Usage

To create a font picker, simply run the plugin on a standard html `input` element.

#### Syntax
```js
$('input.fonts').fontpicker([options]);
````

- **options** (optional)
  - Type: `Object`
  - The options for the font picker. See available [options](#options).

#### Example

```html
<input class="fonts">
```

```js
$('input.fonts').fontpicker({
   lang: 'en',
   variants: true,
   lazyLoad: true,
	showClear: true,
   nrRecents: 3,
   googleFonts: 'Alegreya,Boogaloo,Coiny,Dosis,Emilys Candy,Faster One,Galindo'.split(','),
   localFonts: {
      "Arial": {
         "category": "sans-serif",
         "variants": "400,400i,600,600i"
      },
      "Georgia": {
         "category": "serif",
         "variants": "400,400i,600,600i"
      },
      "Times New Roman": {
         "category": "serif",
         "variants": "400,400i,600,600i"
      },
      "Verdana": {
         "category": "sans-serif",
         "variants": "400,400i,600,600i",
      },
      "Action Man": {},
      "Bauer": {
         "category": "display",
         "variants": "400,400i,600,600i",
         "subsets": "latin-ext,latin"
      },
      "Bubble": {
         "category": "display",
         "variants": "400,400i,600,600i",
         "subsets": "latin-ext,latin"
      }
   },
   localFontsUrl: 'fonts/' // End with a slash!
});
````

When a user picks a font, the original `input` element will be filled with the chosen font family name: `Alegreya`, `Arial`, `Faster One` etc.
If the `variants` option has been enabled (it is by default), the font family will be followed by a font-weight and an italics indicator.
Some examples:

- `Alegreya:400`: Font family `Alegreya`, font weight `400`
- `Alegreya:700`: Font family `Alegreya`, font weight `700`
- `Alegreya:700i`: Font family `Alegreya`, font weight `700`, italics
- `Faster One:400`: Font family `Faster One`, font weight `400`
- `Arial:600i`: Font family `Arial`, font weight `600`, italics

[⬆ back to top](#table-of-contents)

## Options

Fontpicker has one argument, an options object that you can customise.

### lang

- Type: `String`
- Default: `en`
- Options:
  - `en`: English
  - `de`: German
  - `es`: Spanish
  - `nl`: Dutch

The interface language.
If you need a translation in another language: take a look at the `dictionaries` variable in `jquery.fontpicker.js`, and send me the translations for your language.

### variants

- Type: `Boolean`
- Default: `true`

With `variants: true`, users can not only select a font family, but the variant (font weight and font style) of it as well, if applicable. Many fonts in the Google Repository have multiple variants (multiple font weights, normal and italic styles).
In this case, the `input` element will have a value that consists of the chosen font, followed by the font-weight and an italics indicator (see [Example](#example)).

### nrRecents

- Type: `Number`
- Default: `3`

The fontpicker component lists the last X fonts the user picked earlier first, in the *Favorite fonts* section.
The `nrRecents` option defines how many last-picked fonts to remember. Use `0` to not remember any at all.

### lazyLoad

- Type: `Boolean`
- Default: `true`

When the user scrolls the font list, each font is rendered in its own font family. This is accomplished by loading the external font on demand, as soon as the font becomes visible in the list (using an *Intersection Observer*).
The `lazyLoad` option enables or disables this functionality.
If disabled, fonts in the list will no longer be rendered in their own font family.

### googleFonts

- Type: `Array`
- Default: All available Google Fonts

An array of Google fonts to present in the font list. Shows all available Google fonts by default. Use `false` to not show Google Fonts at all.

### localFonts

The Google Fonts Repository doesn't always offer enough options. The fontpicker plugin allows you to present custom fonts as well.
The local font files have to be in `.ttf`, `.woff`, `woff2` or `otf` format, and they should all be put in a single folder, under the document root folder of your site. Something like `/fonts/` makes sense.
Provide the path to this folder as the `localFontsUrl` configuration parameter.
Use the `localFontsType` to indicate what font format you use.

- Type: `Object`
- Default:
  ```
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
   ```

The key of an item is the *font family*. As mentioned above, make sure that custom (non-system) fonts are available on your webserver, as `.woff`, `.ttf`, `.woff2` or `.otf` files (`.ttf` or `.woff` are most widely supported across browsers). Make sure the name of the font files matches the *font family* name used here:
`"Action Man"` -> `/fonts/Action Man.[woff|ttf]`
`"Bubble"` -> `/fonts/Bubble.[woff|ttf]`

The value of an item is an object, containing up to 3 properties:
- `category`: A `String`, containing one of `serif, sans-serif, display, handwriting, monospace`. This allows users to filter fonts by category. If omitted, the font is listed under the `other` category.
- `variants`: A `String`, containing a comma-separated list of variants available for the font. See example below. If omitted, users cannot pick a variant for this font (the font weight will be `400`, the font style will be `normal` (non italics)).
- `subsets`: A `String`, containing a comma-separated list of language-subsets the font entails. This allows users to filter fonts by language. If omitted, the font can (only) be found under `All languages`.

Example:
```
{
   "Arial": {
      "category": "sans-serif",
      "variants": "400,400i,600,600i"
   },
   "Georgia": {
      "category": "serif",
      "variants": "400,400i,600,600i"
   },
   "Times New Roman": {
      "category": "serif",
      "variants": "400,400i,600,600i"
   },
   "Verdana": {
      "category": "sans-serif",
      "variants": "400,400i,600,600i",
   },
   "Action Man": {},
   "Bauer": {
      "category": "display",
      "variants": "400,400i,600,600i",
      "subsets": "latin-ext,latin"
   },
   "Bubble": {
      "category": "display",
      "variants": "400,400i,600,600i",
      "subsets": "latin-ext,latin"
   }
};
```

### localFontsUrl

- Type: `String`
- Default: `/fonts/`

Path to folder where local fonts are stored (in .woff format). Default: `/fonts/`. *Make sure to end with a slash!*

### localFontsType

- Type: `String`
- Default: `woff`

The type of local fonts you have. Either `woff`, `ttf`, `woff2` or `otf`.

### parentElement

- Type: `String` or `jQuery object`
- Default: `'body'`

Parent element (jQuery selector/element) to attach the font picker to. The default `body` should suffice in pretty much all cases. Only tinker with this if you know what you're doing.

If you want to use the Fontpicker inside a Bootstrap modal, you need to attach it to the modal instead of the body, to prevent keyboard/mouse focus issues. For example:
```
$('#font').fontpicker({
   parentElement: '#myModal'
});
```

### showClear

- Type: `Boolean`
- Default: `false`

When enabled, users can clear/deselect a selected font. A *clear* icon will be rendered in the font dropdown.

### onSelect

- Type: `function`
- Default: `undefined`

By default, the Fontpicker Plugin calls `change` on the original input element.
This is sufficient in many cases, but sometimes you also need to know whether a local or Google font was selected. That's where the `onSelect` callback comes in.
This callback function is called when the user picks a font. The function is called with a single argument: an object, containing the following members:

  - `fontType`: Either `local` or `google`
  - `fontFamily`: The font family name (string)
  - `fontStyle`: Either `normal` or `italic`
  - `fontWeight`: The font weight the user selected (integer). 
  - `fontSpec`: The complete font spec. For example: `Arial:400` or `Roboto:700i`. 

### debug

- Type: `Boolean`
- Default: `false`

When enabled, the plugin shows info about fonts being loaded in the console.

[⬆ back to top](#table-of-contents)

## Methods

### set font

Programmatically select a font by calling `val()` on the original input element, then triggering the `change` event:
```
// Select 'Geo' font family
$('#font').val('Geo').trigger('change');
```
or
```
// Select 'Orbitron' font family, weight 900
$('#font').val('Orbitron:900').triggger('change');
```
or
```
// Select 'Open Sans' font family, weight 800, italics
$('#font').val('Open Sans:800i').triggger('change');
```

You can programmatically clear a selected font like this:
```
$('#font').val('').trigger('change');
```

### show

Show the font picker manually
```
$('#font').fontpicker('show');
```

### hide

Hide the font picker manually
```
$('#font').fontpicker('hide');
```

### destroy

Destroy the font picker, revert element back to original.
```
$('#font').fontpicker('destroy');
```

[⬆ back to top](#table-of-contents)

## Browser support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Opera (latest)
- Edge (latest)
- Internet Explorer 11

Please note: For Internet Explorer, you must include the *intersection-observer* polyfill:
```html
<script src="https://cdn.jsdelivr.net/npm/intersection-observer/intersection-observer.js"></script>
```
You can include this anywhere in your page, either before or after including `jquery.fontpicker.js`.

[⬆ back to top](#table-of-contents)

## Events

Fontpicker triggers the `change` event on the original `input` element when a font is selected.
See this example for how this could be used to update the font on the current page.

```html
<input id="font">
```

```js
$('#font').fontpicker().on('change', function() {
   // Split font into family and weight/style
   var tmp = this.value.split(':'),
      family = tmp[0],
      variant = tmp[1] || '400',
      weight = parseInt(variant,10),
      italic = /i$/.test(variant);

   // Set selected font on body
   var css = {
      fontFamily: "'" + family + "'",
      fontWeight: weight,
      fontStyle: italic ? 'italic' : 'normal'
   };

   console.log(css);
   $('body').css(css);
});
```

It is not possible to distinguish between local and Google fonts through the `change` event. Take a look at the [`onSelect`](#onSelect) option for an alternative.

[⬆ back to top](#table-of-contents)

## Real world examples

The Fontpicker plugin is used (among others) on the following websites:

- [Chartle.com](https://www.chartle.com/)
- [MindMapEditor.com](https://www.mindmapeditor.com/)
- [PhotoCollage.com](https://www.photocollage.com/)
- [PhotoEditor.com](https://www.photoeditor.com/)
- [PhotoFilters.com](https://www.photofilters.com/)
- [PhotoResizer.com](https://www.photoresizer.com/)
- [PosterMaker.com](https://www.postermaker.com/)
- [PrintScreenshot.com](https://www.printscreenshot.com/)
- [WordClouds.com](https://www.wordclouds.com/)

[⬆ back to top](#table-of-contents)

## Donations

If you like what I've made here, you can sponsor me with a donation. Thank you so much!

[![](https://www.paypalobjects.com/en_US/i/btn/btn_donateCC_LG.gif)](https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=VUVAC8EA3X468)

[⬆ back to top](#table-of-contents)

## License

This plugin is released under the MIT license. It is simple and easy to understand and places almost no restrictions on what you can do with the code.
[More Information](http://en.wikipedia.org/wiki/MIT_License)

The development of this component was funded by [Zygomatic](https://www.zygomatic.nl/).

[⬆ back to top](#table-of-contents)
