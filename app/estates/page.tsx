import Image from 'next/image'
import Link from 'next/link'
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"

interface Estate {
    urlThumbnail: string
    id: string
    municipality: string
    streetAddress: string
    numberOfRooms: number
    livingSpace: number
    startingPrice: number
    monthlyFee: number
    statusName: string
    endpoint: string
    images: Array<{
        urlThumbnail: string
        imageId: string
        extension: string
    }>
}

async function getEstates(): Promise<Estate[]> {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'
    const res = await fetch(`${baseUrl}/api/estates`, { next: { revalidate: 3600 } })
    
    if (!res.ok) {
        throw new Error('Failed to fetch estates')
    }

    return res.json()
}

export default async function ListPage() {
    const estates = await getEstates()
    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-center text-3xl font-bold mb-12">VÅRA BOSTÄDER</h1>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {estates.map((estate) => (
                    <Link 
                        href={`/estates/${estate.id}?endpoint=${estate.endpoint}`} 
                        key={estate.id} 
                        className="group"
                    >
                        <Card className="overflow-hidden border-none shadow-lg hover:shadow-xl transition-shadow">
                            <CardHeader className="p-0">
                                <div className="relative aspect-[4/3] overflow-hidden">
                                    <Image
                                        src={estate.urlThumbnail || '/placeholder-home.png'}
                                        sizes="(max-width: 600px) 600px, (max-width: 1024px) 1024px, 1920px"
                                        alt={estate.streetAddress}
                                        fill
                                        className="object-cover transition-transform group-hover:scale-105 duration-300"
                                    />
                                    <Badge 
                                        className="absolute top-4 right-4 bg-white/90 text-black hover:bg-white/90"
                                        variant="secondary"
                                    >
                                        {estate.statusName}
                                    </Badge>
                                </div>
                            </CardHeader>
                            
                            <CardContent className="p-6 space-y-4">
                                <div>
                                    <p className="text-sm uppercase tracking-wider text-muted-foreground">
                                        {estate.municipality}
                                    </p>
                                    <h2 className="font-bold text-xl mt-1">
                                        {estate.streetAddress}
                                    </h2>
                                </div>

                                <Separator />

                                <div className="grid grid-cols-2 gap-4 text-sm">
                                    <div>
                                        <p className="text-muted-foreground">Storlek</p>
                                        <p className="font-medium">{estate.numberOfRooms} rum, {estate.livingSpace} m²</p>
                                    </div>
                                    <div>
                                        <p className="text-muted-foreground">Pris</p>
                                        <p className="font-medium">{estate.startingPrice.toLocaleString()} kr</p>
                                    </div>
                                    <div>
                                        <p className="text-muted-foreground">Avgift</p>
                                        <p className="font-medium">{estate.monthlyFee?.toLocaleString()} kr/mån</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </Link>
                ))}
            </div>
        </div>
    )
}