import { useNavigate } from 'react-router-dom'
import { useAppSelector } from '../../../../store'
import { toCatalogPath } from '../../../../utils/catalogRoute'
const fallback = [
  {
    name: 'Mobiles',
    image:
      'https://rukminim2.flixcart.com/image/416/416/xif0q/mobile/5/t/j/edge-50-fusion-pb300002in-motorola-original-imahywzrfagkuyxx.jpeg?q=70',
    target: 'mobiles',
  },
  {
    name: 'Laptops',
    image:
      'https://rukminim2.flixcart.com/image/312/312/xif0q/computer/x/9/j/-original-imahyjzh7m2zsqdg.jpeg?q=70',
    target: 'laptops',
  },
  {
    name: 'Audio',
    image:
      'https://rukminim2.flixcart.com/image/612/612/kz4gh3k0/headphone/c/v/r/-original-imagb7bmhdgghzxq.jpeg?q=70',
    target: 'headphones_headsets',
  },
  {
    name: 'Wearables',
    image:
      'https://rukminim2.flixcart.com/image/612/612/xif0q/smartwatch/f/g/g/-original-imagywnz46fngcks.jpeg?q=70',
    target: 'smart_watches',
  },
  {
    name: 'Speakers',
    image:
      'https://rukminim2.flixcart.com/image/612/612/xif0q/speaker/6/z/2/-original-imahfgfkr5gkk9aq.jpeg?q=70',
    target: 'speakers',
  },
  {
    name: 'TV & Home',
    image:
      'https://rukminim2.flixcart.com/image/312/312/xif0q/television/9/p/9/-original-imah2v29z86u7b79.jpeg?q=70',
    target: 'television',
  },
]
const ElectronicCategory = () => {
  const navigate = useNavigate()
  const { homePage } = useAppSelector((store) => store)
  const items =
    homePage.homePageData?.electronics?.map((item) => ({
      name: item.title || item.subtitle || 'Category',
      image: item.imageUrl,
      target: item.redirectLink || item.categoryId || 'electronics',
    })) || fallback
  const navigateToTarget = (target) => {
    if (!target) return
    navigate(toCatalogPath(target))
  }
  return (
    <section className="app-container" style={{ marginTop: 34 }}>
      <div className="surface p-6 lg:p-8">
        <div className="flex items-end justify-between gap-4 flex-wrap mb-6">
          <div>
            <p className="section-kicker mb-2">Tech Edit</p>
            <h2 className="section-title" style={{ fontSize: 'clamp(1.4rem, 3vw, 2rem)' }}>
              Trending Electronics
            </h2>
          </div>
          <button className="btn-secondary" onClick={() => navigate(toCatalogPath('electronics'))}>
            View all
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {items.slice(0, 6).map((item) => (
            <button
              key={`${item.name}-${item.target}`}
              onClick={() => navigateToTarget(item.target)}
              className="surface-soft p-3 text-left transition hover:-translate-y-1"
              style={{ borderRadius: 16 }}
            >
              <div className="w-full aspect-square rounded-xl overflow-hidden bg-white border border-[#E3ECEF]">
                <img
                  src={item.image || fallback[0].image}
                  alt={item.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <p className="mt-3 text-sm font-semibold text-slate-800">{item.name}</p>
            </button>
          ))}
        </div>
      </div>
    </section>
  )
}
export default ElectronicCategory
