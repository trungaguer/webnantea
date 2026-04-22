//import OrderPage from "../pages/OrderPage/OrderPage";
import ProductsPage from "../pages/ProductsPage/ProductsPage";
import HomePage from "../pages/HomePage/HomePage";
import NotFoundPage from "../pages/NotFoundPage/NotFoundPage";
//import TypeProductsPage from "../pages/TypeProductsPage/TypeProductsPage";
import SignInPage from "../pages/SignInPage/SignInPage";
import SignUpPage from "../pages/SignUpPage/SignUpPage";
import ProductDetailsPage from "../pages/ProductDetailsPage/ProductDetailsPage";
import ProfilePage from "../pages/Profile/ProfilePage";
//import MyOrderPage from "../pages/MyOrder/MyOrder";
import AdminPage from "../pages/AdminPage/AdminPage";
import SearchPage from "../pages/SearchPage/SearchPage";
import PaymentPage from "../pages/PaymentPage/PaymentPage";
import CartPage from "../pages/CartPage/CartPage";
import CheckoutPage from "../pages/ChechoutPage/CheckoutPage";
import MyOrder from "../pages/MyOrder/MyOrder";

export const routes = [
  { path: "/", page: HomePage, isShowHeader: true },
  //{ path: "/order", page: OrderPage, isShowHeader: true },
  { path: "/product", page: ProductsPage, isShowHeader: true },
  //{ path: "/:type", page: TypeProductsPage, isShowHeader: true },
  { path: "/sign-in", page: SignInPage, isShowHeader: false },
  { path: "/sign-up", page: SignUpPage, isShowHeader: false },
  {
    path: "/product-details/:id",
    page: ProductDetailsPage,
    isShowHeader: true,
  },
  {
    path: "/profile-user",
    page: ProfilePage,
    isShowHeader: true,
  },
  { path: "/my-order", page: MyOrder, isShowHeader: true },
  {
    path: "/system/admin",
    page: AdminPage,
    isShowHeader: false,
    isPrivated: true,
  },
  {
    path: "/payment",
    page: PaymentPage,
    isShowHeader: true,
  },
  {
    path: "/cart",
    page: CartPage,
    isShowHeader: true,
  },

  {
    path: "/checkout",
    page: CheckoutPage,
    isShowHeader: true,
  },
  { path: "/search", page: SearchPage, isShowHeader: true },
  { path: "*", page: NotFoundPage },
];
