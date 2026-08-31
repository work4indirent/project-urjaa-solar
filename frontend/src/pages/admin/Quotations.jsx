import { useCallback, useEffect, useState } from "react";
import { ChevronDown, ChevronUp, Loader2, MessageCircle, Printer, Trash2 } from "lucide-react";
import { deleteRow, listRows, updateRow } from "@/lib/db";
import { COMPANY, inr, waLink } from "@/lib/company";

const STATUSES = ["requested", "surveyed", "sent", "accepted", "rejected", "completed"];

export default function Quotations() {
  const [rows, setRows] = useState(null);
  const [openId, setOpenId] = useState(null);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    const { data, error: err } = await listRows("quotations");
    if (err) setError(err.message);
    setRows(data || []);
  }, []);
  useEffect(() => { load(); }, [load]);

  const setStatus = async (id, status) => {
    await updateRow("quotations", id, { status });
    setRows((rs) => rs.map((r) => (r.id === id ? { ...r, status } : r)));
  };
  const remove = async (id) => {
    if (!window.confirm("Delete this quotation?")) return;
    await deleteRow("quotations", id);
    load();
  };
  const waCustomer = (q) =>
    `https://wa.me/91${String(q.phone).replace(/\D/g, "").slice(-10)}?text=${encodeURIComponent(
      `Hello ${q.name}, this is ${COMPANY.name} (ref ${q.quote_ref}). Your indicative quotation: ${q.system_size_kw} kW system, cost ${inr(q.estimated_cost)}, indicative subsidy ${inr(q.estimated_subsidy)}, payable ${inr(q.customer_payable)}. We will confirm final pricing after your free site survey. Reply here to schedule it.`
    )}`;

  const printQuote = (q) => {
    const w = window.open("", "_blank");
    w.document.write(`<html><head><title>Quotation ${q.quote_ref}</title><style>body{font-family:Arial,sans-serif;padding:40px;color:#14213d}h1{color:#122f6b;font-size:22px}table{border-collapse:collapse;width:100%;margin-top:18px}td,th{border:1px solid #ccc;padding:9px 12px;text-align:left;font-size:13px}th{background:#f2f5ef}.head{display:flex;justify-content:space-between;border-bottom:3px solid #1f9d3a;padding-bottom:14px}.muted{color:#666;font-size:12px}.total td{font-weight:bold;background:#fdf6e3}</style></head><body>
      <div class="head"><div><h1>${COMPANY.legalName}</h1><div class="muted">${COMPANY.address}<br/>GSTIN: ${COMPANY.gstin} · Proprietor: ${COMPANY.proprietor}<br/>${COMPANY.email} · ${COMPANY.phoneDisplay}</div></div><div><b>INDICATIVE QUOTATION</b><br/><span class="muted">Ref: ${q.quote_ref || q.id}<br/>Date: ${new Date(q.created_at).toLocaleDateString("en-IN")}</span></div></div>
      <p><b>Customer:</b> ${q.name} · ${q.phone}${q.email ? " · " + q.email : ""}<br/><b>Site:</b> ${[q.address, q.city, q.district, q.state].filter(Boolean).join(", ")} · ${q.property_type}</p>
      <table><tr><th>Item</th><th>Detail</th></tr>
      <tr><td>Recommended system size</td><td>${q.system_size_kw ?? "—"} kW</td></tr>
      <tr><td>Panel preference</td><td>${q.panel_type || "To be confirmed"}</td></tr>
      <tr><td>Monthly bill considered</td><td>${inr(q.monthly_bill)}</td></tr>
      <tr><td>Usable roof area</td><td>${q.roof_area ?? "—"} sq ft</td></tr>
      <tr><td>Indicative project cost</td><td>${inr(q.estimated_cost)}</td></tr>
      <tr><td>Indicative central subsidy (PM Surya Ghar)</td><td>${inr(q.estimated_subsidy)}</td></tr>
      <tr class="total"><td>Indicative amount payable</td><td>${inr(q.customer_payable)}</td></tr></table>
      <p class="muted">This is an indicative quotation. Final pricing, components and subsidy eligibility are confirmed after a free site survey and DISCOM verification. No advance payment is requested before a written final quotation.</p>
      </body></html>`);
    w.document.close();
    w.print();
  };

  return (
    <div data-testid="admin-quotations">
      <div className="admin-head"><div><h1>Quotations</h1><p>Requests from the website quotation tool. Update status as they move through survey and confirmation.</p></div></div>
      {error && <p className="admin-error" data-testid="quotations-error">{error}</p>}
      {rows === null ? (
        <div className="admin-loading"><Loader2 className="spin" /> Loading…</div>
      ) : rows.length === 0 ? (
        <div className="admin-empty" data-testid="quotations-empty">No quotation requests yet.</div>
      ) : (
        <div className="quote-cards">
          {rows.map((q) => (
            <div className="quote-admin-card" key={q.id} data-testid="quotation-card">
              <div className="quote-admin-top" onClick={() => setOpenId(openId === q.id ? null : q.id)}>
                <div>
                  <b>{q.name}</b> <span className="tag">{q.quote_ref}</span>
                  <small>{[q.district, q.state].filter(Boolean).join(", ")} · {q.system_size_kw} kW · payable {inr(q.customer_payable)}</small>
                </div>
                <div className="quote-admin-right">
                  <select className="status-select" value={q.status} onClick={(e) => e.stopPropagation()} onChange={(e) => setStatus(q.id, e.target.value)} data-testid="quotation-status-select">
                    {STATUSES.map((s) => <option key={s}>{s}</option>)}
                  </select>
                  {openId === q.id ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </div>
              </div>
              {openId === q.id && (
                <div className="quote-admin-detail" data-testid="quotation-detail">
                  <div className="quote-summary-grid">
                    <div><small>Phone</small><b>{q.phone}</b></div>
                    <div><small>Property</small><b>{q.property_type}</b></div>
                    <div><small>Monthly bill</small><b>{inr(q.monthly_bill)}</b></div>
                    <div><small>Roof area</small><b>{q.roof_area} sq ft</b></div>
                    <div><small>Panel preference</small><b>{q.panel_type || "—"}</b></div>
                    <div><small>Indicative cost</small><b>{inr(q.estimated_cost)}</b></div>
                    <div><small>Indicative subsidy</small><b>{inr(q.estimated_subsidy)}</b></div>
                    <div className="highlight"><small>Payable</small><b>{inr(q.customer_payable)}</b></div>
                  </div>
                  {q.address && <p className="quote-meta">Site: {[q.address, q.city].filter(Boolean).join(", ")}</p>}
                  <div className="quote-admin-actions">
                    <a className="button button-whatsapp" href={waCustomer(q)} target="_blank" rel="noreferrer" data-testid="quotation-whatsapp-customer"><MessageCircle size={15} /> WhatsApp customer</a>
                    <button className="button button-dark" onClick={() => printQuote(q)} data-testid="quotation-print-button"><Printer size={15} /> Print / PDF</button>
                    <button className="quiet-button danger" onClick={() => remove(q.id)} data-testid="quotation-delete-button"><Trash2 size={14} /> Delete</button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
