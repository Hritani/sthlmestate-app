import Image from 'next/image';

interface StrapiImageProps {
  image: {
    data: {
      attributes: {
        url: string;
        width: number;
        height: number;
        alternativeText: string;
      };
    };
  };
}

export default function StrapiImage({ image }: StrapiImageProps) {
  const { url, width, height, alternativeText } = image.data.attributes;

  return (
    <Image
      src={`${process.env.NEXT_PUBLIC_STRAPI_API_URL}${url}`}
      width={width}
      height={height}
      alt={alternativeText || ''}
    />
  );
}