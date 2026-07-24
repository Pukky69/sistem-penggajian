"use server";

import { Prisma } from "@prisma/client";

import { createEmployee } from "@/services/employee.service";

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