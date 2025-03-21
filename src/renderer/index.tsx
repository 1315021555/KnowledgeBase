import React from "react";
import { SaasProvider } from "@saas-ui/react";
import * as ReactDOM from "react-dom/client";
import router from "./router";
import { RouterProvider } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "./redux/store";

const rootElement = document.getElementById("root");
if (rootElement) {
  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <Provider store={store}>
        <SaasProvider>
          <RouterProvider router={router} />
        </SaasProvider>
      </Provider>
    </React.StrictMode>
  );
}
