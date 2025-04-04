import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainLayout from "./layout/MainLayout";
import Index from "./pages/Index";
import VehicleRegistration from "./pages/VehicleRegistration";
import PendingServices from "./pages/PendingServices";
import Employees from "./pages/Employees";
import Reports from "./pages/Reports";
import Inventory from "./pages/Inventory";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";
import RateService from "./pages/RateService";  // Importar nueva página

// Configura QueryClient con opciones más robustas
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false, // No recargar al cambiar de pestaña
      retry: 1, // Intentar una vez si falla
      staleTime: 5000 // Datos considerados frescos por 5 segundos
    }
  }
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route element={<MainLayout />}>
            <Route path="/" element={<Index />} />
            <Route path="/vehicle-registration" element={<VehicleRegistration />} />
            <Route path="/pending-services" element={<PendingServices />} />
            <Route path="/employees" element={<Employees />} />
            <Route path="/inventory" element={<Inventory />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/rate-service/:serviceId" element={<RateService />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;