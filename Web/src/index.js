import React from "react";
import ReactDOM from "react-dom/client";
import "../node_modules/font-awesome/css/font-awesome.min.css";
import "../node_modules/bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Provider } from "react-redux";
import store from "./redux/store";
import AuthWrapper from "./components/AuthWrapper"; // Import AuthWrapper
import IsAdmin from "./components/IsAdmin";
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
  ProductsAd,
  OrderList,
  ProductStock,
  AddProducts,
  EditProducts,
  Customer,
  PurchasesHistory,
  ManageMyAccount,
  MyProfile,
  AddressBook,
  MyOrder,
  OrderSuccess,
  OrderFail
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
                  <Route path="/dashboard" element={<IsAdmin><Dashboard /></IsAdmin>} />
                  <Route path="/productsAd" element={<IsAdmin><ProductsAd /></IsAdmin>} />
                  <Route path="/orderlist" element={<IsAdmin><OrderList /></IsAdmin>} />
                  <Route path="/productstock" element={<IsAdmin><ProductStock /></IsAdmin>} />
                  <Route path="/addproduct" element={<IsAdmin><AddProducts /></IsAdmin>} />
                  <Route path="/editproducts" element={<IsAdmin><EditProducts /></IsAdmin>} />
                  <Route path="/customer" element={<IsAdmin><Customer /></IsAdmin>} />
                  <Route path="/purchaseshistory" element={<IsAdmin><PurchasesHistory /></IsAdmin>} />
                  <Route path="/ManageMyAccount" element={<ManageMyAccount />} />
                  <Route path="/MyProfile" element={<MyProfile />} />
                  <Route path="/AddressBook" element={<AddressBook />} />
                  <Route path="/MyOrder" element={<MyOrder />} />
                  <Route path="/OrderSuccess" element={<OrderSuccess />} />
                  <Route path="/OrderFail" element={<OrderFail />} />
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
