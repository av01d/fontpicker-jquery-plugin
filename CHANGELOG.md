# Change Log
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/)
and this project adheres to [Semantic Versioning](https://semver.org/).

## [1.10] - 2024-11-07
### Changed
- Updated Google Fonts list

## [1.9] - 2024-09-11
### Changed
- Allow font's 'category' to be '*', which disables category-filtering for that font

## [1.8] - 2024-08-22
### Changed
- Updated Google Fonts list

## [1.7] - 2024-07-17
### Changed
- Updated Google Fonts list

## [1.6] - 2023-03-21
### Changed
- Updated Google Fonts list: now includes some Arabic fonts as well

## [1.5] - 2022-01-19
### Changed
- Added support for TTF, WOFF2 and OTF fonts (configuration parameter `localFontsType`)
- Updated Google Fonts list

## [1.4.5] - 2021-09-28
### Fixed
- Firefox did not load custom fonts properly.

## [1.4.4] - 2021-08-06
### Changed
- If `googleFonts` contains a non existing font, silently ignore the font.

## [1.4.3] - 2021-06-09
- Fixed undeclared variable font, fontFamily, fontType. Fixes [#12](https://github.com/av01d/fontpicker-jquery-plugin/issues/12).

## [1.4.2] - 2021-05-28
### Changed
- Only load local fonts if they're not already available.
  This prevents loading of default system fonts like Helvetica, Times New Roman etc.

## [1.4.1] - 2021-04-28
### Changed
- Add translations for French (`lang = 'fr'`). Translation by Noferi Mickaël.

## [1.4] - 2021-02-26
### Fixed
- CSS glitch fixed (removed fixed height of select box)
- Removed a dangling `console.log`
- Google font `Molle` caused an issue, because of only 1 variant, which was italic too.

## [1.3.1] - 2020-12-11
### Fixed
- Version 1.3 introduced issue [#8](https://github.com/av01d/fontpicker-jquery-plugin/issues/8). This release fixes that.

## [1.3] - 2020-12-08
### Changed
- Updated Google Fonts list (1023 fonts now, was 993).
### Fixed
- Fix for issue [#7](https://github.com/av01d/fontpicker-jquery-plugin/issues/7): when `googleFonts == false`, don't try to load fonts from Google repository.

## [1.2] - 2020-11-30
### Changed
- Added compatibility with Internet Explorer 11.
- `$('#font').val('').trigger('change')` clears selected font.

## [1.1] - 2020-07-15
### Changed
- Added `showClear` option. When `true`, the user can clear a selected font. Fixes issue [#5](https://github.com/av01d/fontpicker-jquery-plugin/issues/5).
- Improved clear buttons (now SVG based and better aligned)
- Fixed an issue with `Press Start 2P` font: when a user selected this font, it would not render that font in the select box.

## [1.0] - 2020-07-10
### Changed
- Added `onSelect` callback. This callback allows for determining whether a local or Google font was selected. Fixes issue [#4]((https://github.com/av01d/fontpicker-jquery-plugin/issues/4).
- Updated Google Fonts list (993 fonts now, was 977).

## [0.9.1] - 2020-06-29
### Changed
- Added `SameSite=Lax` to cookie parameters.

## [0.9] - 2020-05-18
### Changed
- Add translations for Spanish (`lang = 'es'`)

## [0.8] - 2020-03-11
### Fixed
- If the input element had a value of a non-existing font family, a Javascript
  error would be thrown. This is now fixed.

## [0.7] - 2020-03-03
### Changed
- Modal can now be opened by spacebar, when element is focused.
- Keys `1-9` select a font weight in an active item. `1` = font-weight `100` ... `4` = font-weight `400` ... `9` = font-weight `900`.
- Key `i` toggles italics in an active item.
- Italic pill now has a purplish colored background

## [0.6] - 2020-03-02
### Changed
- The fontpicker now lists the last X fonts a user picked in the *Favorite fonts* section.
- The new `nrRecents` option controls how many last-picked fonts are remembered.
- Added a clear button to the search box.

## [0.5] - 2020-02-28
### Fixed
- Favorite fonts weren't rendered in their respective font families when lazy loading was enabled.

## [0.4] - 2020-02-27
### Changed
- Added `lazyLoad` option, allowing you to disable lazy loading of fonts.
- Improved performance on Microsoft Edge.

## [0.3] - 2020-02-26
### Fixed
- Fixed some CSS issues.
- Throw an error if `show` or `hide` methods are called on a destroyed instance.

## [0.2] - 2020-02-26
### Changed
- Added `parentElement` configuration option.

### Fixed
- Fixed some CSS issues.

## [0.1] - 2020-02-25
- Initial release.
