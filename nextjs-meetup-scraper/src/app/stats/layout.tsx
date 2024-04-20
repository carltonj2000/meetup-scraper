"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const hrefs = [
  { name: "Base Hikes", link: "/stats" },
  { name: "Users", link: "/stats/users" },
  { name: "Hikes", link: "/stats/hikes" },
];

const LinkPathnameMatch = (l: string, pn: string) =>
  l === (pn.substring(0, 12) === "/stats/hikes" ? pn.substring(0, 12) : pn);

export default function Layout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  return (
    <main className="max-w-3xl mx-auto">
      <nav className="bg-gray-100 w-full py-4 flex justify-center gap-3 shadow">
        {hrefs.map((hr) => (
          <Link
            key={hr.link}
            className={`underline text-blue-300 py-1 px-2 shadow rounded${
              LinkPathnameMatch(hr.link, pathname) ? " bg-red-100" : ""
            }`}
            href={hr.link}
          >
            {hr.name}
          </Link>
        ))}
      </nav>
      {children}
    </main>
  );
}
