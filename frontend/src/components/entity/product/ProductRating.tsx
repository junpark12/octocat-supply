import { useState } from 'react';

interface ProductRatingProps {
  productId: number;
  productName: string;
}

function readRating(key: string): number {
  try {
    const value = Number(localStorage.getItem(key));
    return Number.isInteger(value) && value >= 1 && value <= 5 ? value : 0;
  } catch {
    return 0;
  }
}

export default function ProductRating({ productId, productName }: ProductRatingProps) {
  const storageKey = `product-rating:${productId}`;
  const [rating, setRating] = useState(() => readRating(storageKey));
  const [saveFailed, setSaveFailed] = useState(false);

  const selectRating = (value: number) => {
    setRating(value);
    try {
      localStorage.setItem(storageKey, String(value));
      setSaveFailed(false);
    } catch {
      setSaveFailed(true);
    }
  };

  return (
    <fieldset className="min-w-0">
      <legend className="mb-2 text-sm font-semibold">Your rating</legend>
      <div className="flex flex-wrap gap-1">
        {[1, 2, 3, 4, 5].map((value) => (
          <button
            key={value}
            type="button"
            onClick={() => selectRating(value)}
            aria-label={`Rate ${productName} ${value} out of 5 stars`}
            aria-pressed={rating === value}
            className="flex h-11 w-11 items-center justify-center rounded-lg border-2 border-red-600 bg-red-600 text-white hover:border-red-700 hover:bg-red-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-500 transition-colors"
          >
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              className="h-7 w-7"
              fill={value <= rating ? 'currentColor' : 'none'}
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinejoin="round"
            >
              <path d="m12 3 2.78 5.63L21 9.54l-4.5 4.39 1.06 6.2L12 17.2l-5.56 2.93 1.06-6.2L3 9.54l6.22-.91L12 3Z" />
            </svg>
          </button>
        ))}
      </div>
      <p role="status" className="mt-2 text-sm">
        {rating ? `Your rating: ${rating}/5` : 'Not rated yet'}
        <span className="block text-xs mt-1">
          {saveFailed
            ? 'Could not save in this browser. Your rating is temporary.'
            : 'Saved only in this browser; not a shared review.'}
        </span>
      </p>
    </fieldset>
  );
}
