import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

const FROM_EMAIL = 'Booti Natural <onboarding@resend.dev>';
const ADMIN_EMAIL = 'asgharaliissyed@gmail.com';

// Generate HTML for customer email
function getCustomerEmailHtml(order: any) {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
      <div style="text-align: center; padding: 20px 0;">
        <h1 style="color: #1B3B1A; margin: 0;">Booti Natural</h1>
      </div>
      
      <div style="background-color: #F9FAFB; padding: 30px; border-radius: 8px;">
        <h2 style="color: #1B3B1A; margin-top: 0;">Order Confirmed!</h2>
        <p>Hi ${order.customerName.split(' ')[0]},</p>
        <p>Thank you for shopping with Booti Natural. We've received your order and are preparing it for shipment.</p>
        
        <div style="background-color: white; padding: 20px; border-radius: 6px; margin: 20px 0;">
          <h3 style="margin-top: 0; color: #1B3B1A;">Order Details</h3>
          <table style="width: 100%; border-collapse: collapse;">
            ${order.items.map((item: any) => `
              <tr>
                <td style="padding: 10px 0; border-bottom: 1px solid #E5E7EB;">
                  <strong>${item.name}</strong><br>
                  <span style="color: #6B7280; font-size: 14px;">Qty: ${item.quantity}</span>
                </td>
                <td style="padding: 10px 0; border-bottom: 1px solid #E5E7EB; text-align: right;">
                  Rs. ${(item.price * item.quantity).toLocaleString()}
                </td>
              </tr>
            `).join('')}
          </table>
          
          <table style="width: 100%; margin-top: 15px;">
            <tr>
              <td style="padding: 5px 0; color: #6B7280;">Subtotal</td>
              <td style="padding: 5px 0; text-align: right;">Rs. ${(order.subtotal || order.total).toLocaleString()}</td>
            </tr>
            <tr>
              <td style="padding: 5px 0; color: #6B7280;">Shipping</td>
              <td style="padding: 5px 0; text-align: right;">Rs. ${order.shipping?.toLocaleString() || '0'}</td>
            </tr>
            <tr>
              <td style="padding: 10px 0; font-weight: bold; font-size: 18px; border-top: 2px solid #1B3B1A;">Total</td>
              <td style="padding: 10px 0; text-align: right; font-weight: bold; font-size: 18px; border-top: 2px solid #1B3B1A;">
                Rs. ${order.total.toLocaleString()}
              </td>
            </tr>
          </table>
        </div>

        <div style="margin-top: 20px;">
          <h3 style="color: #1B3B1A; margin-bottom: 10px;">Delivery Address</h3>
          <p style="margin: 0; color: #4B5563;">
            ${order.address}<br>
            ${order.city} ${order.postalCode}<br>
            ${order.phone}
          </p>
        </div>
      </div>
      
      <div style="text-align: center; padding: 20px; font-size: 14px; color: #6B7280;">
        <p>If you have any questions, reply to this email or contact us at support@bootinatural.com</p>
      </div>
    </div>
  `;
}

// Generate HTML for admin email
function getAdminEmailHtml(order: any) {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
      <h2 style="color: #1B3B1A;">New Order Received!</h2>
      <p>A new order has been placed on Booti Natural.</p>
      
      <div style="background-color: #F9FAFB; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <p><strong>Customer:</strong> ${order.customerName} (${order.customerEmail})</p>
        <p><strong>Phone:</strong> ${order.phone}</p>
        <p><strong>Total:</strong> Rs. ${order.total.toLocaleString()}</p>
        <p><strong>Payment Method:</strong> ${order.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Bank Transfer'}</p>
      </div>
      
      <p>Please check the admin panel to view full order details and process it.</p>
    </div>
  `;
}

export async function sendOrderEmails(order: any) {
  if (!process.env.RESEND_API_KEY) {
    console.log('No RESEND_API_KEY found, skipping emails');
    return;
  }

  try {
    // 1. Send confirmation to customer
    if (order.customerEmail) {
      await resend.emails.send({
        from: FROM_EMAIL,
        to: order.customerEmail,
        subject: 'Order Confirmed - Booti Natural',
        html: getCustomerEmailHtml(order),
      });
      console.log('Customer confirmation email sent');
    }

    // 2. Send notification to admin
    await resend.emails.send({
      from: FROM_EMAIL,
      to: ADMIN_EMAIL,
      subject: `New Order: Rs. ${order.total.toLocaleString()} - Booti Natural`,
      html: getAdminEmailHtml(order),
    });
    console.log('Admin notification email sent');

  } catch (error) {
    console.error('Error sending emails:', error);
    // Don't throw error to prevent order completion from failing if email fails
  }
}
