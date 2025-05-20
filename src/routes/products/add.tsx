import {
  createFileRoute,
  useNavigate,
  Link,
  useParams,
} from "@tanstack/react-router";
import {
  Container,
  Paper,
  Title,
  TextInput,
  Group,
  Button,
  NumberInput,
  Textarea,
  SimpleGrid,
  AppShell,
  ActionIcon,
  useMantineColorScheme,
  useComputedColorScheme,
  rem,
  Stack,
  FileInput,
  Image as MantineImage,
  Text as MantineText,
  Box,
  Divider as MantineDivider,
  ThemeIcon,
} from "@mantine/core";
import {
  IconDeviceFloppy,
  IconArrowLeft,
  IconSun,
  IconMoon,
  IconPackage,
  IconPencil,
  IconPhoto,
  IconCash,
  IconInfoCircle,
} from "@tabler/icons-react";
import { useForm, zodResolver } from "@mantine/form";
import { z } from "zod";
import { v4 as uuidv4 } from "uuid";
import { type Product, dummyProducts } from "../../data/products";
import { useState, useEffect, Fragment } from "react";

const addProductSchema = z.object({
  name: z.string().min(1, { message: "Product name is required" }),
  description: z.string().min(1, { message: "Description is required" }),
  price: z.number().min(0.01, { message: "Price must be greater than 0" }),
  image: z.instanceof(File).nullable().optional(),
  existingImage: z.string().optional(),
  vat: z
    .number()
    .min(0, "VAT cannot be negative")
    .max(100, "VAT cannot exceed 100")
    .nullable()
    .optional(),
  discount: z
    .number()
    .min(0, "Discount cannot be negative")
    .max(100, "Discount cannot exceed 100")
    .nullable()
    .optional(),
});

export type AddProductFormValues = z.infer<typeof addProductSchema>;

interface AddProductPageProps {
  addMode?: boolean;
  productData?: Product;
}

export const Route = createFileRoute("/products/add")({
  component: () => <AddProductPage addMode={true} />,
});

function DisplayField({
  label,
  value,
  icon,
  isLargeText,
}: {
  label: string;
  value: string | number | null | undefined;
  icon?: React.ReactNode;
  isLargeText?: boolean;
}) {
  return (
    <Group wrap="nowrap" gap="xs" align="flex-start" mb="sm">
      {icon && (
        <ThemeIcon variant="light" size="md" mt={rem(2)}>
          {icon}
        </ThemeIcon>
      )}
      <Stack gap={0} style={{ flexGrow: 1 }}>
        <MantineText fz="xs" tt="uppercase" c="dimmed">
          {label}
        </MantineText>
        <MantineText
          fz={isLargeText ? "lg" : "sm"}
          fw={isLargeText ? 600 : 500}
          style={{ whiteSpace: isLargeText ? "normal" : "pre-wrap" }}
        >
          {value || "N/A"}
        </MantineText>
      </Stack>
    </Group>
  );
}

