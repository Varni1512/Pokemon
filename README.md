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

- `src/app`: Next.js App Router structure (`page.tsx`, `layout.tsx`, dynamic routes).
- `src/components`: Reusable UI components grouped by feature (`pokemon/`, `ui/`, `layout/`).
- `src/hooks`: Custom React hooks (`usePokemonList`, `useFavorites`, `useCompare`) for clean state management.
- `src/services`: API abstraction layer (`pokeApi.ts`).
- `src/types`: TypeScript interfaces for the API payloads and UI data models.

## Challenges Faced

One of the main challenges was managing the sheer volume of data returned by the PokéAPI. The list endpoints only return names and URLs, requiring subsequent concurrent requests (`Promise.all`) to fetch the necessary details (images, types, stats) for the grid view. To maintain optimal performance, I implemented a custom hook (`usePokemonList`) that handles data normalization and caching during pagination and filtering, ensuring the UI remains responsive and loading states are handled gracefully.

Handling client-side persistence for Favorites and Comparisons within the Next.js App Router required careful management to prevent React hydration mismatch errors between the initial server-rendered HTML and the client-side `localStorage` state. This was solved using proper mounted state checks.
