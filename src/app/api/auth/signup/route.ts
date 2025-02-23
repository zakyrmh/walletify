import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/db/connect";
import bcrypt from "bcryptjs";
import User from "@/models/User";

export async function POST(request: Request) {
  try {
    await connectToDatabase();

    const body = await request.json();
    const { name, username, password } = body;

    if (!name || !username || !password) {
      return NextResponse.json(
        { error: "Semua field harus diisi." },
        { status: 400 }
      );
    }

    // Periksa apakah username sudah ada
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return NextResponse.json(
        { error: "Username sudah digunakan." },
        { status: 400 }
      );
    }

    // Hash password sebelum menyimpan
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      name,
      username,
      password: hashedPassword,
    });

    await newUser.save();

    return NextResponse.json(
      { message: "User berhasil dibuat." },
      { status: 201 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Gagal mendaftar user." },
      { status: 500 }
    );
  }
}
