import VulnerabilityList from "./VulnerabilityList";

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

async function getVulnerabilities(): Promise<Vulnerability[]> {
  const response = await fetch(
    "http://127.0.0.1:8000/cyber/kev/enriched?limit=5",
    {
      cache: "no-store",
    }
  );

  if (!response.ok) {
    throw new Error("Failed to load SignalDeck cyber intelligence");
  }

  const data = await response.json();

  return data.vulnerabilities;
}

export default async function Home() {
  const vulnerabilities = await getVulnerabilities();

  const criticalCount = vulnerabilities.filter(
    (vulnerability) => vulnerability.severity === "CRITICAL"
  ).length;

  const cvssScores = vulnerabilities
    .map((vulnerability) => vulnerability.cvss_score)
    .filter((score): score is number => score !== null);

  const averageCvss =
    cvssScores.length > 0
      ? (
          cvssScores.reduce((total, score) => total + score, 0) /
          cvssScores.length
        ).toFixed(1)
      : "N/A";

  const ransomwareCount = vulnerabilities.filter(
    (vulnerability) =>
      vulnerability.known_ransomware_use?.toLowerCase() === "known"
  ).length;

  const latestAdded =
    vulnerabilities.length > 0
      ? [...vulnerabilities].sort(
          (a, b) =>
            new Date(b.date_added).getTime() -
            new Date(a.date_added).getTime()
        )[0].date_added
      : "N/A";

  const hasCritical = vulnerabilities.some(
    (vulnerability) =>
      vulnerability.severity === "CRITICAL" &&
      (vulnerability.cvss_score ?? 0) >= 9
  );

  const hasHigh = vulnerabilities.some(
    (vulnerability) => vulnerability.severity === "HIGH"
  );

  const threatLevel = hasCritical
    ? "CRITICAL"
    : hasHigh
      ? "ELEVATED"
      : vulnerabilities.length > 0
        ? "MODERATE"
        : "LOW";

  const threatMessage =
    threatLevel === "CRITICAL"
      ? "Multiple actively exploited high-severity vulnerabilities detected."
      : threatLevel === "ELEVATED"
        ? "High-severity exploited vulnerabilities require attention."
        : threatLevel === "MODERATE"
          ? "Active vulnerabilities are being monitored."
          : "No significant active vulnerability signals detected.";

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <div className="mx-auto max-w-6xl px-6 py-10">
        <header className="mb-10">
          <p className="text-sm uppercase tracking-[0.3em] text-violet-400">
            SignalDeck
          </p>

          <h1 className="mt-2 text-4xl font-bold">
            Cyber Intelligence Dashboard
          </h1>

          <p className="mt-3 max-w-2xl text-slate-400">
            Actively exploited vulnerabilities enriched with live CISA KEV
            and NVD intelligence.
          </p>
        </header>

        <section className="mb-8 rounded-3xl border border-red-500/30 bg-red-500/10 p-6">
          <p className="text-sm uppercase tracking-[0.25em] text-slate-400">
            Global Cyber Threat Level
          </p>

          <div className="mt-4 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-4xl font-bold text-red-400">{threatLevel}</p>
              <p className="mt-2 text-slate-300">{threatMessage}</p>
            </div>

            <div className="text-sm text-slate-400">
              {criticalCount} critical vulnerabilities in current feed
            </div>
          </div>

          <div className="mt-6 h-2 overflow-hidden rounded-full bg-slate-800">
            <div className="h-full w-full rounded-full bg-red-500" />
          </div>

          <div className="mt-2 flex justify-between text-xs uppercase tracking-wide text-slate-500">
            <span>Low</span>
            <span>Moderate</span>
            <span>Elevated</span>
            <span>Critical</span>
          </div>
        </section>

        <section className="mb-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
            <p className="text-sm text-slate-400">Critical Vulnerabilities</p>
            <p className="mt-2 text-3xl font-bold text-red-400">
              {criticalCount}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
            <p className="text-sm text-slate-400">Average CVSS</p>
            <p className="mt-2 text-3xl font-bold text-amber-300">
              {averageCvss}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
            <p className="text-sm text-slate-400">Known Ransomware</p>
            <p className="mt-2 text-3xl font-bold text-orange-300">
              {ransomwareCount}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
            <p className="text-sm text-slate-400">Latest Added</p>
            <p className="mt-2 text-2xl font-bold text-violet-300">
              {latestAdded}
            </p>
          </div>
        </section>

        <VulnerabilityList vulnerabilities={vulnerabilities} />
      </div>
    </main>
  );
}