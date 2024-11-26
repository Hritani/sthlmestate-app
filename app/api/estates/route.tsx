import { formatEstates } from '@/lib/functions'
import { access, mkdir, writeFile } from 'fs/promises'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import path from 'path'

export async function GET(request: Request) {
  const cookieStore = await cookies()
  try {
    const params = {
      customerId: `${process.env.API_USER}`,
      typeOfDate: 1,
      statuses: [{ id: '3' }]
    }

    console.log('Initial params:', params)

    const GetEstateList = `${process.env.API_URL}/Estate/GetEstateList`
    const Authorization = `Basic ${btoa(`${process.env.API_USERNAME}:${process.env.API_PASSWORD}`)}`

    const GetEstateListResponse = await fetch(GetEstateList, {
      method: 'POST',
      headers: {
        'Authorization': Authorization,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(params),
      next: { revalidate: 3600 }
    })

    if (!GetEstateListResponse.ok) {
      throw new Error(`Initial API call failed: ${GetEstateListResponse.status} ${GetEstateListResponse.statusText}`)
    }

    const GetEstateListData = await GetEstateListResponse.json()
    const formatedEstates = formatEstates(GetEstateListData[0])
    
    const erichedList: any[] = []
    
    await Promise.all(formatedEstates.estatesList.map(async (estate) => {
      try {
        const apiUrl = `${process.env.API_URL}${estate.endpoint}?customerId=${process.env.API_USER}&estateId=${estate.id}`
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
    
        const fullEstateData = await response.json()
        const images: any[] = []
        // Create estate directory if it doesn't exist
        const estateDir = path.join(process.cwd(), 'public', 'estates', estate.id.toString())
        await mkdir(estateDir, { recursive: true })
        if (fullEstateData?.images) {
          fullEstateData.images.forEach(async (image: any) => {
            // Create file path with correct extension
            const imagePath = path.join(estateDir, `${image.imageId}.${image.extension}`)
            const hasFile = await access(imagePath).then(() => true).catch(() => false)
            // Update image URL to point to local file
            const publicUrl = `/estates/${estate.id}/${image.imageId}.${image.extension}`
            images.push({
              imageId: image.imageId,
              apiEndpoint: image.url,
              url: publicUrl,
              orderNumber: image.orderNumber,
              showImageOnInternet: image.showImageOnInternet,
              extension: image.extension
            })
            // Get the image data from the API
            try {
              if (!hasFile) {
                const Authorization = `Basic ${btoa(`${process.env.API_USERNAME}:${process.env.API_PASSWORD}`)}`
                const imgParams = image.orderNumber === 1 ? '&w=1920&quality=95&mode=max' : '&w=1920&quality=80&mode=max'
                const apiImage = await fetch(`${image.url}${imgParams}`, {
                  headers: {
                    'Authorization': Authorization
                  },
                  next: { revalidate: 3600 }
                })
            
                if (!apiImage.ok) {
                  console.error('API Response Status:', apiImage.status)
                  console.error('API Response Status Text:', apiImage.statusText)
                  
                  return NextResponse.json(
                    { error: `API call failed: ${apiImage.statusText}` },
                    { status: apiImage.status }
                  )
                }
                const apiImageData = await apiImage.arrayBuffer()
                const imageData = Buffer.from(apiImageData)
                
                await writeFile(imagePath, imageData)
              }
              
            } catch (error) {
              console.error(`Failed to get image ${image.imageId}:`, error)
              throw error
            }
            
          })
        }
        
        erichedList.push({
          apartmentNumber: fullEstateData?.baseInformation?.apartmentNumber,
          baseInformation: fullEstateData?.baseInformation,
          bidSetting: fullEstateData?.internetSettings?.bidSetting,
          bids: fullEstateData.bids,
          city: fullEstateData?.baseInformation?.objectAddress?.city || fullEstateData?.baseInformation?.objectAddress?.municipality,
          county: fullEstateData?.baseInformation?.objectAddress?.county,
          currency: 'kr',
          customerId: estate.customerId,
          dateChanged: estate.dateChanged,
          documents: fullEstateData?.advertiseOn?.documents,
          finalPrice: fullEstateData?.price?.finalPrice,
          firstPublishingDateOnHomepage: fullEstateData?.advertiseOn?.firstPublishingDateOnHomepage,
          floorAndElevator: fullEstateData?.floorAndElevator,
          id: estate.id,
          interior: fullEstateData?.interior,
          isBiddingOngoing: !!estate.bidding,
          livingSpace: estate.livingSpace,
          marketplaces: fullEstateData?.advertiseOn?.marketplaces,
          monthlyFee: estate.monthlyFee,
          monthlyFeeIsZero: fullEstateData?.baseInformation?.monthlyFeeIsZero,
          municipality: fullEstateData?.baseInformation?.objectAddress?.municipality,
          newConstruction: fullEstateData?.baseInformation?.newConstruction,
          numberOfRooms: estate.rooms,
          otherSpace: fullEstateData?.baseInformation?.otherSpace,
          plot: fullEstateData?.plot || null,
          plotArea: fullEstateData?.plot?.area,
          publishedAt: fullEstateData?.date?.assignmentDate,
          startingPrice: estate.price,
          statusName: estate.status.name,
          streetAddress: estate.streetAddress,
          typeDisplay: fullEstateData?.baseInformation?.propertyType,
          zipCode: fullEstateData?.baseInformation?.objectAddress?.zipCode,
          endpoint: estate.endpoint,
          key: estate.key,
          urlThumbnail: estate.urlThumbnail,
          images
        })
    
      } catch (error) {
        console.error('API Error:', error)
        throw error
      }
    }))
    cookieStore.set({
      name: 'estatsList',
      value: 'JSON.stringify(erichedList)',
      path: '/',
    })
    return NextResponse.json(erichedList)
  } catch (error: unknown) {
    console.error('Detailed API Error:', {
      message: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
      cause: error instanceof Error ? error.cause : undefined
    })
    return NextResponse.json(
      { 
        error: 'Failed to fetch estates data',
        details: error instanceof Error ? error.message : String(error)
      },
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