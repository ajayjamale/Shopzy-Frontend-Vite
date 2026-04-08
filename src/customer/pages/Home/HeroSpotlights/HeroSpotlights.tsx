import { useNavigate } from "react-router-dom";
import { useAppSelector } from "../../../../Redux Toolkit/Store";

type SpotlightCard = {
  title: string;
  subtitle?: string;
  imageUrl: string;
  target: string;
};

const fallbackCards: SpotlightCard[] = [
  {
    title: "Summer Fashion Drop",
    subtitle: "Up to 45% off selected styles",
    imageUrl:
      "https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=1200&q=80&fit=crop",
    target: "women_western_wear",
  },
  {
    title: "Tech Week Offers",
    subtitle: "Latest gadgets at best prices",
    imageUrl:
      "https://images.unsplash.com/photo-1518773553398-650c184e0bb3?w=1200&q=80&fit=crop",
    target: "electronics",
  },
  {
    title: "Home Upgrade Picks",
    subtitle: "Refresh your living space",
    imageUrl:
      "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=1200&q=80&fit=crop",
    target: "home_furniture",
  },
];

const HeroSpotlights = () => {
  const navigate = useNavigate();
  const { homePage } = useAppSelector((store) => store);

  const cards: SpotlightCard[] =
    homePage.homePageData?.heroSlides?.slice(1, 4).map((item) => ({
      title: item.title || item.subtitle || "Featured",
      subtitle: item.description || item.badgeText || "",
      imageUrl: item.imageUrl || fallbackCards[0].imageUrl,
      target: item.redirectLink || item.buttonLink || item.categoryId || "/products",
    })) || fallbackCards;

  const handleNavigate = (target: string) => {
    if (!target) return;
    if (target.startsWith("/")) {
      navigate(target);
      return;
    }
    navigate(`/products/${target}`);
  };

  return (
    <section className="app-container" style={{ marginTop: 20 }}>
      <div className="grid md:grid-cols-3 gap-4 auto-rows-[190px]">
        {cards.slice(0, 3).map((card, index) => (
          <button
            key={`${card.title}-${card.target}`}
            onClick={() => handleNavigate(card.target)}
            className={`text-left relative overflow-hidden rounded-2xl border border-[#DCE8EC] group ${
              index === 0 ? "md:col-span-2 md:row-span-2" : ""
            }`}
            style={{
              minHeight: 190,
              background: "#0F172A",
              width: "100%",
              border: "1px solid #DCE8EC",
              padding: 0,
              cursor: "pointer",
            }}
          >
            <img
              src={card.imageUrl}
              alt={card.title}
              className="absolute inset-0 w-full h-full object-cover transition duration-500 group-hover:scale-105"
            />
            <div
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(160deg, rgba(2,6,23,0.7) 0%, rgba(15,118,110,0.2) 80%)",
              }}
            />
            <div className="relative z-10 p-5 h-full flex flex-col justify-end">
              <p className={`text-white font-semibold leading-tight ${index === 0 ? "text-2xl" : "text-xl"}`}>
                {card.title}
              </p>
              <p className="text-[#D1E7E5] text-sm mt-2">{card.subtitle}</p>
              <p className="text-[#5EEAD4] text-xs font-bold uppercase tracking-[0.12em] mt-4">
                Shop now -&gt;
              </p>
            </div>
          </button>
        ))}
      </div>
    </section>
  );
};

export default HeroSpotlights;
