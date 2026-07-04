import { ShieldCheck, LayoutDashboard, ArrowUpRight, ReceiptText, Truck, AlertCircle, Bell, Search } from "lucide-react";

// ─── Primitive skeleton ────────────────────────────────────────────────────
function Sk({ className = "" }: { className?: string }) {
  return (
    <div
      className={`animate-pulse rounded-md bg-muted ${className}`}
    />
  );
}

// ─── Stat card skeleton ────────────────────────────────────────────────────
function StatCard({
  icon: Icon,
  label,
  accentClass,
}: {
  icon: React.ElementType;
  label: string;
  accentClass: string;
}) {
  return (
    <div className="bg-card border border-border rounded-xl p-5 flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div className={`p-2 rounded-lg ${accentClass}`}>
          <Icon className="h-4 w-4" />
        </div>
        <ArrowUpRight className="h-4 w-4 text-muted-foreground/40" />
      </div>
      <div className="space-y-2">
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{label}</p>
        <Sk className="h-7 w-24" />
      </div>
      <div className="flex items-center gap-2">
        <Sk className="h-3 w-16" />
        <Sk className="h-3 w-10" />
      </div>
    </div>
  );
}

// ─── Table skeleton ────────────────────────────────────────────────────────
function TableSkeleton({
  title,
  columns,
  rows = 5,
}: {
  title: string;
  columns: string[];
  rows?: number;
}) {
  return (
    <div className="bg-card border border-border rounded-xl overflow-hidden">
      {/* Table header bar */}
      <div className="px-5 py-4 border-b border-border flex items-center justify-between">
        <div className="space-y-1">
          <h3 className="text-sm font-semibold text-foreground">{title}</h3>
          <Sk className="h-3 w-32" />
        </div>
        <div className="flex gap-2">
          <Sk className="h-8 w-20 rounded-lg" />
          <Sk className="h-8 w-8 rounded-lg" />
        </div>
      </div>

      {/* Column headers */}
      <div
        className="grid gap-4 px-5 py-3 border-b border-border bg-muted/40"
        style={{ gridTemplateColumns: `repeat(${columns.length}, minmax(0,1fr))` }}
      >
        {columns.map((col) => (
          <span key={col} className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            {col}
          </span>
        ))}
      </div>

      {/* Skeleton rows */}
      <div className="divide-y divide-border">
        {Array.from({ length: rows }).map((_, rowIdx) => (
          <div
            key={rowIdx}
            className="grid gap-4 px-5 py-4 items-center"
            style={{ gridTemplateColumns: `repeat(${columns.length}, minmax(0,1fr))` }}
          >
            {columns.map((_, colIdx) => {
              // Vary widths to look realistic
              const widths = ["w-24", "w-20", "w-28", "w-16", "w-20", "w-14"];
              const w = widths[(colIdx + rowIdx) % widths.length];
              if (colIdx === 0) {
                return (
                  <div key={colIdx} className="flex items-center gap-3">
                    <Sk className="h-8 w-8 rounded-full shrink-0" />
                    <div className="space-y-1.5">
                      <Sk className="h-3 w-20" />
                      <Sk className="h-2.5 w-14" />
                    </div>
                  </div>
                );
              }
              if (colIdx === columns.length - 1) {
                return (
                  <div key={colIdx} className="flex justify-end">
                    <Sk className="h-6 w-16 rounded-full" />
                  </div>
                );
              }
              return <Sk key={colIdx} className={`h-3 ${w}`} />;
            })}
          </div>
        ))}
      </div>

      {/* Pagination footer */}
      <div className="px-5 py-3 border-t border-border flex items-center justify-between">
        <Sk className="h-3 w-36" />
        <div className="flex gap-1.5">
          {[1, 2, 3].map((n) => (
            <Sk key={n} className="h-7 w-7 rounded-md" />
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Sidebar nav item ──────────────────────────────────────────────────────
function NavItem({
  icon: Icon,
  label,
  active = false,
}: {
  icon: React.ElementType;
  label: string;
  active?: boolean;
}) {
  return (
    <div
      className={`flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer transition-colors ${
        active
          ? "bg-secondary text-primary font-semibold"
          : "text-muted-foreground hover:bg-muted hover:text-foreground"
      }`}
    >
      <Icon className="h-4 w-4 shrink-0" />
      <span className="text-sm">{label}</span>
    </div>
  );
}

// ─── Page ──────────────────────────────────────────────────────────────────
export default function Dashboard() {
  return (
    <div className="min-h-dvh bg-background flex">

      {/* ── Sidebar ── */}
      <aside className="hidden md:flex flex-col w-56 shrink-0 border-r border-border bg-card h-screen sticky top-0">
        {/* Brand */}
        <div className="px-5 py-5 border-b border-border flex items-center gap-2">
          <div className="bg-primary rounded-lg p-1.5">
            <ShieldCheck className="h-4 w-4 text-primary-foreground" strokeWidth={2.5} />
          </div>
          <span className="text-base font-bold tracking-tight text-foreground">Vouch</span>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-0.5">
          <NavItem icon={LayoutDashboard} label="Overview" active />
          <NavItem icon={ReceiptText} label="Transactions" />
          <NavItem icon={Truck} label="Deliveries" />
          <NavItem icon={AlertCircle} label="Disputes" />
        </nav>

        {/* User stub */}
        <div className="px-4 py-4 border-t border-border flex items-center gap-3">
          <Sk className="h-8 w-8 rounded-full shrink-0" />
          <div className="space-y-1 flex-1 min-w-0">
            <Sk className="h-3 w-20" />
            <Sk className="h-2.5 w-14" />
          </div>
        </div>
      </aside>

      {/* ── Main ── */}
      <div className="flex-1 flex flex-col min-w-0">

        {/* Top bar */}
        <header className="sticky top-0 z-10 bg-card border-b border-border px-6 py-3 flex items-center gap-4">
          {/* Search */}
          <div className="flex items-center gap-2 bg-muted rounded-lg px-3 py-2 flex-1 max-w-sm">
            <Search className="h-4 w-4 text-muted-foreground shrink-0" />
            <Sk className="h-3 flex-1" />
          </div>
          <div className="ml-auto flex items-center gap-3">
            {/* Notification bell */}
            <div className="relative p-2 rounded-lg hover:bg-muted cursor-pointer">
              <Bell className="h-4 w-4 text-muted-foreground" />
              <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-primary" />
            </div>
            <Sk className="h-8 w-8 rounded-full" />
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 p-6 space-y-6 overflow-y-auto">

          {/* Page title */}
          <div className="space-y-1">
            <h1 className="text-xl font-bold text-foreground">Overview</h1>
            <p className="text-sm text-muted-foreground">
              Track escrow transactions, deliveries, and disputes.
            </p>
          </div>

          {/* Stat cards */}
          <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
            <StatCard
              icon={ReceiptText}
              label="Total Transactions"
              accentClass="bg-secondary text-primary"
            />
            <StatCard
              icon={ArrowUpRight}
              label="Total Volume"
              accentClass="bg-secondary text-primary"
            />
            <StatCard
              icon={Truck}
              label="Deliveries"
              accentClass="bg-success-bg text-success"
            />
            <StatCard
              icon={AlertCircle}
              label="Open Disputes"
              accentClass="bg-error-bg text-destructive"
            />
          </div>

          {/* Transactions table */}
          <TableSkeleton
            title="Recent Transactions"
            columns={["Order", "Amount", "Bank", "Date", "Status"]}
            rows={6}
          />

          {/* Disputes table */}
          <TableSkeleton
            title="Open Disputes"
            columns={["Order", "Issue", "Submitted", "Status"]}
            rows={3}
          />

        </main>
      </div>
    </div>
  );
}
