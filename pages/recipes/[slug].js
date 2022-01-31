import { createClient } from "contentful";

// używane w dwóch miejsach
const client = createClient({
  space: process.env.CONTENTFUL_SPACE_ID,
  accessToken: process.env.CONTENTFUL_ACCESS_KEY,
});

export const getStaticPaths = async () => {
  // wszystkei przepisy
  const response = await client.getEntries({
    content_type: "recipe",
  });

  const paths = response.items.map((item) => {
    return {
      params: { slug: item.fields.slug },
    };
  });

  return {
    // do budowania statycznych stron przez nextjs
    paths,
    fallback: false, //404 zamiast fallback pages gdy próbuję wiejsc do urla który nie istneije w path
  };
};

// params z danymi slug jest przekazany z getStaticPaths params: { slug: item.fields.slug }
export async function getStaticProps({ params }) {
  // pobieranie pojedyczne dane gdy jesteśmy na stronie o danym urlu
  const {items} = await client.getEntries({ //destrykturyzacja!
    //dalej zwraca Array z jednym obiektem
    content_type: "recipe",
    // żeby pobrac poejdyncze dane
    "fields.slug": params.slug, //uniklane pole
  });

  return {
    props: {
      recipe: items[0], //single object
    },
  };
}

export default function RecipeDetails({ recipe }) {
  return <div>Recipe Details</div>;
}
