import { NextResponse } from 'next/server'

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = await params
    const endpoint = new URL(request.url).searchParams.get('endpoint') || ''
    const apiUrl = `${process.env.API_URL}${endpoint}?customerId=${process.env.API_USER}&estateId=${id}`
    const Authorization = `Basic ${btoa(`${process.env.API_USERNAME}:${process.env.API_PASSWORD}`)}`

    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Authorization': Authorization,
        'Content-Type': 'application/json',
      },
      next: { revalidate: 3600 } // cache for 1 hour
    })

    if (!response.ok) {
      console.error('API Response Status:', response.status)
      console.error('API Response Status Text:', response.statusText)
      
      return NextResponse.json(
        { error: `API call failed: ${response.statusText}` },
        { status: response.status }
      )
    }

    const data = await response.json()
    const images: any[] = []
    data.images.forEach(async (image: any) => {
      const publicUrl = `/estates/${data.estateId}/${image.imageId}.${image.extension}`
      images.push({
        imageId: image.imageId,
        apiEndpoint: image.url,
        url: publicUrl,
        orderNumber: image.orderNumber,
        showImageOnInternet: image.showImageOnInternet,
        extension: image.extension
      })
    })
    data.imgs = images
    return NextResponse.json(data)

  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch estates data' },
      { status: 500 }
    )
  }
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