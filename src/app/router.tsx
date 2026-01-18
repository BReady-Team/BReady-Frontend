import { createBrowserRouter } from 'react-router-dom'

import HomePage from '../features/home/pages/HomePage'
import LoginPage from '../features/auth/pages/LoginPage'
import SignupPage from '../features/auth/pages/SignupPage'
import PlanDetailPage from '../features/plans/pages/PlanDetailPage'

import MainLayout from '../components/layout/MainLayout'
import AuthLayout from '../components/layout/AuthLayout'

export const router = createBrowserRouter([
  {
    element: <AuthLayout />,
    children: [
      { path: '/login', element: <LoginPage /> },
      { path: '/signup', element: <SignupPage /> },
    ],
  },
  {
    element: <MainLayout />,
    children: [
      { path: '/', element: <HomePage /> },
      { path: '/plans/:planId', element: <PlanDetailPage /> },
    ],
  },
])
