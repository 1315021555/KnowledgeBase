import { createBrowserRouter } from "react-router-dom";
import Main from "../pages/Main";
import AIChat from "../pages/Main/widgets/AIChat";
import Home from "../pages/Main/widgets/Home";
import Note from "../pages/Main/widgets/Note";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Main />,
    children: [
      {
        index: true,
        path: "/home",
        element: <Home />,
      },
      {
        path: "/chat",
        element: <AIChat />,
      },
      {
        path: "/knowledge",
        element: <Note></Note>,
      },
    ],
  },
]);

export default router;
