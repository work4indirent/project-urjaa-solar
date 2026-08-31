import { useCallback, useEffect, useState } from "react";
import { Loader2, Pencil, Plus, Trash2, X } from "lucide-react";
import { deleteRow, insertRow, listRows, updateRow } from "@/lib/db";

export default function Manage({ config }) {
  const { table, title, subtitle, fields, columns, statusField, statusOptions } = config;
  const [rows, setRows] = useState(null);
  const [editing, setEditing] = useState(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    const { data, error: err } = await listRows(table);
    if (err) setError(err.message);
    setRows(data || []);
  }, [table]);

  useEffect(() => { setRows(null); setEditing(null); setError(""); load(); }, [load]);

  const blank = () => Object.fromEntries(fields.map((f) => [f.name, f.type === "checkbox" ? false : ""]));

  const save = async (e) => {
    e.preventDefault();
    setSaving(true);
    const payload = { ...editing };
    const id = payload.id;
    delete payload.id;
    fields.forEach((f) => { if (f.type === "number" && payload[f.name] !== "" && payload[f.name] != null) payload[f.name] = +payload[f.name]; if (payload[f.name] === "") payload[f.name] = null; });
    const { error: err } = id ? await updateRow(table, id, payload) : await insertRow(table, payload);
    setSaving(false);
    if (err) { setError(err.message); return; }
    setEditing(null);
    load();
  };

  const remove = async (id) => {
    if (!window.confirm("Delete this record?")) return;
    await deleteRow(table, id);
    load();
  };

  const setStatus = async (id, value) => {
    await updateRow(table, id, { [statusField]: value });
    setRows((rs) => rs.map((r) => (r.id === id ? { ...r, [statusField]: value } : r)));
  };

  return (
    <div data-testid={`admin-${table}`}>
      <div className="admin-head">
        <div><h1>{title}</h1><p>{subtitle}</p></div>
        <button className="button button-dark" onClick={() => setEditing(blank())} data-testid={`${table}-add-button`}><Plus size={15} /> Add</button>
      </div>
      {error && <p className="admin-error" data-testid={`${table}-error`}>{error}</p>}
      {rows === null ? (
        <div className="admin-loading"><Loader2 className="spin" /> Loading…</div>
      ) : rows.length === 0 ? (
        <div className="admin-empty" data-testid={`${table}-empty`}>No records yet.</div>
      ) : (
        <div className="admin-table-wrap">
          <table className="admin-table" data-testid={`${table}-table`}>
            <thead><tr>{columns.map((c) => <th key={c.key}>{c.label}</th>)}{statusField && <th>Status</th>}<th /></tr></thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.id} data-testid={`${table}-row`}>
                  {columns.map((c) => <td key={c.key}>{c.render ? c.render(r) : String(r[c.key] ?? "—")}</td>)}
                  {statusField && (
                    <td>
                      <select className="status-select" value={r[statusField] || ""} onChange={(e) => setStatus(r.id, e.target.value)} data-testid={`${table}-status-select`}>
                        {statusOptions.map((s) => <option key={s} value={s}>{s.replaceAll("_", " ")}</option>)}
                      </select>
                    </td>
                  )}
                  <td className="row-actions">
                    <button onClick={() => setEditing(Object.fromEntries([["id", r.id], ...fields.map((f) => [f.name, r[f.name] ?? (f.type === "checkbox" ? false : "")])]))} data-testid={`${table}-edit-button`}><Pencil size={14} /></button>
                    <button onClick={() => remove(r.id)} data-testid={`${table}-delete-button`}><Trash2 size={14} /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {editing && (
        <div className="drawer-overlay" onClick={() => setEditing(null)}>
          <form className="drawer" onClick={(e) => e.stopPropagation()} onSubmit={save} data-testid={`${table}-form`}>
            <div className="drawer-head"><h2>{editing.id ? "Edit" : "New"} record</h2><button type="button" onClick={() => setEditing(null)} data-testid={`${table}-form-close`}><X size={17} /></button></div>
            {fields.map((f) => (
              <label key={f.name}>{f.label}
                {f.type === "textarea" ? (
                  <textarea rows="3" value={editing[f.name] ?? ""} onChange={(e) => setEditing({ ...editing, [f.name]: e.target.value })} data-testid={`${table}-field-${f.name}`} />
                ) : f.type === "select" ? (
                  <select value={editing[f.name] ?? ""} onChange={(e) => setEditing({ ...editing, [f.name]: e.target.value })} data-testid={`${table}-field-${f.name}`}>
                    <option value="">—</option>{f.options.map((o) => <option key={o}>{o}</option>)}
                  </select>
                ) : f.type === "checkbox" ? (
                  <input type="checkbox" checked={!!editing[f.name]} onChange={(e) => setEditing({ ...editing, [f.name]: e.target.checked })} data-testid={`${table}-field-${f.name}`} />
                ) : (
                  <input type={f.type || "text"} required={f.required} value={editing[f.name] ?? ""} onChange={(e) => setEditing({ ...editing, [f.name]: e.target.value })} data-testid={`${table}-field-${f.name}`} />
                )}
              </label>
            ))}
            <button className="button button-gold" disabled={saving} data-testid={`${table}-form-save`}>{saving ? "Saving…" : "Save"}</button>
          </form>
        </div>
      )}
    </div>
  );
}
