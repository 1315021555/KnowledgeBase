import React from 'react'
import { SaasProvider } from '@saas-ui/react'
import * as ReactDOM from 'react-dom/client'
import router from './router'
import { RouterProvider } from 'react-router-dom'

const rootElement = document.getElementById('root')
if (rootElement) {
  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <SaasProvider>
        <RouterProvider router={router} />
      </SaasProvider>
    </React.StrictMode>
  )
}
