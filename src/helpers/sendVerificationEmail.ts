import nodemailer from "nodemailer";

export async function sendVerificationEmail(
  email: string,
  username: string,
  otp: string
) {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD,
      },
    });

    // HTML email as a template string
    const htmlContent = `
      <div style="font-family: Arial, sans-serif; text-align: center; padding: 40px;">
        <h2>Hi ${username} 👋</h2>
        <p>Thanks for signing up! Use this verification code to complete your registration:</p>
        <p style="font-size: 32px; font-weight: bold; margin: 24px 0;">${otp}</p>
        <p>This code is valid for 10 minutes.</p>
        <p>If you didn't request this code, you can ignore this email safely.</p>
        <p style="font-size: 12px; color: #888; margin-top: 32px;">© ${new Date().getFullYear()} Annonymous Message</p>
      </div>
    `;

    await transporter.sendMail({
      from: `"Annonymous Message" <${process.env.EMAIL}>`,
      to: email,
      subject: "Verify your account",
      html: htmlContent,
    });

    return {
      success: true,
      message: "Verification email sent successfully",
    };
  } catch (error) {
    console.error("Error sending verification email:", error);
    return { success: false, message: "Failed to send email" };
  }
}
