import { updateStrapi } from '@/lib/strapi';
import { NextResponse } from 'next/server';

interface PageProps {
  params: { type: string|null }
}

export async function PUT(request: { json: () => any; }, { params }: PageProps) {
  try {
    // Parse the incoming request body
    const body = await request.json();
    console.log(body);
    
    const { type } = await params
    
    // Extract the type parameter and payload
    const { data } = body;

    if (!type || !data) {
      return NextResponse.json(
        { error: 'Type and data are required.' },
        { status: 400 }
      );
    }

    // Validate the type to ensure it's a known single type
    const validSingleTypes = ['about', 'home'];
    if (!validSingleTypes.includes(type)) {
      return NextResponse.json(
        { error: 'Invalid single type specified.' },
        { status: 400 }
      );
    }

    // const url = `${process.env.NEXT_PUBLIC_STRAPI_API_URL}/api/${type}`
    // console.log(url);
    // Update the single type using Strapi's API
    const updateTypeData = await updateStrapi(`/${type}`, data);

    if (!updateTypeData.ok) {
      return NextResponse.json(updateTypeData, { status: updateTypeData.status });
    }

    console.log(updateTypeData);
    

    // const updatedData = await updateTypeData.json();

    return NextResponse.json({
      message: 'Single type updated successfully',
      data: updateTypeData,
    });
  } catch (error) {
    console.error('Error updating single type:', error);
    return NextResponse.json(
      { error: 'An error occurred while updating the single type.' },
      { status: 500 }
    );
  }
}

// Add configuration if needed
export const config = {
  api: {
    // Increase body size limit if needed
    bodyParser: {
      sizeLimit: '100mb',
    },
    // Increase response size limit if needed
    responseLimit: '400mb',
  },
}