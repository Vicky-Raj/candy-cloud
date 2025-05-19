export interface CollectionItem {
  collectionId: string;
  orderId: string;
  collectionDate: string; // DD/MM/YYYY format
  amountCollected: number;
  paymentMethod: "Card" | "Cash" | "Transfer" | "Online";
  status: "Pending" | "Collected" | "Failed" | "Processing";
}

export const dummyCollections: CollectionItem[] = [
  {
    collectionId: "COL001",
    orderId: "ORD001",
    collectionDate: "15/01/2023",
    amountCollected: 15.99 * 2,
    paymentMethod: "Card",
    status: "Collected",
  },
  {
    collectionId: "COL002",
    orderId: "ORD002",
    collectionDate: "20/02/2023",
    amountCollected: 22.5,
    paymentMethod: "Online",
    status: "Collected",
  },
  {
    collectionId: "COL003",
    orderId: "ORD003",
    collectionDate: "10/03/2023",
    amountCollected: 12.0 * 5,
    paymentMethod: "Cash",
    status: "Pending",
  },
  {
    collectionId: "COL004",
    orderId: "ORD004",
    collectionDate: "12/03/2023",
    amountCollected: 10.75 * 3,
    paymentMethod: "Card",
    status: "Collected",
  },
  {
    collectionId: "COL005",
    orderId: "ORD005", // Linked to a cancelled order for example
    collectionDate: "01/04/2023",
    amountCollected: 0, // Or the amount that was due before cancellation
    paymentMethod: "Online",
    status: "Failed", // Because order was cancelled
  },
  {
    collectionId: "COL006",
    orderId: "ORD003", // Example of a follow-up or partial collection
    collectionDate: "15/03/2023",
    amountCollected: 20.0, // Partial amount
    paymentMethod: "Transfer",
    status: "Processing",
  },
];
