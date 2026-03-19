import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "./store";
import MainLayout from "./layout/MainLayout";
import Home from "./pages/Home/Home";
import CategoryPage from "./pages/category/CategoryPage";
import ProductDetail from "./pages/product/ProductDetail";
import CartPage from "./pages/cart/CartPage";

function App() {
  return (
    <Provider store={store}>
      <Router>
        <MainLayout>
          <Routes>
            <Route path="/"               element={<Home />} />
            <Route path="/category"       element={<CategoryPage />} />
            <Route path="/category/:slug" element={<CategoryPage />} />
            <Route path="/product/:id"    element={<ProductDetail />} />
            <Route path="/cart"           element={<CartPage />} />
          </Routes>
        </MainLayout>
      </Router>
    </Provider>
  );
}

export default App;