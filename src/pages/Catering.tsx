
import { useState } from 'react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { useToast } from '../hooks/use-toast';

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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Here you would typically send the data to your backend
      console.log('Catering booking data:', formData);
      
      toast({
        title: "Booking Request Submitted!",
        description: "We'll contact you within 24 hours to confirm your event details.",
      });

      // Reset form
      setFormData({
        name: '',
        phone: '',
        email: '',
        eventDate: '',
        eventType: '',
        additionalInfo: ''
      });
    } catch (error) {
      console.error('Error submitting booking:', error);
      toast({
        title: "Error",
        description: "Failed to submit booking request. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const jollofDishes = [
    "Classic Nigerian Jollof",
    "Smoky Party Jollof",
    "Coconut Jollof Rice",
    "Seafood Jollof Supreme",
    "Vegetarian Garden Jollof",
    "Spicy Warrior Jollof"
  ];

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
              
              <div className="space-y-6">
                <div className="border-b border-white/10 pb-4">
                  <h3 className="text-xl font-semibold text-coral-400">Spicy Warrior Jollof</h3>
                  <p className="text-gray-300">Signature Jollof experience</p>
                  <p className="text-2xl font-bold text-white">$3,000</p>
                </div>

                <div className="space-y-4">
                  <h4 className="text-lg font-semibold text-white">Additional Meats (per person)</h4>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg">
                      <span className="text-gray-300">Whole Event</span>
                      <span className="text-coral-400 font-semibold">$15/person</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg">
                      <span className="text-gray-300">Beef Suya</span>
                      <span className="text-coral-400 font-semibold">$5/person</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg">
                      <span className="text-gray-300">Chicken Suya</span>
                      <span className="text-coral-400 font-semibold">$5/person</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg">
                      <span className="text-gray-300">Chicken Wing Suya</span>
                      <span className="text-coral-400 font-semibold">$5/person</span>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg">
                    <span className="text-gray-300">Asun</span>
                    <span className="text-coral-400 font-semibold">$600 (flat rate)</span>
                  </div>
                </div>

                <div className="border-t border-white/10 pt-4">
                  <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg">
                    <span className="text-gray-300">Labor for the Day</span>
                    <span className="text-coral-400 font-semibold">$250</span>
                  </div>
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

            {/* Jollof Dishes Available */}
            <div className="glass-card p-6">
              <h3 className="text-xl font-semibold text-white mb-4">Jollof Dishes Available</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {jollofDishes.map((dish, index) => (
                  <div key={index} className="p-2 bg-white/5 rounded text-gray-300 text-sm">
                    {dish}
                  </div>
                ))}
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
