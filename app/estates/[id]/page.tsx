import { notFound } from 'next/navigation'
import Image from 'next/image'

interface Estate {
    price: any
    interior: any
    baseInformation: any
    urlThumbnail: string
    id: string
    municipality: string
    streetAddress: string
    numberOfRooms: number
    livingSpace: number
    startingPrice: number
    monthlyFee: number
    statusName: string
    viewings: Array<any>
    imgs: Array<{
        url: string
        imageId: string
    }>
}

interface PageProps {
    params: { id: string }
    searchParams: { endpoint?: string }
}

function formatCurrency(amount: number | undefined | null): string {
    if (amount === undefined || amount === null) return '-'
    
    // Manual formatting with space as thousand separator (Swedish format)
    return amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ')
}

async function getEstate(id: string, endpoint: string): Promise<Estate> {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'
    const res = await fetch(`${baseUrl}/api/estates/${id}?endpoint=${encodeURIComponent(endpoint)}`, {
        next: { revalidate: 3600 }
    })
    
    if (!res.ok) {
        notFound()
    }

    return res.json()
}

export default async function EstatePage({ params, searchParams }: PageProps) {
    const { id } = await params
    const { endpoint } = await searchParams
    
    if (!endpoint) {
        notFound()
    }

    const estate = await getEstate(id, endpoint)
    
    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-6">{estate?.streetAddress ?? ''}</h1>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                    <div className="relative aspect-[4/3] overflow-hidden rounded-lg">
                        <Image
                            src={estate.imgs[0].url || '/placeholder-home.png'}
                            alt={estate.baseInformation.objectAddress.streetAddress}
                            fill
                            className="object-cover"
                            sizes="(max-width: 768px) 100vw, 50vw"
                        />
                    </div>
                    
                    {estate.imgs && estate.imgs.length > 0 && (
                        <div className="grid grid-cols-4 gap-2">
                            {estate.imgs.slice(1).map((img) => (
                                <div key={img.imageId} className="relative aspect-square overflow-hidden rounded-md">
                                    <Image
                                        src={img.url}
                                        alt={estate.baseInformation.objectAddress.streetAddress}
                                        fill
                                        className="object-cover"
                                        sizes="(max-width: 768px) 25vw, 12vw"
                                    />
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="space-y-6">
                    <div>
                        <h2 className="text-xl font-semibold mb-2">Property Details</h2>
                        <div className="space-y-2">
                            <p>Municipality: {estate?.baseInformation?.objectAddress?.municipality ?? ''}</p>
                            <p>Rooms: {estate?.interior?.numberOfRooms ?? '-'}</p>
                            <p>Living Space: {estate?.baseInformation?.livingSpace 
                                ? `${estate.baseInformation.livingSpace} m²` 
                                : '-'}</p>
                            <p>Price: {formatCurrency(estate?.price?.startingPrice)} kr</p>
                            <p>Monthly Fee: {formatCurrency(estate?.baseInformation?.monthlyFee)} kr/mån</p>
                            <p>Status: {estate?.viewings?.length > 0 ? 'Ready for Viewing' : 'Tune in for viewings'}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}