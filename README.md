# Planning Poker App

A real-time Planning Poker (Scrum Poker) application built with React, TypeScript, Tailwind CSS, and Firebase.

## Features

- **Real-time Collaboration**: Uses Firebase Realtime Database for instant synchronization
- **Session Management**: Unique session IDs in URLs for easy sharing
- **Role-Based Access**: Admin can reveal and reset votes
- **Fibonacci Voting Scale**: Vote with 0, 1, 2, 3, 5, 8, 13, 21, ?, or ☕
- **Dark Mode Support**: Toggle between light and dark themes
- **Animated Cards**: Smooth card animations and transitions
- **Responsive Design**: Works on desktop, tablet, and mobile devices
- **TypeScript**: Strict typing for better code quality
- **Custom Hooks**: Reusable hooks for session management and dark mode

## Tech Stack

- **React 19** - UI framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Firebase Realtime Database** - Real-time data synchronization
- **React Router** - Client-side routing
- **Vite** - Build tool and dev server

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- A Firebase project (see Firebase Setup below)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/philippe-lubrano/scrum-poker.git
cd scrum-poker
```

2. Install dependencies:
```bash
npm install
```

3. Set up Firebase configuration:
   - Copy `.env.example` to `.env`
   - Add your Firebase credentials to `.env`

```bash
cp .env.example .env
```

### Firebase Setup

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project or use an existing one
3. Enable Realtime Database:
   - Go to Build > Realtime Database
   - Click "Create Database"
   - Start in test mode (or configure security rules)
4. Get your configuration:
   - Go to Project Settings > General
   - Scroll down to "Your apps"
   - Copy the configuration values
5. Update `.env` with your Firebase credentials

### Development

Run the development server:

```bash
npm run dev
```

The app will be available at `http://localhost:5173`

### Build

Build for production:

```bash
npm run build
```

Preview the production build:

```bash
npm run preview
```

## Usage

### Creating a Session

1. Open the app in your browser
2. Enter your name on the home page
3. Click "Create Session"
4. Share the session URL with your team

### Joining a Session

1. Get the session link from the admin
2. Open the link in your browser
3. Enter your name when prompted
4. Start voting!

### Admin Controls

As an admin, you can:
- **Reveal Votes**: Show all votes to the team
- **New Round**: Reset all votes and start a new round

### Voting

1. Select a card value from the Fibonacci scale
2. Wait for other players to vote
3. Admin reveals the votes
4. Discuss and start a new round

## Project Structure

```
src/
├── components/         # Reusable UI components
│   ├── Card.tsx       # Voting card component
│   ├── PlayerList.tsx # List of players with votes
│   ├── VotingInterface.tsx # Voting card selection
│   ├── AdminControls.tsx # Admin action buttons
│   └── DarkModeToggle.tsx # Theme switcher
├── hooks/             # Custom React hooks
│   ├── useSession.ts  # Session management and Firebase sync
│   └── useDarkMode.ts # Dark mode state management
├── pages/             # Page components
│   ├── HomePage.tsx   # Landing page
│   └── SessionPage.tsx # Main voting session page
├── types.ts           # TypeScript type definitions
├── firebase.ts        # Firebase configuration
├── App.tsx            # Main app component with routing
├── main.tsx           # App entry point
└── index.css          # Global styles with Tailwind
```

## Key Components

### useSession Hook

The `useSession` hook provides all session-related functionality:

```typescript
const {
  sessionData,      // Current session state
  loading,          // Loading state
  error,            // Error state
  createSession,    // Create a new session
  joinSession,      // Join an existing session
  castVote,         // Cast a vote
  revealVotes,      // Reveal all votes (admin)
  resetVotes,       // Reset votes for new round (admin)
  removePlayer,     // Remove a player
} = useSession(sessionId, localPlayer);
```

### Components

- **Card**: Individual voting card with animations
- **PlayerList**: Shows all players and their voting status
- **VotingInterface**: Card selection interface
- **AdminControls**: Admin-only reveal and reset buttons
- **DarkModeToggle**: Theme switcher button

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT License - feel free to use this project for any purpose.

## Acknowledgments

Built as a demo of modern React development with TypeScript and Firebase.
