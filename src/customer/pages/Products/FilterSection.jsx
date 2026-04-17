import TuneRoundedIcon from '@mui/icons-material/TuneRounded'
import CheckRoundedIcon from '@mui/icons-material/CheckRounded'
import { colors } from '../../../data/Filter/color'
import { price } from '../../../data/Filter/price'
import { discount } from '../../../data/Filter/discount'
import { useSearchParams } from 'react-router-dom'
const FilterGroup = ({ title, options, param, selected, onToggle }) => {
  return (
    <section className="surface p-4" style={{ borderRadius: 16 }}>
      <h3 className="text-sm font-bold text-slate-800 mb-3">{title}</h3>
      <div className="grid gap-2">
        {options.map((option) => {
          const active = selected === option.value
          return (
            <button
              key={option.value}
              onClick={() => onToggle(param, option.value)}
              className="text-left px-3 py-2 rounded-xl border flex items-center justify-between gap-3"
              style={{
                borderColor: active ? '#54AAA2' : '#D8E5E9',
                background: active ? '#EAF7F5' : '#fff',
                color: active ? '#0F766E' : '#334155',
                fontSize: '0.83rem',
                fontWeight: active ? 700 : 600,
              }}
            >
              <span className="flex items-center gap-2">
                {option.colorHex && (
                  <span
                    style={{
                      width: 14,
                      height: 14,
                      borderRadius: '50%',
                      border: '1px solid rgba(15,23,42,0.15)',
                      background: option.colorHex,
                    }}
                  />
                )}
                {option.label}
              </span>
              {active && <CheckRoundedIcon sx={{ fontSize: 15 }} />}
            </button>
          )
        })}
      </div>
    </section>
  )
}
const FilterSection = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const onToggle = (param, value) => {
    const updated = new URLSearchParams(searchParams.toString())
    if (updated.get(param) === value) {
      updated.delete(param)
    } else {
      updated.set(param, value)
    }
    setSearchParams(updated)
  }
  const clearAll = () => {
    setSearchParams(new URLSearchParams())
  }
  return (
    <aside className="grid gap-3">
      <div className="surface p-4" style={{ borderRadius: 16 }}>
        <div className="flex items-center justify-between mb-2">
          <p className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <TuneRoundedIcon sx={{ fontSize: 18 }} />
            Refine Results
          </p>
          <button
            className="text-xs font-bold uppercase tracking-[0.12em]"
            style={{ color: '#0F766E' }}
            onClick={clearAll}
          >
            Clear
          </button>
        </div>
        <p className="text-xs text-slate-500">Filter by color, price and discounts.</p>
      </div>

      <FilterGroup
        title="Color"
        param="color"
        selected={searchParams.get('color') || ''}
        onToggle={onToggle}
        options={colors.map((item) => ({ label: item.name, value: item.name, colorHex: item.hex }))}
      />

      <FilterGroup
        title="Price"
        param="price"
        selected={searchParams.get('price') || ''}
        onToggle={onToggle}
        options={price.map((item) => ({ label: item.name, value: item.value }))}
      />

      <FilterGroup
        title="Discount"
        param="discount"
        selected={searchParams.get('discount') || ''}
        onToggle={onToggle}
        options={discount.map((item) => ({ label: item.name, value: String(item.value) }))}
      />
    </aside>
  )
}
export default FilterSection
