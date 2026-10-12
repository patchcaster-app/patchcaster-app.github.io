import type { ReactNode } from 'react';
import Link from 'next/link';
import {
  Activity,
  ArrowRight,
  BadgeCheck,
  Database,
  LayoutDashboard,
  MessagesSquare,
  ShieldCheck,
} from 'lucide-react';
import { ServerCodeBlock } from 'fumadocs-ui/components/codeblock.rsc';
import { ThreadPreview } from '@/components/home/thread-preview';
import { Mascot } from '@/components/logo';
import { repositoryUrl } from '@/lib/shared';

const primaryButton =
  'inline-flex items-center gap-2 rounded-full bg-fd-primary px-5 py-2.5 text-sm font-medium text-fd-primary-foreground shadow-sm transition hover:opacity-90';
const secondaryButton =
  'inline-flex items-center gap-2 rounded-full border border-fd-border bg-fd-background px-5 py-2.5 text-sm font-medium transition hover:bg-fd-accent';

const steps = [
  {
    title: 'GitLab signs',
    text: 'A system, group or project hook sends merge request, comment, pipeline and push events with a Standard Webhooks signature.',
  },
  {
    title: 'PatchCaster checks and queues',
    text: 'It verifies the signature, drops duplicates and stale deliveries, finds the channel in your routing table, and stores the event before answering.',
  },
  {
    title: 'Mattermost stays current',
    text: 'The merge request gets one thread. Its first post is edited in place, and notable events arrive as replies.',
  },
];

const features = [
  {
    icon: LayoutDashboard,
    title: 'A live status board',
    text: 'The first post of each thread shows pipeline, reviewers, comments and edits, and is edited as they change instead of adding noise.',
  },
  {
    icon: MessagesSquare,
    title: 'Replies that matter',
    text: 'Comments, pipeline results, review verdicts, pushes with their commit count, merges and closes arrive in the thread they belong to.',
  },
  {
    icon: ShieldCheck,
    title: 'Signed webhooks only',
    text: 'Only deliveries with a valid signature get in. Several secrets can be active at once, so the signing token rotates without downtime.',
  },
  {
    icon: Database,
    title: 'Durable delivery',
    text: 'Every accepted event is stored in PostgreSQL first. Failed posts retry with backoff, survive restarts, and park for triage when retries run out.',
  },
  {
    icon: Activity,
    title: 'Built to operate',
    text: 'Liveness, readiness and Prometheus metrics on an internal port, a graceful drain on shutdown, and migrations that apply themselves.',
  },
  {
    icon: BadgeCheck,
    title: 'Verifiable releases',
    text: 'Static Linux binaries, multi-architecture images and a Helm chart, each signed keylessly with cosign by its release workflow.',
  },
];

const helmInstall = `helm install patchcaster oci://ghcr.io/patchcaster-app/charts/patchcaster \\
  --version <X.Y.Z> \\
  --namespace patchcaster --create-namespace \\
  --set mattermostUrl=https://mattermost.example.com \\
  --set existingSecret=patchcaster \\
  --set-file routing.file=./routing.yaml`;

function Section({ id, eyebrow, title, children }: { id?: string; eyebrow: string; title: string; children: ReactNode }) {
  return (
    <section id={id} className="mx-auto w-full max-w-6xl px-6 py-14 sm:py-16">
      <p className="text-sm font-medium text-fd-primary">{eyebrow}</p>
      <h2 className="mt-2 max-w-2xl text-3xl font-semibold tracking-tight">{title}</h2>
      <div className="mt-10">{children}</div>
    </section>
  );
}

function Hero() {
  return (
    <section className="relative isolate overflow-hidden">
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_70%_55%_at_50%_-10%,color-mix(in_oklab,var(--color-brand-sky)_20%,transparent),transparent)]"
      />
      {/* min-w-0: the preview's unwrappable lines must not widen the column. */}
      <div className="mx-auto grid max-w-6xl items-center gap-14 px-6 py-16 *:min-w-0 lg:grid-cols-[1fr_1.1fr] lg:py-24">
        <div>
          <p className="inline-flex items-center gap-2 rounded-full border border-fd-border bg-fd-card px-3 py-1 text-xs font-medium text-fd-muted-foreground">
            <span className="size-1.5 rounded-full bg-brand-gold" />
            GitLab to Mattermost, self-hosted
          </p>
          <h1 className="mt-6 text-4xl font-semibold tracking-tight text-balance sm:text-5xl lg:text-[3.5rem] lg:leading-[1.08]">
            From forge to chat,
            <br className="hidden lg:block" />{' '}
            <span className="bg-linear-to-r from-hero-from to-hero-to bg-clip-text text-transparent">
              one live thread per merge request.
            </span>
          </h1>
          <p className="mt-6 max-w-xl text-lg text-pretty text-fd-muted-foreground">
            PatchCaster turns GitLab merge request webhooks into a single Mattermost thread. Its first post is a
            status board that keeps itself current, and every notable event lands as a reply right below it.
          </p>
          <div className="mt-9 flex flex-wrap gap-3">
            <Link href="/docs/install" className={primaryButton}>
              Get started <ArrowRight className="size-4" />
            </Link>
            <Link href="/docs" className={secondaryButton}>
              Read the docs
            </Link>
          </div>
        </div>
        <ThreadPreview />
      </div>
    </section>
  );
}

