import { useRoutes } from "react-router-dom";
import AppIndex from "./AppIndex";
import Home from "../pages/Home";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Profile from "../pages/Profile";

function AppNavigation() {
  let element = useRoutes([
    {
      element: <AppIndex />,
      children: [
        {
          path: "/",
          element: <Login />,
          children: [{ index: true }],
        },

        {
          path: "/profile",
          element: <Profile />,
        },
      ],
    },
    {
      path: "/register",
      element: <Register />,
    },
    // {
    //   path: "/login",
    //   element: <Login />,
    // },
  ]);
  return element;
}
export default AppNavigation;
