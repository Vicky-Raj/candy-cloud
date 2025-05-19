import { createRootRoute, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import {
  createTheme,
  MantineProvider,
  type MantineColorsTuple,
} from "@mantine/core";
import "@mantine/core/styles.css";

const primaryColor: MantineColorsTuple = [
  "#e1f8ff",
  "#cbedff",
  "#9ad7ff",
  "#64c1ff",
  "#3aaefe",
  "#20a2fe",
  "#099cff",
  "#0088e4",
  "#0079cd",
  "#0068b6",
];

const theme = createTheme({
  colors: {
    primaryColor,
  },
  primaryColor: "primaryColor",
});

export const Route = createRootRoute({
  component: () => (
    <MantineProvider theme={theme} defaultColorScheme="light">
      <Outlet />
      <TanStackRouterDevtools />
    </MantineProvider>
  ),
});