export function AddProductPage({
  addMode = true,
  productData,
}: AddProductPageProps) {
  const navigate = useNavigate();
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
  const computedColorScheme = useComputedColorScheme("light");

  const [isEditing, setIsEditing] = useState(addMode);

  const effectiveAddMode = addMode;
  const readOnlyMode = !effectiveAddMode && !isEditing;

  const form = useForm<AddProductFormValues>({
    initialValues:
      !effectiveAddMode && productData
        ? {
            name: productData.name,
            description: productData.description,
            price: productData.price,
            image: null,
            existingImage: productData.image,
            vat: productData.vat !== undefined ? productData.vat : null,
            discount:
              productData.discount !== undefined ? productData.discount : null,
          }
        : {
            name: "",
            description: "",
            price: 0.0,
            image: null,
            existingImage: undefined,
            vat: null,
            discount: null,
          },
    validate: zodResolver(addProductSchema),
  });

  useEffect(() => {
    if (!effectiveAddMode && productData) {
      form.setValues({
        name: productData.name,
        description: productData.description,
        price: productData.price,
        image: null,
        existingImage: productData.image,
        vat: productData.vat !== undefined ? productData.vat : null,
        discount:
          productData.discount !== undefined ? productData.discount : null,
      });
      form.resetDirty();
    }
  }, [effectiveAddMode, productData, form.setValues, form.resetDirty]);

  const handleSubmit = (values: AddProductFormValues) => {
    if (effectiveAddMode) {
      const newProductData = {
        id: uuidv4(),
        name: values.name,
        description: values.description,
        price: Number(values.price),
        image: values.image
          ? values.image.name
          : "https://picsum.photos/seed/newproduct/300/200",
        vat:
          values.vat !== null && values.vat !== undefined
            ? Number(values.vat)
            : undefined,
        discount:
          values.discount !== null && values.discount !== undefined
            ? Number(values.discount)
            : undefined,
      };
      console.log("New Product Added:", newProductData);
      alert(`Product ${newProductData.name} would be added.`);
      navigate({ to: "/products" });
    } else if (productData) {
      const updatedProductData = {
        ...productData,
        name: values.name,
        description: values.description,
        price: Number(values.price),
        image: values.image
          ? values.image.name
          : values.existingImage || productData.image,
        vat:
          values.vat !== null && values.vat !== undefined
            ? Number(values.vat)
            : undefined,
        discount:
          values.discount !== null && values.discount !== undefined
            ? Number(values.discount)
            : undefined,
      };
      console.log("Product Updated:", updatedProductData);
      alert(`Product ${updatedProductData.name} would be updated.`);
      setIsEditing(false);
      navigate({
        to: "/products/$productId/details",
        params: { productId: productData.id },
      });
    }
  };

  const pageTitleFromData = productData?.name || "Product";
  const pageTitle = effectiveAddMode
    ? "Add New Product"
    : readOnlyMode
      ? pageTitleFromData
      : `Edit: ${pageTitleFromData}`;

  const AppShellWrapper = effectiveAddMode ? AppShell : Fragment;
  const appShellProps = effectiveAddMode
    ? { header: { height: 70 }, padding: "md" }
    : {};

  return (
    <AppShellWrapper {...appShellProps}>
      {effectiveAddMode && (
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
                to="/products"
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
              <Title order={3} c="white">
                {pageTitle}
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
      )}
      <AppShell.Main
        style={(theme) => ({
          backgroundColor:
            effectiveAddMode || productData
              ? computedColorScheme === "dark"
                ? theme.colors.dark[8]
                : theme.colors.gray[1]
              : undefined,
        })}
      >
        <Container size="md" py={effectiveAddMode ? "xl" : "sm"} px={0}>
          <Paper
            withBorder={effectiveAddMode || isEditing}
            shadow={effectiveAddMode || isEditing ? "md" : "none"}
            p="lg"
            radius="md"
          >
            {!effectiveAddMode && productData && (
              <>
                {!isEditing && (
                  <Group justify="flex-end" mb="xs">
                    <ActionIcon
                      variant="outline"
                      color="blue"
                      onClick={() => setIsEditing(true)}
                      title="Edit Product"
                    >
                      <IconPencil size={18} />
                    </ActionIcon>
                  </Group>
                )}
                <Title order={2} mb="md">
                  {pageTitleFromData}
                </Title>
              </>
            )}
            {effectiveAddMode && !productData && !isEditing && (
              <Title order={3} mb="lg" ta="center">
                {pageTitle}
              </Title>
            )}

            {readOnlyMode && productData ? (
              <Stack gap="xl">
                {form.values.existingImage && (
                  <Paper withBorder p="md" radius="md" shadow="xs">
                    <Title order={4} c="dimmed" mb="sm">
                      <Group gap="xs">
                        <ThemeIcon variant="light">
                          <IconPhoto size="1.1rem" />
                        </ThemeIcon>
                        Image
                      </Group>
                    </Title>
                    <MantineImage
                      src={form.values.existingImage}
                      alt={form.values.name}
                      maw={300}
                      mah={300}
                      fit="contain"
                      radius="sm"
                      style={{ margin: "auto" }}
                    />
                  </Paper>
                )}
                <Paper withBorder p="md" radius="md" shadow="xs">
                  <Title order={4} c="dimmed" mb="sm">
                    <Group gap="xs">
                      <ThemeIcon variant="light">
                        <IconInfoCircle size="1.1rem" />
                      </ThemeIcon>
                      General Information
                    </Group>
                  </Title>
                  <DisplayField
                    label="Product Name"
                    value={form.values.name}
                    isLargeText
                  />
                  <DisplayField
                    label="Description"
                    value={form.values.description}
                  />
                </Paper>

                <Paper withBorder p="md" radius="md" shadow="xs">
                  <Title order={4} c="dimmed" mb="sm">
                    <Group gap="xs">
                      <ThemeIcon variant="light">
                        <IconCash size="1.1rem" />
                      </ThemeIcon>
                      Pricing Details
                    </Group>
                  </Title>
                  <SimpleGrid cols={{ base: 1, sm: 3 }}>
                    <DisplayField
                      label="Price"
                      value={`£${Number(form.values.price).toFixed(2)}`}
                    />
                    <DisplayField
                      label="VAT"
                      value={
                        form.values.vat !== null &&
                        form.values.vat !== undefined
                          ? `${form.values.vat}%`
                          : "N/A"
                      }
                    />
                    <DisplayField
                      label="Discount"
                      value={
                        form.values.discount !== null &&
                        form.values.discount !== undefined
                          ? `${form.values.discount}%`
                          : "N/A"
                      }
                    />
                  </SimpleGrid>
                </Paper>
              </Stack>
            ) : (
              <form onSubmit={form.onSubmit(handleSubmit)}>
                <Stack gap="md">
                  <TextInput
                    label="Product Name"
                    placeholder="Enter product name"
                    required
                    {...form.getInputProps("name")}
                  />
                  <Textarea
                    label="Description"
                    placeholder="Enter product description"
                    required
                    minRows={3}
                    autosize
                    {...form.getInputProps("description")}
                  />
                  {form.values.existingImage && !form.values.image && (
                    <Box mb="xs">
                      <MantineText size="sm" fw={500}>
                        Current Image:
                      </MantineText>
                      <MantineImage
                        src={form.values.existingImage}
                        alt="Current product image"
                        width={80}
                        height={80}
                        fit="contain"
                        radius="sm"
                      />
                    </Box>
                  )}
                  <FileInput
                    label={
                      form.values.existingImage
                        ? "Change Product Image (Optional)"
                        : "Product Image (Optional)"
                    }
                    placeholder="Upload an image"
                    accept="image/*"
                    {...form.getInputProps("image")}
                  />
                  <SimpleGrid cols={3} spacing="md">
                    <NumberInput
                      label="Price (£)"
                      placeholder="0.00"
                      required
                      min={0.01}
                      step={0.01}
                      decimalScale={2}
                      fixedDecimalScale
                      {...form.getInputProps("price")}
                    />
                    <NumberInput
                      label="VAT (%)"
                      placeholder="e.g., 20"
                      min={0}
                      max={100}
                      step={1}
                      allowDecimal={false}
                      {...form.getInputProps("vat")}
                    />
                    <NumberInput
                      label="Discount (%)"
                      placeholder="e.g., 10"
                      min={0}
                      max={100}
                      step={1}
                      allowDecimal={false}
                      {...form.getInputProps("discount")}
                    />
                  </SimpleGrid>
                </Stack>
                {(effectiveAddMode || isEditing) && (
                  <Group justify="flex-end" mt="xl">
                    <Button
                      variant="default"
                      onClick={() => {
                        if (!effectiveAddMode && isEditing) {
                          setIsEditing(false);
                          if (productData) {
                            form.setValues({
                              name: productData.name,
                              description: productData.description,
                              price: productData.price,
                              image: null,
                              existingImage: productData.image,
                              vat:
                                productData.vat !== undefined
                                  ? productData.vat
                                  : null,
                              discount:
                                productData.discount !== undefined
                                  ? productData.discount
                                  : null,
                            });
                            form.resetDirty();
                          }
                        } else {
                          navigate({ to: "/products" });
                        }
                      }}
                      leftSection={<IconArrowLeft size={14} />}
                    >
                      {effectiveAddMode ? "Cancel" : "Cancel Edit"}
                    </Button>
                    <Button
                      type="submit"
                      leftSection={<IconDeviceFloppy size={14} />}
                    >
                      {effectiveAddMode ? "Save Product" : "Update Product"}
                    </Button>
                  </Group>
                )}
              </form>
            )}
          </Paper>
        </Container>
      </AppShell.Main>
    </AppShellWrapper>
  );
}
