import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET() {
  try {
    const packagePath = path.join(process.cwd(), "..", "testbed", "package.json");
    const pkg = JSON.parse(fs.readFileSync(packagePath, "utf-8"));

    const response = NextResponse.json({
      name: pkg.name,
      version: pkg.version,
      dependencies: pkg.dependencies,
    });

    response.headers.set("Access-Control-Allow-Origin", "http://localhost:3000");
    response.headers.set("Access-Control-Allow-Methods", "GET");
    response.headers.set("Access-Control-Allow-Headers", "Content-Type");

    return response;

  } catch (error) {
    return NextResponse.json(
      { error: "Failed to read package.json" },
      { status: 500 }
    );
  }
}