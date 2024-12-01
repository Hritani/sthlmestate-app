import { ModeToggle } from "@/components/theme-mode";
import { notFound } from "next/navigation";

export default async function Home() {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
  const pageResponse = await fetch(`${baseUrl}/api/cms/home`);

  if (!pageResponse.ok) {
    throw new Error('Failed to fetch content');
  }

  if (pageResponse.status === 404) {
      console.log('Not in List');
      notFound()
  }

  const pageData = await pageResponse.json();
  console.log(pageData);

  return (
    <main className="min-h-screen">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div>
              {pageData ? (
                  <h1>{pageData.data.hero_title}</h1>
              ) : (
                  <p>Not Found</p>
              )}
          </div>
      </div>
    </main>
  );
}
