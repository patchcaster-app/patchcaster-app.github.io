import { Mascot } from '@/components/logo';

// An example thread. The wording follows PatchCaster's message templates
// (internal/deliver/templates in the patchcaster repository): the root post
// with its status line, then one reply per notable event.
const statusSegments = ['🟢 Pipeline passed', '👀 1/1 reviewers', '💬 1 comment', '📝 1 edit'];

const replies = [
  { time: '10:44', text: '💬 sam commented' },
  { time: '10:51', text: '📝 alex pushed 2 new commits' },
  { time: '10:58', text: '🟢 Pipeline passed' },
  { time: '11:06', text: '👀 sam reviewed the MR' },
  { time: '11:07', text: '✅ Review was approved by sam!' },
  { time: '11:15', text: '🎉 alex merged !42' },
];

function InlineCode({ children }: { children: string }) {
  return <code className="rounded bg-fd-muted px-1 py-0.5 text-[0.8em]">{children}</code>;
}

function StatusLine() {
  return (
    <p className="flex flex-wrap items-center gap-x-1.5 gap-y-1">
      {statusSegments.map((segment, index) => (
        <span key={segment} className="whitespace-nowrap">
          {index > 0 && <span className="mr-1.5 text-fd-muted-foreground">•</span>}
          {segment}
        </span>
      ))}
    </p>
  );
}

function RootPost() {
  return (
    <article className="flex gap-3">
      <Mascot className="size-9 shrink-0 rounded-full" />
      <div className="min-w-0 flex-1 text-[13px]">
        <header className="flex items-baseline gap-2">
          <span className="font-semibold">PatchCaster</span>
          <span className="rounded bg-fd-muted px-1 text-[10px] font-semibold uppercase tracking-wide text-fd-muted-foreground">
            Bot
          </span>
          <time className="text-xs text-fd-muted-foreground">10:42</time>
        </header>
        <blockquote className="mt-1.5 space-y-1 border-l-4 border-fd-border pl-3 leading-relaxed">
          <p>
            <span className="rounded bg-fd-primary/10 px-0.5 text-fd-primary">@here</span> 🔔
          </p>
          <p className="font-semibold">!42 Add a retry budget to the delivery worker</p>
          <p className="text-fd-muted-foreground">
            by <span className="text-fd-primary">@alex</span> • platform/patchcaster •{' '}
            <span className="whitespace-nowrap">
              <InlineCode>retry-budget</InlineCode> ➜ <InlineCode>main</InlineCode>
            </span>
          </p>
          <p className="truncate text-fd-primary">https://gitlab.example.com/platform/patchcaster/-/merge_requests/42</p>
          <StatusLine />
        </blockquote>
      </div>
    </article>
  );
}

function Replies() {
  return (
    <>
      <div className="flex items-center gap-3 text-xs text-fd-muted-foreground">
        <span className="h-px flex-1 bg-fd-border" />
        {replies.length} replies
        <span className="h-px flex-1 bg-fd-border" />
      </div>
      <ol className="space-y-2.5 text-sm">
        {replies.map((reply) => (
          <li key={reply.time} className="flex gap-3">
            <time className="w-9 shrink-0 pt-px text-right text-[11px] tabular-nums text-fd-muted-foreground">
              {reply.time}
            </time>
            <span>{reply.text}</span>
          </li>
        ))}
      </ol>
    </>
  );
}

export function ThreadPreview() {
  return (
    <figure aria-label="An example PatchCaster thread in Mattermost" className="relative">
      <div
        aria-hidden="true"
        className="absolute -inset-6 -z-10 rounded-[2.5rem] bg-linear-to-br from-fd-primary/25 via-transparent to-brand-signal/25 blur-3xl"
      />
      <div className="overflow-hidden rounded-2xl border border-fd-border bg-fd-card shadow-2xl shadow-fd-primary/10">
        <div className="flex items-center gap-2 border-b border-fd-border px-4 py-3 text-sm">
          <span className="font-semibold">#platform-reviews</span>
          <span className="text-fd-muted-foreground">· Thread</span>
          <span className="ml-auto inline-flex items-center gap-1.5 rounded-full bg-brand-signal/10 px-2 py-0.5 text-[11px] font-medium text-brand-signal">
            <span className="size-1.5 animate-pulse rounded-full bg-brand-signal" />
            live board
          </span>
        </div>
        <div className="space-y-4 p-4 sm:p-5">
          <RootPost />
          <Replies />
        </div>
      </div>
      <figcaption className="mt-4 text-center text-xs text-fd-muted-foreground">
        One merge request, one thread. The first post keeps itself current.
      </figcaption>
    </figure>
  );
}
