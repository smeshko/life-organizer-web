## [Unreleased] - 2026-03-10

### Added
- Create FilterContext with useReducer for global year/period state management
- Integrate FilterProvider into app component tree
- Replace placeholder header selects with shadcn/ui Select components
- Wire sidebar quick-stats heading to FilterContext

### Fixed
- Cycle 1 review - add reducer default case, fix import order, strengthen persistence test
- Remove unused imports in sidebar tests

### Documentation
- Add feature documentation for global year & period filters

### Other
- Verify FilterContext unit test coverage
- Update sidebar tests for dynamic glance heading
- Update header tests for shadcn/ui select integration
