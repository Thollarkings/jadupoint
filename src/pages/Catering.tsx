import { useState } from 'react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { useToast } from '../hooks/use-toast';

const jollofDishes = [
  {
    name: "Classic Nigerian Jollof",
    description: "Traditional Nigerian party Jollof rice.",
    price: "$26",
    image: "public/jollof/jollof1.jpg"
  },
  {
    name: "Smoky Party Jollof",
    description: "Smoky, flavorful Jollof perfect for parties.",
    price: "$30",
    image: "public/jollof/jollof2.jpg"
  },
  {
    name: "Coconut Jollof Rice",
    description: "Creamy coconut-infused Jollof rice.",
    price: "$37",
    image: "public/jollof/jollof3.jpg"
  },
  {
    name: "Seafood Jollof Supreme",
    description: "Loaded with fresh seafood delights.",
    price: "$30",
    image: "public/jollof/jollof4.jpg"
  },
  {
    name: "Vegetarian Garden Jollof",
    description: "Packed with garden-fresh vegetables.",
    price: "$35",
    image: "public/jollof/jollof5.jpg"
  },
  {
    name: "Spicy Warrior Jollof",
    description: "Our signature spicy Jollof experience.",
    price: "$30",
    image: "public/jollof/jollof6.jpg"
  }
];

const additionalMeats = [
  { name: "Whole Event", price: "$15/person" },
  { name: "Beef Suya", price: "$5/person" },
  { name: "Chicken Suya", price: "$5/person" },
  { name: "Chicken Wing Suya", price: "$5/person" }
];

const Catering = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    eventDate: '',
    eventType: '',
    additionalInfo: ''
  });
  const [loading, setLoading] = useState(false);
  const [selectedDishIndex, setSelectedDishIndex] = useState(0);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Here you would typically send the data to your backend
      toast({
        title: "Booking Request Submitted!",
        description: "We'll contact you within 24 hours to confirm your event details.",
      });

      setFormData({
        name: '',
        phone: '',
        email: '',
        eventDate: '',
        eventType: '',
        additionalInfo: ''
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit booking request. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen px-4 py-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-white mb-4">Event Catering</h1>
          <p className="text-xl text-gray-300">Let's spice up your event with our special courses!</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Catering Packages */}
          <div className="space-y-8">
            <div className="glass-card p-8">
              <h2 className="text-3xl font-bold text-white mb-6">Our Catering Packages</h2>
              
              {/* Hamburger Dropdown for Jollof Dishes */}
              <div className="mb-6">
                <label className="block text-gray-300 mb-2">Choose Your Jollof Dish</label>
                <div className="relative">
                  <select
                    className="w-full p-3 border border-gray-200 rounded-xl text-white bg-zinc-700"
                    style={{ backgroundImage: 'linear-gradient(to right, #001f4d,rgb(45, 15, 46),rgb(24, 2, 40))' }}
                    value={selectedDishIndex}
                    onChange={e => setSelectedDishIndex(Number(e.target.value))}
                  >
                    {jollofDishes.map((dish, idx) => (
                      <option key={dish.name} value={idx}>{dish.name}</option>
                    ))}
                  </select>
                  {/* Hamburger icon (optional, for mobile) */}
                  <span className="absolute right-3 top-3 text-gray-400">
                    <svg width="24" height="24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"/></svg>
                  </span>
                </div>
                {/* Display selected dish details */}
                <div className="mt-4 bg-gray-800 p-4 rounded-2xl">
{                  <img 
                    src={jollofDishes[selectedDishIndex].image} 
                    alt={jollofDishes[selectedDishIndex].name} 
                    className="w-full h-48 object-cover rounded-lg mb-4"
                  />}
                  <h3 className="text-xl font-semibold text-coral-400">{jollofDishes[selectedDishIndex].name}</h3>
                  <p className="text-gray-300">{jollofDishes[selectedDishIndex].description}</p>
                  <p className="text-2xl font-bold text-white">{jollofDishes[selectedDishIndex].price}</p>
                </div>
              </div>

              {/* Additional Meats */}
              <div className="space-y-4">
                <h4 className="text-lg font-semibold text-white">Additional Meats (per person)</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {additionalMeats.map(meat => (
                    <div key={meat.name} className="flex justify-between items-center p-3 bg-white/5 rounded-lg">
                      <span className="text-gray-300">{meat.name}</span>
                      <span className="text-coral-400 font-semibold">{meat.price}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Labor for the Day */}
              <div className="border-t border-white/10 pt-4">
                <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg">
                  <span className="text-gray-300">Labor for the Day</span>
                  <span className="text-coral-400 font-semibold">$250</span>
                </div>
              </div>
            </div>

            {/* Terms & Conditions */}
            <div className="glass-card p-6">
              <h3 className="text-xl font-semibold text-white mb-4">Terms & Conditions</h3>
              <ul className="space-y-2 text-gray-300 text-sm">
                <li>• Catering services cover the whole day until all meats are cooked and served.</li>
                <li>• Customers are welcome to inspect all meats before grilling begins.</li>
                <li>• We do not grill or cook meats provided onsite by customers.</li>
                <li>• Additional charges apply if we provide the grill.</li>
                <li>• Due to scheduling constraints, if a client cancels, only half of the deposit amount will be refunded.</li>
              </ul>
            </div>
          </div>

          {/* Booking Form */}
          <div className="glass-card p-8">
            <h2 className="text-3xl font-bold text-white mb-6">Book Your Event</h2>
            <p className="text-gray-300 mb-6">Please fill out the form below to book our catering services:</p>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-gray-300 mb-2">Name *</label>
                <Input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full p-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400"
                  placeholder="Your full name"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-300 mb-2">Phone Number *</label>
                <Input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full p-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400"
                  placeholder="+1 (682) 283-3812"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-300 mb-2">Email *</label>
                <Input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full p-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400"
                  placeholder="your.email@example.com"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-300 mb-2">Event Date *</label>
                <Input
                  type="date"
                  name="eventDate"
                  value={formData.eventDate}
                  onChange={handleInputChange}
                  className="w-full p-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-300 mb-2">Event Type *</label>
                <select
                  name="eventType"
                  value={formData.eventType}
                  onChange={handleInputChange}
                  className="w-full p-3 bg-white/10 border border-white/20 rounded-lg text-white"
                  required
                >
                  <option value="">Select event type</option>
                  <option value="wedding">Wedding</option>
                  <option value="birthday">Birthday Party</option>
                  <option value="corporate">Corporate Event</option>
                  <option value="graduation">Graduation Party</option>
                  <option value="anniversary">Anniversary</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-gray-300 mb-2">Additional Information</label>
                <Textarea
                  name="additionalInfo"
                  value={formData.additionalInfo}
                  onChange={handleInputChange}
                  className="w-full p-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 h-24 resize-none"
                  placeholder="Tell us more about your event, guest count, special requirements, etc."
                />
              </div>

              <Button 
                type="submit" 
                className="w-full btn-coral text-lg py-4"
                disabled={loading}
              >
                {loading ? 'Submitting...' : 'Submit Booking Request'}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Catering;
