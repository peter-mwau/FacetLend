# TODO - Borrowing flow UI

- [x] Update `src/sections/MainPageSections/BorrowingSection.jsx` to implement the borrowing UX:
  - [ ] Wire to `useLending()` from `src/contexts/LendingContext.jsx`
  - [ ] Add inputs for collateral amount and borrow amount
  - [ ] Call `addCollateral(amount)` and `borrowAPS(amount)`
  - [ ] Show health factor by calling `getHealthFactor(address)` (read-on-demand + optional auto-refresh)
  - [ ] Add repay controls calling `repayAPS()`
  - [ ] Display repayable amount via `getRepayableAmount(address)`
  - [ ] Use `loading`/`error` and show status messages

- [ ] Keep `LendingSection.jsx` unchanged for now (placeholder)
- [ ] Run `npm test`/`npm run lint` or `npm run build` to ensure no compile errors
