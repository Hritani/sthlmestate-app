import { ModeToggle } from "@/components/theme-mode";

export default function Home() {
  return (
    <main className="min-h-screen">
      <div className="container p-4">
        <h1>Hello World</h1>
        <div>
          <ModeToggle />
        </div>
      </div>
    </main>
  );
}
