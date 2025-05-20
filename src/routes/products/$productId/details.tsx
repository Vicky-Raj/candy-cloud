import {
  createFileRoute,
  useParams,
  useLoaderData,
  notFound,
  Link,
  // useRouter, // Not used
} from "@tanstack/react-router";
import {
  AppShell,
  Title,
  Group,
  ActionIcon,
  useMantineColorScheme,
  useComputedColorScheme,
  Container, // For main content area
  Text, // If product not found
} from "@mantine/core";
import {
  IconArrowLeft,
  IconSun,
  IconMoon,
  IconPackage,
} from "@tabler/icons-react";
import { AddProductPage } from "../add"; // Import the refactored component
import { dummyProducts, type Product } from "../../../data/products";

export const Route = createFileRoute("/products/$productId/details")({
  loader: async ({ params }) => {
    const product = dummyProducts.find((p) => p.id === params.productId);
    if (!product) {
      throw notFound();
    }
    return product;
  },
  component: ProductDetailsComponent,
});

function ProductDetailsComponent() {
  const product = Route.useLoaderData(); // Use the loader data
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
  const computedColorScheme = useComputedColorScheme("light");
  // const navigate = useNavigate(); // Removed as it's not used

  // The AddProductPage will handle its own title updates based on its internal state (isEditing)
  // We just need to provide the main AppShell structure for this details view.

  return (
    <AppShell header={{ height: 70 }} padding="md">
      <AppShell.Header
        p="sm"
        style={(theme) => ({
          background:
            computedColorScheme === "dark"
              ? theme.colors.dark[5]
              : `linear-gradient(45deg, ${theme.colors.primaryColor[4]}, ${theme.colors.primaryColor[6]})`,
          boxShadow: theme.shadows.sm,
          display: "flex",
          alignItems: "center",
        })}
      >
        <Group justify="space-between" style={{ flexGrow: 1 }}>
          <Group gap="xs">
            <ActionIcon
              component={Link}
              to="/products" // Always back to product list from details page
              variant="transparent"
              title="Back to Products"
              size="lg"
            >
              <IconArrowLeft size="1.5rem" color="white" />
            </ActionIcon>
          </Group>
          <Group align="center">
            <IconPackage
              size="1.8rem"
              color="white"
              style={{ marginRight: "var(--mantine-spacing-xs)" }}
            />
            {/* Title will be handled by AddProductPage when it renders productData */}
            {/* For a static title here, it might conflict or be redundant */}
            <Title order={3} c="white">
              Product Management{" "}
              {/* Generic title, AddProductPage will show specific */}
            </Title>
          </Group>
          <ActionIcon
            variant="transparent"
            onClick={() => toggleColorScheme()}
            title="Toggle color scheme"
            size="lg"
          >
            {computedColorScheme === "dark" ? (
              <IconSun size="1.2rem" color="white" />
            ) : (
              <IconMoon size="1.2rem" color="white" />
            )}
          </ActionIcon>
        </Group>
      </AppShell.Header>
      <AppShell.Main
        style={(theme) => ({
          backgroundColor:
            computedColorScheme === "dark"
              ? theme.colors.dark[8]
              : theme.colors.gray[1],
        })}
        py={0}
        px={0}
      >
        {/* Container is removed here as AddProductPage has its own Container */}
        <AddProductPage addMode={false} productData={product} />
      </AppShell.Main>
    </AppShell>
  );
}
