import jwt from "jsonwebtoken";
import transporter from "./nodemailer";

export async function sendVerificationEmail(userId: string, email: string) {
  // Create a JWT token valid for 1 day
  const token = jwt.sign({ userId }, process.env.JWT_SECRET as string, {
    expiresIn: "1d",
  });
  const verifyUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/verify-email?token=${token}` as string;

  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Verify Your Email",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
        <h2 style="color: #333;">Verify Your Email Address</h2>
        <p style="color: #555;">Thank you for registering with Animeon. Please click the button below to verify your email address.</p>
        <a href="${verifyUrl}" style="display: inline-block; padding: 10px 20px; margin: 20px 0; font-size: 16px; color: #fff; background-color: #ff025b; border-radius: 5px; text-decoration: none;">Verify Email</a>
        <p style="color: #555;">If you did not create an account, no further action is required.</p>
        <p style="color: #555;">Regards,<br/>Animeon Team</p>
      </div>
    `,
  });
}

export async function sendPasswordResetEmail(userId: string, email: string) {
  // Create a JWT token valid for 1 hour
  const token = jwt.sign({ userId }, process.env.JWT_SECRET!, {
    expiresIn: "1h",
  });
  const resetUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/reset-password?token=${token}`;

  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Reset Your Password",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
        <h2 style="color: #333;">Reset Your Password</h2>
        <p style="color: #555;">We received a request to reset your password. Click the button below to reset it.</p>
        <a href="${resetUrl}" style="display: inline-block; padding: 10px 20px; margin: 20px 0; font-size: 16px; color: #fff; background-color: #ff025b; border-radius: 5px; text-decoration: none;">Reset Password</a>
        <p style="color: #555;">If you did not request a password reset, please ignore this email.</p>
        <p style="color: #555;">Regards,<br/>Animeon Team</p>
      </div>
    `,
  });
}