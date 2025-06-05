import { Link } from 'react-router-dom';

const About = () => {
  return (
    <div className="min-h-screen px-4 py-8 bg-gradient-to-r from-black via-coral-900 to-black">
      <div className="max-w-5xl mx-auto w-full bg-gradient-to-r from-black via-coral-900 to-black rounded-lg shadow-lg">
        <div className="glass-card p-8 md:p-12 animate-fade-in">
          <h1 className="text-4xl font-bold text-white mb-8 text-center">
            About <span className="text-coral-400">JaduPoint</span>
          </h1>
          
          <div className="grid md:grid-cols-2 gap-8 items-center mb-12">
            <div>
              <img 
                src="https://images.unsplash.com/photo-1721322800607-8c38375eef04?w=600" 
                alt="Our restaurant interior"
                className="rounded-lg w-full h-64 object-cover"
              />
            </div>
<div>
  <h2 className="text-2xl font-semibold text-coral-400 mb-4 text-center">Our Story</h2>
  <p className="text-gray-300 leading-relaxed text-justify">
    JaduPoint officially started in June 2024, but our journey with authentic Nigerian cuisine began over 15 years ago. Founded out of a passion for perfectly prepared traditional meals, we are committed to sharing the rich, assorted flavors of Nigeria with today’s food lovers. Our mission is to blend time-honored recipes with a modern touch, delivering meals that celebrate heritage, quality, and unforgettable taste. At JaduPoint, every dish is crafted with care, pride, and a love for bringing people together through food. We also take special orders for big events such as weddings, anniversaries, and other celebrations, making your occasions truly memorable.
  </p>
</div>

          </div>

          <div className="mb-12">
            <h2 className="text-2xl font-semibold text-coral-400 mb-6 text-center">Our Mission</h2>
            <p className="text-gray-300 leading-relaxed text-center max-w-3xl mx-auto">
              To preserve and celebrate the rich culinary heritage of West African cuisine while making 
              it accessible to everyone. We believe that food is more than sustenance—it's a connection 
              to culture, family, and community.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <div className="text-center">
              <div className="glass-card p-6">
                <h3 className="text-xl font-semibold text-white mb-3">Authentic Recipes</h3>
                <p className="text-gray-400 text-sm">
                  Traditional recipes passed down through generations, prepared with love and respect for our heritage.
                </p>
              </div>
            </div>
            
            <div className="text-center">
              <div className="glass-card p-6">
                <h3 className="text-xl font-semibold text-white mb-3">Fresh Ingredients</h3>
                <p className="text-gray-400 text-sm">
                  We source the finest, freshest ingredients to ensure every dish meets our high standards.
                </p>
              </div>
            </div>
            
            <div className="text-center">
              <div className="glass-card p-6">
                <h3 className="text-xl font-semibold text-white mb-3">Fast Delivery</h3>
                <p className="text-gray-400 text-sm">
                  Hot, fresh meals delivered quickly to your door, maintaining quality and temperature.
                </p>
              </div>
            </div>
          </div>

          <div className="text-center">
            <h2 className="text-2xl font-semibold text-coral-400 mb-4">Why Choose JaduPoint?</h2>
            <div className="grid md:grid-cols-2 gap-6 text-left">
              <div>
                <ul className="text-gray-300 space-y-3">
                  <li className="flex items-start">
                    <span className="text-coral-400 mr-2">•</span>
                    Over 16 years of combined culinary experience
                  </li>
                  <li className="flex items-start">
                    <span className="text-coral-400 mr-2">•</span>
                    Authentic Nigerian cooking techniques
                  </li>
                  <li className="flex items-start">
                    <span className="text-coral-400 mr-2">•</span>
                    Locally sourced, premium ingredients
                  </li>
                </ul>
              </div>
              <div>
                <ul className="text-gray-300 space-y-3">
                  <li className="flex items-start">
                    <span className="text-coral-400 mr-2">•</span>
                    Custom spice levels to suit your preference
                  </li>
                  <li className="flex items-start">
                    <span className="text-coral-400 mr-2">•</span>
                    Eco-friendly packaging and delivery
                  </li>
                  <li className="flex items-start">
                    <span className="text-coral-400 mr-2">•</span>
                    Satisfaction guaranteed or your money back
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Admin Login Link */}
          <div className="mt-12 pt-8 border-t border-white/10 text-center">
            <Link 
              to="/admin/login"
              className="text-gray-500 hover:text-gray-400 text-sm transition-colors"
            >
              Admin Access
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
