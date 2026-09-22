import { groq } from 'next-sanity';

// Category fragment reused in product queries
const categoryFragment = groq`
  category->{
    _id,
    name,
    slug
  }
`;

// --------------- PRODUCTS ---------------

export const allProductsQuery = groq`
  *[_type == "product" && isActive == true] | order(_createdAt desc) {
    _id,
    name,
    slug,
    description,
    price,
    comparePrice,
    stock,
    rating,
    image,
    gallery,
    isActive,
    isNew,
    _createdAt,
    ${categoryFragment}
  }
`;

export const newArrivalsQuery = groq`
  *[_type == "product" && isActive == true && isNew == true] | order(_createdAt desc) {
    _id,
    name,
    slug,
    description,
    price,
    comparePrice,
    stock,
    rating,
    image,
    gallery,
    isActive,
    isNew,
    _createdAt,
    ${categoryFragment}
  }
`;

export const productBySlugQuery = groq`
  *[_type == "product" && slug.current == $slug][0] {
    _id,
    name,
    slug,
    description,
    price,
    comparePrice,
    stock,
    rating,
    image,
    gallery,
    isActive,
    isNew,
    _createdAt,
    ${categoryFragment}
  }
`;

export const productByIdQuery = groq`
  *[_type == "product" && _id == $id][0] {
    _id,
    name,
    slug,
    description,
    price,
    comparePrice,
    stock,
    rating,
    image,
    gallery,
    isActive,
    isNew,
    _createdAt,
    ${categoryFragment}
  }
`;

export const productsByCategoryQuery = groq`
  *[_type == "product" && isActive == true && category->slug.current == $categorySlug] | order(_createdAt desc) {
    _id,
    name,
    slug,
    description,
    price,
    comparePrice,
    stock,
    rating,
    image,
    gallery,
    isActive,
    isNew,
    _createdAt,
    ${categoryFragment}
  }
`;

// --------------- CATEGORIES ---------------

export const allCategoriesQuery = groq`
  *[_type == "category"] | order(name asc) {
    _id,
    name,
    slug,
    description,
    image,
    "product_count": count(*[_type == "product" && references(^._id) && isActive == true])
  }
`;

export const categoryBySlugQuery = groq`
  *[_type == "category" && slug.current == $slug][0] {
    _id,
    name,
    slug,
    description,
    image
  }
`;
