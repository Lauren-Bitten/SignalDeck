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

type RemediationPriorityProps = {
  vulnerabilities: Vulnerability[];
};

export default function RemediationPriority({
  vulnerabilities,
}: RemediationPriorityProps) {
  const today = new Date();

  const prioritizedVulnerabilities = vulnerabilities
    .map((vulnerability) => {
      const dueDate = new Date(`${vulnerability.due_date}T00:00:00`);

      const daysRemaining = Math.ceil(
        (dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
      );

      return {
        ...vulnerability,
        daysRemaining,
      };
    })
    .sort((a, b) => a.daysRemaining - b.daysRemaining)
    .slice(0, 3);

  function getPriorityLabel(daysRemaining: number) {
    if (daysRemaining < 0) {
      return "OVERDUE";
    }

    if (daysRemaining <= 3) {
      return "URGENT";
    }

    if (daysRemaining <= 7) {
      return "DUE SOON";
    }

    return "UPCOMING";
  }

  function getPriorityText(daysRemaining: number) {
    if (daysRemaining < 0) {
      return `${Math.abs(daysRemaining)} days overdue`;
    }

    if (daysRemaining === 0) {
      return "Due today";
    }

    if (daysRemaining === 1) {
      return "1 day remaining";
    }

    return `${daysRemaining} days remaining`;
  }

  return (
    <section className="mb-10 rounded-2xl border border-slate-800 bg-slate-900 p-6">
      <div>
        <p className="text-sm uppercase tracking-[0.2em] text-violet-400">
          Remediation Priority
        </p>

        <h2 className="mt-1 text-2xl font-semibold">
          Due Soon
        </h2>

        <p className="mt-2 text-sm text-slate-400">
          Vulnerabilities with the closest CISA KEV remediation deadlines.
        </p>
      </div>

      <div className="mt-6 grid gap-4">
        {prioritizedVulnerabilities.map((vulnerability) => (
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

                  <span className="rounded-full bg-orange-500/15 px-2 py-1 text-xs font-semibold text-orange-300">
                    {getPriorityLabel(vulnerability.daysRemaining)}
                  </span>

                  <span className="text-xs text-slate-500">
                    CVSS {vulnerability.cvss_score ?? "N/A"}
                  </span>
                </div>

                <p className="mt-2 text-sm text-slate-300">
                  {vulnerability.vendor} — {vulnerability.product}
                </p>
              </div>

              <div className="text-sm">
                <p className="text-slate-400">
                  Due {vulnerability.due_date}
                </p>

                <p className="mt-1 font-medium text-orange-300">
                  {getPriorityText(vulnerability.daysRemaining)}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}