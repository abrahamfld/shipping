'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiSearch, FiPackage, FiMapPin, FiUser, FiCalendar, FiTruck, FiAlertTriangle, FiCheckCircle, FiClock } from 'react-icons/fi';

interface TrackingHistoryItem {
  id: string;
  date: string;
  location: string;
  remark: string;
  status: string;
}

interface Shipment {
  id: number;
  trackingNumber: string;
  shipmentDetails: {
    quantity: number;
    weight: string;
    serviceType: string;
    description?: string;
  };
  destination: {
    receiverName: string;
    receiverEmail: string;
    receiverAddress?: string;
    expectedDeliveryDate?: string;
  };
  origin: {
    senderName: string;
    location?: string;
    shipmentDate?: string;
  };
  trackingHistory: TrackingHistoryItem[];
  createdAt: string;
  updatedAt: string;
}

const isProblemStatus = (status: string) => {
  return ["on-hold", "lost", "held-by-customs", "delayed"].includes(status.toLowerCase());
};

const getStatusIcon = (status: string) => {
  if (isProblemStatus(status)) return <FiAlertTriangle className="inline mr-1" />;
  if (status.toLowerCase() === "delivered") return <FiCheckCircle className="inline mr-1 text-green-500" />;
  return <FiClock className="inline mr-1 text-amber-500" />;
};

const cardVariant = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const itemVariant = {
  hidden: { opacity: 0, x: -20 },
  visible: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: {
      delay: i * 0.1,
      duration: 0.5
    }
  })
};

