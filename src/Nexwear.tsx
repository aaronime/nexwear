import { RouterProvider } from "react-router";
import { AppRouter } from "./app.router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Toaster } from "./components/ui/sonner";
import { CheckAuthProvider } from "./auth/components/CheckAuthProvider";

export function Nexwear() {
  const queryClient = new QueryClient();

  return (
    <>
      <QueryClientProvider client={queryClient}>
        <CheckAuthProvider>
          <RouterProvider router={AppRouter} />
          <ReactQueryDevtools initialIsOpen={true} />
          <Toaster />
        </CheckAuthProvider>
      </QueryClientProvider>
    </>
  );
}
