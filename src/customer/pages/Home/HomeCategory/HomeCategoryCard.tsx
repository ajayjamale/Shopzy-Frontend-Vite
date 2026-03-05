import React from 'react';
import { useNavigate } from 'react-router-dom';
import './HomeCategoryCard.css'; // import the CSS file

interface HomeCategoryCardProps {
  item: {
    name: string;
    categoryId: string;
    image: string;
    // other fields are optional, but we only need these for display
  };
}

const HomeCategoryCard: React.FC<HomeCategoryCardProps> = ({ item }) => {
  const navigate = useNavigate();

  return (
    <div
      className="hcc-card"
      onClick={() => navigate(`/products/${item.categoryId}`)}
    >
      <div className="hcc-img-wrap">
        <img src={item.image} alt={item.name} loading="lazy" />
      </div>
      <span className="hcc-name">{item.name}</span>
    </div>
  );
};

export default HomeCategoryCard;