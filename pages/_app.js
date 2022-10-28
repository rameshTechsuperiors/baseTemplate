import "../src/stylesheets/globals.css";
import { ThemeProvider } from "styled-components";
import { theme } from "../src/constants/theme";
import { Provider } from "react-redux";
import { createWrapper } from "next-redux-wrapper";
import store from "../src/store/index";
import "../src/stylesheets/globals.css";
import "bootstrap/dist/css/bootstrap.min.css";
// import "nprogress/nprogress.css";
// import "react-toastify/dist/ReactToastify.css";

function MyApp({ Component, pageProps }) {
  return (
    <>
      <ThemeProvider theme={theme}>
        <Provider store={store}>
          <Component {...pageProps} />
        </Provider>
      </ThemeProvider>
    </>
  );
}
const makeStore = () => store;
const wrapper = createWrapper(makeStore, { debug: false });

export default wrapper.withRedux(MyApp);
