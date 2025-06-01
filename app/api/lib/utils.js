// /app/lib/utils.js
export const formatError = (error) => {
  let message = error.message || 'Server Error';
  
  // Mongoose duplicate key error
  if (error.code === 11000) {
    message = `Duplicate field value entered: ${Object.keys(error.keyValue).join(', ')}`;
  }
  
  // Mongoose validation error
  if (error.name === 'ValidationError') {
    message = Object.values(error.errors).map(val => val.message).join(', ');
  }
  
  return message;
};

export const calculateTotals = (items) => {
  const itemsPrice = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const taxRate = 0.15; // 15% tax rate
  const taxPrice = itemsPrice * taxRate;
  const shippingPrice = itemsPrice > 100 ? 0 : 10; // Free shipping over $100
  const totalPrice = itemsPrice + taxPrice + shippingPrice;
  
  return {
    itemsPrice: parseFloat(itemsPrice.toFixed(2)),
    taxPrice: parseFloat(taxPrice.toFixed(2)),
    shippingPrice: parseFloat(shippingPrice.toFixed(2)),
    totalPrice: parseFloat(totalPrice.toFixed(2)),
  };
};

// Email validation
export const validateEmail = (email) => {
  if (!email) return false;
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const isValidFormat = emailRegex.test(email);
  
  // Additional checks
  const isValidLength = email.length <= 254; // RFC 5321 limit
  const localPart = email.split('@')[0];
  const isValidLocalLength = localPart && localPart.length <= 64; // RFC 5321 limit
  
  return isValidFormat && isValidLength && isValidLocalLength;
};

// Phone validation (supports Pakistani and international formats)
export const validatePhone = (phone) => {
  if (!phone) return false;
  
  // Remove all spaces, dashes, parentheses, and plus signs for validation
  const cleanPhone = phone.replace(/[\s\-\(\)\+]/g, '');
  
  // Pakistani phone formats:
  // 03001234567 (11 digits starting with 03)
  // 923001234567 (12 digits starting with 92)
  // International formats: 10-15 digits
  const pakistaniMobileRegex = /^(03[0-9]{9})$/; // 03XXXXXXXXX
  const pakistaniWithCountryCode = /^(923[0-9]{9})$/; // 923XXXXXXXXX
  const internationalRegex = /^[0-9]{10,15}$/; // General international format
  
  return (
    pakistaniMobileRegex.test(cleanPhone) ||
    pakistaniWithCountryCode.test(cleanPhone) ||
    internationalRegex.test(cleanPhone)
  );
};

// Password validation with detailed checks
export const validatePassword = (password) => {
  if (!password) return { isValid: false, message: 'Password is required' };
  
  const minLength = 6;
  const maxLength = 128;
  
  if (password.length < minLength) {
    return { isValid: false, message: `Password must be at least ${minLength} characters long` };
  }
  
  if (password.length > maxLength) {
    return { isValid: false, message: `Password cannot exceed ${maxLength} characters` };
  }
  
  // Check for at least one letter and one number (optional but recommended)
  const hasLetter = /[a-zA-Z]/.test(password);
  const hasNumber = /\d/.test(password);
  
  if (!hasLetter || !hasNumber) {
    return { 
      isValid: false, 
      message: 'Password should contain at least one letter and one number for better security' 
    };
  }
  
  return { isValid: true, message: 'Password is valid' };
};

// Name validation
export const validateName = (name) => {
  if (!name) return { isValid: false, message: 'Name is required' };
  
  const trimmedName = name.trim();
  
  if (trimmedName.length < 2) {
    return { isValid: false, message: 'Name must be at least 2 characters long' };
  }
  
  if (trimmedName.length > 50) {
    return { isValid: false, message: 'Name cannot exceed 50 characters' };
  }
  
  // Check for valid characters (letters, spaces, hyphens, apostrophes)
  const nameRegex = /^[a-zA-Z\s\-']+$/;
  if (!nameRegex.test(trimmedName)) {
    return { isValid: false, message: 'Name can only contain letters, spaces, hyphens, and apostrophes' };
  }
  
  return { isValid: true, message: 'Name is valid' };
};

// Comprehensive form validation
export const validateRegistrationForm = (formData) => {
  const errors = {};
  
  // Validate name
  const nameValidation = validateName(formData.name);
  if (!nameValidation.isValid) {
    errors.name = nameValidation.message;
  }
  
  // Validate email
  if (!validateEmail(formData.email)) {
    errors.email = 'Please enter a valid email address';
  }
  
  // Validate phone
  if (!validatePhone(formData.phone)) {
    errors.phone = 'Please enter a valid phone number (e.g., 03001234567 or +923001234567)';
  }
  
  // Validate password
  const passwordValidation = validatePassword(formData.password);
  if (!passwordValidation.isValid) {
    errors.password = passwordValidation.message;
  }
  
  // Check terms agreement
  if (!formData.agreeTerms) {
    errors.terms = 'You must agree to the Terms of Service and Privacy Policy';
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

// Login form validation
export const validateLoginForm = (formData) => {
  const errors = {};
  
  // Validate email
  if (!formData.email) {
    errors.email = 'Email is required';
  } else if (!validateEmail(formData.email)) {
    errors.email = 'Please enter a valid email address';
  }
  
  // Validate password
  if (!formData.password) {
    errors.password = 'Password is required';
  } else if (formData.password.length < 6) {
    errors.password = 'Password must be at least 6 characters long';
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

// Format phone number for display (add proper formatting)
export const formatPhoneForDisplay = (phone) => {
  if (!phone) return '';
  
  const cleanPhone = phone.replace(/[\s\-\(\)\+]/g, '');
  
  // Pakistani mobile number formatting
  if (cleanPhone.match(/^03[0-9]{9}$/)) {
    return cleanPhone.replace(/^(03[0-9]{2})([0-9]{3})([0-9]{4})$/, '$1-$2-$3');
  }
  
  // Pakistani with country code
  if (cleanPhone.match(/^923[0-9]{9}$/)) {
    return cleanPhone.replace(/^(92)(3[0-9]{2})([0-9]{3})([0-9]{4})$/, '+$1 $2-$3-$4');
  }
  
  // Return as-is for other formats
  return phone;
};

// Sanitize input (remove dangerous characters)
export const sanitizeInput = (input) => {
  if (typeof input !== 'string') return input;
  
  return input
    .trim()
    .replace(/[<>\"']/g, '') // Remove potentially dangerous characters
    .substring(0, 1000); // Limit length
};

// Check password strength
export const getPasswordStrength = (password) => {
  if (!password) return { strength: 'empty', score: 0, message: 'Enter a password' };
  
  let score = 0;
  const checks = {
    length: password.length >= 8,
    lowercase: /[a-z]/.test(password),
    uppercase: /[A-Z]/.test(password),
    numbers: /\d/.test(password),
    symbols: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password),
  };
  
  score += checks.length ? 1 : 0;
  score += checks.lowercase ? 1 : 0;
  score += checks.uppercase ? 1 : 0;
  score += checks.numbers ? 1 : 0;
  score += checks.symbols ? 1 : 0;
  
  if (score <= 2) return { strength: 'weak', score, message: 'Weak password' };
  if (score <= 3) return { strength: 'medium', score, message: 'Medium strength' };
  if (score <= 4) return { strength: 'strong', score, message: 'Strong password' };
  return { strength: 'very-strong', score, message: 'Very strong password' };
};