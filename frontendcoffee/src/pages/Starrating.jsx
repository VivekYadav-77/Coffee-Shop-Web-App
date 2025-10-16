import { Star } from "lucide-react";

const StarRating = ({ rating, of = 5, size = 16 }) => {
  return (
    <div className="flex items-center gap-1">
      {[...Array(of)].map((_, i) => (
        <Star
          key={i}
          size={size}
          className={
            i < Math.round(rating)
              ? "text-yellow-400 fill-yellow-400"
              : "text-gray-600"
          }
        />
      ))}
    </div>
  );
};

export default StarRating;
