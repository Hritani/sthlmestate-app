import { fetchStrapi } from '@/lib/strapi';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const about = await fetchStrapi('/about?populate[blocks][populate]=*&populate[AboutHero][populate]=*');
  return NextResponse.json(about)
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