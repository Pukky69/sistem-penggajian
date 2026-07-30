export type CompanySettings = {
  companyName: string;
  companyAddress: string;
  companyEmail: string;
  companyPhone: string;
};

// Mock/Default Config - Dalam aplikasi production dapat disimpan di DB
let currentSettings: CompanySettings = {
  companyName: "PT. PERUSAHAAN INDONESIA",
  companyAddress: "Jl. Raya Utama No. 123, Jakarta Selatan",
  companyEmail: "info@perusahaan.co.id",
  companyPhone: "021-5550199",
};

export async function getCompanySettings(): Promise<CompanySettings> {
  return currentSettings;
}

export async function updateCompanySettings(data: CompanySettings): Promise<CompanySettings> {
  currentSettings = { ...data };
  return currentSettings;
}