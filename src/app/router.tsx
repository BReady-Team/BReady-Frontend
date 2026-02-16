import { createBrowserRouter } from 'react-router-dom'

import HomePage from '../features/home/pages/HomePage'
import LoginPage from '../features/auth/pages/LoginPage'
import SignupPage from '../features/auth/pages/SignupPage'

import PlanDetailPageWrapper from '../features/plans/pages/PlanDetailPageWrapper'
import PlanListPage from '../features/plans/pages/PlanListPage'
import PlanCreatePage from '@/features/plans/pages/PlanCreatePage'

import StatsPage from '../features/stats/pages/StatsPage'
import MyPage from '@/features/user/pages/MyPage'

import MainLayout from '../components/layout/MainLayout'
import AuthLayout from '../components/layout/AuthLayout'

import ProtectedRoute from '../routes/ProtectedRoute'

export const router = createBrowserRouter([
  // 로그인 전 영역
  {
    element: <AuthLayout />,
    children: [
      { path: '/', element: <HomePage /> },
      { path: '/login', element: <LoginPage /> },
      { path: '/signup', element: <SignupPage /> },
    ],
  },

  // 로그인 후 영역
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <MainLayout />,
        children: [
          { path: '/plans', element: <PlanListPage /> },
          { path: '/plans/new', element: <PlanCreatePage /> },
          { path: '/plans/:planId/edit', element: <PlanCreatePage /> },
          { path: '/plans/:planId', element: <PlanDetailPageWrapper /> },
          { path: '/stats', element: <StatsPage /> },
          { path: '/mypage', element: <MyPage /> },
        ],
      },
    ],
  },
])
