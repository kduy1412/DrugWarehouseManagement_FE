import "./App.css";
import { ThemeProvider } from "antd-style";
import { RouterProvider } from "react-router-dom";
import { router } from "./routes";
import { ConfigProvider } from "antd";
import React from "react";

function App() {
  return (
    <ConfigProvider
      theme={{
        token: {
          fontFamily: "Montserrat",
        },
      }}
    >
      <ThemeProvider>
        <RouterProvider router={router} />
      </ThemeProvider>
    </ConfigProvider>
  );
}

export default App;
