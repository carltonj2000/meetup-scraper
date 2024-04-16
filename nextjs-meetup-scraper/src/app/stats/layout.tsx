import Link from "next/link";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <main className="max-w-xl mx-auto">
      <nav className="bg-gray-100 w-full py-4 flex justify-center gap-3">
        <Link className="underline text-blue-300" href="/">
          Base Hikes
        </Link>
        <Link className="underline text-blue-300" href="/users">
          Users
        </Link>
      </nav>
      {children}
    </main>
  );
}
