import { PrismaClient, Role } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // =========================
  // ADMIN
  // =========================
  const hashedPassword = await bcrypt.hash("admin123", 10);

  await prisma.user.upsert({
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

  // =========================
  // POSITION
  // =========================
  const positions = [
    "Manager",
    "Supervisor",
    "Staff",
    "Intern",
  ];

  for (const nama of positions) {
    await prisma.position.upsert({
      where: { nama },
      update: {},
      create: { nama },
    });
  }

  // =========================
  // GRADE
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

  // =========================
  // EARNING
  // =========================
  const earnings = [
    {
      nama: "Bonus",
      tipe: "FIXED",
      nilai: 500000,
    },
    {
      nama: "Lembur",
      tipe: "VARIABLE",
      nilai: 100000,
    },
    {
      nama: "Transport",
      tipe: "FIXED",
      nilai: 300000,
    },
    {
      nama: "Tunjangan Jabatan",
      tipe: "FIXED",
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

  // =========================
  // DEDUCTION
  // =========================
  const deductions = [
    {
      nama: "BPJS",
      tipe: "PERCENT",
      nilai: 4,
    },
    {
      nama: "PPh21",
      tipe: "PERCENT",
      nilai: 5,
    },
    {
      nama: "Kasbon",
      tipe: "VARIABLE",
      nilai: 0,
    },
    {
      nama: "Potongan Lain",
      tipe: "VARIABLE",
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

  console.log("✅ Seed completed.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });