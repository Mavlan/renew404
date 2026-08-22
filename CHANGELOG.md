# Changelog

All notable changes to Renew404 are documented in this file.

The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and releases use [Semantic Versioning](https://semver.org/).

## [Unreleased]

## [1.1.0] - 2026-08-23

### Added

- Seventeen stable system categories plus local custom categories.
- Searchable service templates with local brand logos and deterministic fallbacks.
- Simplified Chinese, Traditional Chinese, English, and Japanese interfaces.
- Expanded ISO 4217 currency selector with localized names and region hints.
- PWA launch screen and explicit in-app update feedback.
- Linux-safe, resource-first 1Panel release archive workflow.

### Changed

- Simplified service creation around templates and progressive advanced customization.
- Improved mobile sheets, form proportions, safe-area spacing, date input behavior, and navigation icons.
- JSON export now includes service `iconKey` and custom category data while retaining backup format version 1.

### Compatibility

- Existing IndexedDB records migrate without being cleared.
- Legacy version-1 JSON backups remain importable when category or icon fields are absent.
- Templates and logo definitions are not required to render saved services.

## [1.0.0] - 2026-08-01

### Added

- Initial local-first subscription tracking, payment history, statistics, JSON backup, calendar export, and offline PWA support.
