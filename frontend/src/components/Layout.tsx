import { Link } from 'react-router-dom'

export default function Layout({ children }: { children: React.ReactNode }) {
	return (
		<div className="min-h-screen bg-gradient-to-b from-rose-50 to-orange-50">
			<header className="bg-white/80 backdrop-blur sticky top-0 z-20 border-b">
				<div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
					<Link to="/" className="text-xl font-bold text-rose-700">FoodSense</Link>
					<nav className="flex items-center gap-3 text-sm">
						<Link to="/signin" className="text-rose-700 hover:underline">Sign in</Link>
						<Link to="/register" className="bg-rose-600 hover:bg-rose-700 text-white px-3 py-1.5 rounded shadow-soft">Get started</Link>
					</nav>
				</div>
			</header>
			<main>{children}</main>
			<footer className="mt-16 border-t">
				<div className="max-w-6xl mx-auto px-4 py-8 text-sm text-gray-600">© {new Date().getFullYear()} FoodSense</div>
			</footer>
		</div>
	)
}
