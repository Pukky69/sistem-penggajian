import { PrismaClient, Role, EmployeeStatus } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // =========================
  // ADMIN AKUN UTAMA
  // =========================
  const hashedPassword = await bcrypt.hash("admin123", 10);

  const admin = await prisma.user.upsert({
    where: {
      email: "admin@payroll.com",
    },
    update: {},
    create: {
      name: "Administrator",
      email: "admin@payroll.com",
      password: hashedPassword,
      role: Role.ADMIN,
    },
  });

  console.log("✅ Admin user seeded.");

  // =========================
  // POSITION (JABATAN)
  // =========================
  const positions = ["Manager", "Supervisor", "Staff", "Intern"];

  for (const nama of positions) {
    await prisma.position.upsert({
      where: { nama },
      update: {},
      create: { nama },
    });
  }

  console.log("✅ Positions seeded.");

  // =========================
  // GRADE (GOLONGAN)
  // =========================
  const grades = [
    { nama: "A", gajiPokok: 12000000 },
    { nama: "B", gajiPokok: 9000000 },
    { nama: "C", gajiPokok: 6000000 },
    { nama: "D", gajiPokok: 4000000 },
  ];

  for (const grade of grades) {
    await prisma.grade.upsert({
      where: {
        nama: grade.nama,
      },
      update: {},
      create: grade,
    });
  }

  console.log("✅ Grades seeded.");

  // =========================
  // EMPLOYEE & KARYAWAN USER
  // =========================
  const manager = await prisma.position.findUnique({
    where: { nama: "Manager" },
  });

  const supervisor = await prisma.position.findUnique({
    where: { nama: "Supervisor" },
  });

  const staff = await prisma.position.findUnique({
    where: { nama: "Staff" },
  });

  const gradeA = await prisma.grade.findUnique({
    where: { nama: "A" },
  });

  const gradeB = await prisma.grade.findUnique({
    where: { nama: "B" },
  });

  const gradeC = await prisma.grade.findUnique({
    where: { nama: "C" },
  });

  if (!manager || !supervisor || !staff || !gradeA || !gradeB || !gradeC) {
    throw new Error("Position atau Grade belum tersedia.");
  }

  // Buat Karyawan
  const emp1 = await prisma.employee.upsert({
    where: { nik: "EMP001" },
    update: {},
    create: {
      nik: "EMP001",
      nama: "Budi Santoso",
      email: "budi@payroll.com",
      tanggalLahir: new Date("1995-05-15"),
      tanggalMasuk: new Date("2023-01-10"),
      status: EmployeeStatus.AKTIF,
      positionId: manager.id,
      gradeId: gradeA.id,
    },
  });

  const emp2 = await prisma.employee.upsert({
    where: { nik: "EMP002" },
    update: {},
    create: {
      nik: "EMP002",
      nama: "Siti Aisyah",
      email: "siti@payroll.com",
      tanggalLahir: new Date("1997-08-20"),
      tanggalMasuk: new Date("2023-05-01"),
      status: EmployeeStatus.AKTIF,
      positionId: supervisor.id,
      gradeId: gradeB.id,
    },
  });

  await prisma.employee.upsert({
    where: { nik: "EMP003" },
    update: {},
    create: {
      nik: "EMP003",
      nama: "Andi Wijaya",
      email: "andi@payroll.com",
      tanggalLahir: new Date("1998-02-12"),
      tanggalMasuk: new Date("2024-01-15"),
      status: EmployeeStatus.NONAKTIF,
      positionId: staff.id,
      gradeId: gradeC.id,
    },
  });

  // Buat User login portal untuk Karyawan Aktif
  const userPassword = await bcrypt.hash("user123", 10);

  await prisma.user.upsert({
    where: { email: "budi@payroll.com" },
    update: { employeeId: emp1.id },
    create: {
      name: "Budi Santoso",
      email: "budi@payroll.com",
      password: userPassword,
      role: Role.KARYAWAN,
      employeeId: emp1.id,
    },
  });

  await prisma.user.upsert({
    where: { email: "siti@payroll.com" },
    update: { employeeId: emp2.id },
    create: {
      name: "Siti Aisyah",
      email: "siti@payroll.com",
      password: userPassword,
      role: Role.KARYAWAN,
      employeeId: emp2.id,
    },
  });

  console.log("✅ Employees & Employee Users seeded.");

  // =========================
  // EARNING (TUNJANGAN)
  // =========================
  const earnings = [
    {
      nama: "Bonus",
      tipe: "TETAP",
      nilai: 500000,
    },
    {
      nama: "Lembur",
      tipe: "TETAP",
      nilai: 100000,
    },
    {
      nama: "Transport",
      tipe: "TETAP",
      nilai: 300000,
    },
    {
      nama: "Tunjangan Jabatan",
      tipe: "TETAP",
      nilai: 750000,
    },
  ];

  for (const earning of earnings) {
    await prisma.earning.upsert({
      where: {
        nama: earning.nama,
      },
      update: {},
      create: earning,
    });
  }

  console.log("✅ Earnings seeded.");

  // =========================
  // DEDUCTION (POTONGAN)
  // =========================
  const deductions = [
    {
      nama: "BPJS Kesehatan",
      tipe: "PERSENTASE",
      nilai: 1, // 1%
    },
    {
      nama: "PPh21",
      tipe: "PERSENTASE",
      nilai: 5, // 5%
    },
    {
      nama: "Kasbon",
      tipe: "TETAP",
      nilai: 0,
    },
  ];

  for (const deduction of deductions) {
    await prisma.deduction.upsert({
      where: {
        nama: deduction.nama,
      },
      update: {},
      create: deduction,
    });
  }

  console.log("✅ Deductions seeded.");

  // =========================
  // COMPANY PROFILE
  // =========================
  await prisma.companyProfile.upsert({
    where: {
      id: 1,
    },
    update: {},
    create: {
      id: 1,
      nama: "PT Payroll Indonesia",
      alamat: "Jakarta, Indonesia",
      email: "admin@payroll.com",
      telepon: "02112345678",
      logoUrl: "",
    },
  });

  console.log("✅ Company profile seeded.");
  console.log("🚀 Seed completed successfully!");
}

main()
  .catch((error) => {
    console.error("❌ Seed failed:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });