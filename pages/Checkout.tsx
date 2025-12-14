import React, { useState, useEffect } from 'react';
import { useStore } from '../context/StoreContext';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Trash2, Minus, Plus, Truck, CreditCard, ArrowRight, Loader } from 'lucide-react';
import { DeliveryOption, UserDetails } from '../types';
import { calculateShipping, processPayment } from '../services/mockApi';

export const CartPage = () => {
  const { cart, removeFromCart, updateCartQuantity } = useStore();
  const navigate = useNavigate();
  
  const subtotal = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);

  if (cart.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
        <h2 className="text-3xl font-bold text-white mb-4">Your Cart is Empty</h2>
        <p className="text-brand-muted mb-8">Looks like you haven't added any gear yet.</p>
        <button onClick={() => navigate('/shop')} className="bg-brand-red text-white px-8 py-3 rounded-lg font-bold hover:bg-brand-redHover transition-colors">
          Start Shopping
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-white mb-8">SHOPPING CART</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-6">
          {cart.map((item) => (
            <div key={item.cartId} className="flex gap-4 p-4 bg-brand-dark rounded-xl border border-brand-gray">
              <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-brand-gray">
                <img src={item.images[0]} alt={item.name} className="h-full w-full object-cover" />
              </div>
              
              <div className="flex flex-1 flex-col">
                <div>
                  <div className="flex justify-between text-base font-medium text-white">
                    <h3>{item.name}</h3>
                    <p className="ml-4">{item.price * item.quantity} RUB</p>
                  </div>
                  <p className="mt-1 text-sm text-brand-muted">{item.category}</p>
                  <p className="mt-1 text-sm text-brand-muted">Size: {item.selectedSize} | Color: {item.selectedColor}</p>
                </div>
                
                <div className="flex flex-1 items-end justify-between text-sm">
                  <div className="flex items-center border border-brand-gray rounded-lg">
                    <button onClick={() => updateCartQuantity(item.cartId, item.quantity - 1)} className="p-2 hover:text-white text-brand-muted"><Minus className="h-4 w-4" /></button>
                    <span className="px-2 text-white font-mono">{item.quantity}</span>
                    <button onClick={() => updateCartQuantity(item.cartId, item.quantity + 1)} className="p-2 hover:text-white text-brand-muted"><Plus className="h-4 w-4" /></button>
                  </div>

                  <button
                    type="button"
                    onClick={() => removeFromCart(item.cartId)}
                    className="font-medium text-brand-red hover:text-brand-redHover flex items-center gap-1"
                  >
                    <Trash2 className="h-4 w-4" /> Remove
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div className="bg-brand-dark p-6 rounded-xl border border-brand-gray h-fit">
          <h2 className="text-lg font-bold text-white mb-4">Order Summary</h2>
          <div className="flex justify-between py-2 border-b border-brand-gray">
            <span className="text-brand-muted">Subtotal</span>
            <span className="text-white font-mono">{subtotal} RUB</span>
          </div>
          <div className="py-2 text-sm text-brand-muted">
            Shipping calculated at next step.
          </div>
          <div className="flex justify-between py-4 text-xl font-bold text-white">
            <span>Total</span>
            <span>{subtotal} RUB</span>
          </div>
          <button 
            onClick={() => navigate('/checkout')}
            className="w-full bg-brand-red text-white py-4 rounded-lg font-bold hover:bg-brand-redHover transition-colors mt-4"
          >
            Proceed to Checkout
          </button>
        </div>
      </div>
    </div>
  );
};

export const Checkout = () => {
  const { cart, createOrder } = useStore();
  const navigate = useNavigate();
  const [step, setStep] = useState<1 | 2>(1); // 1: Details & Shipping, 2: Payment
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Form State
  const [details, setDetails] = useState<UserDetails>({
    fullName: '', phone: '', email: '', country: 'Russia', city: '', address: ''
  });
  
  // Shipping State
  const [shippingOptions, setShippingOptions] = useState<DeliveryOption[]>([]);
  const [selectedShipping, setSelectedShipping] = useState<DeliveryOption | null>(null);
  const [isCalculatingShipping, setIsCalculatingShipping] = useState(false);

  const subtotal = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const totalWeight = cart.reduce((acc, item) => acc + (item.weightKg * item.quantity), 0);

  // Trigger CDEK calc when City changes (debounced ideal, simple here)
  useEffect(() => {
    if (details.city.length > 2 && details.country === 'Russia') {
      setIsCalculatingShipping(true);
      calculateShipping(details.city, totalWeight).then(options => {
        setShippingOptions(options);
        setIsCalculatingShipping(false);
      });
    } else {
      setShippingOptions([]);
      setSelectedShipping(null);
    }
  }, [details.city, details.country, totalWeight]);

  const handleDetailsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedShipping) {
      setError('Please select a shipping method.');
      return;
    }
    setError('');
    setStep(2);
  };

  const handlePayment = async () => {
    setLoading(true);
    try {
      if(!selectedShipping) throw new Error("Shipping not selected");

      // Process Mock Payment
      const total = subtotal + selectedShipping.price;
      const paymentResult = await processPayment(total, { cardNumber: '4242' }); // Mock
      
      if (paymentResult.success) {
        // Create Order
        const orderId = await createOrder(details, { method: selectedShipping, cost: selectedShipping.price });
        // Redirect to success
        navigate(`/order-success/${orderId}`);
      } else {
        setError('Payment failed. Try again.');
      }
    } catch (err) {
      setError('An error occurred processing your order.');
    } finally {
      setLoading(false);
    }
  };

  if (cart.length === 0) return <div className="p-8 text-center text-white">Cart is empty. Redirecting...</div>;

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="flex items-center justify-center mb-8 gap-4">
        <div className={`flex items-center justify-center w-8 h-8 rounded-full ${step >= 1 ? 'bg-brand-red text-white' : 'bg-brand-gray text-brand-muted'}`}>1</div>
        <div className={`h-1 w-12 ${step >= 2 ? 'bg-brand-red' : 'bg-brand-gray'}`}></div>
        <div className={`flex items-center justify-center w-8 h-8 rounded-full ${step >= 2 ? 'bg-brand-red text-white' : 'bg-brand-gray text-brand-muted'}`}>2</div>
      </div>

      {step === 1 ? (
        <form onSubmit={handleDetailsSubmit} className="space-y-8">
          {/* Customer Details */}
          <div className="bg-brand-dark p-6 rounded-xl border border-brand-gray">
            <h2 className="text-xl font-bold text-white mb-4">Customer Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input 
                required placeholder="Full Name" 
                className="bg-brand-black border border-brand-gray p-3 rounded text-white"
                value={details.fullName} onChange={e => setDetails({...details, fullName: e.target.value})}
              />
              <input 
                required placeholder="Phone" type="tel"
                className="bg-brand-black border border-brand-gray p-3 rounded text-white"
                value={details.phone} onChange={e => setDetails({...details, phone: e.target.value})}
              />
              <input 
                required placeholder="Email" type="email"
                className="bg-brand-black border border-brand-gray p-3 rounded text-white md:col-span-2"
                value={details.email} onChange={e => setDetails({...details, email: e.target.value})}
              />
            </div>
          </div>

          {/* Shipping Address */}
          <div className="bg-brand-dark p-6 rounded-xl border border-brand-gray">
            <h2 className="text-xl font-bold text-white mb-4">Shipping Address</h2>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                 <select 
                  className="bg-brand-black border border-brand-gray p-3 rounded text-white"
                  value={details.country} onChange={e => setDetails({...details, country: e.target.value})}
                >
                  <option value="Russia">Russia</option>
                  <option value="Belarus">Belarus</option>
                </select>
                <input 
                  required placeholder="City" 
                  className="bg-brand-black border border-brand-gray p-3 rounded text-white"
                  value={details.city} onChange={e => setDetails({...details, city: e.target.value})}
                />
              </div>
              <input 
                required placeholder="Street, House, Apt (or CDEK Address)" 
                className="bg-brand-black border border-brand-gray p-3 rounded text-white w-full"
                value={details.address} onChange={e => setDetails({...details, address: e.target.value})}
              />
            </div>
          </div>

          {/* CDEK Options */}
          <div className="bg-brand-dark p-6 rounded-xl border border-brand-gray">
            <div className="flex items-center gap-3 mb-4">
               <Truck className="text-brand-red" />
               <h2 className="text-xl font-bold text-white">Delivery Method (From Minsk)</h2>
            </div>
            
            {!details.city && <p className="text-brand-muted">Enter city to calculate shipping.</p>}
            {isCalculatingShipping && <p className="text-brand-muted flex items-center gap-2"><Loader className="animate-spin h-4 w-4"/> Calculating CDEK rates...</p>}
            
            <div className="space-y-3 mt-4">
              {shippingOptions.map(option => (
                <label key={option.id} className={`flex justify-between items-center p-4 border rounded-lg cursor-pointer transition-colors ${selectedShipping?.id === option.id ? 'border-brand-red bg-brand-red/10' : 'border-brand-gray hover:border-brand-muted'}`}>
                  <div className="flex items-center gap-3">
                    <input 
                      type="radio" 
                      name="shipping" 
                      checked={selectedShipping?.id === option.id}
                      onChange={() => setSelectedShipping(option)}
                      className="text-brand-red focus:ring-brand-red"
                    />
                    <div>
                      <p className="font-bold text-white">{option.name}</p>
                      <p className="text-sm text-brand-muted">{option.daysMin}-{option.daysMax} days</p>
                    </div>
                  </div>
                  <span className="font-mono text-white">{option.price} RUB</span>
                </label>
              ))}
            </div>
            {error && <p className="text-red-500 mt-2">{error}</p>}
          </div>

          <button type="submit" className="w-full bg-white text-black font-bold py-4 rounded-lg hover:bg-gray-200 transition-colors">
            Continue to Payment
          </button>
        </form>
      ) : (
        // PAYMENT STEP
        <div className="max-w-lg mx-auto space-y-6">
          <div className="bg-brand-dark p-6 rounded-xl border border-brand-gray">
             <h2 className="text-xl font-bold text-white mb-6">Payment</h2>
             
             <div className="space-y-2 mb-6 text-sm text-brand-muted border-b border-brand-gray pb-4">
               <div className="flex justify-between"><span>Subtotal:</span><span>{subtotal} RUB</span></div>
               <div className="flex justify-between"><span>Shipping ({selectedShipping?.name}):</span><span>{selectedShipping?.price} RUB</span></div>
               <div className="flex justify-between text-white font-bold text-lg pt-2"><span>Total:</span><span>{subtotal + (selectedShipping?.price || 0)} RUB</span></div>
             </div>

             {/* Mock Card Input */}
             <div className="space-y-4">
                <div className="relative">
                  <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-muted h-5 w-5" />
                  <input type="text" placeholder="Card Number" className="w-full bg-brand-black border border-brand-gray p-3 pl-10 rounded text-white" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <input type="text" placeholder="MM/YY" className="w-full bg-brand-black border border-brand-gray p-3 rounded text-white" />
                  <input type="text" placeholder="CVC" className="w-full bg-brand-black border border-brand-gray p-3 rounded text-white" />
                </div>
             </div>
             
             {error && <p className="text-red-500 mt-4 text-sm">{error}</p>}

             <div className="flex gap-4 mt-8">
               <button onClick={() => setStep(1)} className="flex-1 py-3 text-brand-muted hover:text-white">Back</button>
               <button 
                onClick={handlePayment} 
                disabled={loading}
                className="flex-[2] bg-brand-red text-white py-3 rounded-lg font-bold hover:bg-brand-redHover flex justify-center items-center gap-2"
              >
                {loading ? <Loader className="animate-spin h-5 w-5" /> : `Pay ${subtotal + (selectedShipping?.price || 0)} RUB`}
               </button>
             </div>
          </div>
        </div>
      )}
    </div>
  );
};

export const OrderSuccess = () => {
  const { id } = useParams();
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4">
      <div className="h-20 w-20 bg-green-900/30 text-green-500 rounded-full flex items-center justify-center mb-6 border border-green-900">
        <ArrowRight className="h-10 w-10 rotate-[-45deg]" />
      </div>
      <h1 className="text-3xl font-bold text-white mb-2">Order Confirmed!</h1>
      <p className="text-brand-muted mb-6">Thank you for choosing TopStore. Order #{id}</p>
      <div className="bg-brand-dark p-4 rounded-lg border border-brand-gray max-w-md mx-auto mb-8">
        <p className="text-sm text-brand-muted">A confirmation email has been sent to you. We will notify you once the package is handed over to CDEK.</p>
      </div>
      <Link to="/" className="bg-white text-black px-8 py-3 rounded-lg font-bold hover:bg-gray-200">
        Return Home
      </Link>
    </div>
  );
}