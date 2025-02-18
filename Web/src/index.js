import React from "react";
import ReactDOM from "react-dom/client";
import "../node_modules/font-awesome/css/font-awesome.min.css";
import "../node_modules/bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Provider } from "react-redux";
import store from "./redux/store";
import AuthWrapper from "./components/AuthWrapper"; // Import AuthWrapper

import {
  Home,
  Product,
  Products,
  AboutPage,
  ContactPage,
  Cart,
  Login,
  Register,
  Checkout,
  PageNotFound,
  Dashboard,
  Products_Ad,
  OrderList,
  ProductStock,
  AddProducts,
  EditProducts,
  Customer,
  PurchasesHistory,
} from "./pages";
import ScrollToTop from "./components/ScrollToTop";
import { Toaster } from "react-hot-toast";

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <BrowserRouter>
    <ScrollToTop>
      <Provider store={store}>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Các trang yêu cầu đăng nhập sẽ được bọc bởi AuthWrapper */}
          <Route
            path="/*"
            element={
              <AuthWrapper>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/product" element={<Products />} />
                  <Route path="/product/:id" element={<Product />} />
                  <Route path="/about" element={<AboutPage />} />
                  <Route path="/contact" element={<ContactPage />} />
                  <Route path="/cart" element={<Cart />} />
                  <Route path="/checkout" element={<Checkout />} />
                  <Route path="*" element={<PageNotFound />} />
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/products_ad" element={<Products_Ad />} />
                  <Route path="/orderlist" element={<OrderList />} />
                  <Route path="/productstock" element={<ProductStock />} />
                  <Route path="/addproduct" element={<AddProducts />} />
                  <Route path="/editproducts" element={<EditProducts />} />
                  <Route path="/customer" element={<Customer />} />
                  <Route path="/purchaseshistory" element={<PurchasesHistory />} />
                </Routes>
              </AuthWrapper>
            }
          />
        </Routes>
      </Provider>
    </ScrollToTop>
    <Toaster />
  </BrowserRouter>
);