export default function HomePage() {
  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [filtered, setFiltered] = useState<Shipment[]>([]);
  const [search, setSearch] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [searched, setSearched] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [recentSearches, setRecentSearches] = useState<string[]>([]);

  useEffect(() => {
    const fetchShipments = async () => {
      try {
        await new Promise((resolve) => setTimeout(resolve, 2000));
        const res = await fetch('/my-route/shipments');
        const data = await res.json();
        if (data.success) {
          setShipments(data.shipments);
        }
      } catch (error) {
        console.error('Error fetching shipments:', error);
        setError('Failed to load shipment data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchShipments();
    
    // Load recent searches from localStorage
    const savedSearches = localStorage.getItem('recentShipmentSearches');
    if (savedSearches) {
      setRecentSearches(JSON.parse(savedSearches));
    }
  }, []);

  const handleSearch = () => {
    setSearched(true);
    setError('');
    setFiltered([]);

    const trimmedSearch = search.trim();
    
    if (!trimmedSearch) {
      setError('Please enter a tracking number');
      return;
    }

    // Show loading state
    setLoading(true);

    // Simulate loading for 3 seconds before showing results
    setTimeout(() => {
      // Case-insensitive exact match
      const exactMatch = shipments.find(
        (shipment) => shipment.trackingNumber.toLowerCase() === trimmedSearch.toLowerCase()
      );

      if (exactMatch) {
        setFiltered([exactMatch]);
        // Add to recent searches
        const updatedSearches = [trimmedSearch, ...recentSearches.filter(s => s !== trimmedSearch)].slice(0, 5);
        setRecentSearches(updatedSearches);
        localStorage.setItem('recentShipmentSearches', JSON.stringify(updatedSearches));
      } else {
        setError('No shipment found with that tracking number');
      }
      
      // Hide loading state
      setLoading(false);
    }, 3000); // 3 seconds delay
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleRecentSearchClick = (trackingNumber: string) => {
    setSearch(trackingNumber);
    setTimeout(() => handleSearch(), 0);
  };

  return (
    <main className="flex flex-col min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 text-gray-800">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-emerald-600 to-teal-500 text-white py-16 px-4 sm:px-6 flex flex-col justify-center items-center space-y-6 text-center">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-32 h-32 bg-white rounded-full filter blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-48 h-48 bg-white rounded-full filter blur-3xl"></div>
        </div>
        
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative z-10"
        >
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
            Track Your Shipment
          </h1>
          <p className="text-base sm:text-xl max-w-xl mt-4">
            Enter your complete tracking number to view real-time shipment details and delivery updates.
          </p>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="relative z-10 w-full px-4 sm:px-0 max-w-2xl"
        >
          <div className="flex flex-col sm:flex-row gap-2 w-full">
            <div className="relative flex-1">
              <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-emerald-600" />
              <input
                type="text"
                placeholder="Enter tracking number (e.g., SH123456789)"
                className="w-full pl-12 pr-4 py-3 sm:py-4 rounded-xl text-base sm:text-lg border border-white bg-white text-emerald-700 placeholder-emerald-400 shadow-lg focus:outline-none focus:ring-4 focus:ring-emerald-300/50 transition-all duration-300"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={handleKeyDown}
              />
            </div>
            <button
              onClick={handleSearch}
              className="flex items-center justify-center gap-2 bg-white text-emerald-700 font-bold py-3 sm:py-4 px-6 rounded-xl hover:bg-emerald-50 transition-all duration-300 shadow-lg hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-emerald-300/50 disabled:opacity-50"
              disabled={loading}
            >
              {loading ? (
                <svg className="animate-spin h-5 w-5 text-emerald-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : (
                <>
                  <FiSearch className="text-lg" />
                  Track
                </>
              )}
            </button>
          </div>
          
          {error && (
            <motion.p 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-rose-200 font-medium mt-3"
            >
              {error}
            </motion.p>
          )}
          
          {recentSearches.length > 0 && !search && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="mt-4 text-left bg-white/10 backdrop-blur-sm rounded-xl p-4"
            >
              <p className="text-sm text-white/80 mb-2">Recent searches:</p>
              <div className="flex flex-wrap gap-2">
                {recentSearches.map((trackingNumber) => (
                  <button
                    key={trackingNumber}
                    onClick={() => handleRecentSearchClick(trackingNumber)}
                    className="text-sm bg-white/20 hover:bg-white/30 px-3 py-1 rounded-lg transition-colors"
                  >
                    {trackingNumber}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </motion.div>
      </section>

      {/* Loading State */}
      <AnimatePresence>
        {loading && (
          <motion.section 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col justify-center items-center py-20 gap-6"
          >
            <div className="relative">
              <div className="animate-spin rounded-full h-20 w-20 border-t-4 border-b-4 border-emerald-500"></div>
              <FiPackage className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-emerald-500 text-2xl" />
            </div>
            <p className="text-gray-600">Tracking your shipment...</p>
          </motion.section>
        )}
      </AnimatePresence>

      {/* Results Section */}
      <AnimatePresence>
        {!loading && filtered.length > 0 && (
          <motion.section 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="px-4 sm:px-8 py-10 max-w-7xl mx-auto w-full"
          >
            <h2 className="text-3xl font-bold mb-8 text-center text-emerald-700">
              Shipment Details
            </h2>

            <div className="flex flex-col gap-8">
              {filtered.map((shipment) => (
                <div key={shipment.id} className="flex flex-col gap-8">
                  {/* Summary Card */}
                  <motion.div
                    variants={cardVariant}
                    initial="hidden"
                    animate="visible"
                    className="bg-white border border-gray-200 p-6 rounded-3xl shadow-lg hover:shadow-xl transition-shadow"
                  >
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div>
                        <h3 className="text-xl font-bold text-emerald-700 flex items-center gap-2">
                          <FiPackage /> Shipment #{shipment.trackingNumber}
                        </h3>
                        <p className="text-gray-600 mt-1">
                          {shipment.shipmentDetails.serviceType} • {shipment.shipmentDetails.weight} kg • {shipment.shipmentDetails.quantity} item(s)
                        </p>
                      </div>
                      <div className="flex flex-col sm:flex-row gap-4">
                        <div className="bg-emerald-50 text-emerald-700 px-4 py-2 rounded-lg">
                          <p className="font-medium">From</p>
                          <p>{shipment.origin.location || 'Unknown'}</p>
                        </div>
                        <div className="bg-teal-50 text-teal-700 px-4 py-2 rounded-lg">
                          <p className="font-medium">To</p>
                          <p>{shipment.destination.receiverAddress || 'Unknown'}</p>
                        </div>
                      </div>
                    </div>
                  </motion.div>

                  {/* Details Cards */}
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Shipment Details */}
                    <motion.div
                      variants={cardVariant}
                      initial="hidden"
                      animate="visible"
                      className="bg-white border border-gray-200 p-6 rounded-3xl shadow-lg hover:shadow-xl transition-shadow"
                    >
                      <h3 className="text-xl font-bold text-emerald-700 flex items-center gap-2 mb-4">
                        <FiPackage /> Package Details
                      </h3>
                      <div className="space-y-4">
                        <div className="flex items-start gap-3">
                          <div className="bg-emerald-100 p-2 rounded-lg text-emerald-600">
                            <FiPackage />
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Service Type</p>
                            <p className="font-medium">{shipment.shipmentDetails.serviceType}</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3">
                          <div className="bg-emerald-100 p-2 rounded-lg text-emerald-600">
                            <FiTruck />
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Weight & Quantity</p>
                            <p className="font-medium">{shipment.shipmentDetails.weight} kg • {shipment.shipmentDetails.quantity} item(s)</p>
                          </div>
                        </div>
                        {shipment.shipmentDetails.description && (
                          <div className="flex items-start gap-3">
                            <div className="bg-emerald-100 p-2 rounded-lg text-emerald-600">
                              <FiAlertTriangle />
                            </div>
                            <div>
                              <p className="text-sm text-gray-500">Special Notes</p>
                              <p className={
                                /hold|customs|lost|delay/i.test(shipment.shipmentDetails.description)
                                  ? 'text-rose-600 font-medium'
                                  : 'text-gray-700'
                              }>
                                {shipment.shipmentDetails.description}
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                    </motion.div>

                    {/* Destination */}
                    <motion.div
                      variants={cardVariant}
                      initial="hidden"
                      animate="visible"
                      className="bg-white border border-gray-200 p-6 rounded-3xl shadow-lg hover:shadow-xl transition-shadow"
                    >
                      <h3 className="text-xl font-bold text-emerald-700 flex items-center gap-2 mb-4">
                        <FiMapPin /> Destination
                      </h3>
                      <div className="space-y-4">
                        <div className="flex items-start gap-3">
                          <div className="bg-teal-100 p-2 rounded-lg text-teal-600">
                            <FiUser />
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Receiver</p>
                            <p className="font-medium">{shipment.destination.receiverName}</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3">
                          <div className="bg-teal-100 p-2 rounded-lg text-teal-600">
                            <FiMapPin />
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Address</p>
                            <p className="font-medium">
                              {shipment.destination.receiverAddress || 'Not specified'}
                            </p>
                          </div>
                        </div>
                        {shipment.destination.expectedDeliveryDate && (
                          <div className="flex items-start gap-3">
                            <div className="bg-teal-100 p-2 rounded-lg text-teal-600">
                              <FiCalendar />
                            </div>
                            <div>
                              <p className="text-sm text-gray-500">Expected Delivery</p>
                              <p className="font-medium">
                                {new Date(shipment.destination.expectedDeliveryDate).toLocaleDateString('en-US', {
                                  weekday: 'long',
                                  year: 'numeric',
                                  month: 'long',
                                  day: 'numeric'
                                })}
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                    </motion.div>

                    {/* Origin */}
                    <motion.div
                      variants={cardVariant}
                      initial="hidden"
                      animate="visible"
                      className="bg-white border border-gray-200 p-6 rounded-3xl shadow-lg hover:shadow-xl transition-shadow"
                    >
                      <h3 className="text-xl font-bold text-emerald-700 flex items-center gap-2 mb-4">
                        <FiMapPin /> Origin
                      </h3>
                      <div className="space-y-4">
                        <div className="flex items-start gap-3">
                          <div className="bg-amber-100 p-2 rounded-lg text-amber-600">
                            <FiUser />
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Sender</p>
                            <p className="font-medium">{shipment.origin.senderName}</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3">
                          <div className="bg-amber-100 p-2 rounded-lg text-amber-600">
                            <FiMapPin />
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Location</p>
                            <p className="font-medium">
                              {shipment.origin.location || 'Not specified'}
                            </p>
                          </div>
                        </div>
                        {shipment.origin.shipmentDate && (
                          <div className="flex items-start gap-3">
                            <div className="bg-amber-100 p-2 rounded-lg text-amber-600">
                              <FiCalendar />
                            </div>
                            <div>
                              <p className="text-sm text-gray-500">Shipment Date</p>
                              <p className="font-medium">
                                {new Date(shipment.origin.shipmentDate).toLocaleDateString('en-US', {
                                  weekday: 'long',
                                  year: 'numeric',
                                  month: 'long',
                                  day: 'numeric'
                                })}
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  </div>

                  {/* Tracking History */}
                  {shipment.trackingHistory?.length > 0 && (
                    <motion.div
                      variants={cardVariant}
                      initial="hidden"
                      animate="visible"
                      className="bg-white border border-gray-200 p-6 rounded-3xl shadow-lg"
                    >
                      <h3 className="text-xl font-bold text-emerald-700 flex items-center gap-2 mb-6">
                        <FiTruck /> Shipment History
                      </h3>
                      <div className="relative">
                        {/* Timeline line */}
                        <div className="absolute left-6 top-0 h-full w-0.5 bg-gray-200"></div>
                        
                        <ul className="space-y-6">
                          {shipment.trackingHistory.map((item, index) => (
                            <motion.li
                              key={item.id}
                              custom={index}
                              variants={itemVariant}
                              initial="hidden"
                              animate="visible"
                              className="relative pl-10"
                            >
                              {/* Timeline dot */}
                              <div className={`absolute left-0 top-1 w-4 h-4 rounded-full flex items-center justify-center ${
                                isProblemStatus(item.status)
                                  ? 'bg-rose-100 border-2 border-rose-500'
                                  : index === 0
                                    ? 'bg-emerald-100 border-2 border-emerald-500'
                                    : 'bg-gray-100 border-2 border-gray-400'
                              }`}>
                                <div className={`w-2 h-2 rounded-full ${
                                  isProblemStatus(item.status)
                                    ? 'bg-rose-500'
                                    : index === 0
                                      ? 'bg-emerald-500'
                                      : 'bg-gray-400'
                                }`}></div>
                              </div>
                              
                              <div className={`p-5 rounded-xl ${
                                isProblemStatus(item.status)
                                  ? 'bg-rose-50 border border-rose-100'
                                  : 'bg-gray-50 border border-gray-100'
                              }`}>
                                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                                  <h4 className="font-bold flex items-center gap-2">
                                    {getStatusIcon(item.status)}
                                    <span className="capitalize">{item.status.replace(/-/g, ' ')}</span>
                                  </h4>
                                  <p className="text-sm text-gray-500">
                                    {new Date(item.date).toLocaleDateString('en-US', {
                                      weekday: 'short',
                                      month: 'short',
                                      day: 'numeric',
                                      year: 'numeric',
                                      hour: '2-digit',
                                      minute: '2-digit'
                                    })}
                                  </p>
                                </div>
                                <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-4">
                                  <div>
                                    <p className="text-sm text-gray-500">Location</p>
                                    <p className="font-medium">{item.location}</p>
                                  </div>
                                  <div>
                                    <p className="text-sm text-gray-500">Remarks</p>
                                    <p className="font-medium">{item.remark}</p>
                                  </div>
                                </div>
                              </div>
                            </motion.li>
                          ))}
                        </ul>
                      </div>
                    </motion.div>
                  )}
                </div>
              ))}
            </div>
          </motion.section>
        )}
      </AnimatePresence>

      {/* Empty States */}
      <AnimatePresence>
        {!loading && (
          <>
            {searched && filtered.length === 0 && !error && (
              <motion.section 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center justify-center text-center py-16 px-4 max-w-2xl mx-auto"
              >
                <div className="bg-rose-100 p-4 rounded-full mb-6">
                  <FiPackage className="text-rose-500 text-3xl" />
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-2">No Shipment Found</h3>
                <p className="text-gray-600 mb-6">
                  We couldn't find any shipment with that tracking number. Please check the number and try again.
                </p>
                <button
                  onClick={() => setSearched(false)}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-2 px-6 rounded-lg transition-colors"
                >
                  Try Another Number
                </button>
              </motion.section>
            )}

            {!searched && filtered.length === 0 && (
              <motion.section 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center justify-center text-center py-16 px-4 max-w-2xl mx-auto"
              >
                <div className="bg-emerald-100 p-4 rounded-full mb-6">
                  <FiSearch className="text-emerald-500 text-3xl" />
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-2">Track Your Shipment</h3>
                <p className="text-gray-600 mb-6">
                  Enter a complete tracking number in the search field above to view detailed shipment information and real-time updates.
                </p>
                {recentSearches.length > 0 && (
                  <div className="w-full">
                    <p className="text-sm text-gray-500 mb-3">Your recent searches:</p>
                    <div className="flex flex-wrap justify-center gap-2">
                      {recentSearches.map((trackingNumber) => (
                        <button
                          key={trackingNumber}
                          onClick={() => handleRecentSearchClick(trackingNumber)}
                          className="text-sm bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
                        >
                          <FiPackage className="text-emerald-500" />
                          {trackingNumber}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </motion.section>
            )}
          </>
        )}
      </AnimatePresence>
    </main>
  );
}
