import {
  Html,
  Head,
  Font,
  Preview,
  Heading,
  Section,
  Text,
  Container,
} from "@react-email/components";

interface VerificationEmailProps {
  username: string;
  otp: string;
}

export default function VerificationEmail({
  username,
  otp,
}: VerificationEmailProps) {
  return (
    <Html lang="en" dir="ltr">
      <Head>
        <title>Verify Your Email</title>
        <Font
          fontFamily="Inter"
          fallbackFontFamily="Arial"
          webFont={{
            url: "https://fonts.googleapis.com/css2?family=Inter:wght@400;600&display=swap",
            format: "woff2",
          }}
          fontWeight={400}
          fontStyle="normal"
        />
      </Head>

      <Preview>Your verification code is: {otp}</Preview>

      <Section style={{ backgroundColor: "#f3f4f6", padding: "40px 0" }}>
        <Container
          style={{
            maxWidth: "480px",
            margin: "0 auto",
            backgroundColor: "#ffffff",
            borderRadius: "12px",
            padding: "32px",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)",
            fontFamily: "Inter, Arial, sans-serif",
          }}
        >
          <Heading
            as="h2"
            style={{
              fontSize: "22px",
              fontWeight: "600",
              marginBottom: "12px",
              color: "#111827",
              textAlign: "center",
            }}
          >
            Hi {username} 👋
          </Heading>

          <Text
            style={{
              fontSize: "16px",
              color: "#4B5563",
              lineHeight: "1.6",
              textAlign: "center",
            }}
          >
            Thanks for signing up! Use the verification code below to complete
            your registration:
          </Text>

          <Text
            style={{
              fontSize: "32px",
              fontWeight: "600",
              letterSpacing: "4px",
              color: "#111827",
              textAlign: "center",
              margin: "24px 0",
            }}
          >
            {otp}
          </Text>

          <Text
            style={{
              fontSize: "14px",
              color: "#6B7280",
              textAlign: "center",
              marginBottom: "16px",
            }}
          >
            This code is valid for 10 minutes.
          </Text>

          <Text
            style={{ fontSize: "14px", color: "#6B7280", textAlign: "center" }}
          >
            If you didn&apos;t request this code, you can safely ignore this
            email.
          </Text>

          <Text
            style={{
              fontSize: "12px",
              color: "#9CA3AF",
              marginTop: "32px",
              textAlign: "center",
            }}
          >
            © {new Date().getFullYear()} Annonymous Message
          </Text>
        </Container>
      </Section>
    </Html>
  );
}
