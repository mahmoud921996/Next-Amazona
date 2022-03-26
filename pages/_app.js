import { PayPalScriptProvider } from "@paypal/react-paypal-js";
import { CacheProvider } from "@emotion/react";
import createEmotionCache from "../utility/createEmotionCache";
import ProductsState from "../store/products/productsProvider";
import { SessionProvider } from "next-auth/react";
import OrdersProvider from "../store/ordersContext/OrdersProvider";
import AdminProvider from "../store/admin/adminProvider";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import theme from "../styles/theme";
import darkTheme from "../styles/darkTheme";
import { SnackbarProvider } from "notistack";
import ThemeContext from "../store/ThemeContext";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useEffect, useState } from "react";

import dynamic from "next/dynamic";

const Layout = dynamic(() => import("../components/layout/Layout"));

const clientSideEmotionCache = createEmotionCache();

const MyApp = props => {
  const {
    Component,
    emotionCache = clientSideEmotionCache,
    pageProps,
    session,
  } = props;
  const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");
  const [darkMode, setDarkMode] = useState(prefersDarkMode);

  useEffect(() => {
    const mode = localStorage.getItem("mode") === "true";
    setDarkMode(mode);
  }, []);

  const _setDarkMode = newmode => {
    localStorage.setItem("mode", newmode);
    setDarkMode(newmode);
  };

  return (
    <CacheProvider value={emotionCache}>
      <PayPalScriptProvider deferLoading={true}>
        <SnackbarProvider
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
        >
          <SessionProvider session={session}>
            <OrdersProvider>
              <ProductsState>
                <AdminProvider>
                  <ThemeContext.Provider
                    value={{ darkMode, setDarkMode: _setDarkMode }}
                  >
                    <ThemeProvider theme={darkMode ? darkTheme : theme}>
                      <CssBaseline />
                      <Layout>
                        <Component {...pageProps} />
                      </Layout>
                    </ThemeProvider>
                  </ThemeContext.Provider>
                </AdminProvider>
              </ProductsState>
            </OrdersProvider>
          </SessionProvider>
        </SnackbarProvider>
      </PayPalScriptProvider>
    </CacheProvider>
  );
};
export default MyApp;
