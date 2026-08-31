import { useEffect, useState } from "react";
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { FileText, Package, Users, Wrench } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { countRows } from "@/lib/db";

const LEAD_STATUSES = ["new", "contacted", "qualified", "site_survey", "quotation_sent", "negotiation", "won", "lost", "follow_up"];

export default function Dashboard() {
  const [counts, setCounts] = useState({ leads: 0, quotations: 0, products: 0, services: 0 });
  const [chart, setChart] = useState([]);
  useEffect(() => {
    (async () => {
      const [leads, quotations, products, services] = await Promise.all([
        countRows("leads"), countRows("quotations"), countRows("products"), countRows("service_requests"),
      ]);
      setCounts({ leads, quotations, products, services });
      const { data } = await supabase.from("leads").select("status");
      const byStatus = LEAD_STATUSES.map((s) => ({ status: s.replace("_", " "), count: (data || []).filter((l) => l.status === s).length })).filter((x) => x.count > 0);
      setChart(byStatus.length ? byStatus : [{ status: "no leads yet", count: 0 }]);
    })();
  }, []);
  const cards = [
    ["Leads", counts.leads, Users, "leads-count"],
    ["Quotations", counts.quotations, FileText, "quotations-count"],
    ["Products", counts.products, Package, "products-count"],
    ["Service requests", counts.services, Wrench, "services-count"],
  ];
  return (
    <div data-testid="admin-dashboard">
      <div className="admin-head"><h1>Dashboard</h1><p>Live overview of your pipeline and catalogue.</p></div>
      <div className="kpi-grid">
        {cards.map(([label, value, Icon, tid]) => (
          <div className="kpi-card" key={label} data-testid={`kpi-${tid}`}>
            <Icon size={18} /><strong>{value ?? "—"}</strong><span>{label}</span>
          </div>
        ))}
      </div>
      <div className="chart-card" data-testid="leads-chart">
        <h3>Leads by status</h3>
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={chart}>
            <XAxis dataKey="status" tick={{ fontSize: 11 }} />
            <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
            <Tooltip />
            <Bar dataKey="count" fill="#1f9d3a" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
