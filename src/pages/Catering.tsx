import { useState } from 'react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { useToast } from '../hooks/use-toast';
import emailjs from '@emailjs/browser'; // Uncomment if using EmailJS

const jollofDishes = [
  // Original jollof dishes
  { name: "Classic Nigerian Jollof", description: "Traditional Nigerian party Jollof rice.", price: "$26", image: "jollof/jollof1.jpg" },
  { name: "Smoky Party Jollof", description: "Smoky, flavorful Jollof perfect for parties.", price: "$30", image: "jollof/jollof2.jpg" },
  { name: "Coconut Jollof Rice", description: "Creamy coconut-infused Jollof rice.", price: "$37", image: "jollof/jollof3.jpg" },
  { name: "Seafood Jollof Supreme", description: "Loaded with fresh seafood delights.", price: "$30", image: "jollof/jollof4.jpg" },
  { name: "Vegetarian Garden Jollof", description: "Packed with garden-fresh vegetables.", price: "$35", image: "jollof/jollof5.jpg" },
  { name: "Spicy Warrior Jollof", description: "Our signature spicy Jollof experience.", price: "$30", image: "jollof/jollof6.jpg" },
  
  // Added fried rice dishes
  { 
    name: "Umami Bomb Fried Rice",
    description: "Savory explosion with shiitake mushrooms, bonito flakes, and spicy XO sauce topped with crispy garlic",
    price: "$30", 
    image: "Fried-Rice1.jpg"
  },
    { 
    name: "Smoked Jollof Snails",
    description: "Exquisite smoked snails served on a bed of our signature party Jollof rice with a rich pepper sauce",
    price: "$45", 
    image: "jollof-snails1.jpg"
  },
  { 
    name: "Dragon's Breath Fried Rice",
    description: "Intensely spicy fried rice with habanero peppers, Szechuan peppercorns, and chili oil. Not for the faint-hearted!",
    price: "$27", 
    image: "Fried-Rice2.jpg"
  },
  { 
    name: "Tropical Warrior Fried Rice",
    description: "Jerk-spiced fried rice with grilled shrimp, mango, coconut flakes and a ghost pepper honey glaze",
    price: "$29", 
    image: "Fried-Rice3.jpg"
  }
];

const additionalMeats = [
  { name: "Whole Event", price: "$15/person" },
  { name: "Snails", price: "$10/person" },
  { name: "Alligator", price: "$15/person" },
  { name: "smoked Fish", price: "$5/person" },
  { name: "Beef", price: "$10/person" },
  { name: "Goat Meat", price: "$15/person" }
];

const LABOUR_COST = 250;
const TAX_RATE = 0.0825; // 8.25%

