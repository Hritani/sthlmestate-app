import { notFound } from 'next/navigation';
import { useState } from 'react';

const pages = [
    { id: 'home', slug: '' },
    { id: 'about', slug: 'om-oss' },
];

interface PageProps {
    params: { page: string|null }
}

const DynamicPage = async ({ params }: PageProps) => {
    const { page } = await params;
    let foundPage = pages.find(p => p.slug === page);
    if (!page) {
        foundPage = pages[0];
    }

    if (!foundPage) {
        console.log('Not in List');
        notFound()
    }
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const pageResponse = await fetch(`${baseUrl}/api/cms/${foundPage.id}`);

    // console.log(page);
    // console.log(pageResponse);

    if (!pageResponse.ok) {
        throw new Error('Failed to fetch content');
    }

    if (pageResponse.status === 404) {
        console.log('Not in List');
        notFound()
    }

    const pageData = await pageResponse.json();
    // console.log(pageData);

    return (
        <main className="min-h-screen">
            <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div>
                    {pageData ? (
                        <h1>{pageData.data.title}</h1>
                    ) : (
                        <p>Not Found</p>
                    )}
                </div>
            </div>
        </main>
    );
};

export default DynamicPage;