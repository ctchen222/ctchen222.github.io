import configJson from "@/site.config.json";

export interface NavItem {
  label: string;
  url: string;
}

export interface SiteConfig {
  title: string;
  siteTitle: string;
  author: string;
  url: string;
  disqus: string;
  footer: NavItem[];
  nav: NavItem[];
}

export const config: SiteConfig = configJson;