const Catering = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    eventDate: '',
    eventType: '',
    numberOfPeople: '',
    additionalInfo: ''
  });
  const [loading, setLoading] = useState(false);
  const [selectedDishIndex, setSelectedDishIndex] = useState(0);

  // Calculate prices
  const dishPrice = Number(jollofDishes[selectedDishIndex].price.replace('$', '')) || 0;
  const numPeople = Number(formData.numberOfPeople) || 0;
  const subtotal = dishPrice * numPeople;
  const labour = LABOUR_COST;
  const preTaxTotal = subtotal + labour;
  const tax = preTaxTotal * TAX_RATE;
  const total = preTaxTotal + tax;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // EmailJS Integration (uncomment and configure if needed)
    
    const formattedMessage = `
Event Booking Request:
-------------------
Selected Jollof Dish: ${jollofDishes[selectedDishIndex].name} ($${dishPrice}/person)
Number of People: ${numPeople}
Subtotal: $${subtotal.toFixed(2)}
Labour for the Day: $${labour.toFixed(2)}
Tax (8.25%): $${tax.toFixed(2)}
Total: $${total.toFixed(2)}

Event Type: ${formData.eventType}
Event Date: ${formData.eventDate}
Phone: ${formData.phone}
Additional Information: ${formData.additionalInfo || 'None provided'}
    `;
    const templateParams = {
      name: formData.name,
      email: formData.email,
      message: formattedMessage,
      time: new Date().toLocaleString(),
    };
    try {
      await emailjs.send(
        'service_nhkj0mp',
        'template_r7qndos',
        templateParams,
        'VvF5HuAWU3b9UV75I'
      );
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
        numberOfPeople: '',
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
    
    // For now, just show the toast and reset the form
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
      numberOfPeople: '',
      additionalInfo: ''
    });
    setLoading(false);
  };

  return (
    <div className="min-h-screen px-4 py-8 bg-gradient-to-r from-black via-coral-900 to-black">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-white mb-4">Event <span className="text-coral-400">Catering</span></h1>
          <p className="text-xl text-gray-300">Let's spice up your event with our special courses!</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Catering Packages */}
          <div className="space-y-8">
            <div className="glass-card p-8">
              <h2 className="text-3xl font-bold text-white mb-6">Our Catering Packages</h2>
              
              {/* Jollof Dishes Dropdown */}
              <div className="mb-6">
                <label className="block text-gray-300 mb-2">Choose Your Jollof Dish</label>
                <div className="relative">
                  <select
                    className="w-full p-3 border border-gray-700 rounded-xl text-white bg-coral-900"
                    style={{ backgroundImage: 'linear-gradient(to right,rgb(35, 1, 51),rgb(42, 10, 43),rgb(24, 2, 40))' }}
                    value={selectedDishIndex}
                    onChange={e => setSelectedDishIndex(Number(e.target.value))}
                  >
                    {jollofDishes.map((dish, idx) => (
                      <option key={dish.name} value={idx}>{dish.name}</option>
                    ))}
                  </select>
                  <span className="absolute right-3 top-3 text-gray-400">
                    <svg width="24" height="24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"/></svg>
                  </span>
                </div>
                {/* Display selected dish details */}
                <div className="mt-4 bg-gradient-to-r from-black via-coral-900 to-black p-4 rounded-2xl">
                  <img 
                    src={jollofDishes[selectedDishIndex].image} 
                    alt={jollofDishes[selectedDishIndex].name} 
                    className="w-full h-64 object-cover rounded-lg mb-4"
                  />
                  <h3 className="text-xl font-semibold text-coral-300">{jollofDishes[selectedDishIndex].name}</h3>
                  <p className="text-gray-300">{jollofDishes[selectedDishIndex].description}</p>
                  <p className="text-2xl font-bold text-white">{jollofDishes[selectedDishIndex].price}</p>
                </div>
              </div>

              {/* Special Proteins */}
              <div className="space-y-4">
                <h4 className="text-lg font-semibold text-white">Special Proteins (per person)</h4>
                <div className="grid grid-cols-2 sm:grid-cols-2 gap-4">
                  {additionalMeats.map(meat => (
                    <div key={meat.name} className="flex justify-between items-center p-3 bg-white/5 rounded-lg">
                      <span className="text-gray-300">{meat.name}</span>
                      <span className="text-coral-300 font-semibold">{meat.price}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Labour for the Day */}
              <div className="border-t border-white/10 pt-4">
                <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg">
                  <span className="text-gray-300">Labour for the Day</span>
                  <span className="text-coral-300 font-semibold">${labour.toFixed(2)}</span>
                </div>
              </div>
              <div>
                <label className="block text-gray-300 mb-2">Number of Persons *</label>
                <Input
                  type="number"
                  name="numberOfPeople"
                  min="1"
                  value={formData.numberOfPeople}
                  onChange={handleInputChange}
                  className="w-full p-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400"
                  placeholder="e.g. 50"
                  required
                />
              </div>
              {/* Price Breakdown */}
              <div className="mt-6 p-4 bg-black/30 rounded-lg text-white space-y-2">
                <div className="flex justify-between">
                  <span>
                    Subtotal (${dishPrice}/person × {numPeople || 0} persons):
                  </span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Labour for the Day:</span>
                  <span>${labour.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax (8.25%):</span>
                  <span>${tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-bold text-coral-300 text-lg border-t border-white/10 pt-2">
                  <span>Total:</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>

              {/* Terms & Conditions */}
              <div className="glass-card p-6">
                <h3 className="text-xl font-semibold text-white mb-4">Terms & Conditions</h3>
                <ul className="space-y-2 text-gray-300 text-sm">
                  <li>• Catering services cover the entire event day until all Jollof rice dishes and meats are fully prepared and served.</li>
                  <li>• Customers are welcome to inspect all meats and Jollof rice dishes before serving begins.</li>
                  <li>• We do <strong>not</strong> grill or cook any meats provided onsite by customers.</li>
                  <li>• Additional charges apply if we provide grilling equipment or extra cooking services.</li>
                  <li>• Due to scheduling constraints, if a client cancels, only half of the deposit amount will be refunded.</li>
                </ul>
              </div>
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
                  className="w-full p-3 bg-coral-900 border border-white/20 rounded-lg text-white"
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
              {/* NUMBER OF PEOPLE FIELD */}
              <div>
                <label className="block text-gray-300 mb-2">Number of People *</label>
                <Input
                  type="number"
                  name="numberOfPeople"
                  min="1"
                  value={formData.numberOfPeople}
                  onChange={handleInputChange}
                  className="w-full p-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400"
                  placeholder="e.g. 50"
                  required
                />
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
                className="w-full text-lg text-white py-4 bg-gradient-to-r from-black via-zinc-900 to-black"
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
