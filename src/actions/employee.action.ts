"use server";

import { Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache"; 
import { createEmployee, updateEmployee } from "@/services/employee.service"; 
import { deleteEmployee } from "@/services/employee.service";
import {
  employeeSchema,
  type EmployeeFormValues,
} from "@/validations/employee";


export async function createEmployeeAction(
  values: EmployeeFormValues
) {

  try {

    // validasi ulang di server
    const validatedData = employeeSchema.parse(values);


    const employee = await createEmployee(
      validatedData
    );


    return {
      success: true,

      data: {
        id: employee.id,
        nik: employee.nik,
        nama: employee.nama,
        email: employee.email,
      },

      message:
        "Karyawan berhasil ditambahkan",
    };


  } catch (error) {


    console.error(
      "CREATE EMPLOYEE ERROR:",
      error
    );


    // Handle duplicate unique field
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {

      const target = String(
        error.meta?.target
    );


      if (
        target.toLowerCase().includes("nik")
        ) {
       

        return {
          success: false,
          message:
            "NIK sudah digunakan",
        };

      }


      if (
        target.toLowerCase().includes("email")
     ) {

        return {
          success: false,
          message:
            "Email sudah digunakan",
        };

      }

    }


    return {
      success: false,

      message:
        "Gagal menambahkan karyawan",
    };

  }

}

export async function updateEmployeeAction(
  id: number,
  values: EmployeeFormValues
) {
  try {
    // validasi ulang di server
    const validatedData = employeeSchema.parse(values);

    const employee = await updateEmployee(id, validatedData);

    // Revalidate cache agar data di tabel & detail terupdate
    revalidatePath("/employees");
    revalidatePath(`/employees/${id}`);

    return {
      success: true,
      data: {
        id: employee.id,
        nik: employee.nik,
        nama: employee.nama,
        email: employee.email,
      },
      message: "Data karyawan berhasil diperbarui",
    };
  } catch (error) {
    console.error("UPDATE EMPLOYEE ERROR:", error);

    // Handle duplicate unique field
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      const target = String(error.meta?.target);

      if (target.toLowerCase().includes("nik")) {
        return {
          success: false,
          message: "NIK sudah digunakan",
        };
      }

      if (target.toLowerCase().includes("email")) {
        return {
          success: false,
          message: "Email sudah digunakan",
        };
      }
    }

    return {
      success: false,
      message: "Gagal memperbarui karyawan",
    };
  }
}

export async function deleteEmployeeAction(id: number) {
  try {
    const deletedEmployee = await deleteEmployee(id);

    revalidatePath("/employees");

    return {
      success: true,
      data: {
        id: deletedEmployee.id,
        nama: deletedEmployee.nama,
      },
      message: `Karyawan ${deletedEmployee.nama} berhasil dihapus`,
    };
  } catch (error) {
    console.error("DELETE EMPLOYEE ERROR:", error);

    // Prisma error jika data terikat dengan tabel lain (misal payroll)
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2003"
    ) {
      return {
        success: false,
        message: "Gagal menghapus! Data karyawan ini terikat dengan riwayat gaji/transaksi lain.",
      };
    }

    return {
      success: false,
      message: "Gagal menghapus data karyawan",
    };
  }
}