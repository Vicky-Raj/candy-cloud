import {
  createFileRoute,
  useLoaderData,
  notFound,
} from "@tanstack/react-router";
import { CustomerFormPage } from "../add"; // Reusing the form page
import { dummyCustomers, type Customer } from "../../../data/customers";

// This is the new route for /customers/$customerId/edit
export const Route = createFileRoute("/customers/$customerId/edit")({
  loader: async ({ params }) => {
    // Ensure params.customerId is treated as a string for comparison
    const customerId = params.customerId as string;
    const customer = dummyCustomers.find((c) => c.id === customerId);
    if (!customer) {
      throw notFound();
    }
    return customer;
  },
  component: EditCustomerComponent,
});

function EditCustomerComponent() {
  const customerToEdit = Route.useLoaderData();

  // CustomerFormPage will render its own AppShell when in editMode (as designed in previous steps)
  return <CustomerFormPage editMode={true} customerData={customerToEdit} />;
}
