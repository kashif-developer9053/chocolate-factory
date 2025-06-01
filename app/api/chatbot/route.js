// /app/api/chatbot/route.js
import { NextResponse } from 'next/server';
import connectDB from '@/app/lib/db';
import Product from '@/app/lib/models/Product';
import ChatMessage from '@/app/lib/models/ChatMessage';
import { formatError } from '@/app/lib/utils';

// Simple chatbot implementation
export async function POST(req) {
  try {
    await connectDB();
    
    const { message, sessionId, userId } = await req.json();
    
    if (!message || !sessionId) {
      return NextResponse.json(
        { success: false, message: 'Message and session ID are required' },
        { status: 400 }
      );
    }
    
    // Store user message
    await ChatMessage.create({
      user: userId || null,
      sessionId,
      role: 'user',
      content: message,
    });
    
    // Process message and generate response
    let botResponse = '';
    
    // Simple keyword-based responses
    const lowerMessage = message.toLowerCase();
    
    if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('hey')) {
      botResponse = 'Hello! How can I help you today?';
    } else if (lowerMessage.includes('help')) {
      botResponse = 'I can help with product information, order status, and general questions. What do you need assistance with?';
    } else if (lowerMessage.includes('shipping') || lowerMessage.includes('delivery')) {
      botResponse = 'We offer free shipping on orders over $100. Standard shipping takes 3-5 business days, and express shipping takes 1-2 business days.';
    } else if (lowerMessage.includes('return') || lowerMessage.includes('refund')) {
      botResponse = 'Our return policy allows returns within 30 days of purchase. Please contact our support team with your order number for assistance.';
    } else if (lowerMessage.includes('payment') || lowerMessage.includes('pay')) {
      botResponse = 'We accept credit cards, PayPal, and cash on delivery (COD) as payment methods.';
    } else if (lowerMessage.includes('order status') || lowerMessage.includes('track')) {
      botResponse = 'To check your order status, please provide your order number. You can also view your order history in your account dashboard.';
    } else if (lowerMessage.includes('product') || lowerMessage.includes('item')) {
      // Try to find product information
      const productKeywords = message.split(' ').filter(word => word.length > 3);
      
      if (productKeywords.length > 0) {
        const searchQuery = { $text: { $search: productKeywords.join(' ') } };
        const products = await Product.find(searchQuery).limit(3);
        
        if (products.length > 0) {
          botResponse = 'I found these products that might interest you:\n\n';
          products.forEach((product, index) => {
            botResponse += `${index + 1}. ${product.name} - $${product.price}\n`;
          });
          botResponse += '\nWould you like more information about any of these products?';
        } else {
          botResponse = "I couldn't find specific product information. Please try describing the product differently or browse our catalog.";
        }
      } else {
        botResponse = 'We have a wide range of products. Could you please be more specific about what you are looking for?';
      }
    } else if (lowerMessage.includes('contact') || lowerMessage.includes('speak') || lowerMessage.includes('human')) {
      botResponse = 'Would you like to speak with a customer service representative? You can contact our support team at support@example.com or use the contact form on our website.';
    } else if (lowerMessage.includes('thank')) {
      botResponse = "You're welcome! Is there anything else I can help you with?";
    } else {
      botResponse = "I'm not sure I understand. Could you please rephrase your question? I can help with product information, shipping, returns, and other common inquiries.";
    }
    
    // Store bot response
    const chatMessage = await ChatMessage.create({
      user: userId || null,
      sessionId,
      role: 'bot',
      content: botResponse,
    });
    
    return NextResponse.json({
      success: true,
      data: {
        message: chatMessage.content,
        timestamp: chatMessage.createdAt,
      },
    });
  } catch (error) {
    console.error('Chatbot error:', error);
    return NextResponse.json(
      { success: false, message: formatError(error) },
      { status: 500 }
    );
  }
}

// Get chat history
export async function GET(req) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(req.url);
    const sessionId = searchParams.get('sessionId');
    
    if (!sessionId) {
      return NextResponse.json(
        { success: false, message: 'Session ID is required' },
        { status: 400 }
      );
    }
    
    const messages = await ChatMessage.find({ sessionId })
      .sort({ createdAt: 1 });
    
    return NextResponse.json({
      success: true,
      data: messages,
    });
  } catch (error) {
    console.error('Get chat history error:', error);
    return NextResponse.json(
      { success: false, message: formatError(error) },
      { status: 500 }
    );
  }
}