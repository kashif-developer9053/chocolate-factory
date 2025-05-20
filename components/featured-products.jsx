import Link from "next/link"
import { CirclePlus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

export default function FeaturedProducts() {
  const products = [
    {
      id: 1,
      name: "Chocolate Croissant",
      price: 350,
      description: "Buttery, flaky croissant filled with rich chocolate, baked to golden perfection.",
      category: "Pastries",
      image: "https://images.unsplash.com/photo-1623334044303-241021148842?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80",
    },
    {
      id: 2,
      name: "Classic Tiramisu",
      price: 450,
      description: "Layers of coffee-soaked ladyfingers and mascarpone cream, dusted with cocoa powder.",
      category: "Desserts",
      image: "https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80",
    },
    {
      id: 3,
      name: "Artisan Sourdough Bread",
      price: 300,
      description: "Traditional sourdough made with our 5-year-old starter, featuring a crispy crust and chewy interior.",
      category: "Bread",
      image: "https://images.unsplash.com/photo-1589367920969-ab8e050bbb04?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80",
    },
    {
      id: 4,
      name: "Lotus Cheesecake",
      price: 550,
      description: "Creamy cheesecake with a layer of Lotus Biscoff spread and crumbled biscuit topping.",
      category: "Desserts",
      image: "https://images.unsplash.com/photo-1533134242443-d4fd215305ad?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80",
    },
    {
      id: 5,
      name: "Pistachio Baklava",
      price: 280,
      description: "Layers of flaky phyllo pastry filled with chopped pistachios, soaked in honey syrup.",
      category: "Middle Eastern",
      image: "https://images.unsplash.com/photo-1519676867240-f03562e64548?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80",
    },
    {
      id: 6,
      name: "Cinnamon Rolls",
      price: 250,
      description: "Soft, fluffy rolls with a swirl of cinnamon sugar, topped with cream cheese frosting.",
      category: "Pastries",
      image: "https://images.unsplash.com/photo-1576618148400-f54bed99fcfd?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80",
    },
    {
      id: 7,
      name: "Mango Mousse Cake",
      price: 500,
      description: "Light and airy mousse cake made with fresh Pakistani mangoes on a vanilla sponge base.",
      category: "Desserts",
      image: "https://images.unsplash.com/photo-1563805042-7684c019e1cb?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80",
    },
    {
      id: 8,
      name: "Fresh Naan",
      price: 100,
      description: "Soft, pillowy traditional naan bread baked in our tandoor oven, brushed with butter.",
      category: "Bread",
      image: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80",
    },
  ]

  return (
    <section className="py-12 md:py-16 lg:py-20">
      <div className="container">
        <div className="mb-8 flex flex-col items-center text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">Our Featured Menu</h2>
          <p className="mt-4 max-w-[700px] text-muted-foreground">
            Handcrafted with love and the finest ingredients - our most popular bakery items
          </p>
        </div>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4">
          {products.map((product) => (
            <Card key={product.id} className="overflow-hidden">
              <div className="relative h-48 w-full overflow-hidden">
                <img
                  src={product.image}
                  alt={product.name}
                  className="h-full w-full object-cover transition-transform hover:scale-105"
                />
              </div>
              <div className="p-5">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-bold text-lg">{product.name}</h3>
                  <span className="text-primary font-semibold">Rs. {product.price}</span>
                </div>
                <p className="text-gray-600 text-sm mb-4">{product.description}</p>
                <div className="flex justify-between items-center">
                  <span className="text-xs px-2 py-1 bg-secondary text-primary rounded-full">
                    {product.category}
                  </span>
                  <Button variant="ghost" className="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 h-9 rounded-md px-3 text-primary hover:text-primary/90 hover:bg-secondary">
                    <CirclePlus className="mr-1 h-4 w-4" /> Add to Cart
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
        <div className="mt-10 flex justify-center">
          <Button asChild size="lg">
            <Link href="/menu">View Full Menu</Link>
          </Button>
        </div>
      </div>
    </section>
  )
}