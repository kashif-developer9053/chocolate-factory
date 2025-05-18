import Image from "next/image"
import { Button } from "@/components/ui/button"

export default function SpecialOffers() {
  const offers = [
    {
      id: 1,
      title: "Weekend Breakfast Special",
      description: "Enjoy our famous breakfast platter with coffee for just Rs. 800. Available every Saturday and Sunday from 8AM to 11AM.",
      image: "https://images.unsplash.com/photo-1495147466023-ac5c588e2e94?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80",
      category: "Breakfast",
      price: "Rs. 800"
    },
    {
      id: 2,
      title: "Dessert Combo",
      description: "Select any two desserts from our signature collection and get a complimentary coffee or tea. Perfect for afternoon indulgence!",
      image: "https://images.unsplash.com/photo-1551024601-bec78aea704b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80",
      category: "Desserts",
      price: "Rs. 1,200"
    },
    {
      id: 3,
      title: "Family Package",
      description: "Order our family package for 4-6 people and receive a 15% discount on your total bill. Available for dine-in and takeaway.",
      image: "https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80",
      category: "Special",
      price: "Rs. 3,500"
    }
  ]

  return (
    <section className="py-16">
      <div className="container mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold mb-4">Special Offers</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Discover our exclusive deals and seasonal promotions designed to give you more of what you love at great prices.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {offers.map((offer) => (
            <div key={offer.id} className="bg-white rounded-lg overflow-hidden shadow-md">
              <div className="relative h-48 w-full">
                <Image
                  src={offer.image}
                  alt={offer.title}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-6">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-bold text-lg">{offer.title}</h3>
                  <span className="text-primary font-semibold">{offer.price}</span>
                </div>
                <p className="text-gray-600 text-sm mb-4">{offer.description}</p>
                <div className="flex justify-between items-center">
                  <span className="text-xs px-2 py-1 bg-secondary text-primary rounded-full">
                    {offer.category}
                  </span>
                  <Button variant="outline" className="text-primary">View Details</Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-10 text-center">
          <Button asChild size="lg">
            <a href="/offers">View All Offers</a>
          </Button>
        </div>
      </div>
    </section>
  )
}