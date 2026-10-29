import { BrowserRouter, Route, Routes } from "react-router-dom";
import Layout from "@/components/Layout";
import { CartProvider } from "@/lib/cart";
import { ToastProvider } from "@/lib/toast";
import Home from "@/pages/Home";
import Shop from "@/pages/Shop";
import Product from "@/pages/Product";
import Cart from "@/pages/Cart";
import Kashrut from "@/pages/Kashrut";
import About from "@/pages/About";
import NotFound from "@/pages/NotFound";

const App = () => (
  <CartProvider>
    <BrowserRouter>
      <ToastProvider>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Home />} />
            <Route path="/shop" element={<Shop />} />
            <Route path="/product/:id" element={<Product />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/kashrut" element={<Kashrut />} />
            <Route path="/about" element={<About />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </ToastProvider>
    </BrowserRouter>
  </CartProvider>
);

export default App;
