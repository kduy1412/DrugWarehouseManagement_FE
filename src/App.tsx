import "./App.css";
import { ThemeProvider } from "antd-style";
import { RouterProvider } from "react-router-dom";
import { router } from "./routes";
import React from "react";
import { ConfigProvider } from "antd";

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
