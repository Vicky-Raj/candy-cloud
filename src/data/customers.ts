export interface Customer {
  id: string;
  code: string;
  name: string;
  address: string;
  city: string;
  postCode: string;
  mobile: string;
  phone: string;
  contact: string;
  creditTerms: string;
  creditLimit: number;
  deliveryBetween: string;
}

export const dummyCustomers: Customer[] = [
  {
    id: "1",
    code: "CUST001",
    name: "Candy Corner",
    address: "123 Sweet Street",
    city: "Sugartown",
    postCode: "SW1 1AA",
    mobile: "07700900001",
    phone: "02079460001",
    contact: "John Sugar",
    creditTerms: "30 Days",
    creditLimit: 5000,
    deliveryBetween: "9am - 1pm",
  },
  {
    id: "2",
    code: "CUST002",
    name: "Lollipop Lane",
    address: "456 Lolly Lane",
    city: "Chocville",
    postCode: "CH2 2BB",
    mobile: "07700900002",
    phone: "02079460002",
    contact: "Mary Pop",
    creditTerms: "Net 15",
    creditLimit: 2500,
    deliveryBetween: "1pm - 5pm",
  },
  {
    id: "3",
    code: "CUST003",
    name: "Gumdrop Gardens",
    address: "789 Gummy Grove",
    city: "Sugartown",
    postCode: "SW1 3CC",
    mobile: "07700900003",
    phone: "02079460003",
    contact: "Peter Chew",
    creditTerms: "COD",
    creditLimit: 1000,
    deliveryBetween: "10am - 2pm",
  },
  {
    id: "4",
    code: "CUST004",
    name: "The Chocolate Factory",
    address: "1 Wonka Way",
    city: "Chocville",
    postCode: "CH2 4DD",
    mobile: "07700900004",
    phone: "02079460004",
    contact: "Willy W.",
    creditTerms: "Net 60",
    creditLimit: 10000,
    deliveryBetween: "Anytime",
  },
];
