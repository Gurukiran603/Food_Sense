import { useEffect, useState } from 'react'
import { api, loadAuthTokenFromStorage } from '../lib/api'
import Layout from '../components/Layout'
// @ts-ignore - unicode filename
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import heroLocal from '../../🌟 Vibrant Healthy Meal Inspiration with Fresh….jpeg'

type Alert = { id: number; message: string; is_read: boolean; created_at: string }

type FruitOption = { label: string; value: string }
const FRUITS: FruitOption[] = [
	{ label: 'Banana', value: 'banana' },
	{ label: 'Apple', value: 'apple' },
	{ label: 'Tomato', value: 'tomato' },
	{ label: 'Carrot', value: 'carrot' },
	{ label: 'Strawberry', value: 'strawberry' },
	{ label: 'Orange', value: 'orange' },
	{ label: 'Grape', value: 'grape' },
]

function suggestionFor(name: string, predictedIso: string) {
	const now = new Date()
	const exp = new Date(predictedIso)
	const days = Math.ceil((exp.getTime() - now.getTime()) / (1000*60*60*24))
	const n = name.toLowerCase()
	const quickUse = 'Use today: smoothies, stir-fries, soups.'
	const shortUse = 'Use soon: salads, yogurt toppings, sandwiches.'
	const midUse = 'Plan ahead: bake, grill, or batch-cook.'
	const longUse = 'Plenty of time: store properly; plan recipes this week.'
	let extra = ''
	if (n.includes('banana')) extra = 'Try banana bread, pancakes, or freeze for smoothies.'
	else if (n.includes('apple')) extra = 'Great for pies, crisps, or apple-cinnamon oatmeal.'
	else if (n.includes('tomato')) extra = 'Make pasta sauce, shakshuka, or bruschetta.'
	else if (n.includes('carrot')) extra = 'Do carrot soup, roasted sides, or carrot muffins.'
	else if (n.includes('strawberry')) extra = 'Top pancakes, make compote, or freeze for later.'
	else if (n.includes('orange')) extra = 'Juice it, make vinaigrettes, or zest for baking.'
	else if (n.includes('grape')) extra = 'Freeze as snacks, toss in salads, or make compote.'

	if (days <= 0) return 'Expired — compost or discard if unsafe.'
	if (days <= 2) return `${quickUse} ${extra}`
	if (days <= 5) return `${shortUse} ${extra}`
	if (days <= 10) return `${midUse} ${extra}`
	return `${longUse} ${extra}`
}

export default function Dashboard() {
	const [itemName, setItemName] = useState('Banana')
	const [pred, setPred] = useState<string>('')
	const [alerts, setAlerts] = useState<Alert[]>([])
	const [selected, setSelected] = useState<string[]>(['banana','apple','tomato'])
	const [batch, setBatch] = useState<{ item_name: string; predicted_expiry: string }[]>([])
	const [env, setEnv] = useState<{ weather?: string; temperature_c?: number; spo2_pct?: number } | null>(null)

	useEffect(() => {
		loadAuthTokenFromStorage()
		refreshAlerts()
		refreshBatch()
		api.get('/api/env').then(r => setEnv(r.data)).catch(() => setEnv(null))
	}, [])

	async function refreshAlerts() {
		try {
			const res = await api.get('/api/alerts')
			setAlerts(res.data)
		} catch { /* ignore */ }
	}

	async function onPredict(e: React.FormEvent) {
		e.preventDefault()
		const res = await api.post('/api/predict', { item_name: itemName })
		setPred(new Date(res.data.predicted_expiry).toLocaleString())
	}

	async function refreshBatch() {
		const items = selected.map(v => ({ item_name: v }))
		const res = await api.post('/api/predict/batch', { items })
		setBatch(res.data.results.map((r: any) => ({ item_name: r.item_name, predicted_expiry: r.predicted_expiry })))
	}

	function toggleFruit(v: string) {
		setSelected(prev => {
			const has = prev.includes(v)
			const next = has ? prev.filter(x => x !== v) : [...prev, v]
			setTimeout(() => { refreshBatch() }, 0)
			return next
		})
	}

	return (
		<Layout>
			<section className="bg-cover bg-center" style={{ backgroundImage: `url(${heroLocal ?? ''})` }}>
				<div className="max-w-6xl mx-auto px-4 py-24">
					<h1 className="text-4xl md:text-5xl font-extrabold text-white drop-shadow">Save fresh food. Save money. Save the planet.</h1>
					<p className="text-white/90 mt-3 max-w-2xl drop-shadow">FoodSense predicts expiries and gives smart suggestions so your fruits and veggies never go to waste.</p>
				</div>
			</section>
			<section className="max-w-6xl mx-auto px-4 -mt-10 relative z-10">
				{env && (
					<div className="grid grid-cols-3 gap-4 mb-6">
						<div className="bg-white rounded-xl shadow p-4 text-center">
							<p className="text-xs text-gray-500">Weather</p>
							<p className="text-lg font-semibold">{env.weather}</p>
						</div>
						<div className="bg-white rounded-xl shadow p-4 text-center">
							<p className="text-xs text-gray-500">Temperature</p>
							<p className="text-lg font-semibold">{env.temperature_c}°C</p>
						</div>
						<div className="bg-white rounded-xl shadow p-4 text-center">
							<p className="text-xs text-gray-500">SpO₂</p>
							<p className="text-lg font-semibold">{env.spo2_pct}%</p>
						</div>
					</div>
				)}
				<div className="grid md:grid-cols-2 gap-6">
					<div className="bg-white rounded-xl shadow-soft p-6">
						<h2 className="font-semibold text-lg mb-3">Predict single item</h2>
						<form onSubmit={onPredict} className="flex gap-2">
							<input className="flex-1 border rounded px-3 py-2" value={itemName} onChange={e=>setItemName(e.target.value)} placeholder="e.g., Apple" />
							<button className="bg-green-600 hover:bg-green-700 text-white rounded px-4">Predict</button>
						</form>
						{pred && <p className="text-sm text-gray-700 mt-3">Predicted expiry: <span className="font-medium">{pred}</span></p>}
					</div>
					<div className="bg-white rounded-xl shadow-soft p-6">
						<h2 className="font-semibold text-lg mb-3">Fruit shelf-life</h2>
						<div className="flex flex-wrap gap-2 mb-3">
							{FRUITS.map(f => (
								<button key={f.value} onClick={() => toggleFruit(f.value)} className={`px-3 py-1.5 rounded border ${selected.includes(f.value) ? 'bg-rose-600 text-white border-rose-600' : 'bg-white hover:bg-rose-50'}`}>{f.label}</button>
							))}
						</div>
						<ul className="space-y-3">
							{batch.map(b => (
								<li key={b.item_name} className="text-sm border rounded p-3">
									<div className="flex justify-between">
										<span className="capitalize font-medium">{b.item_name}</span>
										<span className="text-gray-600">{new Date(b.predicted_expiry).toLocaleDateString()}</span>
									</div>
									<p className="text-gray-600 mt-1">{suggestionFor(b.item_name, b.predicted_expiry)}</p>
								</li>
							))}
						</ul>
					</div>
				</div>
			</section>
		</Layout>
	)
}
