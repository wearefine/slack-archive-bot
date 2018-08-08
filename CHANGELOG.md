# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and this project adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

## Unreleased

### Fixed

- Unfiltered channels were getting added back to filtered when user count was greater than 2.

## [v0.4.0] - 6-1-2018

### Fixed

- Filtered channel list by number of members is now used to get channel history to filter on time.

### Updated

- Getting the channel history now is inlcusive by the latest date in each channel.

## [v0.3.4]

### Added

- Docker support
- Package version now pull from package.json
- Keywords to package.json

### Fixed

- Removed extra console log

## [v0.3.3] - 2017-10-13

### Changed

- Removed `Private` flag in package.json to publish to NPM

## [v0.3.2] - 2017-10-13

### Added

- LICENSE
- `-b, --basic` option default setting documentation

### Changed

- README and help documentation for the `-b, --basic` option to reflect what the option is used for
- CHANGELOG format
- Updated Yarn and NPM install methods to pull from NPM

## v0.3.1 - 2017-09-22

### Added

- added a -b --basic option so allow for basic stdout for cron and task runner tools

## v0.3.0 - 2017-09-22

### Changed

 - refactored the code so requests are throttled to 1 per 2 sec

## v0.2.4 - 2017-08-11

### Fixed

- fixed a bug in input name for channel list params

## v0.2.3 - 2017-08-08

### Fixed

- Fix typos in recent README changes

## v0.2.2 - 2017-08-08

### Changed

- updated stdout to use console log

## v0.2.1 - 2017-08-08

### Changed

- updated error out to use console error

## v0.1.1 - 2017-07-26

### Changed

- Fixed typos all over

## v0.1.0 - 2017-07-26

### Added

- All the things
