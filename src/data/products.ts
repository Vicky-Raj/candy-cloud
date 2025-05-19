export interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  image: string;
}

export const dummyProducts: Product[] = [
  {
    id: "PROD001",
    name: "Celestial Candy Clusters",
    price: 29.99,
    description:
      "A delightful mix of star-shaped gummies and shimmering sugar crystals. Out of this world flavor!",
    image: "https://picsum.photos/200?random=1",
  },
  {
    id: "PROD002",
    name: "Mystic Mint Meltaways",
    price: 19.75,
    description:
      "Cool mint candies that melt in your mouth, revealing a swirl of magic.",
    image: "https://picsum.photos/200?random=2",
  },
  {
    id: "PROD003",
    name: "Ruby Raspberry Ropes",
    price: 15.5,
    description:
      "Long, chewy raspberry ropes bursting with a tangy sweetness. Perfect for sharing.",
    image: "https://picsum.photos/200?random=3",
  },
  {
    id: "PROD004",
    name: "Golden Honeycomb Bites",
    price: 35.0,
    description: "Crunchy honeycomb pieces enrobed in rich, golden chocolate.",
    image: "https://picsum.photos/200?random=4",
  },
  {
    id: "PROD005",
    name: "Sapphire Sour Spheres",
    price: 22.99,
    description:
      "Intensely sour blue raspberry spheres that will make your taste buds tingle.",
    image: "https://picsum.photos/200?random=5",
  },
  {
    id: "PROD006",
    name: "Emerald Apple Chews",
    price: 18.25,
    description:
      "Soft and chewy apple candies with a vibrant green color and a crisp taste.",
    image: "https://picsum.photos/200?random=6",
  },
  {
    id: "PROD007",
    name: "Chocolate Lava Cakes (Mini)",
    price: 45.9,
    description:
      "Miniature chocolate cakes with a molten lava center. Pure decadence.",
    image: "https://picsum.photos/200?random=7",
  },
  {
    id: "PROD008",
    name: "Vanilla Bean Bonbons",
    price: 25.0,
    description:
      "Smooth vanilla bean ganache covered in a delicate white chocolate shell.",
    image: "https://picsum.photos/200?random=8",
  },
  {
    id: "PROD009",
    name: "Cosmic Caramel Comets",
    price: 21.5,
    description:
      "Chewy caramel candies shaped like comets, with a sprinkle of sea salt.",
    image: "https://picsum.photos/200?random=9",
  },
  {
    id: "PROD010",
    name: "Strawberry Stardust Taffy",
    price: 12.99,
    description:
      "Light and airy strawberry taffy that stretches for miles. Dusted with edible glitter.",
    image: "https://picsum.photos/200?random=10",
  },
];
