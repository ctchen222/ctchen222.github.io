import Link from "next/link";
import { config } from "@/lib/config";

export function SiteHeader() {
  return (
    <header className="mb-10 flex flex-wrap items-center justify-between gap-4 py-2 text-sm">
      <Link href="/" className="site-title">
        {config.title}
      </Link>
      <nav className="flex flex-wrap items-center gap-4">
          {config.nav.map((item) => (
            <Link
              key={item.url}
              href={item.url}
              className="nav-link"
            >
              {item.label}
            </Link>
          ))}
      </nav>
    </header>
  );
}
