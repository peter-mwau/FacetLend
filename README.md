# FacetLend (Beta v1.0.1)

Unlock every facet of your borrowing power.

FacetLend is a web app that interacts with an on-chain borrowing & pricing system, designed around a **Diamond Proxy** architecture. The frontend focuses on making complex DeFi interactions easier to access with a clean dashboard experience.

> Repo: https://github.com/peter-mwau/FacetLend.git

---

## Problem this project solves

- **DeFi interactions are hard to navigate**: users need to understand multiple contract calls (flash loans, lending/borrowing, pricing).
- **Smart-contract upgrades are complex**: Diamond/Fectar-based designs require careful deployment and address wiring.
- **Onboarding should be frictionless**: account abstraction reduces the need for users to manage raw wallets and complex setup.

---

## Opportunity

Diamond-based systems enable modular evolution (new facets without redeploying the core). FacetLend provides:

- A UI layer that can be updated quickly while keeping a stable on-chain address (the diamond).
- A path for improving UX via account abstraction (**ERC-4337**) so new users can onboard faster.
- A structure that supports future facets/modules with minimal frontend changes.

---

## Key features

### Lending & Borrowing UX

- View lending/borrow-related data via the connected smart contracts.
- User flows for depositing collateral and borrowing.
- Repay / health factor style readouts (as enabled by the connected contracts).

### Flashloan tools

- Flashloan-oriented UI and flows via the connected `FlashLoanFacet`.

### Pricing / Move Price utilities

- Pricing-related interactions via the connected facets (e.g., `MovePriceFacet`).

### Settings / Developer-friendly UI

- App settings and connectivity tooling through the frontend sections/components.

---

## Account abstraction (ERC-4337) & thirdweb

FacetLend uses **ERC-4337**-style account abstraction via **thirdweb** to simplify onboarding:

- Wallet connection is handled through `ThirdwebProvider`.
- The goal is to allow smoother user onboarding compared to traditional “EOA + manual steps” setups.

---

## Architecture overview

### On-chain: Diamond Proxy (separate repository)

The core smart contracts are implemented as a **Diamond Proxy** (separate repo). The diamond contract address is treated as the single “entry point”, while facet addresses define the modular functionality.

### Frontend: contract address + ABI injection

This repository is the **frontend**. It injects/uses the connected on-chain addresses and the corresponding ABI definitions.

Contract address wiring is centralized in:

- `src/constants/addresses.js`

Current configured addresses (example wiring):

- **APS**: `0x4d6B3b7AFE85CB6c8b00A893a39Ea68F7aF0CE55`
- **MainDiamond (Diamond Proxy address)**: `0xD9ba8B2e5649a4c1d58D0eF81eEbD102804fd11c`
- **DiamondInit**: `0x5EA45eb5d66f9dd3F8884Af7464AE7fd9d5A12d0`

Facets:

- `DiamondCutFacet`: `0xF39559bfC20029660355d6aBc53865c91e2F1637`
- `DiamondLoupeFacet`: `0xD6e1C0C1F0AB595Da6Af63ad90E0b53422C51926`
- `OwnershipFacet`: `0xfb2e29098bD8C1825ED089933fC2B8e6ef116c9e`
- `ApsdexFacet`: `0x525b14069B77775B2Bfb068935cc30AF7EBD9BE8`
- `FlashLoanFacet`: `0x461B77b568Fce016f6813501711dbFdAB25C5654`
- `MovePriceFacet`: `0xd7276E2C7EEa521B9b0Bd6e53eaC75e8bfE6fA38`
- `LendingFacet`: `0x0e36b85F2eECe143ff2F871dc352c0712455298C`

> **ABIs**: The frontend expects ABI artifacts for the diamond and facet contracts to be available/usable (for example from the build artifacts folder structure in this repo or via your diamond repo’s artifact outputs). Ensure the ABIs match the deployed facet interfaces.

### Contract interaction flow (high-level)

1. User connects wallet (thirdweb / ERC-4337 onboarding path).
2. Frontend loads configured diamond + facet addresses.
3. UI calls the relevant facet/diamond functions through the injected contract instances.
4. UI presents state reads and transaction outcomes.

---

## Technology stack

- **Frontend**: React + Vite
- **Styling**: TailwindCSS
- **Web3**: thirdweb (wallet integration & account abstraction onboarding)
- **PWA**: `vite-plugin-pwa` (offline-first caching + install support)
- **UI**: lucide-react, react-icons, react-toastify
- **Smart contract artifacts**: stored under `src/artifacts/` in this repo (generated build outputs)

---

## PWA (Progressive Web App)

FacetLend is configured as a **PWA** using `vite-plugin-pwa`.

- App icons are provided in `public/` (e.g., `pwa-512x512.png`, `apple-touch-icon.png`).
- Manifest + service worker are generated at build time.

### PWA screenshots

Suggested README preview:

- Install prompt:
  - `![PWA install prompt](public/screenshots/pwa-install.png)`
- PWA opened view:
  - `![PWA home view](public/screenshots/pwa-home.png)`

---

## Screenshots

Add screenshots to `public/`:

- `public/facetlend1.png`
- `public/facetlend2.png`
- `public/facetlend3.png`
- `public/facetlend5.png`

Example embedding:

- Dashboard:
  - `![Dashboard](public/facetlend2.png)`
- Settings:
  - `![Settings](public/facetlend5.png)`

---

## Docker + Nginx (SPA deployment)

This repo is **dockerized** and served via **nginx**.

- `Dockerfile` builds the Vite app and copies it into the nginx static web root.
- nginx is configured with SPA fallback so client-side routes work.

> If you deploy behind a separate **Nginx reverse proxy**, keep this nginx SPA container behind it (or swap container nginx for your reverse-proxy upstream). The current `Dockerfile` already supports SPA routing.

---

## Folder structure

```txt
FacetLend/
  public/
    (icons, favicons, PWA assets)
    dist/
  src/
    components/
    constants/
      addresses.js              # deployed diamond + facet addresses
    contexts/
      (web3/contract state providers)
    hooks/
    pages/
    providers/
    sections/
    services/
    artifacts/
      (contract ABI/artifact outputs)
    App.jsx
    main.jsx
  index.html
  vite.config.js               # PWA configuration
  Dockerfile                   # dockerized build + nginx
  package.json
  LICENSE
  README.md
```

---

## Versioning

- **Beta**: development version **1.0.1**

---

## License

MIT License. See `LICENSE`.
