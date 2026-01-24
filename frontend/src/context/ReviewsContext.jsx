import { createContext, useContext, useState, useEffect } from 'react';

const ReviewsContext = createContext();

export const useReviews = () => {
  const context = useContext(ReviewsContext);
  if (!context) {
    throw new Error('useReviews must be used within a ReviewsProvider');
  }
  return context;
};

export const ReviewsProvider = ({ children }) => {
  const [reviews, setReviews] = useState([]);

  // Load reviews from localStorage on mount
  useEffect(() => {
    const savedReviews = localStorage.getItem('hotelReviews');
    if (savedReviews) {
      setReviews(JSON.parse(savedReviews));
    } else {
      // Initial mock reviews
      const mockReviews = [
        {
          id: 1,
          hotelId: 4, // Taj Lands End
          hotelName: "Taj Lands End",
          userId: "user1",
          userName: "Rahul Sharma",
          rating: 5,
          title: "Excellent experience!",
          comment: "The sea view was breathtaking. Staff was extremely helpful and the food was amazing.",
          date: "2026-01-15",
          helpful: 12
        },
        {
          id: 2,
          hotelId: 4, // Taj Lands End
          hotelName: "Taj Lands End",
          userId: "user2",
          userName: "Priya Patel",
          rating: 4,
          title: "Great stay but pricey",
          comment: "Beautiful property with excellent amenities. A bit expensive but worth it for special occasions.",
          date: "2026-01-10",
          helpful: 8
        },
        {
          id: 3,
          hotelId: 16, // ITC Grand Chola
          hotelName: "ITC Grand Chola",
          userId: "user1",
          userName: "Rahul Sharma",
          rating: 5,
          title: "Amazing stay!",
          comment: "Exceptional service and beautiful property. The rooms are spacious and well-maintained.",
          date: "2026-01-08",
          helpful: 15
        },
        {
          id: 4,
          hotelId: 2, // The Oberoi Udaivilas
          hotelName: "The Oberoi Udaivilas",
          userId: "user3",
          userName: "Amit Kumar",
          rating: 5,
          title: "Best hotel in India",
          comment: "Simply the best luxury experience. The lake view is mesmerizing and service is impeccable.",
          date: "2025-12-20",
          helpful: 25
        },
      ];
      setReviews(mockReviews);
      localStorage.setItem('hotelReviews', JSON.stringify(mockReviews));
    }
  }, []);

  // Add a new review
  const addReview = (review) => {
    const newReview = {
      ...review,
      id: Date.now(),
      date: new Date().toISOString().split('T')[0],
      helpful: 0
    };
    const updatedReviews = [...reviews, newReview];
    setReviews(updatedReviews);
    localStorage.setItem('hotelReviews', JSON.stringify(updatedReviews));
    
    // Dispatch event for UI updates
    window.dispatchEvent(new Event('reviewAdded'));
    
    return newReview;
  };

  // Get reviews for a specific hotel
  const getHotelReviews = (hotelId) => {
    return reviews.filter(r => r.hotelId === hotelId);
  };

  // Get aggregated rating for a hotel
  const getHotelRating = (hotelId) => {
    const hotelReviews = reviews.filter(r => r.hotelId === hotelId);
    if (hotelReviews.length === 0) {
      return null; // No user reviews yet
    }
    
    const totalRating = hotelReviews.reduce((sum, r) => sum + r.rating, 0);
    const avgRating = totalRating / hotelReviews.length;
    
    // Convert 1-5 star rating to 1-10 scale for display
    const displayScore = ((avgRating / 5) * 10).toFixed(1);
    
    // Generate rating text based on score
    let ratingText = "Good";
    if (displayScore >= 9.5) ratingText = "Exceptional";
    else if (displayScore >= 8.5) ratingText = "Excellent";
    else if (displayScore >= 7.5) ratingText = "Very Good";
    else if (displayScore >= 6.5) ratingText = "Good";
    else ratingText = "Average";
    
    return {
      score: parseFloat(displayScore),
      text: ratingText,
      count: hotelReviews.length,
      avgStars: avgRating.toFixed(1)
    };
  };

  // Mark a review as helpful
  const markHelpful = (reviewId) => {
    const updatedReviews = reviews.map(r =>
      r.id === reviewId ? { ...r, helpful: (r.helpful || 0) + 1 } : r
    );
    setReviews(updatedReviews);
    localStorage.setItem('hotelReviews', JSON.stringify(updatedReviews));
  };

  // Get all reviews count
  const getTotalReviewsCount = () => reviews.length;

  // Get reviews by user
  const getUserReviews = (userId) => {
    return reviews.filter(r => r.userId === userId);
  };

  const value = {
    reviews,
    addReview,
    getHotelReviews,
    getHotelRating,
    markHelpful,
    getTotalReviewsCount,
    getUserReviews
  };

  return (
    <ReviewsContext.Provider value={value}>
      {children}
    </ReviewsContext.Provider>
  );
};

export default ReviewsContext;
