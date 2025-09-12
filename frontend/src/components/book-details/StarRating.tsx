export default function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center space-x-1">
      {[...Array(5)].map((_, index) => {
        const starValue = index + 1;

        if (rating >= starValue) {
          return (
            <svg
              key={index}
              viewBox="0 0 24 24"
              fill="#1A1A1A"
              className="h-6 w-6"
            >
              <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
            </svg>
          );
        } else if (rating >= starValue - 0.5) {
          const id = `half-gradient-${index}`;
          return (
            <svg
              key={index}
              viewBox="0 0 24 24"
              fill={`url(#${id})`}
              className="h-6 w-6"
            >
              <defs>
                <linearGradient id={id}>
                  <stop offset="50%" stopColor="#1A1A1A" />
                  <stop offset="50%" stopColor="#d1d5db" />
                </linearGradient>
              </defs>
              <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
            </svg>
          );
        } else {
          return (
            <svg
              key={index}
              viewBox="0 0 24 24"
              fill="#d1d5db"
              className="h-6 w-6"
            >
              <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
            </svg>
          );
        }
      })}
    </div>
  );
}
