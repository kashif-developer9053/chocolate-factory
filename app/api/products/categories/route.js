// app/api/products/categories/route.js
import { NextResponse } from 'next/server';
import connectDB from '../../lib/db';
import Category from '../../lib/models/Category';
import Product from '../../lib/models/Product';
import { formatError } from '../../lib/utils';
import fs from 'fs';
import path from 'path';

export async function GET(req) {
  try {
    await connectDB();
    console.log('Connected to database for categories');

    const categories = await Category.find({}).sort({ name: 1 }).lean();
    console.log('Fetched categories:', categories);

    if (!categories || categories.length === 0) {
      console.log('No categories found');
      return NextResponse.json({
        success: true,
        data: [],
      });
    }

    const categoriesWithCounts = await Promise.all(
      categories.map(async (category) => {
        try {
          const productCount = await Product.countDocuments({ category: category._id });
          return { ...category, productCount };
        } catch (error) {
          console.error(`Error counting products for category ${category._id}:`, error.message);
          return { ...category, productCount: 0 };
        }
      })
    );

    console.log('Categories with counts:', categoriesWithCounts);

    return NextResponse.json({
      success: true,
      data: categoriesWithCounts,
    });
  } catch (error) {
    console.error('Get categories error:', error.message, error.stack);
    return NextResponse.json(
      { success: false, message: formatError(error) || 'Internal Server Error' },
      { status: 500 }
    );
  }
}

export async function POST(req) {
  try {
    await connectDB();
    const body = await req.json();
    const { name, slug, description, parent, imageBase64 } = body;

    let imagePath = null;
    if (imageBase64) {
      const matches = imageBase64.match(/^data:(image\/\w+);base64,(.+)$/);
      if (!matches) {
        return NextResponse.json({ success: false, message: 'Invalid image data' }, { status: 400 });
      }

      const ext = matches[1].split('/')[1];
      const data = matches[2];
      const buffer = Buffer.from(data, 'base64');

      const filename = `${Date.now()}.${ext}`;
      const filePath = path.join(process.cwd(), 'public/images', filename);

      await fs.promises.writeFile(filePath, buffer);
      imagePath = `/images/${filename}`;
    }

    const category = new Category({
      name,
      slug,
      description,
      parent: parent || null,
      image: imagePath,
    });

    await category.save();

    return NextResponse.json({ success: true, data: category });
  } catch (error) {
    console.error('Error creating category:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Server error' },
      { status: 500 }
    );
  }
}