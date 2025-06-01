// /app/api/auth/register/route.js
import { NextResponse } from 'next/server';
import connectDB from '../../lib/db';
import User from '../../lib/models/User';
import { generateToken, setTokenCookie } from '../../lib/auth';

import { formatError, validateEmail, validatePassword, validatePhone, validateName, sanitizeInput } from '../../lib/utils';

export async function POST(req) {
  try {
    await connectDB();
    
    const { name, email, phone, password } = await req.json();
    
    // Sanitize inputs
    const sanitizedName = sanitizeInput(name);
    const sanitizedEmail = sanitizeInput(email);
    const sanitizedPhone = sanitizeInput(phone);
    
    // Basic required field validation
    if (!sanitizedName || !sanitizedEmail || !sanitizedPhone || !password) {
      return NextResponse.json(
        { success: false, message: 'Please provide all required fields' },
        { status: 400 }
      );
    }

    // Detailed validation using utils
    const nameValidation = validateName(sanitizedName);
    if (!nameValidation.isValid) {
      return NextResponse.json(
        { success: false, message: nameValidation.message },
        { status: 400 }
      );
    }

    if (!validateEmail(sanitizedEmail)) {
      return NextResponse.json(
        { success: false, message: 'Please provide a valid email address' },
        { status: 400 }
      );
    }

    const passwordValidation = validatePassword(password);
    if (!passwordValidation.isValid) {
      return NextResponse.json(
        { success: false, message: passwordValidation.message },
        { status: 400 }
      );
    }

    if (!validatePhone(sanitizedPhone)) {
      return NextResponse.json(
        { success: false, message: 'Please provide a valid phone number (e.g., 03001234567 or +923001234567)' },
        { status: 400 }
      );
    }
    
    // Check if user already exists
    const userExists = await User.findOne({ 
      $or: [
        { email: sanitizedEmail.toLowerCase() }, 
        { phone: sanitizedPhone }
      ] 
    });
    
    if (userExists) {
      if (userExists.email === sanitizedEmail.toLowerCase()) {
        return NextResponse.json(
          { success: false, message: 'An account with this email already exists' },
          { status: 400 }
        );
      }
      if (userExists.phone === sanitizedPhone) {
        return NextResponse.json(
          { success: false, message: 'An account with this phone number already exists' },
          { status: 400 }
        );
      }
    }
    
    // Create user
    const user = await User.create({
      name: sanitizedName.trim(),
      email: sanitizedEmail.toLowerCase().trim(),
      phone: sanitizedPhone.trim(),
      password,
    });
    
    // Generate token
    const token = generateToken(user._id);
    
    // Create response
    const response = NextResponse.json({
      success: true,
      message: 'Registration successful! Welcome to ShopEase.',
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
      },
    }, { status: 201 });
    
    // Set cookie
    setTokenCookie(response, token);
    
    return response;
  } catch (error) {
    console.error('Register error:', error);
    return NextResponse.json(
      { success: false, message: formatError(error) },
      { status: 500 }
    );
  }
}
