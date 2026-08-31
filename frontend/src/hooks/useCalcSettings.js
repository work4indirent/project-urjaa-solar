import { useEffect, useState } from "react";
import { getSetting } from "@/lib/db";

export const DEFAULT_CALC = {
  cost_per_kw: 55000,
  bill_per_kw: 850,
  gen_per_kw_year: 1450,
  savings_factor: 0.82,
  subsidy_1kw: 30000,
  subsidy_2kw: 60000,
  subsidy_3kw_plus: 78000,
};

export const subsidyFor = (kw, s = DEFAULT_CALC) => {
  if (kw <= 0) return 0;
  if (kw <= 1) return +s.subsidy_1kw;
  if (kw <= 2) return +s.subsidy_2kw;
  return +s.subsidy_3kw_plus;
};

export function useCalcSettings() {
  const [settings, setSettings] = useState(DEFAULT_CALC);
  useEffect(() => {
    let alive = true;
    getSetting("calculator").then((v) => { if (alive && v) setSettings({ ...DEFAULT_CALC, ...v }); });
    return () => { alive = false; };
  }, []);
  return settings;
}
