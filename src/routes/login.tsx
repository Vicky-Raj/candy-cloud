import {
  Box,
  Button,
  Center,
  Paper,
  PasswordInput,
  Stack,
  Text,
  TextInput,
  rem,
  useMantineTheme,
  useMantineColorScheme,
} from "@mantine/core";

import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/login")({
  component: Login,
});

function Login() {
  const theme = useMantineTheme();
  const { colorScheme } = useMantineColorScheme();
  const isDark = colorScheme === "dark";

  const backgroundImage = isDark
    ? "url(/assets/bg_dark.png)"
    : "url(/assets/bg.png)";

  return (
    <Center
      style={{
        minHeight: "100vh",
        width: "100%",
        backgroundColor: isDark
          ? theme.colors.dark[7]
          : theme.colors.primaryColor[1],
        backgroundImage: backgroundImage,
        backgroundSize: "cover",
        backgroundPosition: "center center",
        backgroundRepeat: "no-repeat",
        transition:
          "filter 0.3s ease-in-out, background-color 0.3s ease-in-out, background-image 0.3s ease-in-out",
      }}
    >
      <Stack align="center" w="100%" maw={400} mx="auto" gap={0}>
        <Paper
          shadow="md"
          p="lg"
          radius="lg"
          w="100%"
          withBorder
          style={{
            backgroundColor: isDark ? theme.colors.dark[6] : theme.white,
          }}
        >
          <Stack gap="md" align="center" w="100%">
            <Box mb={rem(8)} mt={rem(-40)}>
              <img
                src="/assets/logo.jpeg"
                alt="Candy Cloud Delights Logo"
                style={{
                  width: rem(100),
                  height: rem(100),
                  borderRadius: "50%",
                  objectFit: "cover",
                  display: "block",
                  margin: "0 auto",
                  boxShadow: isDark
                    ? theme.shadows.md
                    : `0 2px 8px ${theme.colors.primaryColor[2]}`,
                }}
              />
            </Box>
            <Text
              size="xl"
              fw={700}
              ta="center"
              c={isDark ? theme.white : theme.colors.primaryColor[6]}
              mb="sm"
            >
              Welcome Back!
            </Text>
            <TextInput
              label="Email"
              placeholder="you@email.com"
              radius="md"
              size="md"
              required
              styles={{
                label: {
                  color: isDark
                    ? theme.colors.gray[5]
                    : theme.colors.primaryColor[7],
                },
                input: {
                  backgroundColor: isDark ? theme.colors.dark[5] : theme.white,
                  color: isDark ? theme.white : theme.black,
                },
              }}
              w="100%"
            />
            <PasswordInput
              label="Password"
              placeholder="Your password"
              radius="md"
              size="md"
              required
              styles={{
                label: {
                  color: isDark
                    ? theme.colors.gray[5]
                    : theme.colors.primaryColor[7],
                },
                input: {
                  backgroundColor: isDark ? theme.colors.dark[5] : theme.white,
                  color: isDark ? theme.white : theme.black,
                },
              }}
              w="100%"
            />
            <Button
              fullWidth
              radius="md"
              size="md"
              mt="md"
              color="primaryColor"
            >
              Login
            </Button>
          </Stack>
        </Paper>
      </Stack>
    </Center>
  );
}
