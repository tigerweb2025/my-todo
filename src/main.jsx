import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './components/App'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Todo from './components/Todo'
import Done from './components/Done'
import Corbeille from './components/Corbeille'
import { Toaster } from 'react-hot-toast'

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        path: "/",
        element: <Todo />,
      },
      {
        path: "/done",
        element: <Done />,
      },
      {
        path: "/trash",
        element: <Corbeille />,
      },
    ],
  },
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Toaster />
    <RouterProvider router={router} />
  </StrictMode>
)
