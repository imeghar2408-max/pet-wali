import React, { useState } from 'react';
import { useApp } from '../context/AppContext.tsx';

export const ReviewModal: React.FC = () => {
  const { reviewModalBooking, setReviewModalBooking, submitReview, providers } = useApp();

  const [rating, setRating] = useState<number>(5);
  const [comment, setComment] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>(['Punctual & Friendly', 'Great live updates']);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedSuccess, setSubmittedSuccess] = useState(false);

  if (!reviewModalBooking) return null;

  const provider = providers.find((p) => p.id === reviewModalBooking.providerId);

  const availableTags = [
    'Punctual & Friendly',
    'Gentle with Pet',
    'Great live updates',
    'Detailed potty logs',
    'Respectful of home',
    'Highly recommended',
  ];

  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter((t) => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) return;

    setIsSubmitting(true);
    const combinedComment = selectedTags.length > 0
      ? `${selectedTags.join(', ')}. ${comment}`
      : comment;

    await submitReview({
      bookingId: reviewModalBooking.id,
      providerId: reviewModalBooking.providerId,
      providerName: provider?.name || reviewModalBooking.serviceName,
      serviceName: reviewModalBooking.serviceName,
      userId: reviewModalBooking.userId,
      rating,
      comment: combinedComment,
    });

    setIsSubmitting(false);
    setSubmittedSuccess(true);
    setTimeout(() => {
      setSubmittedSuccess(false);
      setReviewModalBooking(null);
    }, 1800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
      <div className="w-full max-w-sm bg-surface rounded-3xl shadow-2xl border border-outline-variant/30 overflow-hidden animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className="p-5 border-b border-surface-container-high flex items-center justify-between bg-surface">
          <div>
            <h3 className="text-base font-bold font-headline text-primary">Rate &amp; Review Service</h3>
            <span className="text-xs text-on-surface-variant font-body">
              {reviewModalBooking.serviceName} • {reviewModalBooking.date}
            </span>
          </div>
          <button
            onClick={() => setReviewModalBooking(null)}
            className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant hover:bg-surface-container-high"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        {submittedSuccess ? (
          <div className="p-8 text-center space-y-3">
            <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto shadow-sm">
              <span className="material-symbols-outlined text-[32px]">check_circle</span>
            </div>
            <h4 className="text-base font-bold font-headline text-primary">Thank You!</h4>
            <p className="text-xs text-on-surface-variant">
              Your feedback has been verified and published to caregiver records.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-5 space-y-4">
            {/* Star Rating Picker */}
            <div className="text-center space-y-1.5 py-1">
              <span className="text-xs font-semibold text-on-surface-variant">Overall Experience</span>
              <div className="flex items-center justify-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className="p-1 text-2xl transition-transform active:scale-125 focus:outline-none"
                  >
                    <span
                      className={`material-symbols-outlined text-[32px] ${
                        star <= rating
                          ? 'material-symbols-fill text-amber-500'
                          : 'text-outline-variant/60'
                      }`}
                    >
                      star
                    </span>
                  </button>
                ))}
              </div>
              <span className="text-xs font-bold text-primary">
                {rating === 5
                  ? 'Exceptional ★★★★★'
                  : rating === 4
                  ? 'Great Service ★★★★'
                  : rating === 3
                  ? 'Average ★★★'
                  : 'Needs Improvement'}
              </span>
            </div>

            {/* Quick Complement Tags */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-on-surface block">Caregiver Highlights</label>
              <div className="flex flex-wrap gap-1.5">
                {availableTags.map((tag) => {
                  const isSelected = selectedTags.includes(tag);
                  return (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => toggleTag(tag)}
                      className={`px-2.5 py-1 rounded-xl text-[11px] font-medium border transition-all ${
                        isSelected
                          ? 'bg-primary-container text-white border-primary shadow-xs'
                          : 'bg-surface-container-low text-on-surface-variant border-outline-variant/40 hover:bg-surface-container'
                      }`}
                    >
                      {tag}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Comment Text Area */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-on-surface block">Your Written Review</label>
              <textarea
                required
                rows={3}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Share your experience with the walker/vet and how your pet enjoyed the care..."
                className="w-full p-3 rounded-2xl border border-outline-variant bg-surface text-xs text-on-surface placeholder:text-outline focus:outline-none focus:border-primary shadow-xs resize-none"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full h-11 rounded-2xl bg-primary text-on-primary font-headline font-bold text-xs flex items-center justify-center gap-2 shadow-md hover:bg-primary-container transition-colors disabled:opacity-50"
            >
              <span className="material-symbols-outlined text-[18px]">send</span>
              <span>{isSubmitting ? 'Publishing...' : 'Submit Verified Review'}</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
