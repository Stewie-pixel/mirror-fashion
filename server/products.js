export const TRYON_PRODUCTS = {
  p1: {
    id: 'p1',
    name: 'Camel Tailoring Coat',
    image: 'assets/camel_coat.png',
    match: 96,
    garmentDes: 'Camel wool-blend tailoring coat with structured shoulders',
    vtonCategory: 'upper_body',
  },
  p3: {
    id: 'p3',
    name: 'Leather Statement Jacket',
    image: 'assets/leather_statement_jacket.png',
    match: 89,
    garmentDes: 'Black lambskin leather jacket with asymmetric zip',
    vtonCategory: 'upper_body',
  },
  p4: {
    id: 'p4',
    name: 'Structured Denim Trench',
    image: 'assets/denim_jacket.png',
    match: 87,
    garmentDes: 'Indigo denim trench coat with belted waist',
    vtonCategory: 'upper_body',
  },
};

export function byId(id) {
  return TRYON_PRODUCTS[id] ?? null;
}
