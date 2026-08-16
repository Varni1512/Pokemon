import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { EmptyState } from '@/components/ui/EmptyState';

export default function NotFound() {
  return (
    <>
      <Header />
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <EmptyState 
          title="Pokémon Not Found"
          description="We couldn't find the Pokémon you were looking for. It might not exist or the URL might be incorrect."
          action={
            <Link 
              href="/"
              className="px-8 py-3 rounded-full font-semibold bg-[var(--accent-primary)] text-white hover:bg-[var(--accent-secondary)] transition-colors shadow-lg hover:shadow-xl"
            >
              Return to Explorer
            </Link>
          }
        />
      </main>
    </>
  );
}
