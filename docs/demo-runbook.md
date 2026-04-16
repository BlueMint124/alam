# Demo Runbook

## Vercel Deploy Note

- This project now includes `vercel.json` with SPA rewrites so direct visits to routes like `/tracking` and `/settings` resolve to `index.html` on Vercel.
- Build command: `npm run build`
- Output directory: `dist`

## Presentation Goal

Show that the product can:
- search a transit route
- let the user choose a route
- begin a ride-oriented flow
- run a deterministic demo scenario
- surface a transfer alert and a near-arrival alert

## Recommended Demo Flow

### 1. Open the app

- Open the deployed Vercel URL.
- Confirm the `ArriveHae` title is visible.
- Brief line: `This is a web MVP of a transit drop-off alert service for riders who may miss their stop.`

### 2. Search a route

- In `From`, enter `Myeongdong Station`.
- In `To`, enter `Seoul Station`.
- Click `Find Routes`.
- Brief line: `The app fetches route options and stores the latest route in local recents.`

### 3. Show route selection

- Point to the route result card.
- Click `View details for Myeongdong Station to Seoul Station`.
- Brief line: `Users can inspect the selected route before boarding.`

### 4. Show route detail and boarding start

- In the detail card, point to the transit segment and stop count.
- Click `Boarding Start`.
- Brief line: `The boarding flow starts only after the user explicitly confirms the route.`

### 5. Show local persistence

- Point to the `Recent routes` section near the top.
- Optional: click `Save Favorite` in the detail card.
- Brief line: `For the web MVP, recents and favorites are stored locally in the browser.`

### 6. Run the deterministic alert demo

- Scroll to the `Settings` section.
- Keep the transfer warning checkbox enabled.
- Click `Load Demo Scenario`.
- Confirm these texts appear:
  - `Transfer alert`
  - `Near-arrival alert`
- Brief line: `For presentation reliability, the MVP includes a deterministic simulation path that always reproduces the alert sequence.`

## Recommended Talk Track

### Problem

`When people ride buses or subways while tired or distracted, they can miss their stop.`

### Solution

`ArriveHae tracks the chosen transit route and warns the rider before transfer and near the final destination.`

### MVP Scope

`This web MVP focuses on route search, route selection, boarding start, simulation-based replay, and alert verification.`

### Expansion

`Next, the same structure can expand to real GPS tracking, richer alerts, account sync, and app deployment.`

## Fallback Plan

If live route-search behavior is slow during the presentation:
- refresh once before starting
- keep the `From` and `To` values above ready
- use the deterministic `Load Demo Scenario` step as the main proof point

If you need to demo deep-link safety on Vercel:
- open `/tracking` or `/settings` directly after deployment
- confirm the app still loads instead of returning a 404
