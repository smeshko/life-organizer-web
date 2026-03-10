## [Unreleased] - 2026-03-10

### Added
- Add date range and multi-category filter params to API
- Create useTransactionFilters hook for local filter state
- Update useTransactions hook to accept filter params
- Install shadcn/ui tabs, popover, checkbox, badge components
- Build TransactionFilters component
- Integrate filters into transactions page

### Fixed
- Resolve lint error in transactions page memoization
- Normalize query key values, restore fake timers in tests
- Normalize empty date strings, add missing filter tests

### Documentation
- Add feature documentation for transaction filtering

### Other
- Add integration tests for transaction filtering
