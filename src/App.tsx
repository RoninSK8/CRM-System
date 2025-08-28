import { createBrowserRouter, redirect, RouterProvider } from "react-router";
import TodosPage from "./pages/TodosPage";
import ProfilePage from "./pages/ProfilePage";

import SideMenu from "./layout/HomePageLayout";

const router = createBrowserRouter([
  {
    path: "/",
    element: <SideMenu />,
    children: [
      {
        index: true,
        loader: async () => redirect("/todos"),
      },
      {
        path: "/todos",
        element: <TodosPage />,
      },
      {
        path: "/profile",
        element: <ProfilePage />,
      },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
