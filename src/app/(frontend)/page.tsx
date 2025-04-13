'use client';

import { useEffect, useState } from 'react';

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

export default function HomePage() {
  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [filtered, setFiltered] = useState<Shipment[]>([]);
  const [search, setSearch] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchShipments = async () => {
      try {
        // 2-second delay
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
  ;

  const handleSearch = (trackingNumber: string) => {
    setSearch(trackingNumber);
    const filteredResults = shipments.filter((shipment) =>
      shipment.trackingNumber.toLowerCase().includes(trackingNumber.toLowerCase())
    );
    setFiltered(filteredResults);
  };

  return (
    <main className="flex flex-col min-h-screen bg-gray-50">
      {/* Hero/Search Section */}
      <section className="bg-emerald-600 text-white py-12 flex flex-col justify-center items-center space-y-6 text-center">
        <h1 className="text-4xl sm:text-5xl font-extrabold leading-tight">
          Track Your Shipments Easily
        </h1>
        <p className="text-lg sm:text-xl">
          Enter your tracking number below to find your shipment details.
        </p>
        <input
          type="text"
          placeholder="Enter Tracking Number"
          className="w-80 sm:w-96 p-4 rounded-xl text-lg border border-white bg-white text-emerald-700 placeholder-emerald-400 shadow-md focus:outline-none focus:ring-4 focus:ring-emerald-300"
          value={search}
          onChange={(e) => handleSearch(e.target.value)}
        />
      </section>

      {/* Loading */}
      {loading ? (
        <section className="flex justify-center items-center py-20">
          <img src="/loading.gif" alt="Loading..." className="w-16 h-16" />
          
        </section>
      ) : search ? (
        <section className="px-4 sm:px-8 py-8">
          <h2 className="text-3xl font-bold mb-6 text-center text-emerald-700">
            Shipment Details
          </h2>

          {filtered.length > 0 ? (
            <div className="flex flex-col gap-10">
              {filtered.map((shipment) => (
                <div
                  key={shipment.id}
                  className="flex flex-col gap-6"
                >
                  {/* Shipment Details Card */}
                  <div className="flex flex-col md:flex-row gap-6">
                    <div className="bg-white p-6 rounded-xl shadow-md w-full md:w-1/3">
                      <h3 className="text-xl font-semibold text-emerald-600">Shipment Details</h3>
                      <div className="mt-4 text-gray-700">
                        <p><strong>Quantity:</strong> {shipment.shipmentDetails.quantity}</p>
                        <p><strong>Weight:</strong> {shipment.shipmentDetails.weight} kg</p>
                        <p><strong>Service Type:</strong> {shipment.shipmentDetails.serviceType}</p>
                        {shipment.shipmentDetails.description && (
                          <p>
                            <strong>Description:</strong>{' '}
                            <span
                              className={
                                /hold|on hold/i.test(shipment.shipmentDetails.description)
                                  ? 'text-rose-600 font-semibold'
                                  : 'text-gray-700'
                              }
                            >
                              {shipment.shipmentDetails.description}
                            </span>
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Destination Card */}
                    <div className="bg-white p-6 rounded-xl shadow-md w-full md:w-1/3">
                      <h3 className="text-xl font-semibold text-emerald-600">Destination</h3>
                      <div className="mt-4 text-gray-700">
                        <p><strong>Receiver Name:</strong> {shipment.destination.receiverName}</p>
                        <p><strong>Receiver Email:</strong> {shipment.destination.receiverEmail}</p>
                        {shipment.destination.receiverAddress && (
                          <p><strong>Receiver Address:</strong> {shipment.destination.receiverAddress}</p>
                        )}
                        {shipment.destination.expectedDeliveryDate && (
                          <p><strong>Expected Delivery Date:</strong> {new Date(shipment.destination.expectedDeliveryDate).toLocaleDateString()}</p>
                        )}
                      </div>
                    </div>

                    {/* Origin Card */}
                    <div className="bg-white p-6 rounded-xl shadow-md w-full md:w-1/3">
                      <h3 className="text-xl font-semibold text-emerald-600">Origin</h3>
                      <div className="mt-4 text-gray-700">
                        <p><strong>Sender Name:</strong> {shipment.origin.senderName}</p>
                        {shipment.origin.location && (
                          <p><strong>Location:</strong> {shipment.origin.location}</p>
                        )}
                        {shipment.origin.shipmentDate && (
                          <p><strong>Shipment Date:</strong> {new Date(shipment.origin.shipmentDate).toLocaleDateString()}</p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Tracking History */}
                  {shipment.trackingHistory?.length > 0 && (
  <div className="bg-white p-6 rounded-xl shadow-md">
    <h3 className="text-xl font-semibold text-emerald-600 mb-4">Shipment History</h3>
    <ul className="space-y-4">
      {shipment.trackingHistory.map((item) => (
        <li
          key={item.id}
          className={`border-l-4 pl-4 ${
            item.status === "on-hold" || item.status === "lost"
              ? "border-red-600 text-red-600"
              : "border-emerald-500 text-gray-800"
          }`}
        >
          <p><strong>Date:</strong> {new Date(item.date).toLocaleDateString()}</p>
          <p><strong>Location:</strong> {item.location}</p>
          <p>
            <strong>Status:</strong>{" "}
            <span
              className={`capitalize ${
                item.status === "on-hold" || item.status === "lost"
                  ? "text-red-600"
                  : "text-gray-700"
              }`}
            >
              {item.status}
            </span>
          </p>
          <p><strong>Remark:</strong> {item.remark}</p>
        </li>
      ))}
    </ul>
  </div>
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
