# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.1.7] - 2024-04-01

### Fixed

- Fixed console interception issues during page navigation
- Improved cleanup of console interception on app unmount
- Added proper state management for console interception
- Fixed linter warnings for unused variables

### Changed

- Moved console interception logic to global state
- Improved console restoration logic to only trigger on app unmount
- Added unmounting flag to track app lifecycle

[0.1.7]: https://github.com/OptoCode/nuxt-dev-console/releases/tag/v0.1.7

## [0.1.6] - 2024-04-01

### Added

- Added composable functions for logging and error handling
- Enhanced browser console control functionality
- Updated documentation with new features

[0.1.6]: https://github.com/OptoCode/nuxt-dev-console/releases/tag/v0.1.6

## [0.1.5] - 2024-04-01

### Changed

- Minor improvements and bug fixes

[0.1.5]: https://github.com/OptoCode/nuxt-dev-console/releases/tag/v0.1.5

## [0.1.4] - 2024-04-01

### Changed

- Minor improvements and bug fixes

[0.1.4]: https://github.com/OptoCode/nuxt-dev-console/releases/tag/v0.1.4

## [0.1.3] - 2024-04-01

### Changed

- Minor improvements and bug fixes

[0.1.3]: https://github.com/OptoCode/nuxt-dev-console/releases/tag/v0.1.3

## [0.1.2] - 2024-04-01

### Changed

- Minor improvements and bug fixes

[0.1.2]: https://github.com/OptoCode/nuxt-dev-console/releases/tag/v0.1.2

## [0.1.0] - 2024-04-01

### Added

- Initial release of nuxt-dev-console
- Customizable theme (dark/light/system)
- Flexible positioning options
- Keyboard shortcuts support
- Advanced filtering capabilities
- Copy to clipboard functionality
- Performance optimized implementation
- Production mode support (optional)
- Real-time log updates
- Basic test suite
- Comprehensive documentation
- TypeScript support
- Playground environment
- Composable functions:
  - `useDevLog` for logging and console control
  - `useNuxtErrorHandler` for automatic error handling
- Browser console control with enable/disable functionality
- Automatic Nuxt and Vue error/warning handling
- Log history management with max size limit
- Sanitized error and object logging

### Changed

- N/A (Initial release)

### Deprecated

- N/A (Initial release)

### Removed

- N/A (Initial release)

### Fixed

- N/A (Initial release)

### Security

- N/A (Initial release)

[0.1.0]: https://github.com/OptoCode/nuxt-dev-console/releases/tag/v0.1.0
