import { resend } from "@/lib/resend";
import { ApiResponse } from "@/types/ApiResponse";
import VerificationEmail from "../../emails/VerificationEmail";

export async function sendVerificationEmail(
  email: string,
  username: string,
  verifyCode: string
): Promise<ApiResponse> {
  try {
    const response = await resend.emails.send({
      from: `${process.env.RESEND_FROM_EMAIL}`,
      to: `${process.env.RESEND_TO_EMAIL}`,
      subject: "Annonymous Message | Verification Code",
      react: VerificationEmail({ username, otp: verifyCode }),
    });

    if (!response.data?.id)
      return {
        success: false,
        message: response.error?.message || "Failed to send verification email",
      };

    return {
      success: true,
      message: "Verification email sent successfully",
    };
  } catch (error) {
    console.error("Error sending verification email", error);
    return {
      success: false,
      message: "Failed to send verification email",
    };
  }
}
