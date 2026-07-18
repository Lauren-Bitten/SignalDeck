type CveDetails = {
  cve_id: string;
  cvss_score: number | null;
  severity: string | null;
  vector: string | null;
  description: string | null;
  published: string | null;
  last_modified: string | null;
  weaknesses: string[];
  references: string[];
};

async function getCveDetails(cveId: string): Promise<CveDetails> {
  const response = await fetch(
    `http://127.0.0.1:8000/cyber/cve/${encodeURIComponent(cveId)}`,
    {
      cache: "no-store",
    }
  );

  if (!response.ok) {
    throw new Error(`Failed to load details for ${cveId}`);
  }

  return response.json();
}

type PageProps = {
  params: Promise<{
    cve_id: string;
  }>;
};

export default async function CveDetailsPage({ params }: PageProps) {
  const { cve_id } = await params;
  const cve = await getCveDetails(cve_id);

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <div className="mx-auto max-w-5xl px-6 py-10">
        <a
          href="/"
          className="text-sm font-medium text-violet-400 hover:text-violet-300"
        >
          ← Back to Cyber Dashboard
        </a>

        <header className="mt-8">
          <div className="flex flex-wrap items-center gap-3">
            <span className="rounded-full bg-red-500/15 px-3 py-1 text-sm font-semibold text-red-400">
              {cve.severity ?? "UNKNOWN"}
            </span>

            <span className="text-sm text-slate-400">
              CVSS {cve.cvss_score ?? "N/A"}
            </span>
          </div>

          <h1 className="mt-4 text-4xl font-bold">{cve.cve_id}</h1>

          <p className="mt-4 max-w-4xl leading-7 text-slate-300">
            {cve.description ?? "No description available."}
          </p>
        </header>

        <section className="mt-10 grid gap-4 md:grid-cols-2">
          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
            <p className="text-sm text-slate-500">Published</p>
            <p className="mt-2 font-medium">
              {cve.published ?? "Not available"}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
            <p className="text-sm text-slate-500">Last Modified</p>
            <p className="mt-2 font-medium">
              {cve.last_modified ?? "Not available"}
            </p>
          </div>
        </section>

        <section className="mt-6 rounded-2xl border border-slate-800 bg-slate-900 p-6">
          <h2 className="text-xl font-semibold">CVSS Vector</h2>

          <p className="mt-3 break-words font-mono text-sm text-slate-300">
            {cve.vector ?? "No CVSS vector available."}
          </p>
        </section>

        <section className="mt-6 rounded-2xl border border-slate-800 bg-slate-900 p-6">
          <h2 className="text-xl font-semibold">Weaknesses</h2>

          {cve.weaknesses.length > 0 ? (
            <div className="mt-4 flex flex-wrap gap-2">
              {cve.weaknesses.map((weakness) => (
                <span
                  key={weakness}
                  className="rounded-full border border-violet-500/30 bg-violet-500/10 px-3 py-1 text-sm text-violet-300"
                >
                  {weakness}
                </span>
              ))}
            </div>
          ) : (
            <p className="mt-3 text-slate-400">
              No weakness information available.
            </p>
          )}
        </section>

        <section className="mt-6 rounded-2xl border border-slate-800 bg-slate-900 p-6">
          <h2 className="text-xl font-semibold">References</h2>

          {cve.references.length > 0 ? (
            <div className="mt-4 grid gap-3">
              {cve.references.map((reference) => (
                <a
                  key={reference}
                  href={reference}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="break-all rounded-xl border border-slate-800 bg-slate-950 p-4 text-sm text-violet-300 transition hover:border-violet-500"
                >
                  {reference}
                </a>
              ))}
            </div>
          ) : (
            <p className="mt-3 text-slate-400">
              No external references available.
            </p>
          )}
        </section>
      </div>
    </main>
  );
}