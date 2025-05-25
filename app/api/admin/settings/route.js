// /app/api/admin/settings/route.js
import { NextResponse } from 'next/server';
import connectDB from '@/app/lib/db';
import Setting from '@/app/lib/models/Setting';
import { admin } from '@/app/lib/auth';
import { formatError } from '@/app/lib/utils';

// Get settings (admin only)
export async function GET(req) {
  try {
    await connectDB();
    
    const result = await admin(req);
    
    if (result instanceof NextResponse) {
      return result;
    }
    
    const { searchParams } = new URL(req.url);
    const group = searchParams.get('group') || '';
    
    // Build query
    const query = {};
    
    if (group) {
      query.group = group;
    }
    
    const settings = await Setting.find(query);
    
    // Convert to key-value object
    const settingsObj = {};
    settings.forEach(setting => {
      settingsObj[setting.key] = setting.value;
    });
    
    return NextResponse.json({
      success: true,
      data: settingsObj,
    });
  } catch (error) {
    console.error('Get settings error:', error);
    return NextResponse.json(
      { success: false, message: formatError(error) },
      { status: 500 }
    );
  }
}

// Update settings (admin only)
export async function PUT(req) {
  try {
    await connectDB();
    
    const result = await admin(req);
    
    if (result instanceof NextResponse) {
      return result;
    }
    
    const settings = await req.json();
    
    // Update each setting
    const updatedSettings = {};
    
    for (const [key, value] of Object.entries(settings)) {
      let setting = await Setting.findOne({ key });
      
      if (setting) {
        setting.value = value;
        await setting.save();
      } else {
        // Create new setting
        setting = await Setting.create({
          key,
          value,
          group: settings.group || 'general',
        });
      }
      
      updatedSettings[key] = setting.value;
    }
    
    return NextResponse.json({
      success: true,
      data: updatedSettings,
    });
  } catch (error) {
    console.error('Update settings error:', error);
    return NextResponse.json(
      { success: false, message: formatError(error) },
      { status: 500 }
    );
  }
}