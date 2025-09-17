import { Navigate, useLocation } from 'react-router-dom'
import { isAuthenticated, loadAuthTokenFromStorage } from '../lib/api'
import { useEffect, useState } from 'react'

export default function RequireAuth({ children }: { children: JSX.Element }) {
	const location = useLocation()
	const [loaded, setLoaded] = useState(false)
	useEffect(() => { loadAuthTokenFromStorage(); setLoaded(true) }, [])
	if (!loaded) return null
	if (!isAuthenticated()) {
		return <Navigate to="/signin" state={{ from: location }} replace />
	}
	return children
}

