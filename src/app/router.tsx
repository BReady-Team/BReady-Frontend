import { createBrowserRouter } from 'react-router-dom'

import HomePage from '../features/home/pages/HomePage'
import LoginPage from '../features/auth/pages/LoginPage'
import SignupPage from '../features/auth/pages/SignupPage'
import PlanDetailPageWrapper from '../features/plans/pages/PlanDetailPageWrapper'
import MainLayout from '../components/layout/MainLayout'
import AuthLayout from '../components/layout/AuthLayout'
import StatsPage from '../features/stats/pages/StatsPage'

export const router = createBrowserRouter([
  {
    element: <AuthLayout />,
    children: [
      { path: '/login', element: <LoginPage /> },
      { path: '/signup', element: <SignupPage /> },
      { path: '/', element: <HomePage /> },
    ],
  },
  {
    element: <MainLayout />,
    children: [
      {
        path: '/plans/:planId',
        element: <PlanDetailPageWrapper />,
      },
      { path: '/stats', element: <StatsPage /> },
    ],
  },
])
