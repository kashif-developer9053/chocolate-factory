import { NextResponse } from 'next/server';
import dbConnect from '../../../lib/db'; // Adjust the path as necessary
import Category from '../../../lib/models/Category'; // Adjust the path as necessary    
import { writeFile } from 'fs/promises';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

// GET single category (optional)
export async function GET(req, { params }) {
  await dbConnect();
  const { id } = params;

  try {
    const category = await Category.findById(id).populate('parent');
    return NextResponse.json({ success: true, data: category });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Category not found' }, { status: 404 });
  }
}

// UPDATE category
export async function PUT(req, { params }) {
  await dbConnect();
  const { id } = params;

  try {
    const formData = await req.formData();
    const updates = {
      name: formData.get('name'),
      slug: formData.get('slug'),
      description: formData.get('description') || '',
      parent: formData.get('parent') || null,
    };

    // Handle image upload if new image provided
    const image = formData.get('image');
    if (image && typeof image.name === 'string') {
      const ext = path.extname(image.name);
      const filename = `${uuidv4()}${ext}`;
      const buffer = Buffer.from(await image.arrayBuffer());
      const uploadPath = path.join(process.cwd(), 'public/images', filename);
      await writeFile(uploadPath, buffer);
      updates.image = filename;
    }

    const updated = await Category.findByIdAndUpdate(id, updates, { new: true });

    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    console.error('UPDATE error:', error);
    return NextResponse.json({ success: false, message: 'Error updating category' }, { status: 500 });
  }
}

// DELETE category
export async function DELETE(req, { params }) {
  await dbConnect();
  const { id } = params;

  try {
    await Category.findByIdAndDelete(id);
    return NextResponse.json({ success: true, message: 'Category deleted' });
  } catch (error) {
    console.error('DELETE error:', error);
    return NextResponse.json({ success: false, message: 'Error deleting category' }, { status: 500 });
  }
}
