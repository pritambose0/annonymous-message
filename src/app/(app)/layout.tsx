interface RootLayoutProps {
  children: React.ReactNode;
}

export default async function RootLayout({ children }: RootLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col pt-16">
      <div id="main-content" className="flex flex-1 flex-col">
        {children}
      </div>
    </div>
  );
}
