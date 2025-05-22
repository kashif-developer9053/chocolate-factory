import Image from "next/image";
import { Star } from "lucide-react";

export default function CustomerReviews() {
  const reviews = [
    {
      id: 1,
      name: "Areeba K.",
      role: "Customer",
      image:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&q=80",
      review:
        "Super fast delivery and everything was perfectly packed! The chocolates were fresh and original. Will definitely order again!",
      rating: 5,
      date: "May 23, 2025",
      location: "Rawalpindi",
    },
    {
      id: 2,
      name: "Hassan M.",
      role: "Customer",
      image:
        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&q=80",
      review:
        "I’ve been craving imported snacks for months – finally found a trusted seller. Thank you, Chocolates Factory!",
      rating: 5,
      date: "May 23, 2025",
      location: "Islamabad",
    },
    {
      id: 3,
      name: "Sana A.",
      role: "Customer",
      image:
        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&q=80",
      review:
        "Ordered in bulk for a party. Great prices, amazing service, and the kids loved it. Highly recommended!",
      rating: 5,
      date: "May 23, 2025",
      location: "Bahria Town",
    },
    {
      id: 4,
      name: "Nimra Z.",
      role: "Customer",
      image:
        "https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&q=80",
      review:
        "The packaging was so cute, and everything arrived safely. Loved the variety!",
      rating: 5,
      date: "May 23, 2025",
      location: "Lahore",
    },
    {
      id: 5,
      name: "Usman R.",
      role: "Customer",
      image:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&q=80",
      review:
        "Customer service was very responsive and helpful. My order came right on time and exactly as shown.",
      rating: 5,
      date: "May 23, 2025",
      location: "Rawalpindi",
    },
    {
      id: 6,
      name: "Fatima S.",
      role: "Customer",
      image:
        "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&q=80",
      review:
        "Best place to get imported chocolates in Pakistan. Real products, real taste!",
      rating: 5,
      date: "May 23, 2025",
      location: "Islamabad",
    },
  ];

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto">
        <div className="max-w-2xl mx-auto text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">What Our Customers Say</h2>
          <p className="text-gray-600">
            Don't just take our word for it - hear from our valued customers about their Chocolates Factory experience
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {reviews.map((review) => (
            <div key={review.id} className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex items-center gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={16}
                    className={
                      i < review.rating
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-gray-300"
                    }
                  />
                ))}
                <span className="text-sm text-gray-500 ml-2">{review.date}</span>
              </div>

              <p className="text-gray-700 mb-6 italic">"{review.review}"</p>

              <div className="flex items-center">
                <div className="relative w-12 h-12 rounded-full overflow-hidden mr-4">
                  <Image
                    src={review.image}
                    alt={review.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <p className="font-semibold">{review.name}</p>
                  <p className="text-sm text-gray-500">
                    {review.role}, {review.location}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-10 text-center">
          <a
            href="/reviews"
            className="inline-flex items-center text-primary hover:underline"
          >
            View All Reviews
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 ml-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
}