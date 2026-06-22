import { Route, Routes } from 'react-router-dom';
import { Toaster } from '@/components/ui/sonner';
import { Layout } from '@/components/layout/Layout';
import { RequireAuth } from '@/components/RequireAuth';
import { useBootstrapAuth } from '@/hooks/useAuth';
import { Home } from '@/pages/Home';
import { Search } from '@/pages/Search';
import { AuctionDetail } from '@/pages/AuctionDetail';
import { Dashboard } from '@/pages/Dashboard';
import { ComoFunciona } from '@/pages/ComoFunciona';
import { NotFound } from '@/pages/NotFound';

function App() {
  useBootstrapAuth();

  return (
    <>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/busca" element={<Search />} />
          <Route path="/lote/:id" element={<AuctionDetail />} />
          <Route
            path="/painel"
            element={
              <RequireAuth>
                <Dashboard />
              </RequireAuth>
            }
          />
          <Route path="/como-funciona" element={<ComoFunciona />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
      <Toaster richColors position="top-right" />
    </>
  );
}

export default App;
