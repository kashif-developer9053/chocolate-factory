import { NextResponse } from "next/server";
import connectDB from "../../lib/db";
import Setting from "../../lib/models/Setting";
import { admin } from "../../lib/auth";
import { formatError } from "../../lib/utils";



export async function GET(req) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const key = searchParams.get("key");

    // Skip authentication for logoUrl
    if (key !== "logoUrl") {
      const result = await admin(req);
      if (result instanceof NextResponse) {
        return result;
      }
    }

    const query = key ? { key } : {};
    const settings = await Setting.find(query);
    const settingsObj = {};
    settings.forEach((setting) => {
      settingsObj[setting.key] = setting.value;
    });

    return NextResponse.json({
      success: true,
      data: settingsObj,
    });
  } catch (error) {
    console.error("Get settings error:", error);
    return NextResponse.json(
      { success: false, message: formatError(error) },
      { status: 500 }
    );
  }
}


export async function PUT(req) {
  try {
    await connectDB();
    const result = await admin(req);
    if (result instanceof NextResponse) {
      return result;
    }

    const { key, logo } = await req.json();

    if (!key || key !== "logoUrl") {
      console.error("Invalid or missing key:", key);
      return NextResponse.json(
        { success: false, message: "Invalid or missing key" },
        { status: 400 }
      );
    }

    if (!logo || !logo.startsWith("data:image/")) {
      console.error("No valid logo provided");
      return NextResponse.json(
        { success: false, message: "No logo file provided" },
        { status: 400 }
      );
    }

    let setting = await Setting.findOne({ key: "logoUrl" });
    if (setting) {
      setting.value = logo; // Store Base64 string
      setting.updatedAt = Date.now();
      await setting.save();
    } else {
      setting = await Setting.create({
        key: "logoUrl",
        value: logo,
        group: "appearance",
      });
    }

    return NextResponse.json({
      success: true,
      data: { logoUrl: setting.value },
    });
  } catch (error) {
    console.error("Update settings error:", error);
    return NextResponse.json(
      { success: false, message: formatError(error) },
      { status: 500 }
    );
  }
}