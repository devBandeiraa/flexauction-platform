import { lazy, Suspense } from 'react';
import { Navigate, Route, Routes, useLocation, useParams } from 'react-router-dom';
import { Toaster } from '@/components/ui/sonner';
import { Layout } from '@/components/layout/Layout';
import { ScrollToTop } from '@/components/shared/ScrollToTop';
import { RequireAuth } from '@/components/RequireAuth';
import { useBootstrapAuth } from '@/hooks/useAuth';
import { Home } from '@/pages/Home';

// Route-level code splitting — keep the landing eager, lazy-load the rest.
const Search = lazy(() => import('@/pages/Search').then((m) => ({ default: m.Search })));
const AuctionDetail = lazy(() =>
  import('@/pages/AuctionDetail').then((m) => ({ default: m.AuctionDetail })),
);
const Dashboard = lazy(() => import('@/pages/Dashboard').then((m) => ({ default: m.Dashboard })));
const ComoFunciona = lazy(() =>
  import('@/pages/ComoFunciona').then((m) => ({ default: m.ComoFunciona })),
);
const Sobre = lazy(() => import('@/pages/Sobre').then((m) => ({ default: m.Sobre })));
const Contato = lazy(() => import('@/pages/Contato').then((m) => ({ default: m.Contato })));
const Login = lazy(() => import('@/pages/Login').then((m) => ({ default: m.Login })));
const Cadastro = lazy(() => import('@/pages/Cadastro').then((m) => ({ default: m.Cadastro })));
const NotFound = lazy(() => import('@/pages/NotFound').then((m) => ({ default: m.NotFound })));

/** Keep old links alive: /busca -> /leiloes (preserving query), /lote/:id -> /leilao/:id. */
function LegacySearchRedirect() {
  const { search } = useLocation();
  return <Navigate to={`/leiloes${search}`} replace />;
}

function LegacyLotRedirect() {
  const { id } = useParams();
  return <Navigate to={`/leilao/${id}`} replace />;
}

function RouteFallback() {
  return (
    <div className="flex min-h-[40vh] items-center justify-center text-sm text-muted-foreground">
      Carregando...
    </div>
  );
}

function App() {
  useBootstrapAuth();

  return (
    <>
      <ScrollToTop />
      <Suspense fallback={<RouteFallback />}>
        <Routes>
          {/* Auth screens use their own split-screen layout (no Header/Footer). */}
          <Route path="/login" element={<Login />} />
          <Route path="/cadastro" element={<Cadastro />} />

          <Route element={<Layout />}>
            <Route path="/" element={<Home />} />
            <Route path="/leiloes" element={<Search />} />
            <Route path="/leilao/:id" element={<AuctionDetail />} />
            <Route path="/sobre" element={<Sobre />} />
            <Route path="/contato" element={<Contato />} />
            <Route path="/como-funciona" element={<ComoFunciona />} />
            <Route
              path="/painel"
              element={
                <RequireAuth>
                  <Dashboard />
                </RequireAuth>
              }
            />

            {/* Legacy redirects */}
            <Route path="/busca" element={<LegacySearchRedirect />} />
            <Route path="/lote/:id" element={<LegacyLotRedirect />} />

            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </Suspense>
      <Toaster richColors position="top-right" />
    </>
  );
}

export default App;
