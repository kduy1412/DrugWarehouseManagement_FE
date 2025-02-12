import './App.css';
import { ThemeProvider } from 'antd-style';
import {
  Route,
  createBrowserRouter,
  createRoutesFromElements,
  RouterProvider,
} from "react-router-dom";
import RootComponent  from './components/layout/RootComponent';
import DashBoard from './components/layout/DashBoard';
import RootPage from './components/layout/RootPage';
function App() {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path="/" element={<RootComponent />}>
        <Route index element={<RootPage />} />
        <Route path="/dashboard" element={<DashBoard/>}></Route>
      </Route>
    )
  );
  return (
    <ThemeProvider>
      <RouterProvider router={router} />
    </ThemeProvider>
  );
}

export default App;
