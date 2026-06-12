# TODO - Lending section wiring

- [x] Replace `src/sections/MainPageSections/LendingSection.jsx` placeholder UI with lending pool controls that use `useLending()`.
  - [x] Show inputs + buttons for: addCollateral, withdrawCollateral, harvestStakingRewards.
  - [x] Show read-only telemetry: health factor, liquidation status, repayable amount, staking yield, position collateral.
  - [x] Add refresh buttons to re-query on demand.
  - [x] Render wallet connect banner when not connected.
- [x] Ensure section matches styling patterns used by `BorrowingSection.jsx`.
- [x] Run eslint/build to confirm no React/JS issues.
