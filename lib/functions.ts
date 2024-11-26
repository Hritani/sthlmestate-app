import { EstatesListRaw, Estate } from "@/interface/EstateListRaw"

export const formatEstates = (data: any) => {
    const estatesList: any[] = []
    for (const [key, value] of Object.entries(data) as [string, any[]][]) {
        let endpoint = ''
        if (key === 'houses') {
            endpoint = '/Estate/GetHouse'
        } else if (key === 'cottages') {
            endpoint = '/Estate/GetCottage'
        } else if (key === 'housingCooperativeses') {
            endpoint = '/Estate/GetHousingCooperative'
        } else if (key === 'plots') {
            endpoint = '/Estate/GetPlot'
        } else if (key === 'projects') {
            endpoint = '/Estate/GetProject'
        } else if (key === 'farms') {
            endpoint = '/Estate/GetFarm'
        } else if (key === 'commercialPropertys') {
            endpoint = '/Estate/GetCommercialProperty'
        } else if (key === 'condominiums') {
            endpoint = '/Estate/GetCondominium'
        } else if (key === 'foreignProperties') {
            endpoint = '/Estate/GetForeignProperty'
        } else if (key === 'premises') {
            endpoint = '/Estate/GetPremise'
        }
        if (!!value.length && typeof value !== 'string') {
            value.map((estate: any) => {
                estatesList.push({
                ...estate,
                endpoint,
                key,
                urlThumbnail: !estate?.mainImage
                    ? '/placeholder-home.png'
                    : `/estates/${estate.id}/${estate.mainImage.imageId}.${estate.mainImage.extension}`
                })
            })
        }
    }
    return {
        total: estatesList.length,
        estatesList,
    }
}

export const enrichEstate = async(estate: any, endpoint: string) => {
    const fullEstateData = await getEstateRawData(estate.id, endpoint)
    return {
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
        zipCode: fullEstateData?.baseInformation?.objectAddress?.zipCode
    }
}

const getEstateRawData = async (id: string, endpoint: string) => {
    let apiUrl = `api/estates/${id}?endpoint=${endpoint}`
    const response = await fetch(apiUrl, { method: 'GET' })
    const data = await response.json()
    return data
}