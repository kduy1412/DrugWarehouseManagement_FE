import './App.css';
import { ThemeProvider } from 'antd-style';
import {
  Route,
  createBrowserRouter,
  createRoutesFromElements,
  RouterProvider,
} from "react-router-dom";
import RootComponent  from './components/RootComponent';
import HomePage from './pages/HomePage';
import RootPage from './components/RootPage';
function App() {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path="/" element={<RootComponent />}>
        <Route index element={<RootPage />} />
        <Route path="/homepage" element={<HomePage/>}></Route>
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
