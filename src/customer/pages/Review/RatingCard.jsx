import React from 'react'
import StarIcon from '@mui/icons-material/Star'
import './Reviews.css'
const LABELS = ['Poor', 'Average', 'Good', 'Very Good', 'Excellent']
const RatingCard = ({ reviews }) => {
  const total = reviews.length
  // Count per star 1–5
  const counts = [1, 2, 3, 4, 5].map(
    (star) => reviews.filter((r) => Math.round(r.rating) === star).length,
  )
  const avg = total > 0 ? (reviews.reduce((s, r) => s + r.rating, 0) / total).toFixed(1) : '0.0'
  const StarDisplay = ({ value }) => (
    <div className="amz-rv-stars" style={{ marginBottom: 6 }}>
      {[1, 2, 3, 4, 5].map((s) => (
        <span key={s} className={`amz-rv-star ${s <= Math.round(value) ? '' : 'empty'}`}>
          <StarIcon style={{ fontSize: '1rem' }} />
        </span>
      ))}
    </div>
  )
  return (
    <div className="amz-rv-card">
      <div className="amz-rv-card-header">Customer Reviews</div>
      <div className="amz-rv-card-body">
        <div className="amz-rv-summary">
          {/* Big score */}
          <div className="amz-rv-big-score">
            <span className="amz-rv-score-num">{avg}</span>
            <StarDisplay value={Number(avg)} />
            <span className="amz-rv-score-label">out of 5</span>
          </div>

          {/* Bar breakdown — 5 down to 1 */}
          <div className="amz-rv-bars">
            {[5, 4, 3, 2, 1].map((star) => {
              const count = counts[star - 1]
              const pct = total > 0 ? (count / total) * 100 : 0
              const fillCls = star <= 2 ? (star === 1 ? 'vlow' : 'low') : ''
              return (
                <div key={star} className="amz-rv-bar-row">
                  <span className="amz-rv-bar-label">{LABELS[star - 1]}</span>
                  <div className="amz-rv-bar-track">
                    <div className={`amz-rv-bar-fill ${fillCls}`} style={{ width: `${pct}%` }} />
                  </div>
                  <span className="amz-rv-bar-count">{count}</span>
                </div>
              )
            })}
          </div>
        </div>

        <div style={{ fontSize: '0.8125rem', color: '#565959' }}>
          {total} global rating{total !== 1 ? 's' : ''}
        </div>
      </div>
    </div>
  )
}
export default RatingCard
