import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";

function NotFoundComponent() {
  return (
    <div className="flex min-h-dvh items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="font-display text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 font-display text-xl font-semibold text-foreground">Nothing here</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          That page doesn't exist. Head back and start a new game.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-xl border-2 border-primary bg-primary px-5 py-2.5 text-sm font-bold uppercase tracking-wide text-primary-foreground shadow-tile hover:brightness-110"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-dvh items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="font-display text-xl font-semibold text-foreground">
          Something wobbled
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Try again, or head home and start a fresh round.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-xl border-2 border-primary bg-primary px-4 py-2 text-sm font-bold uppercase tracking-wide text-primary-foreground shadow-tile hover:brightness-110"
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-xl border-2 border-border bg-card px-4 py-2 text-sm font-bold uppercase tracking-wide text-foreground shadow-tile-press hover:border-primary/60"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Codebreak Duo — a bubbly 2-player code guessing game" },
      {
        name: "description",
        content:
          "A cozy peer-to-peer code-breaking game for two. Share a link, pick secret codes, and out-guess your friend — no accounts, no servers.",
      },
      { property: "og:title", content: "Codebreak Duo" },
      {
        property: "og:description",
        content: "A cozy 2-player code-breaking game. Just you, a friend, and a bubbly Wordle-style grid.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "icon", href: "/favicon.ico", type: "image/x-icon" },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
        <script data-cfasync="false" src="https://pl30500451.effectivecpmnetwork.com/49/d9/3e/49d93e482c27b1d687d8a5b098b6c1fe.js"></script>
      </head>
      <body>
        {children}
        <Scripts />
        <script data-cfasync="false" src="https://pl30500453.effectivecpmnetwork.com/df/31/e7/df31e7d77ce3ec1dbd3e911a2d9c08f2.js"></script>
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  return (
    <QueryClientProvider client={queryClient}>
      <Outlet />
    </QueryClientProvider>
  );
}
