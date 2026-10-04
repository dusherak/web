import Link from "next/link";

export default function NotFound() {
  return (
    <main className="stage-bg grid min-h-svh place-items-center px-6 text-center">
      <div>
        <p className="font-mono text-xs tracking-[0.28em] text-gold">404</p>
        <h1 className="mt-4 text-4xl font-light tracking-tight text-white">Nothing here yet</h1>
        <Link href="/" className="mt-8 inline-block text-sm text-white/55 transition-colors hover:text-gold">
          ← All products
        </Link>
      </div>
    </main>
  );
}
