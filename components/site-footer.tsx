import { config } from "@/lib/config";

export function SiteFooter() {
  return (
    <footer className="mt-16 flex flex-wrap items-center gap-x-5 gap-y-2 py-6 text-sm text-muted-foreground">
      <span>© CTCHEN</span>
      <div className="flex flex-wrap gap-5">
        {config.footer.map((item) => (
          <a
            key={item.url}
            href={item.url}
            target={item.url.startsWith("http") ? "_blank" : undefined}
            rel={item.url.startsWith("http") ? "noopener noreferrer" : undefined}
            className="nav-link"
          >
            {item.label}
          </a>
        ))}
      </div>
    </footer>
  );
}
