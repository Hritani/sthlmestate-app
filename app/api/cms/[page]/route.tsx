import { fetchStrapi } from '@/lib/strapi';
import { NextResponse } from 'next/server';

export async function GET(request: Request, { params }: { params: { page: string } }) {
  const { page } = await params
  const pageData = await fetchStrapi(`/${page}?populate[blocks][populate]=*`);
  return NextResponse.json(pageData)
}

// Add configuration if needed
export const config = {
  api: {
    // Increase body size limit if needed
    bodyParser: {
      sizeLimit: '1mb',
    },
    // Increase response size limit if needed
    responseLimit: '4mb',
  },
}