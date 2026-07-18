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

type ThreatOverviewProps = {
  vulnerabilities: Vulnerability[];
};

export default function ThreatOverview({
  vulnerabilities,
}: ThreatOverviewProps) {
  const vendorCounts = vulnerabilities.reduce<Record<string, number>>(
    (counts, vulnerability) => {
      const vendor = vulnerability.vendor || "Unknown";

      counts[vendor] = (counts[vendor] || 0) + 1;

      return counts;
    },
    {}
  );

  const topVendors = Object.entries(vendorCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  return (
    <section className="mb-10 rounded-2xl border border-slate-800 bg-slate-900 p-6">
      <div>
        <p className="text-sm uppercase tracking-[0.2em] text-violet-400">
          Threat Intelligence Overview
        </p>

        <h2 className="mt-1 text-2xl font-semibold">
          Top Affected Vendors
        </h2>

        <p className="mt-2 text-sm text-slate-400">
          Vendors represented most frequently in the current vulnerability feed.
        </p>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {topVendors.map(([vendor, count]) => (
          <div
            key={vendor}
            className="rounded-xl border border-slate-800 bg-slate-950 p-4"
          >
            <p className="text-sm text-slate-500">Vendor</p>

            <div className="mt-2 flex items-end justify-between gap-4">
              <p className="text-lg font-semibold text-white">{vendor}</p>

              <p className="text-3xl font-bold text-violet-300">
                {count}
              </p>
            </div>

            <p className="mt-2 text-xs text-slate-500">
              {count === 1 ? "vulnerability" : "vulnerabilities"}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}