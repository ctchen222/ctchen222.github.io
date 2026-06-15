import type { Metadata } from "next";
import { config } from "@/lib/config";
import {
  Activity,
  Boxes,
  BriefcaseBusiness,
  Code2,
  GraduationCap,
  Github,
  Globe2,
  Layers3,
  NotebookText,
  ServerCog,
  TestTube2,
} from "lucide-react";

export const metadata: Metadata = {
  title: `About — ${config.siteTitle}`,
};

export default function AboutPage() {
  return (
    <div className="about-page">
      <section className="about-hero">
        <div className="about-copy">
          <h1>Cheng-Ting Chen</h1>
          <p className="about-role">Backend-focused Software Engineer</p>
          <p>
            I build reliable APIs, AI-agent workflows, and Kubernetes-based
            services. My recent work sits around backend reliability,
            observability, testing, and delivery automation.
          </p>
        </div>
        <div className="about-snapshot" aria-label="Profile snapshot">
          <div>
            <span>Location</span>
            <strong>Taipei, Taiwan</strong>
          </div>
          <div>
            <span>Focus</span>
            <strong>Backend systems, AI workflows, observability</strong>
          </div>
          <div>
            <span>Stack</span>
            <strong>TypeScript, Python, Go, Kubernetes</strong>
          </div>
        </div>
      </section>

      <section className="about-section">
        <h2>Interview deck</h2>
        <article className="interview-resource-card">
          <div>
            <p className="interview-resource-kicker">Personal introduction</p>
            <h3>Interactive personal deck</h3>
            <p>
              A presentation version of my background, project work, and
              engineering focus. It is built for interview conversations, with a
              browser-based deck view and a downloadable PDF.
            </p>
          </div>
          <div className="project-links">
            <a href="/interview-deck/">
              <span>
                <strong>Open interactive deck</strong>
                <small>/interview-deck</small>
              </span>
            </a>
            <a
              href="/interview-deck/downloads/personal-deck.pdf"
              rel="noopener noreferrer"
              target="_blank"
            >
              <span>
                <strong>Download PDF</strong>
                <small>personal-deck.pdf</small>
              </span>
            </a>
          </div>
        </article>
      </section>

      <section className="about-section">
        <h2>Experience</h2>
        <div className="experience-list">
          <ExperienceItem
            icon={<ServerCog aria-hidden="true" />}
            role="Backend Engineer"
            company="Tricuss"
            location="Taipei, Taiwan"
            period="2025/12 - 2026/05"
            bullets={[
              "Built production LangGraph agent workflows by improving data pipeline reliability and ReAct tool-calling behavior.",
              "Containerized and deployed AI backend services across Kubernetes-based workloads using Docker and Helm.",
              "Implemented OTel tracing, metrics, and logs with Prometheus, Grafana, and Tempo for backend and AI observability.",
            ]}
          />
          <ExperienceItem
            icon={<BriefcaseBusiness aria-hidden="true" />}
            role="Software Engineer"
            company="Cacdi"
            location="Taipei, Taiwan"
            period="2024/11 - 2025/11"
            bullets={[
              "Restructured internal event-form workflows and backend behavior, reducing average configuration steps by 40%.",
              "Raised core business logic test coverage by 25% in three months using GenAI/LLM-assisted edge-case test generation.",
              "Partnered with frontend and product teams to refine API behavior, reduce workflow friction, and improve internal tool usability.",
            ]}
          />
        </div>
      </section>

      <section className="about-section">
        <h2>Selected projects</h2>
        <div className="project-grid">
          <ProjectCard
            title="FurFriend-Finder"
            meta="TypeScript, Express, PostgreSQL, LINE, Kubernetes"
            description="A Taiwan pet adoption and lost-pet matching platform. It combines shelter data, lost-pet reports, notifications, and LINE integration into one adoption workflow."
            links={[
              { label: "GitHub repository", href: "https://github.com/ctchen222/FurFriend-Finder" },
              { label: "Live site", href: "https://furfriend-finder.com" },
            ]}
          />
          <ProjectCard
            title="Tic-Tac-Toe"
            meta="Go, WebSockets, Redis, OpenTelemetry"
            description="A real-time Tic-Tac-Toe backend focused on WebSocket gameplay, matchmaking, reconnect behavior, and production-style observability."
            links={[
              { label: "GitHub repository", href: "https://github.com/ctchen222/Tic-Tac-Toe" },
            ]}
          />
          <ProjectCard
            title="Homelab"
            meta="k3s, Argo CD, Helm, Grafana"
            description="A GitOps homelab running personal services, FinOps tooling, Kubernetes deployments, and observability on a single k3s VPS."
            links={[
              { label: "GitHub repository", href: "https://github.com/ctchen222/homelab" },
            ]}
          />
        </div>
      </section>

      <section className="about-section">
        <h2>Education</h2>
        <div className="about-list">
          <AboutItem
            icon={<GraduationCap aria-hidden="true" />}
            title="National Central University"
            meta="BS in Electrical Engineering, 2017 - 2021"
          >
            GPA 3.5/4.3. Top 10 in the Department of Electrical Engineering
            analog circuit design competition.
          </AboutItem>
          <AboutItem
            icon={<NotebookText aria-hidden="true" />}
            title="National Taiwan University"
            meta="MS in Bioinformatics, attended 2021 - 2025"
          >
            Coursework included algorithms, machine learning, deep learning in
            computer vision, and generative AI.
          </AboutItem>
        </div>
      </section>

      <section className="about-section">
        <h2>Technologies</h2>
        <div className="skill-grid">
          <SkillGroup
            icon={<Code2 aria-hidden="true" />}
            title="Languages"
            items={["JavaScript", "TypeScript", "Python", "Golang"]}
          />
          <SkillGroup
            icon={<Layers3 aria-hidden="true" />}
            title="Backend"
            items={["Node.js", "Express.js", "Flask", "PostgreSQL", "MongoDB", "Redis", "REST APIs"]}
          />
          <SkillGroup
            icon={<TestTube2 aria-hidden="true" />}
            title="Testing"
            items={["Jest", "Unit tests", "Integration tests", "E2E tests"]}
          />
          <SkillGroup
            icon={<Boxes aria-hidden="true" />}
            title="Cloud and DevOps"
            items={["Kubernetes", "Docker", "AWS", "GitHub Actions", "Helm", "Argo CD"]}
          />
          <SkillGroup
            icon={<Activity aria-hidden="true" />}
            title="Observability"
            items={["OpenTelemetry", "Prometheus", "Grafana", "Tempo", "Loki", "Jaeger"]}
          />
        </div>
      </section>
    </div>
  );
}

