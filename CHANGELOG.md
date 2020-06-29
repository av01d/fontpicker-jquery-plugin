# Change Log
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/)
and this project adheres to [Semantic Versioning](https://semver.org/).

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
