export const COMPANY = {
  name: "URJAA SOLAR ENERGY",
  legalName: "M/S URJAA SOLAR ENERGY",
  proprietor: "Abhishek Jaiprakash Jaiswal",
  gstin: "09AYYPJ2449J1ZN",
  constitution: "Proprietorship",
  address: "Lucknow Allahabad Road, Near Jaishwaal Guest House, Kabariyaganj, Kunda, Pratapgarh, Uttar Pradesh",
  email: "Urjaasolarenergy@gmail.com",
  whatsapp: "919867405251",
  phoneDisplay: "+91 98674 05251",
  logo: "/urjaa-logo.jpeg",
};

export const waLink = (text) =>
  `https://wa.me/${COMPANY.whatsapp}?text=${encodeURIComponent(text)}`;

export const inr = (n) => `₹${Number(n || 0).toLocaleString("en-IN")}`;

// Indicative PM Surya Ghar central subsidy (as published on pmsuryaghar.gov.in; confirmed during application)
export const centralSubsidy = (kw) => {
  if (kw <= 0) return 0;
  if (kw <= 1) return 30000;
  if (kw <= 2) return 60000;
  return 78000;
};

export const estimateSystem = (monthlyBill) => {
  const size = Math.max(1, Math.min(20, Math.round(monthlyBill / 850)));
  const cost = size * 55000;
  const subsidy = centralSubsidy(size);
  return { size, cost, subsidy, payable: Math.max(0, cost - subsidy) };
};