function AboutItem({
  icon,
  title,
  meta,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  meta?: string;
  children: React.ReactNode;
}) {
  return (
    <article className="about-item">
      <div className="about-item-icon">{icon}</div>
      <div className="about-item-detail">
        <h2>{title}</h2>
        {meta ? <p className="about-item-meta">{meta}</p> : null}
        <p>{children}</p>
      </div>
    </article>
  );
}

function ExperienceItem({
  icon,
  role,
  company,
  location,
  period,
  bullets,
}: {
  icon: React.ReactNode;
  role: string;
  company: string;
  location: string;
  period: string;
  bullets: string[];
}) {
  return (
    <article className="experience-item">
      <div className="about-item-icon">{icon}</div>
      <div className="experience-detail">
        <div className="experience-heading">
          <div>
            <h3>{role}</h3>
            <p>{company} - {location}</p>
          </div>
          <time>{period}</time>
        </div>
        <ul>
          {bullets.map((bullet) => (
            <li key={bullet}>{bullet}</li>
          ))}
        </ul>
      </div>
    </article>
  );
}

function ProjectCard({
  title,
  meta,
  description,
  links = [],
}: {
  title: string;
  meta: string;
  description: string;
  links?: Array<{ label: string; href: string }>;
}) {
  return (
    <article className="project-card">
      <p className="project-meta">{meta}</p>
      <h3>{title}</h3>
      <span>{description}</span>
      <div className="project-links">
        {links.map((link) => (
          <a
            href={link.href}
            key={link.href}
            rel="noopener noreferrer"
            target="_blank"
          >
            {link.href.includes("github.com") ? (
              <Github aria-hidden="true" />
            ) : (
              <Globe2 aria-hidden="true" />
            )}
            <span>
              <strong>{link.label}</strong>
              <small>{link.href.replace("https://", "")}</small>
            </span>
          </a>
        ))}
      </div>
    </article>
  );
}

function SkillGroup({
  icon,
  title,
  items,
}: {
  icon: React.ReactNode;
  title: string;
  items: string[];
}) {
  return (
    <article className="skill-group">
      <div className="skill-heading">
        {icon}
        <h3>{title}</h3>
      </div>
      <p>{items.join(", ")}</p>
    </article>
  );
}
