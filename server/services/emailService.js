const nodemailer = require('nodemailer'); 

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.example.com',
  port : process.env.SMTP_PORT || 587,
  secure : false,
  auth:{
    user: process.env.SMTP_USER ,
    pass: process.env.SMTP_PASS,
  },
});

transporter.verify((error, success)=>{
  if(error){
    console.log("❌ Email server connection error:",error);
  }else{
    console.log("✅ Email server is ready to send messages"); 
  }
});

const sendWelcomeEmail = async (email, name) => {
  try{
    const mailOptions ={
      from: `"XYZ Coffee shop" <${process.env.SMTP_FROM || "xyz@email.com"}>`,
      to: email,
      subject: "Welcome to XYZ Coffee Shop!☕",
      text: `<div style="font-family: Arial, sans-serif; max-width:600px;margin:0 auto; padding: 0px; background-color: #f9f9f9;">
        <div style = "background : linear-gradient(135deg, #d7706, #ea580c); padding: 40px 30px; text-align: center; color: white;">
        <p style = "color: #fef3c7; margin: 10px 0 0 0; font-size: 15px;">We're thrilled to have you here and your premium coffee experience starts here.</p>
        </div>
        <div style= "padding: 40px 30px ; background: white; margin: 0 25px;">
          <h2 style="color: #d97706; margin-top : 0; ">Hello ${name}!☕</h2>
           <p style="color: #374151; line-height: 1.6; font-size: 16px;">
              Thank you for joining the Brew & Bean family! We're excited to serve you the finest coffee experience with premium quality beans and exceptional service.
            </p>
            
            <div style="background: #fef3c7; padding: 20px; border-radius: 8px; margin: 30px 0;">
              <h3 style="color: #d97706; margin-top: 0;">What you can look forward to:</h3>
              <ul style="color: #374151; line-height: 1.8;">
                <li>🌟 Premium quality coffee from around the world</li>
                <li>🥐 Fresh pastries baked daily in-house</li>
                <li>📱 Easy online ordering and real-time tracking</li>
                <li>🎁 Exclusive member offers and loyalty rewards and cashback</li>
                <li>👨‍🍳 Expert baristas from around the world crafting perfect cups</li>
              </ul>
            </div>
            
            <div style="text-align: center; margin: 40px 0;">
              <a href="${process.env.FRONTEND_URL || ''}" 
                 style="background: linear-gradient(135deg, #d97706, #ea580c); color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; display: inline-block; font-weight: bold; font-size: 16px;">
                Start Ordering Now and Enjoy 10% Off Your First Purchase! and get free delivery as well as promo code to shop from different e-commerce sites
              </a>
            </div>
            
            <div style="border-top: 1px solid #e5e7eb; padding-top: 20px; margin-top: 30px;">
              <p style="color: #6b7280; font-size: 14px; margin: 0;">
                Need help? Contact us at <a href="mailto:helloxyz@email.com" style="color: #d97706;">helloxyz@email.com</a> or call 123-789-456
              </p>
            </div>
          </div>
          
          <div style="background: #374151; padding: 20px 30px; text-align: center; margin: 0 20px;">
            <p style="color: #9ca3af; margin: 0; font-size: 14px;">
              Happy brewing!<br>
              <strong style="color: #fbbf24;">The XYZ Coffee Shop Team</strong>
            </p>
          </div>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);
    console.log(`✅ Welcome email sent to ${email}`);
  } catch (error) {
    console.error('❌ Welcome email error:', error.message);
  }
};

// Send password reset email
const sendPasswordResetEmail = async (email, name, resetToken) => {
  try {
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;
    
    const mailOptions = {
      from: `"<XYZ Coffee Shop>" <${process.env.SMTP_FROM || 'noreplyxyz@email.com'}>`,
      to: email,
      subject: 'Password Reset Request - XYZ Coffee Shop',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #f9f9f9;">
          <div style="background: linear-gradient(135deg, #dc2626, #b91c1c); padding: 40px 30px; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 28px;">Password Reset Request</h1>
            <p style="color: #fecaca; margin: 10px 0 0 0; font-size: 16px;">Secure your XYZ Coffee Shop account</p>
          </div>
          
          <div style="padding: 40px 30px; background: white; margin: 0 20px;">
            <h2 style="color: #dc2626; margin-top: 0;">Hello ${name},</h2>
            <p style="color: #374151; line-height: 1.6; font-size: 16px;">
              We received a request to reset your password for your XYZ coffee shop account. If you didn't make this request, you can safely ignore this email.
            </p>
            
            <div style="background: #fef2f2; padding: 20px; border-radius: 8px; margin: 30px 0; border-left: 4px solid #dc2626;">
              <p style="color: #374151; margin: 0; font-size: 16px;">
                <strong>Important:</strong> This password reset link will expire in 5 minutes for security reasons so please reset your password within that time.
              </p>
            </div>
            
            <div style="text-align: center; margin: 40px 0;">
              <a href="${resetUrl}" 
                 style="background: linear-gradient(135deg, #dc2626, #b91c1c); color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; display: inline-block; font-weight: bold; font-size: 16px;">
                Reset Your Password within time.
              </a>
            </div>
            
            <p style="color: #6b7280; font-size: 14px; line-height: 1.6;">
              If the button doesn't work, copy and paste this link into your browser and hit enter and you will reset your there. :<br>
              <a href="${resetUrl}" style="color: #dc2626; word-break: break-all;">${resetUrl}</a>
            </p>
            
            <div style="border-top: 1px solid #e5e7eb; padding-top: 20px; margin-top: 30px;">
              <p style="color: #6b7280; font-size: 14px; margin: 0;">
                If you have any questions, contact us at <a href="mailto:helloxyz@email.com" style="color: #dc2626;">helloxyz@email.com</a>
              </p>
            </div>
          </div>
          
          <div style="background: #374151; padding: 20px 30px; text-align: center; margin: 0 20px;">
            <p style="color: #9ca3af; margin: 0; font-size: 14px;">
              Stay secure,<br>
              <strong style="color: #fbbf24;">The XYZ Security Team</strong>
            </p>
          </div>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);
    console.log(`✅ Password reset email sent to ${email}`);
  } catch (error) {
    console.error('❌ Password reset email error:', error.message);
    throw error;
  }
};

// Send order confirmation email
const sendOrderConfirmationEmail = async (email, order) => {
  try {
    const itemsList = order.items.map(item => 
      `<tr>
        <td style="padding: 10px; border-bottom: 1px solid #e5e7eb;">${item.name}</td>
        <td style="padding: 10px; border-bottom: 1px solid #e5e7eb; text-align: center;">${item.quantity}</td>
        <td style="padding: 10px; border-bottom: 1px solid #e5e7eb; text-align: right;">$${(item.price * item.quantity).toFixed(2)}</td>
      </tr>`
    ).join('');

    const mailOptions = {
      from: `"XYZ" <${process.env.SMTP_FROM || 'noreplyxyz@email.com'}>`,
      to: email,
      subject: `Order Confirmation #${order.orderNumber} ☕`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #f9f9f9;">
          <div style="background: linear-gradient(135deg, #059669, #047857); padding: 40px 30px; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 28px;">Order Confirmed! 🎉</h1>
            <p style="color: #a7f3d0; margin: 10px 0 0 0; font-size: 16px;">Your delicious order is being prepared we will further notify you once it's ready.</p>
          </div>
          
          <div style="padding: 40px 30px; background: white; margin: 0 20px;">
            <h2 style="color: #059669; margin-top: 0;">Thank you for your order!</h2>
            <p style="color: #374151; line-height: 1.6; font-size: 16px;">
              Your order has been received and our skilled baristas are preparing it with care. You'll receive updates as your order progresses.
              Thank you for your patience.
            </p>
            
            <div style="background: #f0fdf4; padding: 25px; border-radius: 8px; margin: 30px 0; border: 1px solid #bbf7d0;">
              <h3 style="margin-top: 0; color: #059669; font-size: 18px;">Order Details</h3>
              <div style="margin-bottom: 15px;">
                <strong style="color: #374151;">Order Number:</strong> <span style="color: #059669; font-weight: bold;">#${order.orderNumber}</span><br>
                <strong style="color: #374151;">Order Type:</strong> ${order.orderType.charAt(0).toUpperCase() + order.orderType.slice(1)}<br>
                <strong style="color: #374151;">Estimated Time:</strong> ${order.estimatedTime} minutes<br>
                <strong style="color: #374151;">Status:</strong> <span style="color: #059669; font-weight: bold;">${order.status.charAt(0).toUpperCase() + order.status.slice(1)}</span>
              </div>
              
              <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
                <thead>
                  <tr style="background: #e5e7eb;">
                    <th style="padding: 12px; text-align: left; color: #374151;">Item</th>
                    <th style="padding: 12px; text-align: center; color: #374151;">Qty</th>
                    <th style="padding: 12px; text-align: right; color: #374151;">Price</th>
                  </tr>
                </thead>
                <tbody>
                  ${itemsList}
                </tbody>
              </table>
              
              <div style="border-top: 2px solid #059669; padding-top: 15px; margin-top: 15px; text-align: right;">
                <p style="font-size: 20px; font-weight: bold; color: #059669; margin: 0;">
                  Total: $${order.total.toFixed(2)}
                </p>
              </div>
            </div>
            
            <div style="text-align: center; margin: 40px 0;">
              <a href="${process.env.FRONTEND_URL || ''}/#orders" 
                 style="background: linear-gradient(135deg, #059669, #047857); color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; display: inline-block; font-weight: bold; font-size: 16px;">
                Track Your Order here.
              </a>
            </div>
            
            <div style="background: #fef3c7; padding: 20px; border-radius: 8px; margin: 30px 0;">
              <p style="color: #92400e; margin: 0; font-size: 14px; text-align: center;">
                <strong>Pickup Instructions:</strong> Please bring this OTP or your order number when collecting your order.
              </p>
            </div>
            
            <div style="border-top: 1px solid #e5e7eb; padding-top: 20px; margin-top: 30px;">
              <p style="color: #6b7280; font-size: 14px; margin: 0;">
                Questions about your order? Contact us at <a href="mailto:helloxyz@email.com" style="color: #059669;">helloxyz@email.com</a> or call 123-789-4567
              </p>
            </div>
          </div>
          
          <div style="background: #374151; padding: 20px 30px; text-align: center; margin: 0 20px;">
            <p style="color: #9ca3af; margin: 0; font-size: 14px;">
              Enjoy your coffee!<br>
              <strong style="color: #fbbf24;">The XYZ Team</strong>
            </p>
          </div>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);
    console.log(`✅ Order confirmation email sent to ${email}`);
  } catch (error) {
    console.error('❌ Order confirmation email error:', error.message);
  }
};

module.exports = {
  sendWelcomeEmail,
  sendPasswordResetEmail,
  sendOrderConfirmationEmail
};
