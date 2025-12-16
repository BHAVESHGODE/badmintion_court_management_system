import { Star, StarHalf } from 'lucide-react';

const StarRating = ({ rating, interactive = false, onChange, size = 4 }) => {
    // rating is 0-5
    // interactive: allow clicking

    return (
        <div className="flex items-center space-x-1">
            {[1, 2, 3, 4, 5].map((star) => {
                const isFull = rating >= star;
                const isHalf = rating >= star - 0.5 && rating < star;

                return (
                    <div
                        key={star}
                        className={`${interactive ? 'cursor-pointer hover:scale-110 transition-transform' : ''}`}
                        onClick={() => interactive && onChange && onChange(star)}
                    >
                        {isFull ? (
                            <Star className={`w-${size} h-${size} fill-yellow-400 text-yellow-400`} />
                        ) : isHalf ? (
                            <StarHalf className={`w-${size} h-${size} fill-yellow-400 text-yellow-400`} />
                        ) : (
                            <Star className={`w-${size} h-${size} text-gray-600`} />
                        )}
                    </div>
                );
            })}
        </div>
    );
};

export default StarRating;
