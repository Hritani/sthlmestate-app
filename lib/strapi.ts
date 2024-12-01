const fetchStrapi = async (endpoint: string) => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_STRAPI_API_URL}/api${endpoint}`, {
      headers: {
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_STRAPI_TOKEN}`,
      },
    });
    const data = await res.json();
    return data;
  };
  
const updateStrapi = async (type: string, updateData: {}) => {
  console.log('updateData', updateData);
  
    const res = await fetch(`${process.env.NEXT_PUBLIC_STRAPI_API_URL}/api${type}`,
      {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_STRAPI_TOKEN}`,
        },
        body: JSON.stringify({ type, updateData }),
      }
    );
    const data = await res.json();
    return data;
  };
  
  export { fetchStrapi, updateStrapi };