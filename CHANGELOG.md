# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).
## v0.1.11

[compare changes](https://github.com/OptoCode/nuxt-dev-console/compare/v0.1.10...v0.1.11)

### 🚀 Enhancements

- Update ChangeLog and package.json ([190ff29](https://github.com/OptoCode/nuxt-dev-console/commit/190ff29))
- Remove compasable and added a plugin ([700d42b](https://github.com/OptoCode/nuxt-dev-console/commit/700d42b))
- **DevConsole:** Enhance functionality with log filtering, storage, and UI improvements ([090dfc7](https://github.com/OptoCode/nuxt-dev-console/commit/090dfc7))
- **DevConsole:** Introduce advanced logging features and UI enhancements ([25fd23d](https://github.com/OptoCode/nuxt-dev-console/commit/25fd23d))
- **DevConsole:** Add tagged logging and improve documentation ([bc03cfe](https://github.com/OptoCode/nuxt-dev-console/commit/bc03cfe))

### ✅ Tests

- **components:** Enhance DevConsole component tests with theme and filtering ([e7fe7a1](https://github.com/OptoCode/nuxt-dev-console/commit/e7fe7a1))

### ❤️ Contributors

- OptoCode ([@OptoCode](https://github.com/OptoCode))

## v0.1.10

### 🩹 Fixes

- Fix export of useDevLog composable to use named export instead of default export, resolving import errors in consuming applications ([#issue](https://github.com/OptoCode/nuxt-dev-console/commit/48775f2))

## v0.1.9


### 🚀 Enhancements

- Enhance DevConsole configuration and UI in playground and test project; update release script in package.json ([c6fa35c](https://github.com/OptoCode/nuxt-dev-console/commit/c6fa35c))
- Add composable functions for logging and error handling, enhance browser console control, and update documentation ([a279677](https://github.com/OptoCode/nuxt-dev-console/commit/a279677))

### 🩹 Fixes

- Update schema boolean type definitions ([0bd0970](https://github.com/OptoCode/nuxt-dev-console/commit/0bd0970))
- Update schema type definitions to use string literals ([0b87773](https://github.com/OptoCode/nuxt-dev-console/commit/0b87773))
- Update schema to match Nuxt module configuration style ([bc26160](https://github.com/OptoCode/nuxt-dev-console/commit/bc26160))
- Remove schema and rely on defaults for type information ([5e0f99c](https://github.com/OptoCode/nuxt-dev-console/commit/5e0f99c))

### 💅 Refactors

- Remove unused devConsole composable, enhance error handling in app.vue, and update README with new console log sections ([d5b056f](https://github.com/OptoCode/nuxt-dev-console/commit/d5b056f))

### 🏡 Chore

- Update CHANGELOG for version 0.1.7, improve console interception logic, and enhance README with module update instructions ([3603ff8](https://github.com/OptoCode/nuxt-dev-console/commit/3603ff8))
- Update CHANGELOG for version 0.1.8 with minor improvements and bug fixes ([2dac6e3](https://github.com/OptoCode/nuxt-dev-console/commit/2dac6e3))

### ❤️ Contributors

- OptoCode ([@OptoCode](https://github.com/OptoCode))

## [0.1.8] - 2024-04-01

### Changed

- Minor improvements and bug fixes

[0.1.8]: https://github.com/OptoCode/nuxt-dev-console/releases/tag/v0.1.8

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
