import dbConnect from "../../../lib/db";
import Order from "../../../lib/models/Order";
import nodemailer from "nodemailer";



export async function POST(req) {
  await dbConnect();

  try {
    const { orderId, newStatus, customerEmail } = await req.json();

    if (!orderId || !newStatus || !customerEmail) {
      return new Response(JSON.stringify({ success: false, message: "Missing required fields" }), { status: 400 });
    }

    console.log("Notify API called with orderId:", orderId);

    const order = await Order.findById(orderId);
    if (!order) {
      console.error("Order not found for orderId:", orderId);
      return new Response(JSON.stringify({ success: false, message: "Order not found" }), { status: 404 });
    }

    console.log("Fetched order:", order);

    const orderIdString = order._id.toString();

    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const statusMessages = {
      processing: "Your order is being processed!",
      shipped: "Your order has been shipped! You'll receive tracking details soon.",
      delivered: "Your order has been delivered. Thank you for shopping with us!",
      cancelled: "Your order has been cancelled. Please contact support for more details.",
    };

    const htmlContent = `
      <h1>Order Status Update</h1>
      <p>Dear ${order.customer.firstName} ${order.customer.lastName},</p>
      <p>Your order #${orderIdString.slice(-6).toUpperCase()} has been updated to <strong>${newStatus}</strong>.</p>
      <p>${statusMessages[newStatus] || "Your order status has been updated."}</p>
      <h2>Order Details</h2>
      <ul>
        ${order.items
          .map(
            (item) => `
              <li>
                ${item.name} - Quantity: ${item.quantity} - Price: Rs. ${item.price.toFixed(0)}
              </li>
            `
          )
          .join("")}
      </ul>
      <p><strong>Total:</strong> Rs. ${order.pricing.total.toFixed(0)}</p>
      <p><strong>Order Date:</strong> ${new Date(order.orderDate).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })}</p>
      ${order.trackingNumber ? `<p><strong>Tracking Number:</strong> ${order.trackingNumber}</p>` : ""}
      <p>Thank you for shopping with The Chocolate Factory!</p>
    `;

    await transporter.sendMail({
      from: `"The Chocolate Factory" <${process.env.EMAIL_USER}>`,
      to: customerEmail,
      subject: `Order #${orderIdString.slice(-6).toUpperCase()} - Status Updated to ${newStatus}`,
      html: htmlContent,
    });

    return new Response(JSON.stringify({ success: true, message: "Email sent successfully" }), { status: 200 });
  } catch (error) {
    console.error("Error sending email:", error);
    return new Response(JSON.stringify({ success: false, message: "Failed to send email: " + error.message }), { status: 500 });
  }
}