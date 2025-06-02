
import { useState } from 'react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { useToast } from '../hooks/use-toast';
import { useRecipes } from '../hooks/useRecipes';
import emailjs from '@emailjs/browser';

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
  const { recipes, loading, error } = useRecipes();
  
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    eventDate: '',
    eventType: '',
    numberOfPeople: '',
    additionalInfo: ''
  });
  const [loadingForm, setLoadingForm] = useState(false);
  const [selectedRecipeId, setSelectedRecipeId] = useState('');

  // Get the selected recipe object
  const selectedRecipe = recipes.find(recipe => recipe.id === selectedRecipeId) || recipes[0];

  // Calculate prices
  const dishPrice = selectedRecipe ? selectedRecipe.medium_price : 0;
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

  const handleRecipeChange = (e) => {
    setSelectedRecipeId(e.target.value);
  };

  // Set initial selected recipe when recipes load
  useState(() => {
    if (recipes.length > 0 && !selectedRecipeId) {
      setSelectedRecipeId(recipes[0].id);
    }
  }, [recipes, selectedRecipeId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoadingForm(true);

    const formattedMessage = `
Event Booking Request:
-------------------
Selected Jollof Dish: ${selectedRecipe?.name || 'Unknown'} ($${dishPrice}/person)
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
      title: `${formData.name}'s Event Booking Request`,
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
      setLoadingForm(false);
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen px-4 py-8 bg-gradient-to-r from-black via-coral-900 to-black flex items-center justify-center">
        <div className="text-white text-xl">Loading catering options...</div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen px-4 py-8 bg-gradient-to-r from-black via-coral-900 to-black flex items-center justify-center">
        <div className="text-center">
          <div className="text-white text-xl mb-4">Error loading recipes</div>
          <div className="text-gray-300">{error}</div>
        </div>
      </div>
    );
  }

  // No recipes available
  if (recipes.length === 0) {
    return (
      <div className="min-h-screen px-4 py-8 bg-gradient-to-r from-black via-coral-900 to-black flex items-center justify-center">
        <div className="text-white text-xl">No recipes available for catering</div>
      </div>
    );
  }

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
              
              {/* Dynamic Jollof Dishes Dropdown */}
              <div className="mb-6">
                <label className="block text-gray-300 mb-2">Choose Your Jollof Dish</label>
                <div className="relative">
                  <select
                    className="w-full pt-4 pb-4 pl-3 pr-6 border border-gray-700 rounded-xl text-white bg-coral-900"
                    value={selectedRecipeId}
                    onChange={handleRecipeChange}
                  >
                    {recipes.map((recipe) => (
                      <option key={recipe.id} value={recipe.id}>
                        {recipe.name}
                      </option>
                    ))}
                  </select>
                </div>
                
                {/* Display selected dish details */}
                {selectedRecipe && (
                  <div className="mt-4 bg-gradient-to-r from-black via-coral-900 to-black p-4 rounded-2xl">
                    <img 
                      src={selectedRecipe.image} 
                      alt={selectedRecipe.name} 
                      className="w-full h-64 object-cover rounded-lg mb-4"
                    />
                    <h3 className="text-xl font-semibold text-coral-300">{selectedRecipe.name}</h3>
                    <p className="text-gray-300">{selectedRecipe.description}</p>
                    <p className="text-2xl font-bold text-white">${selectedRecipe.medium_price}</p>
                  </div>
                )}
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
                disabled={loadingForm}
              >
                {loadingForm ? 'Submitting...' : 'Submit Booking Request'}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Catering;
