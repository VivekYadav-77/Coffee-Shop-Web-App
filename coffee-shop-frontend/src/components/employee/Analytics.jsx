import React, { useMemo } from 'react'
import '../../styles/employee/employee-shared.css'

const formatDay = (d) => {
  try {
    const dt = new Date(d)
    return `${dt.getMonth()+1}/${dt.getDate()}`
  } catch { return '' }
}

const buildSeries = (orders) => {
  const byDay = new Map()
  const byItem = new Map()
  orders.forEach(o => {
    const k = formatDay(o.orderTime || Date.now())
    byDay.set(k, (byDay.get(k) || 0) + (o.total || 0))
    ;(o.items || []).forEach(it => {
      byItem.set(it.name, (byItem.get(it.name) || 0) + it.quantity)
    })
  })
  const dayLabels = Array.from(byDay.keys())
  const dayValues = dayLabels.map(l => byDay.get(l))
  const items = Array.from(byItem.entries()).sort((a,b)=>b[1]-a[1]).slice(0,5)
  return { dayLabels, dayValues, items }
}

const MiniLineChart = ({ labels, values }) => {
  const w = 360, h = 120, pad = 24
  const max = Math.max(1, ...values)
  const pts = values.map((v,i)=>{
    const x = pad + (i*(w-2*pad))/Math.max(1, values.length-1)
    const y = h - pad - (v/max)*(h-2*pad)
    return `${x},${y}`
  }).join(' ')
  return (
    <svg className="chart" viewBox={`0 0 ${w} ${h}`}>
      <polyline fill="none" stroke="#ff8e3c" strokeWidth="3" points={pts} />
      {values.map((v,i)=>{
        const x = pad + (i*(w-2*pad))/Math.max(1, values.length-1)
        const y = h - pad - (v/max)*(h-2*pad)
        return <circle key={i} cx={x} cy={y} r="3" fill="#ffd23f" />
      })}
    </svg>
  )
}

const BarChart = ({ items }) => {
  const max = Math.max(1, ...items.map(i=>i[1]))
  return (
    <div className="bar-chart">
      {items.map(([name, val]) => (
        <div className="bar-row" key={name}>
          <span className="bar-label">{name}</span>
          <div className="bar-track">
            <div className="bar-fill" style={{ width: `${(val/max)*100}%` }}></div>
          </div>
          <span className="bar-value">{val}</span>
        </div>
      ))}
    </div>
  )
}

const DonutChart = ({ total, orders }) => {
  const confirmed = orders.filter(o=> (o.status||'confirmed')==='confirmed').length
  const others = Math.max(0, orders.length - confirmed)
  const a = confirmed, b = others, sum = Math.max(1, a+b)
  const pctA = (a/sum)*100
  return (
    <div className="donut-wrap">
      <div className="donut" style={{
        background: `conic-gradient(#4ade80 0 ${pctA}%, rgba(255,255,255,0.15) ${pctA}% 100%)`
      }}>
        <div className="donut-center">
          <div className="donut-num">{total.toLocaleString()}</div>
          <div className="donut-sub">Total Revenue</div>
        </div>
      </div>
      <div className="donut-legend">
        <span className="lg lg-a"></span> Confirmed ({confirmed})
        <span className="lg lg-b" style={{marginLeft:'1rem'}}></span> Others ({others})
      </div>
    </div>
  )
}

const AnalyticsPage = ({ onBack }) => {
  const orders = useMemo(() => JSON.parse(localStorage.getItem('brewCraftOrders') || '[]'), [])
  const revenue = orders.reduce((t, o) => t + (o.total || 0), 0)
  const totalItems = orders.reduce((t, o) => t + (o.items || []).reduce((s,i)=>s+i.quantity,0), 0)
  const { dayLabels, dayValues, items } = useMemo(() => buildSeries(orders), [orders])

  return (
    <div className="emp-page">
      <div className="emp-container">
        <div className="emp-header">
          <button className="back-btn" onClick={onBack}>Back</button>
          <h1 className="emp-title">Analytics Dashboard</h1>
        </div>

        <div className="emp-grid">
          <div className="emp-card"><h3>Total Revenue</h3><div className="emp-metric">₹{revenue.toLocaleString()}</div></div>
          <div className="emp-card"><h3>Total Orders</h3><div className="emp-metric">{orders.length}</div></div>
          <div className="emp-card"><h3>Total Items Sold</h3><div className="emp-metric">{totalItems}</div></div>
        </div>

        <div className="emp-grid" style={{marginTop:'1rem'}}>
          <div className="emp-card">
            <h3>Revenue Trend</h3>
            <MiniLineChart labels={dayLabels} values={dayValues} />
            <div className="axis-labels">
              {dayLabels.map((l,i)=> <span key={i}>{l}</span>)}
            </div>
          </div>
          <div className="emp-card">
            <h3>Top Coffees (Qty)</h3>
            <BarChart items={items} />
          </div>
          <div className="emp-card">
            <h3>Order Status Split</h3>
            <DonutChart total={revenue} orders={orders} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default AnalyticsPage


