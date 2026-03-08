import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
  Navigate,
} from "react-router-dom";
import { Home, PublicHome, PublicHomeKenya, Auth, Orders, Tables, Menu, Dashboard, Inventory } from "./pages";
import Header from "./components/shared/Header";
import BottomNav from "./components/shared/BottomNav";
import { useSelector } from "react-redux";
import useLoadData from "./hooks/useLoadData";
import FullScreenLoader from "./components/shared/FullScreenLoader"

function Layout() {
  const isLoading = useLoadData();
  const location = useLocation();
  const { isAuth } = useSelector(state => state.user);
  const isPublicRoute = ["/", "/kenya", "/auth"].includes(location.pathname);
  const showShell = isAuth && !isPublicRoute && location.pathname !== "/ops";

  if(isLoading && !isPublicRoute) return <FullScreenLoader />

  return (
    <>
      {showShell && <Header />}
      <Routes>
        <Route
          path="/"
          element={<PublicHome />}
        />
        <Route
          path="/kenya"
          element={<PublicHomeKenya />}
        />
        <Route path="/auth" element={isAuth ? <Navigate to="/ops" /> : <Auth />} />
        <Route
          path="/ops"
          element={
            <ProtectedRoutes>
              <Home />
            </ProtectedRoutes>
          }
        />
        <Route
          path="/orders"
          element={
            <ProtectedRoutes>
              <Orders />
            </ProtectedRoutes>
          }
        />
        <Route
          path="/tables"
          element={
            <ProtectedRoutes>
              <Tables />
            </ProtectedRoutes>
          }
        />
        <Route
          path="/menu"
          element={
            <ProtectedRoutes>
              <Menu />
            </ProtectedRoutes>
          }
        />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoutes>
              <Dashboard />
            </ProtectedRoutes>
          }
        />
        <Route
          path="/inventory"
          element={
            <ProtectedRoutes>
              <Inventory />
            </ProtectedRoutes>
          }
        />
        <Route path="*" element={<div>Not Found</div>} />
      </Routes>
      {showShell && <BottomNav />}
    </>
  );
}

function ProtectedRoutes({ children }) {
  const { isAuth } = useSelector((state) => state.user);
  if (!isAuth) {
    return <Navigate to="/auth" />;
  }

  return children;
}

function App() {
  return (
    <Router>
      <Layout />
    </Router>
  );
}

export default App;
