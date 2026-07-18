"use client";

export default function DashboardRefresh() {
  const lastUpdated = new Date().toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit",
  });

  function refreshDashboard() {
    window.location.reload();
  }

  return (
    <div className="mb-8 flex flex-col gap-3 rounded-2xl border border-slate-800 bg-slate-900 p-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <p className="text-sm text-slate-500">Last updated</p>
        <p className="font-medium text-slate-200">{lastUpdated}</p>
      </div>

      <button
        type="button"
        onClick={refreshDashboard}
        className="rounded-xl border border-violet-500/40 bg-violet-500/10 px-4 py-2 font-medium text-violet-300 transition hover:bg-violet-500/20"
      >
        Refresh Intelligence
      </button>
    </div>
  );
}