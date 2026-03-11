## [Unreleased] - 2026-03-10

### Added
- Install sonner toast library and add toaster component
- Add updateBudgetPlan API mutation function
- Create useUpdateBudget mutation hook with optimistic updates
- Create BudgetCell component with display/edit state machine
- Implement keyboard navigation utility for budget grid
- Integrate BudgetCell into BudgetSection
- Wire up optimistic mutation and editing state in BudgetGrid
- Customize toast styling with design tokens

### Fixed
- Extract BudgetCellEditor to avoid setState-in-effect and ref-during-render violations
- Add type prefix to cell IDs, implement retry action, add onBlur save
- Prevent blur overriding keyboard navigation, add type to mutation params

### Documentation
- Add feature documentation for inline budget editing (LIFE-47)
