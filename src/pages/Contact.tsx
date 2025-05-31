import { useState } from 'react';
import { Button } from '../components/ui/button';
import emailjs from '@emailjs/browser';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);

  // Initialize EmailJS with your public key once
  emailjs.init('VvF5HuAWU3b9UV75I');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const serviceID = 'service_nhkj0mp';
    const templateID = 'template_r7qndos';

    const templateParams = {
      name: formData.name,
      email: formData.email,
      message: formData.message,
    };

    emailjs.send(serviceID, templateID, templateParams)
      .then(() => {
        alert('Thank you for your message! We\'ll get back to you soon.');
        setFormData({ name: '', email: '', message: '' });
      })
      .catch((error) => {
        console.error('Failed to send email:', error);
        alert('Oops! Something went wrong. Please try again later.');
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <div className="min-h-screen px-4 py-8 bg-gradient-to-r from-black via-coral-900 to-black">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4 animate-fade-in">
            Contact <span className="text-coral-400">JaduPoint</span>
          </h1>
          <p className="text-gray-300 animate-fade-in">
            We'd love to hear from you! Get in touch with any questions, feedback, or special requests.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Contact Info */}
          <div className="glass-card p-6 animate-fade-in">
            <h2 className="text-2xl font-semibold text-coral-400 mb-6">Get in Touch</h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-white font-semibold mb-1">Phone</h3>
                <p className="text-gray-300">+1 (555) 123-JADU</p>
              </div>
              <div>
                <h3 className="text-white font-semibold mb-1">Email</h3>
                <p className="text-gray-300">hello@jadupoint.com</p>
              </div>
              <div>
                <h3 className="text-white font-semibold mb-1">Address</h3>
                <p className="text-gray-300">
                  3387 chapel oaks drive,<br />
                  Coppell Texas 75019
                </p>
              </div>
              <div>
                <h3 className="text-white font-semibold mb-1">Hours</h3>
                <div className="text-gray-300 text-sm">
                  <p>Monday - Friday: 10am - 10pm</p>
                  <p>Saturday - Sunday: 9am - 11pm</p>
                </div>
              </div>
            </div>
            <div className="mt-8">
              <h3 className="text-white font-semibold mb-3">Quick Questions?</h3>
              <p className="text-gray-400 text-sm mb-4">
                For immediate assistance with orders or general inquiries, you can also reach us through:
              </p>
              <div className="space-y-2 text-sm">
                <p className="text-gray-300">WhatsApp: +1 (555) 123-JADU</p>
                <p className="text-gray-300">Twitter: @JaduPoint</p>
                <p className="text-gray-300">Instagram: @jadupoint_official</p>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="glass-card p-6 animate-fade-in">
            <h2 className="text-2xl font-semibold text-coral-400 mb-6">Send us a Message</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-white font-semibold mb-2">Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full p-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:border-coral-400 focus:outline-none transition-colors"
                  placeholder="Your full name"
                />
              </div>
              <div>
                <label className="block text-white font-semibold mb-2">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full p-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:border-coral-400 focus:outline-none transition-colors"
                  placeholder="your.email@example.com"
                />
              </div>
              <div>
                <label className="block text-white font-semibold mb-2">Message</label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={5}
                  className="w-full p-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:border-coral-400 focus:outline-none transition-colors resize-none"
                  placeholder="Tell us how we can help you..."
                />
              </div>
              <Button type="submit" className="w-full btn-coral" disabled={loading}>
                {loading ? 'Sending...' : 'Send Message'}
              </Button>
            </form>
            <div className="mt-6 p-4 bg-coral-500/10 border border-coral-500/20 rounded-lg">
              <p className="text-coral-300 text-sm">
                <strong>Note:</strong> We typically respond to all inquiries within 24 hours. 
                For urgent matters, please call us directly.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
