import { client } from '@/lib/sanity';
import Link from 'next/link';
import { CheckCircle2, Package, MapPin, CreditCard, ChevronRight } from 'lucide-react';
import { notFound } from 'next/navigation';

export default async function OrderSuccessPage({ params }: { params: { id: string } }) {
  const orderId = params.id;

  // Fetch order directly from Sanity
  const order = await client.fetch(`
    *[_type == "order" && _id == $id][0] {
      _id,
      customerName,
      customerEmail,
      phone,
      address,
      city,
      postalCode,
      paymentMethod,
      items,
      subtotal,
      shipping,
      total,
      status,
      createdAt
    }
  `, { id: orderId }, { cache: 'no-store' });

  if (!order) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-[#F9FAFB] font-inter py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto space-y-8">
        
        {/* Header Section */}
        <div className="bg-white p-8 sm:p-12 rounded-2xl shadow-sm border border-gray-100 text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-50 mb-6">
            <CheckCircle2 size={40} className="text-green-500" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-[#1B3B1A] mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>
            Order Confirmed!
          </h1>
          <p className="text-gray-600 text-base sm:text-lg max-w-lg mx-auto">
            Thank you for your order, {order.customerName.split(' ')[0]}. We've received your order and are getting it ready to be shipped.
          </p>
          
          <div className="mt-8 pt-8 border-t border-gray-100 flex flex-col sm:flex-row justify-center gap-4">
            <Link 
              href="/"
              className="inline-flex items-center justify-center px-8 py-3.5 bg-[#1B3B1A] text-white font-semibold rounded-full hover:bg-[#2D5A2A] transition-colors"
            >
              Continue Shopping
            </Link>
            <button 
              className="inline-flex items-center justify-center px-8 py-3.5 bg-white text-[#1B3B1A] font-semibold rounded-full border border-[#E5E7EB] hover:bg-gray-50 transition-colors"
            >
              Track Order <span className="text-xs ml-2 text-gray-400 font-normal">(Coming soon)</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Order Details Card */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-6">
            <div className="flex items-center justify-between border-b border-gray-100 pb-4">
              <h2 className="text-lg font-bold text-[#1B3B1A]" style={{ fontFamily: 'Playfair Display, serif' }}>Order Details</h2>
              <span className="text-sm font-medium text-gray-500">#{order._id.slice(-8)}</span>
            </div>
            
            <div className="space-y-4">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Date</span>
                <span className="font-medium text-gray-900">
                  {new Date(order.createdAt).toLocaleDateString('en-PK', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric'
                  })}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Payment Method</span>
                <span className="font-medium text-gray-900 capitalize">
                  {order.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Bank Transfer'}
                </span>
              </div>
            </div>

            <div className="border-t border-gray-100 pt-4">
              <h3 className="text-sm font-bold text-gray-900 mb-4">Items</h3>
              <div className="space-y-4">
                {order.items.map((item: any, i: number) => (
                  <div key={i} className="flex gap-4">
                    <div className="w-16 h-16 bg-gray-100 rounded-lg border border-gray-200 overflow-hidden shrink-0 flex items-center justify-center">
                      {item.image ? (
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                      ) : (
                        <Package size={20} className="text-gray-400" />
                      )}
                    </div>
                    <div className="flex-1 flex flex-col justify-center">
                      <p className="text-sm font-semibold text-gray-900 line-clamp-1">{item.name}</p>
                      <p className="text-xs text-gray-500 mt-1">Qty: {item.quantity}</p>
                    </div>
                    <div className="text-right flex flex-col justify-center">
                      <p className="text-sm font-semibold text-[#1B3B1A]">Rs. {(item.price * item.quantity).toLocaleString()}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="border-t border-gray-100 pt-4 space-y-3 text-sm">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span className="font-medium">Rs. {(order.subtotal || order.total).toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Shipping</span>
                <span className="font-medium">Rs. {order.shipping?.toLocaleString() || '250'}</span>
              </div>
              <div className="flex justify-between text-lg font-bold text-[#1B3B1A] pt-2 border-t border-gray-100">
                <span>Total</span>
                <span>Rs. {order.total.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Delivery & Contact Card */}
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <div className="flex items-center gap-2 mb-4">
                <MapPin size={18} className="text-[#D4A017]" />
                <h2 className="text-lg font-bold text-[#1B3B1A]" style={{ fontFamily: 'Playfair Display, serif' }}>Delivery Address</h2>
              </div>
              <div className="text-sm text-gray-600 space-y-1">
                <p className="font-medium text-gray-900 text-base mb-2">{order.customerName}</p>
                <p>{order.address}</p>
                <p>{order.city} {order.postalCode}</p>
                <p className="pt-2 mt-2 border-t border-gray-50">{order.phone}</p>
              </div>
            </div>

            <div className="bg-[#1B3B1A] p-6 rounded-2xl shadow-sm text-white">
              <h2 className="text-lg font-bold mb-4 text-[#D4A017]" style={{ fontFamily: 'Playfair Display, serif' }}>Need Help?</h2>
              <p className="text-sm text-gray-300 mb-4">
                If you have any questions about your order, please contact our support team.
              </p>
              <div className="space-y-2 text-sm font-medium">
                <p>Email: <a href="mailto:support@bootinatural.com" className="text-white hover:text-[#D4A017] transition-colors">support@bootinatural.com</a></p>
                <p>Phone: <a href="tel:+923000000000" className="text-white hover:text-[#D4A017] transition-colors">+92 300 0000000</a></p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
