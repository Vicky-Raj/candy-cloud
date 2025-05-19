import {
  createFileRoute,
  useParams,
  useLoaderData,
  Link,
} from "@tanstack/react-router";
import { Text, Title, useComputedColorScheme } from "@mantine/core";
import type { Customer } from "../../../data/customers";

// Path matches /customer/$customerId/statement
export const Route = createFileRoute("/customer/$customerId/statement")({
  component: CustomerStatementPage,
});

function CustomerStatementPage() {
  const { customerId: paramCustomerId } = useParams({
    from: "/customer/$customerId/statement",
  });
  const parentCustomerData = useLoaderData({
    from: "/customer/$customerId",
  }) as Customer | undefined;
  const customerName = parentCustomerData?.name || "Customer";
  const customerActualId = parentCustomerData?.id || paramCustomerId;
  const computedColorScheme = useComputedColorScheme("light");

  return (
    <>
      <Title order={3} mb="md">
        Statement: {customerName} ({customerActualId})
      </Title>
      <Text>Statement page content will go here.</Text>
    </>
  );
}
