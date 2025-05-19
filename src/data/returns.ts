export interface ReturnItem {
  returnId: string;
  orderId: string;
  returnDate: string; // DD/MM/YYYY format
  productName: string;
  quantity: number;
  reason: string;
  status: "Pending" | "Approved" | "Rejected" | "Processed";
}

export const dummyReturns: ReturnItem[] = [
  {
    returnId: "RET001",
    orderId: "ORD001",
    returnDate: "20/01/2023",
    productName: "Vanilla Swirls",
    quantity: 1,
    reason: "Damaged item",
    status: "Approved",
  },
  {
    returnId: "RET002",
    orderId: "ORD003",
    returnDate: "15/03/2023",
    productName: "Strawberry Clouds",
    quantity: 2,
    reason: "Wrong item received",
    status: "Pending",
  },
  {
    returnId: "RET003",
    orderId: "ORD004",
    returnDate: "18/03/2023",
    productName: "Minty Fresh",
    quantity: 1,
    reason: "Changed mind",
    status: "Rejected",
  },
  {
    returnId: "RET004",
    orderId: "ORD002",
    returnDate: "25/02/2023",
    productName: "Chocolate Dreams",
    quantity: 1,
    reason: "Not as expected",
    status: "Processed",
  },
  {
    returnId: "RET005",
    orderId: "ORD005",
    returnDate: "05/04/2023",
    productName: "Caramel Crunch",
    quantity: 1,
    reason: "Item arrived late",
    status: "Approved",
  },
];
