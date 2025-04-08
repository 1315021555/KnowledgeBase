import { createBrowserRouter } from "react-router-dom";
import Main from "../pages/Main";
import AIChat from "../pages/Main/views/AIChat";
import Home from "../pages/Main/views/Home";
import KnowledgePage from "../pages/Main/views/KnowledgePage";
import SettingsPage from "../pages/Main/views/Setting";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Main />,
    children: [
      {
        index: true,
        // path: "/home",
        element: <Home />,
      },
      {
        path: "/chat",
        element: <AIChat />,
      },
      {
        path: "/knowledge",
        element: <KnowledgePage />,
      },
      {
        path: "/setting",
        element: <SettingsPage />,
      },
    ],
  },
]);

export default router;
