// pages/_app.js
import { CssBaseline, ThemeProvider } from "@mui/material";
import { useRouter } from "next/router";
import TopNav from "../components/TopNav";
import withAuth from "../hoc/withAuth2";
import theme from "../theme";

function App({ Component, pageProps }) {
  const router = useRouter();

  const excludedPaths = ["/register", "/login"];
  const shouldShowTopNav = !excludedPaths.includes(router.pathname);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {shouldShowTopNav && <TopNav />}
      <Component {...pageProps} />
    </ThemeProvider>
  );
}

export default withAuth(App);
