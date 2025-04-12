import "./App.css";
import { ThemeProvider } from "antd-style";
import { RouterProvider } from "react-router-dom";
import { router } from "./routes";
import { ConfigProvider } from "antd";
import viVN from "antd/locale/vi_VN";
import "dayjs/locale/vi";

function App() {
  return (
    <ConfigProvider
      theme={{
        token: {
          fontFamily: "Montserrat",
        },
      }}
      locale={viVN}
    >
      <ThemeProvider>
        <RouterProvider router={router} />
      </ThemeProvider>
    </ConfigProvider>
  );
}

export default App;
