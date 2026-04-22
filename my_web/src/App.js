import React, { Fragment, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { routes } from "./routes";
import DefaultComponent from "./components/DefaultComponent/DefaultComponent";

import { useDispatch } from "react-redux";
import { updateUser } from "./redux/slides/userSlide";

import * as UserService from "./services/UserService";
import { decodeToken, getAccessToken, isTokenExpired, logout } from "./utils";

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    const initUser = async () => {
      const accessToken = getAccessToken();

      if (!accessToken) return;

      try {
        // ✅ decode an toàn
        const decoded = decodeToken(accessToken);

        if (!decoded?.id) {
          console.warn("Token không hợp lệ");
          logout();
          return;
        }

        // ❗ chỉ log thôi (để interceptor xử lý)
        if (isTokenExpired(accessToken)) {
          console.warn("Access token hết hạn → interceptor sẽ refresh");
        }

        // 🔥 CALL API (QUAN TRỌNG)
        const userDetails = await UserService.getDetailsUser(decoded.id);

        if (userDetails?.status === "OK") {
          dispatch(
            updateUser({
              ...userDetails.data,
              id: decoded.id,
              isAdmin: decoded.isAdmin,
              access_token: accessToken,
            }),
          );
        } else {
          console.warn("Không lấy được user");
        }
      } catch (error) {
        console.error("INIT USER ERROR:", error);

        // ❗ CHỈ logout nếu refresh cũng fail
        if (
          error?.response?.status === 401 &&
          error?.response?.data?.code === "TOKEN_EXPIRED"
        ) {
          logout();
        }
      }
    };

    initUser();
  }, [dispatch]);

  return (
    <Router
      future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true,
      }}
    >
      <Routes>
        {routes.map((route) => {
          const Page = route.page;
          const Layout = route.isShowHeader ? DefaultComponent : Fragment;

          return (
            <Route
              key={route.path}
              path={route.path}
              element={
                <Layout>
                  <Page />
                </Layout>
              }
            />
          );
        })}
      </Routes>
    </Router>
  );
}

export default App;
