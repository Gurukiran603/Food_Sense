import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { api, setAuthToken } from '../lib/api'

export default function SignIn() {
	const nav = useNavigate()
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')
	const [error, setError] = useState<string | null>(null)
	const [loading, setLoading] = useState(false)

	async function onSubmit(e: React.FormEvent) {
		e.preventDefault()
		setError(null)
		setLoading(true)
		try {
			const res = await api.post('/api/auth/login', { email, password })
			setAuthToken(res.data.access_token)
			nav('/dashboard')
		} catch (err: any) {
			setError(err?.response?.data?.detail ?? 'Login failed')
		} finally {
			setLoading(false)
		}
	}

	return (
		<div className="min-h-screen bg-fruit-mix bg-cover bg-center flex items-center justify-center p-4">
			<div className="w-full max-w-md bg-white/90 backdrop-blur rounded-2xl shadow-soft p-6">
				<h1 className="text-2xl font-bold text-center mb-1 text-rose-700">FoodSense</h1>
				<p className="text-center text-sm text-gray-600 mb-6">Welcome back</p>
				<form onSubmit={onSubmit} className="space-y-4">
					<input className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-rose-200" type="email" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} required />
					<input className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-rose-200" type="password" placeholder="Password" value={password} onChange={e=>setPassword(e.target.value)} required />
					{error && <div className="text-red-600 text-sm">{error}</div>}
					<button disabled={loading} className="w-full bg-rose-600 hover:bg-rose-700 text-white rounded px-3 py-2">
						{loading ? 'Signing in...' : 'Sign In'}
					</button>
				</form>
				<div className="my-4 text-center text-gray-500">or</div>
				<button className="w-full border rounded px-3 py-2 flex items-center justify-center gap-2">
					<img alt="google" src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" className="w-5 h-5" />
					Continue with Google
				</button>
				<p className="text-sm text-center mt-4">No account? <Link to="/register" className="text-rose-700 font-medium">Create one</Link></p>
			</div>
		</div>
	)
}
