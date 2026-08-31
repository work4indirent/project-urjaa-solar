import { useEffect, useState } from "react";
import { Save } from "lucide-react";
import { getSetting, saveSetting } from "@/lib/db";
import { DEFAULT_CALC } from "@/hooks/useCalcSettings";

const FIELDS = [
  ["cost_per_kw", "Project cost per kW (₹)", "Used for indicative project cost in the calculator and quotations."],
  ["bill_per_kw", "Monthly bill per kW (₹)", "₹ of monthly bill that maps to 1 kW of recommended system size."],
  ["gen_per_kw_year", "Annual generation per kW (kWh)", "Estimated units generated per kW per year."],
  ["savings_factor", "Savings factor (0–1)", "Share of the yearly bill assumed saved (e.g. 0.82 = 82%)."],
  ["subsidy_1kw", "Indicative subsidy — 1 kW (₹)", "Central subsidy shown for 1 kW residential systems."],
  ["subsidy_2kw", "Indicative subsidy — 2 kW (₹)", "Central subsidy shown for 2 kW residential systems."],
  ["subsidy_3kw_plus", "Indicative subsidy — 3 kW+ (₹)", "Central subsidy shown for 3 kW and larger residential systems."],
];

export default function SettingsPage() {
  const [form, setForm] = useState(DEFAULT_CALC);
  const [status, setStatus] = useState("");
  const [saving, setSaving] = useState(false);
  useEffect(() => { getSetting("calculator").then((v) => { if (v) setForm({ ...DEFAULT_CALC, ...v }); }); }, []);
  const submit = async (e) => {
    e.preventDefault();
    setSaving(true);
    const clean = Object.fromEntries(Object.entries(form).map(([k, v]) => [k, +v]));
    const { error } = await saveSetting("calculator", clean);
    setSaving(false);
    setStatus(error ? `Could not save: ${error.message}` : "Saved. The website calculator and quotation estimates now use these values.");
  };
  return (
    <div data-testid="admin-settings">
      <div className="admin-head"><div><h1>Calculator settings</h1><p>Edit the pricing and subsidy assumptions used by the public calculator and quotation tool — no code changes needed.</p></div></div>
      <form className="settings-form" onSubmit={submit} data-testid="settings-form">
        {FIELDS.map(([key, label, hint]) => (
          <label key={key}>
            {label}
            <input type="number" step="any" required value={form[key]} onChange={(e) => setForm({ ...form, [key]: e.target.value })} data-testid={`setting-${key}`} />
            <small>{hint}</small>
          </label>
        ))}
        <button className="button button-gold" disabled={saving} data-testid="settings-save-button"><Save size={15} /> {saving ? "Saving…" : "Save settings"}</button>
        {status && <p className="form-status" data-testid="settings-status">{status}</p>}
      </form>
    </div>
  );
}