function HowItWorks() {
  return (
    <Section eyebrow="How it works" title="A signed webhook in, a tidy thread out.">
      <ol className="grid gap-6 md:grid-cols-3">
        {steps.map((step, index) => (
          <li key={step.title} className="rounded-2xl border border-fd-border bg-fd-card p-6">
            <span className="flex size-8 items-center justify-center rounded-full bg-fd-primary/10 text-sm font-semibold text-fd-primary">
              {index + 1}
            </span>
            <h3 className="mt-4 font-semibold">{step.title}</h3>
            <p className="mt-2 text-sm text-fd-muted-foreground">{step.text}</p>
          </li>
        ))}
      </ol>
    </Section>
  );
}

function Features() {
  return (
    <Section eyebrow="Why PatchCaster" title="Calm channels, nothing missed.">
      <div className="grid gap-px overflow-hidden rounded-2xl border border-fd-border bg-fd-border sm:grid-cols-2 lg:grid-cols-3">
        {features.map(({ icon: Icon, title, text }) => (
          <div key={title} className="bg-fd-background p-6">
            <Icon className="size-5 text-fd-primary" />
            <h3 className="mt-4 font-semibold">{title}</h3>
            <p className="mt-2 text-sm text-fd-muted-foreground">{text}</p>
          </div>
        ))}
      </div>
    </Section>
  );
}

function Deploy() {
  return (
    <Section eyebrow="Deploy" title="Runs where your services already run.">
      <div className="grid items-start gap-10 *:min-w-0 lg:grid-cols-[1fr_1.3fr]">
        <div className="space-y-4 text-fd-muted-foreground">
          <p>
            PatchCaster ships as a Helm chart, a container image and a static Linux binary. It needs a PostgreSQL 18
            database, a Mattermost bot account and GitLab 19.0 or later.
          </p>
          <p>
            The chart can attach a Gateway API route for the webhook, and the charts repository has ready-made Flux
            and helmfile setups that verify the chart&apos;s signature before installing it.
          </p>
          <div className="flex flex-wrap gap-3 pt-2">
            <Link href="/docs/install" className={secondaryButton}>
              Installation guide <ArrowRight className="size-4" />
            </Link>
            <a href="https://github.com/patchcaster-app/charts" className={secondaryButton}>
              Helm chart
            </a>
          </div>
        </div>
        <ServerCodeBlock code={helmInstall} lang="bash" codeblock={{ title: 'Install with Helm' }} />
      </div>
    </Section>
  );
}

function ClosingCallToAction() {
  return (
    <section className="mx-auto w-full max-w-6xl px-6 pt-6 pb-20">
      <div className="relative isolate grid items-center gap-10 overflow-hidden rounded-3xl border border-fd-border bg-fd-card px-8 py-12 md:grid-cols-[auto_1fr] md:px-14">
        <div
          aria-hidden="true"
          className="absolute inset-0 -z-10 bg-linear-to-br from-brand-sky/15 via-transparent to-brand-gold/20"
        />
        <Mascot className="mx-auto size-36 rounded-3xl shadow-xl shadow-brand-sky/20 md:size-44" />
        <div className="text-center md:text-left">
          <h2 className="text-3xl font-semibold tracking-tight">Give every merge request its own herald.</h2>
          <p className="mt-4 max-w-xl text-fd-muted-foreground md:max-w-none">
            Start with the installation guide, or read how configuration, integrations and operations fit together.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3 md:justify-start">
            <Link href="/docs/install" className={primaryButton}>
              Get started <ArrowRight className="size-4" />
            </Link>
            <a href={repositoryUrl} className={secondaryButton}>
              View on GitHub
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-fd-border">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-6 py-8 text-sm text-fd-muted-foreground">
        <p>PatchCaster is open source under the MIT licence.</p>
        <nav className="flex gap-6">
          <Link href="/docs" className="hover:text-fd-foreground">
            Docs
          </Link>
          <Link href="/docs/changelog" className="hover:text-fd-foreground">
            Changelog
          </Link>
          <a href={repositoryUrl} className="hover:text-fd-foreground">
            GitHub
          </a>
        </nav>
      </div>
    </footer>
  );
}

export default function HomePage() {
  return (
    <>
      <Hero />
      <HowItWorks />
      <Features />
      <Deploy />
      <ClosingCallToAction />
      <Footer />
    </>
  );
}
