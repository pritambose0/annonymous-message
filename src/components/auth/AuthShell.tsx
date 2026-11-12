import { Logo } from "@/components/Logo";

export default function AuthShell({ children }: { children: React.ReactNode }) {
  return (
    <main
      id="main-content"
      className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 pb-16 pt-28 sm:pt-32"
    >
      <div className="pointer-events-none absolute inset-0 bg-radial-fade" />
      <div className="pointer-events-none absolute inset-0 bg-grid opacity-[0.35] mask-fade-bottom" />
      <div className="relative w-full max-w-md">
        <div className="mb-8 flex justify-center">
          <Logo />
        </div>
        <div className="rounded-2xl border border-border bg-card/80 p-6 shadow-2xl shadow-black/40 backdrop-blur-xl sm:p-8">
          {children}
        </div>
        <p className="mt-6 text-center text-xs text-muted-foreground">
          Honest feedback, without the pressure of a name.
        </p>
      </div>
    </main>
  );
}
