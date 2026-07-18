type Vulnerability = {
  cve_id: string;
  vendor: string;
  product: string;
  name: string;
  date_added: string;
  due_date: string;
  known_ransomware_use: string;
  cvss_score: number | null;
  severity: string | null;
  description: string | null;
};

type RecentThreatActivityProps = {
  vulnerabilities: Vulnerability[];
};

export default function RecentThreatActivity({
  vulnerabilities,
}: RecentThreatActivityProps) {
  const recentThreats = [...vulnerabilities]
    .sort(
      (a, b) =>
        new Date(b.date_added).getTime() -
        new Date(a.date_added).getTime()
    )
    .slice(0, 3);

  return (
    <section className="mb-10 rounded-2xl border border-slate-800 bg-slate-900 p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.2em] text-violet-400">
            Recent Threat Activity
          </p>

          <h2 className="mt-1 text-2xl font-semibold">
            Newly Added Vulnerabilities
          </h2>
        </div>

        <span className="text-sm text-slate-500">
          Latest {recentThreats.length}
        </span>
      </div>

      <div className="mt-6 grid gap-4">
        {recentThreats.map((vulnerability) => (
          <div
            key={vulnerability.cve_id}
            className="rounded-xl border border-slate-800 bg-slate-950 p-4"
          >
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div>
                <div className="flex flex-wrap items-center gap-3">
                  <span className="font-semibold">
                    {vulnerability.cve_id}
                  </span>

                  <span className="rounded-full bg-red-500/15 px-2 py-1 text-xs font-semibold text-red-400">
                    {vulnerability.severity ?? "UNKNOWN"}
                  </span>

                  <span className="text-xs text-slate-500">
                    CVSS {vulnerability.cvss_score ?? "N/A"}
                  </span>
                </div>

                <p className="mt-2 text-sm text-slate-300">
                  {vulnerability.vendor} — {vulnerability.product}
                </p>
              </div>

              <div className="text-sm text-slate-500">
                Added {vulnerability.date_added}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}