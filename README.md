# UnoMas

UnoMas is a lightweight group-ordering app for coffee runs, snack pickups, and other shared orders. One person creates a room, shares the room code, and everyone in the group adds their own order so the person collecting the order can see everything in one place.

The app is built as a real-time single-page web app, so room members, order updates, and completion status stay in sync as people join and edit their items.

## What it does

UnoMas helps small groups coordinate a shared order without needing messages, screenshots, or one person manually collecting everyone's requests.

Typical flow:

1. A host creates a room and gets a shareable room code.
2. Other people join using that code and enter their names.
3. Each participant adds or edits their own order.
4. Everyone in the room can see progress as orders come in.
5. The group can mark the run complete once everything has been picked up.

## Features available to users

- **Create a room** for a group order with a room name and host name.
- **Join an existing room** using a room code.
- **Live room membership** so participants appear in the room as they join.
- **Personal order editing** so each person manages their own items.
- **Shared order visibility** so everyone can see the full list of orders.
- **Order progress tracking** showing how many people have already added an order.
- **Waiting indicators** for members who have not submitted an order yet.
- **Copyable room code** for quick sharing.
- **Help / SOS requests** to notify the room that someone needs help.
- **Completion status** to mark the order run as finished.
- **Reopen completed orders** when changes are needed after completion.
- **Host-only room deletion** to permanently remove the room and its orders.
- **Room closed state** when a room has been deleted or is no longer available.

## Tools and technologies used

- **React 18** for the user interface
- **Vite 5** for local development and production builds
- **@vitejs/plugin-react** for React support in Vite
- **Firebase** as the backend platform
- **Cloud Firestore** for real-time room and order storage/sync
- **npm** for dependency management and scripts
- **JavaScript / JSX** for application code
- **CSS** for styling

## Project structure

- `src/screens` – top-level screens for the landing page and active room view
- `src/components` – reusable UI pieces such as order cards, progress display, notifications, and modals
- `src/hooks` – custom React hooks for room state and toast notifications
- `src/firebase` – Firebase setup and Firestore room operations
- `src/utils.js` – helpers such as room-code generation and display utilities

## Development

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Create a production build:

```bash
npm run build
```

Preview the production build locally:

```bash
npm run preview
```

## Notes

- Room data is stored in Firestore and updated in real time.
- The current Firebase configuration is included in the repo via `src/firebase/config.js`.
- The README above reflects the features that are present in the current codebase.
