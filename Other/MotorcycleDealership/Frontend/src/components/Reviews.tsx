import { useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { useState } from 'react';

interface Review {
    id: string;
    motorcycleId: string;
    userId: string;
    rating: number;
    comment: string;
}

interface ReviewsProps {
    motorcycleId: string;
}

const fetchReviews = async (motorcycleId: string) => {
    try {
        const response = await axios.get(`http://localhost:5001/api/reviews/${motorcycleId}`, {
            withCredentials: true,
        });
        return response.data;
    } catch (error: any) {
        if (error.response?.status === 401) {
            console.warn('User not authenticated');
        } else {
            console.error('Error fetching reviews:', error);
        }
        return [];
    }
};

const Reviews: React.FC<ReviewsProps> = ({ motorcycleId }) => {
    const queryClient = useQueryClient();
    const [newReview, setNewReview] = useState({ rating: 0, comment: '' });
    const [error, setError] = useState<string | null>(null);

    const { data: reviews = [], isLoading } = useQuery({
        queryKey: ['reviews', motorcycleId],
        queryFn: () => fetchReviews(motorcycleId),
    });

    const handleReviewSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (newReview.rating > 0 && newReview.comment.trim()) {
            const review = {
                motorcycleId,
                rating: newReview.rating,
                comment: newReview.comment,
                userId: 'demo-user', // Замените на реальный userId, если требуется
            };

            try {
                await axios.post('http://localhost:5001/api/reviews', review, {
                    withCredentials: true, // Разрешаем отправку cookies
                });
                setNewReview({ rating: 0, comment: '' });
                setError(null);
                await queryClient.invalidateQueries({ queryKey: ['reviews', motorcycleId] });
            } catch (error) {
                console.error('Failed to submit review:', error);
                setError('Failed to submit review. Please try again later.');
            }
        }
    };

    const handleStarClick = (rating: number) => {
        setNewReview({ ...newReview, rating });
    };

    if (isLoading) return <div className="text-center py-6 text-gray-600">Loading...</div>;

    return (
        <div className="p-3">
            <form
                onSubmit={handleReviewSubmit}
                className="mb-6 max-w-xl mx-auto bg-white/90 p-4 rounded-lg shadow-md border border-gradient-to-b from-blue-200 to-transparent hover:shadow-lg transition-all duration-300"
            >
                <h3 className="text-lg font-semibold text-gray-800 mb-3">Add a Review</h3>
                <div className="mb-3">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Rating:</label>
                    <div className="flex space-x-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <span
                                key={star}
                                onClick={() => handleStarClick(star)}
                                className={`cursor-pointer text-xl ${newReview.rating >= star ? 'text-yellow-500' : 'text-gray-300'} hover:text-yellow-500 transition-colors`}
                            >
                                ★
                            </span>
                        ))}
                    </div>
                </div>
                <div className="mb-3">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Comment:</label>
                    <textarea
                        value={newReview.comment}
                        onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                        placeholder="Write your review..."
                        className="w-full p-2 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-purple-500 focus:border-transparent transition resize-vertical"
                        rows={3}
                    />
                </div>
                <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white p-1.5 rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105"
                    disabled={!newReview.rating || !newReview.comment.trim()}
                >
                    Submit Review
                </button>
                {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
            </form>

            <div className="space-y-4 max-w-2xl mx-auto">
                {reviews.length ? (
                    reviews.map((review: Review) => (
                        <div
                            key={review.id}
                            className="bg-white p-4 rounded-lg shadow-md border border-gray-100 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
                        >
                            <p className="text-base font-medium text-gray-800">
                                Rating: {review.rating} / 5{' '}
                                <span className="inline-block ml-1 text-yellow-500">★</span>
                            </p>
                            <p className="text-gray-600 mt-1 leading-relaxed">{review.comment}</p>
                        </div>
                    ))
                ) : (
                    <p className="text-center text-gray-500 text-base py-4 bg-white/80 rounded-lg shadow-sm">
                        No reviews available.
                    </p>
                )}
            </div>
        </div>
    );
};

export default Reviews;