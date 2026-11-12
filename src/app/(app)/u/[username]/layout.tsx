import type { Metadata } from "next";

type Props = {
  params: Promise<{ username: string }>;
  children: React.ReactNode;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { username } = await params;
  const title = `Send @${username} an anonymous message`;
  const description = `Send @${username} an anonymous message on Mystery Message. Your identity stays private — they only see what you write.`;

  return {
    title,
    description,
    alternates: {
      canonical: `/u/${username}`,
    },
    openGraph: {
      type: "website",
      title,
      description,
      url: `/u/${username}`,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default function PublicProfileLayout({ children }: Props) {
  return children;
}
