import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { PokemonDetails } from '@/components/pokemon/PokemonDetails';
import { getPokemonDetails, getPokemonSpecies } from '@/services/pokeApi';
import { capitalize } from '@/lib/utils';
import { Header } from '@/components/layout/Header';

interface PageProps {
  params: Promise<{ name: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { name } = await params;
  return {
    title: `${capitalize(name)} | Pokédex`,
    description: `Explore abilities, stats, and moves for ${capitalize(name)}`,
  };
}

export default async function PokemonPage({ params }: PageProps) {
  const { name } = await params;

  let detail;
  try {
    detail = await getPokemonDetails(name);
  } catch (error) {
    console.error(error);
    notFound();
  }
  
  // Fetch species info. If it fails, we still render the page
  let species = null;
  try {
    species = await getPokemonSpecies(detail.id);
  } catch {
    console.warn(`Could not fetch species data for ${name}`);
  }

  return (
    <>
      <Header />
      <main className="flex-1 w-full pb-20">
        <PokemonDetails pokemon={detail} species={species} />
      </main>
    </>
  );
}
