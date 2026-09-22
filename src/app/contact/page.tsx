import { Mail, Phone, MapPin } from 'lucide-react';

export default function ContactPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center mb-16">
        <h1 className="text-4xl font-poppins font-bold text-dark-green mb-4">Contact Us</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Have questions about our products or your order? We&apos;re here to help! 
          Reach out to us through any of the channels below.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Contact Info */}
        <div className="bg-light-grey p-10 rounded-2xl">
          <h2 className="text-2xl font-poppins font-bold text-gray-900 mb-8">Get in Touch</h2>
          
          <div className="space-y-6">
            <div className="flex items-start">
              <div className="bg-white p-3 rounded-full text-gold mr-4 shadow-sm">
                <Phone size={24} />
              </div>
              <div>
                <h3 className="font-bold text-gray-900">Phone & WhatsApp</h3>
                <p className="text-gray-600 mt-1">+92 300 1234567</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="bg-white p-3 rounded-full text-gold mr-4 shadow-sm">
                <Mail size={24} />
              </div>
              <div>
                <h3 className="font-bold text-gray-900">Email</h3>
                <p className="text-gray-600 mt-1">support@bootinatural.com</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="bg-white p-3 rounded-full text-gold mr-4 shadow-sm">
                <MapPin size={24} />
              </div>
              <div>
                <h3 className="font-bold text-gray-900">Location</h3>
                <p className="text-gray-600 mt-1">123 Natural Way, Wellness City, Pakistan</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Contact Form */}
        <div className="bg-white p-10 rounded-2xl shadow-sm border border-gray-100">
          <h2 className="text-2xl font-poppins font-bold text-gray-900 mb-8">Send a Message</h2>
          
          <form className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
              <input 
                type="text" 
                id="name" 
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-gold focus:border-gold outline-none transition-colors"
                placeholder="John Doe"
              />
            </div>
            
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
              <input 
                type="email" 
                id="email" 
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-gold focus:border-gold outline-none transition-colors"
                placeholder="john@example.com"
              />
            </div>
            
            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">Message</label>
              <textarea 
                id="message" 
                rows={4}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-gold focus:border-gold outline-none transition-colors resize-none"
                placeholder="How can we help you?"
              ></textarea>
            </div>
            
            <button 
              type="button" 
              className="w-full py-4 bg-dark-green text-white font-bold rounded-lg hover:bg-[#122711] transition-colors focus:ring-4 focus:ring-green-900/20 shadow-lg shadow-green-900/20"
            >
              Send Message
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
