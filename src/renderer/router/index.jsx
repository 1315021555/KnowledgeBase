import { createBrowserRouter } from "react-router-dom";
import Main from "../pages/Main";
import AIChat from "../pages/Main/views/AIChat";
import Home from "../pages/Main/views/Home";
import KnowledgePage from "../pages/Main/views/KnowledgePage";

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
    ],
  },
]);

export default router;
