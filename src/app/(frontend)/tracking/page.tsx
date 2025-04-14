'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

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

const cardVariant = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export default function HomePage() {
  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [filtered, setFiltered] = useState<Shipment[]>([]);
  const [search, setSearch] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);

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
      } finally {
        setLoading(false);
      }
    };

    fetchShipments();
  }, []);

  const handleSearch = (trackingNumber: string) => {
    setSearch(trackingNumber);
    const filteredResults = shipments.filter((shipment) =>
      shipment.trackingNumber.toLowerCase().includes(trackingNumber.toLowerCase())
    );
    setFiltered(filteredResults);
  };

  return (
    <main className="flex flex-col min-h-screen bg-gray-50 text-gray-800">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-emerald-600 to-teal-500 text-white py-16 px-6 sm:px-0 flex flex-col justify-center items-center space-y-6 text-center">
        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight">
          Track Your Shipment
        </h1>
        <p className="text-lg sm:text-xl max-w-xl">
          Enter your tracking number to get the latest shipment updates.
        </p>
        <input
          type="text"
          placeholder="Enter Tracking Number"
          className="w-full max-w-md p-4 rounded-xl text-lg border border-white bg-white text-emerald-700 placeholder-emerald-400 shadow-md focus:outline-none focus:ring-4 focus:ring-emerald-300 transition-all duration-300"
          value={search}
          onChange={(e) => handleSearch(e.target.value)}
        />
      </section>

      {/* Loading State */}
      {loading ? (
        <section className="flex justify-center items-center py-20">
          <img src="/loading.gif" alt="Loading..." className="w-16 h-16" />
        </section>
      ) : search ? (
        <section className="px-4 sm:px-8 py-10">
          <h2 className="text-3xl font-bold mb-6 text-center text-emerald-700">
            Shipment Details
          </h2>

          {filtered.length > 0 ? (
            <div className="flex flex-col gap-10">
              {filtered.map((shipment) => (
                <div key={shipment.id} className="flex flex-col gap-6">
                  {/* Shipment Cards */}
                  <div className="flex flex-col md:flex-row gap-6">
                    {/* Shipment Details */}
                    <motion.div
                      variants={cardVariant}
                      initial="hidden"
                      animate="visible"
                      className="bg-white/80 backdrop-blur-lg border border-gray-200 p-6 rounded-3xl shadow-xl hover:shadow-2xl transition-shadow w-full md:w-1/3"
                    >
                      <h3 className="text-xl font-bold text-emerald-700">Shipment Details</h3>
                      <div className="mt-4 space-y-2">
                        <p><strong>Quantity:</strong> {shipment.shipmentDetails.quantity}</p>
                        <p><strong>Weight:</strong> {shipment.shipmentDetails.weight} kg</p>
                        <p><strong>Service Type:</strong> {shipment.shipmentDetails.serviceType}</p>
                        {shipment.shipmentDetails.description && (
                          <p>
                            <strong>Description:</strong>{' '}
                            <span className={
                              /hold|customs|lost|delay/i.test(shipment.shipmentDetails.description)
                                ? 'text-rose-600 font-semibold'
                                : 'text-gray-700'
                            }>
                              {shipment.shipmentDetails.description}
                            </span>
                          </p>
                        )}
                      </div>
                    </motion.div>

                    {/* Destination */}
                    <motion.div
                      variants={cardVariant}
                      initial="hidden"
                      animate="visible"
                      className="bg-white/80 backdrop-blur-lg border border-gray-200 p-6 rounded-3xl shadow-xl hover:shadow-2xl transition-shadow w-full md:w-1/3"
                    >
                      <h3 className="text-xl font-bold text-emerald-700">Destination</h3>
                      <div className="mt-4 space-y-2">
                        <p><strong>Receiver Name:</strong> {shipment.destination.receiverName}</p>
                        <p><strong>Receiver Email:</strong> {shipment.destination.receiverEmail}</p>
                        {shipment.destination.receiverAddress && (
                          <p><strong>Receiver Address:</strong> {shipment.destination.receiverAddress}</p>
                        )}
                        {shipment.destination.expectedDeliveryDate && (
                          <p><strong>Expected Delivery:</strong> {new Date(shipment.destination.expectedDeliveryDate).toLocaleDateString()}</p>
                        )}
                      </div>
                    </motion.div>

                    {/* Origin */}
                    <motion.div
                      variants={cardVariant}
                      initial="hidden"
                      animate="visible"
                      className="bg-white/80 backdrop-blur-lg border border-gray-200 p-6 rounded-3xl shadow-xl hover:shadow-2xl transition-shadow w-full md:w-1/3"
                    >
                      <h3 className="text-xl font-bold text-emerald-700">Origin</h3>
                      <div className="mt-4 space-y-2">
                        <p><strong>Sender Name:</strong> {shipment.origin.senderName}</p>
                        {shipment.origin.location && <p><strong>Location:</strong> {shipment.origin.location}</p>}
                        {shipment.origin.shipmentDate && (
                          <p><strong>Shipment Date:</strong> {new Date(shipment.origin.shipmentDate).toLocaleDateString()}</p>
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
                      className="bg-white/90 backdrop-blur-md p-6 rounded-3xl shadow-lg border border-gray-200"
                    >
                      <h3 className="text-xl font-bold text-emerald-700 mb-4">Shipment History</h3>
                      <ul className="space-y-4">
                        {shipment.trackingHistory.map((item, index) => (
                          <motion.li
                            key={item.id}
                            variants={cardVariant}
                            initial="hidden"
                            animate="visible"
                            transition={{ delay: index * 0.1 }}
                            className={`relative border-l-4 pl-6 py-4 bg-white/60 backdrop-blur-md rounded-lg shadow ${
                              isProblemStatus(item.status)
                                ? 'border-rose-600 text-rose-600'
                                : 'border-emerald-500 text-gray-800'
                            }`}
                          >
                            <span className={`absolute -left-2 top-5 w-3 h-3 rounded-full ${
                              isProblemStatus(item.status)
                                ? 'bg-rose-600'
                                : 'bg-emerald-500'
                            }`} />
                            <p><strong>Date:</strong> {new Date(item.date).toLocaleDateString()}</p>
                            <p><strong>Location:</strong> {item.location}</p>
                            <p><strong>Status:</strong> <span className="capitalize">{item.status}</span></p>
                            <p><strong>Remark:</strong> {item.remark}</p>
                          </motion.li>
                        ))}
                      </ul>
                    </motion.div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-500">No shipments match that tracking number.</p>
          )}
        </section>
      ) : (
        <section className="text-center text-gray-500 py-10">
          <p>Start by typing a tracking number above to view shipment details.</p>
        </section>
      )}
    </main>
  );
}
