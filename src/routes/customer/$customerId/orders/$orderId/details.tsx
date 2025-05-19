import { createFileRoute, useParams } from "@tanstack/react-router";
import { CustomerAddOrderPage } from "../add"; // Import the refactored component
import type { AddOrderFormValues, OrderItemValue } from "../add"; // Import types

// Example dummy order data - in a real app, this would come from a loader
const createDummyOrderData = (
  orderId: string,
  customerId: string
): AddOrderFormValues => ({
  orderId: orderId,
  orderDate: new Date(),
  deliveryDate: new Date(new Date().setDate(new Date().getDate() + 7)), // A week from now
  paymentType: "Card",
  comments: "This is a dummy order for viewing and editing.",
  orderItems: [
    {
      productId: "dummyProd1",
      name: "Dummy Product 1 Dummy Product 1",
      image: "https://picsum.photos/200?random=1",
      unitPrice: 19.99,
      quantity: 2,
    },
    {
      productId: "dummyProd2",
      name: "Another Dummy Product Another Dummy Product",
      image: "https://picsum.photos/200?random=1",
      unitPrice: 25.5,
      quantity: 1,
    },
  ],
});

export const Route = createFileRoute(
  "/customer/$customerId/orders/$orderId/details"
)({
  component: OrderDetailsComponent,
});

function OrderDetailsComponent() {
  const { orderId, customerId } = Route.useParams(); // Use Route.useParams()
  const dummyOrderData = createDummyOrderData(orderId, customerId);

  // Note: The CustomerAddOrderPage itself fetches customer data using useLoaderData
  // based on the $customerId from its own route context if used directly.
  // When embedding it here, ensure the parent routes provide necessary context if it relied on it
  // or modify CustomerAddOrderPage to also accept customerData as a prop if needed.
  // For now, assuming CustomerAddOrderPage can get customerId from its own useLoaderData call,
  // as the route structure /customer/$customerId is a parent.

  return <CustomerAddOrderPage addMode={false} orderData={dummyOrderData} />;
}
