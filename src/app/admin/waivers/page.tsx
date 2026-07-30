import { list } from "@vercel/blob";
import { notFound } from "next/navigation";

import { AdminWaiversTable } from "@/components/admin-waivers-table";
import { Header } from "@/components/header";
import { SiteFooter } from "@/components/site-footer";
import {
  WAIVER_BLOB_PREFIX,
  assertBlobConfigured,
  parseWaiverPathname,
  verifyAdminToken,
  type WaiverListItem,
} from "@/lib/waiver";

export const dynamic = "force-dynamic";

type PageProps = {
  searchParams: Promise<{ token?: string }>;
};

async function listWaivers(): Promise<WaiverListItem[]> {
  assertBlobConfigured();
  const items: WaiverListItem[] = [];
  let cursor: string | undefined;

  do {
    const result = await list({
      prefix: WAIVER_BLOB_PREFIX,
      cursor,
    });

    for (const blob of result.blobs) {
      if (!blob.pathname.toLowerCase().endsWith(".pdf")) continue;
      const parsed = parseWaiverPathname(blob.pathname);
      items.push({
        pathname: blob.pathname,
        url: blob.url,
        uploadedAt: blob.uploadedAt.toISOString(),
        parentName: parsed.parentName,
        participantName: parsed.participantName,
        date: parsed.date,
      });
    }

    cursor = result.hasMore ? result.cursor : undefined;
  } while (cursor);

  items.sort((a, b) => b.uploadedAt.localeCompare(a.uploadedAt));
  return items;
}

export default async function AdminWaiversPage({ searchParams }: PageProps) {
  const { token } = await searchParams;
  if (!verifyAdminToken(token) || !token) {
    notFound();
  }

  let waivers: WaiverListItem[] = [];
  let loadError: string | null = null;

  try {
    waivers = await listWaivers();
  } catch (error) {
    loadError =
      error instanceof Error ? error.message : "Could not load waivers.";
  }

  return (
    <div className="flex min-h-screen flex-col bg-[#F3F4F4]">
      <Header />
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-10 sm:px-6 sm:py-12">
        <div className="mb-8">
          <h1 className="font-[family-name:var(--font-display)] text-4xl uppercase tracking-tight text-[#090A0A]">
            Parade waivers
          </h1>
          <p className="mt-2 text-[#313a36]">
            {waivers.length} saved submission{waivers.length === 1 ? "" : "s"}
          </p>
        </div>

        {loadError ? (
          <p className="rounded border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-800">
            {loadError}
          </p>
        ) : waivers.length === 0 ? (
          <p className="text-[#313a36]">No signed waivers yet.</p>
        ) : (
          <AdminWaiversTable waivers={waivers} token={token} />
        )}
      </main>
      <SiteFooter />
    </div>
  );
}
