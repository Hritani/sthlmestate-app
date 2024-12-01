const fetchStrapi = async (endpoint: string) => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_STRAPI_API_URL}/api${endpoint}`, {
      headers: {
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_STRAPI_TOKEN}`,
      },
    });
    const data = await res.json();
    return data;
  };
  
  export { fetchStrapi };