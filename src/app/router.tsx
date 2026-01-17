import { createBrowserRouter } from 'react-router-dom'
import HomePage from '../features/home/pages/HomePage'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <HomePage />,
  },
])
