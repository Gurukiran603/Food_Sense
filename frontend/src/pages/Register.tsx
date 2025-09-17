import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { api, setAuthToken } from '../lib/api'

export default function Register() {
	const nav = useNavigate()
	const [fullName, setFullName] = useState('')
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')
	const [error, setError] = useState<string | null>(null)
	const [loading, setLoading] = useState(false)

	async function onSubmit(e: React.FormEvent) {
		e.preventDefault()
		setError(null)
		setLoading(true)
		try {
			await api.post('/api/auth/register', { email, password, full_name: fullName })
			const res = await api.post('/api/auth/login', { email, password })
			setAuthToken(res.data.access_token)
			nav('/dashboard')
		} catch (err: any) {
			setError(err?.response?.data?.detail ?? 'Registration failed')
		} finally {
			setLoading(false)
		}
	}

	return (
		<div className="min-h-screen bg-fruit-citrus bg-cover bg-center flex items-center justify-center p-4">
			<div className="w-full max-w-md bg-white/90 backdrop-blur rounded-2xl shadow-soft p-6">
				<h1 className="text-2xl font-bold text-center mb-1 text-rose-700">Join FoodSense</h1>
				<form onSubmit={onSubmit} className="space-y-4 mt-4">
					<input className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-rose-200" type="text" placeholder="Full name" value={fullName} onChange={e=>setFullName(e.target.value)} />
					<input className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-rose-200" type="email" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} required />
					<input className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-rose-200" type="password" placeholder="Password" value={password} onChange={e=>setPassword(e.target.value)} required />
					{error && <div className="text-red-600 text-sm">{error}</div>}
					<button disabled={loading} className="w-full bg-rose-600 hover:bg-rose-700 text-white rounded px-3 py-2">
						{loading ? 'Creating...' : 'Create account'}
					</button>
				</form>
				<p className="text-sm text-center mt-4">Already have an account? <Link to="/signin" className="text-rose-700 font-medium">Sign in</Link></p>
			</div>
		</div>
	)
}
