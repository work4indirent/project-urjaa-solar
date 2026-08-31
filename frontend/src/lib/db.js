import { supabase } from "@/lib/supabase";

export const createLead = (lead) => supabase.from("leads").insert({ ...lead, source: "website" });

export const createQuotationRequest = (q) => supabase.from("quotations").insert(q);

export const createServiceRequest = (s) => supabase.from("service_requests").insert(s);

export const listRows = async (table, opts = {}) => {
  let q = supabase.from(table).select("*").order(opts.orderBy || "created_at", { ascending: false });
  if (opts.eq) Object.entries(opts.eq).forEach(([k, v]) => { q = q.eq(k, v); });
  if (opts.limit) q = q.limit(opts.limit);
  return q;
};

export const insertRow = (table, row) => supabase.from(table).insert(row).select().single();
export const updateRow = (table, id, patch) => supabase.from(table).update(patch).eq("id", id).select().single();
export const deleteRow = (table, id) => supabase.from(table).delete().eq("id", id);

export const countRows = async (table) => {
  const { count } = await supabase.from(table).select("*", { count: "exact", head: true });
  return count || 0;
};
