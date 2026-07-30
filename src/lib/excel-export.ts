import XLSX from "xlsx-js-style";

export type PayrollExportItem = {
  nik: string;
  nama: string;
  jabatan: string;
  golongan: string;
  gajiPokok: number;
  totalTunjangan: number;
  bpjs: number;
  pph21: number;
  potonganLain: number;
  totalPotongan: number;
  takeHomePay: number;
};

export function exportPayrollReportToExcel(
  items: PayrollExportItem[],
  bulanNama: string,
  tahun: number,
  companyName: string = "PT. PERUSAHAAN INDONESIA"
) {
  // 1. Buat Workbook & Worksheet
  const wb = XLSX.utils.book_new();

  // Header Laporan
  const rawData: (string | number)[][] = [
    [companyName.toUpperCase()],
    [`LAPORAN REKAPITULASI PENGGAJIAN KARYAWAN`],
    [`PERIODE: ${bulanNama.toUpperCase()} ${tahun}`],
    [], // Baris kosong
    [
      "NO",
      "NIK",
      "NAMA KARYAWAN",
      "JABATAN",
      "GOLONGAN",
      "GAJI POKOK",
      "TUNJANGAN",
      "BPJS",
      "PPH21",
      "POTONGAN LAIN",
      "TOTAL POTONGAN",
      "TAKE HOME PAY",
    ],
  ];

  // Total variabel
  let sumGajiPokok = 0;
  let sumTunjangan = 0;
  let sumBpjs = 0;
  let sumPph21 = 0;
  let sumPotonganLain = 0;
  let sumTotalPotongan = 0;
  let sumTHP = 0;

  // Populate data baris
  items.forEach((item, index) => {
    sumGajiPokok += item.gajiPokok;
    sumTunjangan += item.totalTunjangan;
    sumBpjs += item.bpjs;
    sumPph21 += item.pph21;
    sumPotonganLain += item.potonganLain;
    sumTotalPotongan += item.totalPotongan;
    sumTHP += item.takeHomePay;

    rawData.push([
      index + 1,
      item.nik,
      item.nama,
      item.jabatan,
      item.golongan,
      item.gajiPokok,
      item.totalTunjangan,
      item.bpjs,
      item.pph21,
      item.potonganLain,
      item.totalPotongan,
      item.takeHomePay,
    ]);
  });

  // Baris Total / Summary
  rawData.push([
    "",
    "",
    "TOTAL REKAPITULASI",
    "",
    "",
    sumGajiPokok,
    sumTunjangan,
    sumBpjs,
    sumPph21,
    sumPotonganLain,
    sumTotalPotongan,
    sumTHP,
  ]);

  const ws = XLSX.utils.aoa_to_sheet(rawData);

  // 2. Setting Lebar Kolom (Column Widths)
  ws["!cols"] = [
    { wch: 5 },  // NO
    { wch: 12 }, // NIK
    { wch: 25 }, // NAMA
    { wch: 20 }, // JABATAN
    { wch: 12 }, // GOLONGAN
    { wch: 16 }, // GAJI POKOK
    { wch: 15 }, // TUNJANGAN
    { wch: 14 }, // BPJS
    { wch: 14 }, // PPH21
    { wch: 16 }, // POTONGAN LAIN
    { wch: 16 }, // TOTAL POTONGAN
    { wch: 18 }, // TAKE HOME PAY
  ];

  // 3. Apply Styling
  const headerStyle = {
    font: { bold: true, color: { rgb: "FFFFFF" }, sz: 10 },
    fill: { fgColor: { rgb: "1E293B" } }, // Dark Slate Header
    alignment: { horizontal: "center", vertical: "center" },
    border: {
      top: { style: "thin", color: { rgb: "000000" } },
      bottom: { style: "thin", color: { rgb: "000000" } },
    },
  };

  const currencyFormat = "#,##0";

  // Iterasi sel untuk styling
  const range = XLSX.utils.decode_range(ws["!ref"] || "A1:L100");
  for (let R = range.s.r; R <= range.e.r; ++R) {
    for (let C = range.s.c; C <= range.e.c; ++C) {
      const cellAddress = XLSX.utils.encode_cell({ r: R, c: C });
      if (!ws[cellAddress]) continue;

      // Style Judul Atas
      if (R < 3) {
        ws[cellAddress].s = {
          font: { bold: true, sz: R === 0 ? 14 : 11 },
          alignment: { horizontal: "left" },
        };
      }

      // Style Table Header (Baris Ke-4 / Index 4)
      if (R === 4) {
        ws[cellAddress].s = headerStyle;
      }

      // Style Data Cells (Baris Ke-5 sampai sebelum Total)
      if (R > 4 && R < range.e.r) {
        const isNumericCol = C >= 5;
        ws[cellAddress].s = {
          alignment: { horizontal: isNumericCol ? "right" : C === 0 ? "center" : "left" },
          border: {
            bottom: { style: "thin", color: { rgb: "E2E8F0" } },
          },
        };
        if (isNumericCol) {
          ws[cellAddress].z = currencyFormat;
        }
      }

      // Style Row Total (Baris Terakhir)
      if (R === range.e.r) {
        const isNumericCol = C >= 5;
        ws[cellAddress].s = {
          font: { bold: true },
          fill: { fgColor: { rgb: "F1F5F9" } },
          alignment: { horizontal: isNumericCol ? "right" : "left" },
          border: {
            top: { style: "thin", color: { rgb: "000000" } },
            bottom: { style: "double", color: { rgb: "000000" } },
          },
        };
        if (isNumericCol) {
          ws[cellAddress].z = currencyFormat;
        }
      }
    }
  }

  // 4. Append Worksheet ke Workbook & Export
  XLSX.utils.book_append_sheet(wb, ws, "Laporan Payroll");
  XLSX.writeFile(wb, `Laporan_Penggajian_${bulanNama}_${tahun}.xlsx`);
}