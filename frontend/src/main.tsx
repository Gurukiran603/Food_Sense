import React from 'react'
import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom'
import './index.css'
import SignIn from './pages/SignIn'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import RequireAuth from './components/RequireAuth'

const router = createBrowserRouter([
	{ index: true, element: <Navigate to="/signin" replace /> },
	{ path: '/signin', element: <SignIn /> },
	{ path: '/register', element: <Register /> },
	{ path: '/dashboard', element: (
		<RequireAuth>
			<Dashboard />
		</RequireAuth>
	) },
])

ReactDOM.createRoot(document.getElementById('root')!).render(
	<React.StrictMode>
		<RouterProvider router={router} />
	</React.StrictMode>,
)
