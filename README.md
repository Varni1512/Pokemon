# Pokémon Explorer

A modern, responsive frontend application that consumes the public PokéAPI to present Pokémon data through a polished, user-friendly interface. Built as a comprehensive assignment to demonstrate strong frontend architecture, responsive design, and API integration.

## Features

- **Pokémon Listing**: Browse Pokémon through a responsive, premium card-based layout.
- **Advanced Search & Filtering**: Search by name or ID, filter by 18 Pokémon types, and filter by Generations (I - IX).
- **Sorting**: Sort the listing by ID, Name, HP, Attack, and Speed.
- **Detailed Profiles**: Dedicated pages for each Pokémon showing full statistics, abilities, top moves, and physical traits.
- **Compare Pokémon**: Select multiple Pokémon to compare their base statistics side-by-side.
- **Favorites**: Mark Pokémon as favorites, which persists across sessions using `localStorage`.
- **Light / Dark Mode**: Full theme support with a modern aesthetic.

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **API**: PokéAPI v2

## API Used

This project directly integrates with [PokéAPI](https://pokeapi.co/):
- `GET /pokemon?limit=20&offset=0` (Pagination and list fetching)
- `GET /pokemon/{name}` (Detailed statistics and abilities)
- `GET /pokemon-species/{id}` (Flavor text and descriptions)

## Installation & Running Locally

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```
4. Open [http://localhost:3000](http://localhost:3000) in your browser.

*Note: No environment variables or API keys are required to run this project.*

## Project Structure

```text
Pokémon Explorer/
├── public/                 # Static assets (icons, images)
├── src/
│   ├── app/                # Next.js 14 App Router
│   │   ├── compare/        # Compare Pokémon feature page
│   │   ├── pokemon/        # Pokémon details dynamic routes
│   │   ├── globals.css     # Global styles and Tailwind v4 imports
│   │   ├── layout.tsx      # Root layout with Theme providers
│   │   └── page.tsx        # Home page / Pokémon listing
│   ├── components/         # Reusable React components
│   │   ├── layout/         # Layout components (Header, Hero)
│   │   ├── pokemon/        # Feature-specific components (Cards, Filters)
│   │   └── ui/             # Core UI components (Buttons, Skeletons, ThemeToggle)
│   ├── constants/          # Application constants (e.g., Pokémon types)
│   ├── hooks/              # Custom React hooks
│   │   ├── useCompare.ts   # Logic for Pokémon comparison feature
│   │   ├── useFavorites.ts # Client-side LocalStorage state management
│   │   └── usePokemonList.ts # API fetching, caching, and pagination
│   ├── lib/                # Utility functions
│   │   └── utils.ts        # Helper functions (e.g., class merging)
│   ├── services/           # API integration layer
│   │   └── pokeApi.ts      # Fetch methods for PokéAPI endpoints
│   └── types/              # TypeScript type definitions
│       └── pokemon.ts      # Interfaces for state and API responses
├── eslint.config.mjs       # ESLint configuration
├── next.config.ts          # Next.js configuration
├── postcss.config.mjs      # PostCSS configuration
└── tsconfig.json           # TypeScript configuration
```

## Architecture & Design Decisions

- **Feature-Driven Component Design**: Components are modularized by feature (e.g., `pokemon/`, `layout/`) rather than flat structures. This ensures scalability as the application grows.
- **Separation of Concerns (SoC)**: Business logic and state management are abstracted into custom React hooks (`src/hooks`), keeping the UI components purely presentational and easy to test.
- **Service Layer Pattern**: All PokéAPI integrations are isolated in `src/services/pokeApi.ts`. This decouples the UI from the network layer, making it easier to mock during testing or swap endpoints in the future.
- **Strict Typing**: Comprehensive TypeScript interfaces (`src/types`) are used for both API payloads and internal state, ensuring end-to-end type safety and reducing runtime errors.

## Challenges Faced

One of the main challenges was managing the sheer volume of data returned by the PokéAPI. The list endpoints only return names and URLs, requiring subsequent concurrent requests (`Promise.all`) to fetch the necessary details (images, types, stats) for the grid view. To maintain optimal performance, I implemented a custom hook (`usePokemonList`) that handles data normalization and caching during pagination and filtering, ensuring the UI remains responsive and loading states are handled gracefully.

Handling client-side persistence for Favorites and Comparisons within the Next.js App Router required careful management to prevent React hydration mismatch errors between the initial server-rendered HTML and the client-side `localStorage` state. This was solved using proper mounted state checks.
