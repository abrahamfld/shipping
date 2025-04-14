'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, MapPin, Clock, ShieldCheck } from 'lucide-react';
import Image from 'next/image';

export default function LandingPage() {
  const imageList = ['/1.png', '/2.png', '/3.png'];
  const [currentImage, setCurrentImage] = useState(imageList[0]);

  useEffect(() => {
    const interval = setInterval(() => {
      const randomIndex = Math.floor(Math.random() * imageList.length);
      setCurrentImage(imageList[randomIndex]);
    }, 4000); // change every 4 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <main className="min-h-screen bg-gradient-to-br from-emerald-100 via-white to-emerald-50 text-gray-800">
      {/* Hero Section */}
      <section className="px-6 md:px-16 py-12 flex items-center justify-center">
        <div className="max-w-7xl w-full grid md:grid-cols-2 gap-12 items-center">
          {/* Text Section */}
          <motion.div
            className="space-y-6"
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-4xl sm:text-5xl font-extrabold leading-tight text-emerald-700">
              Deliver Smarter, Track Faster.
            </h1>
            <p className="text-lg sm:text-xl text-gray-700">
              Discover the future of shipment tracking. Real-time updates, detailed history, and beautiful modern design — all in one place.
            </p>

            <Link
              href="/tracking"
              className="inline-flex items-center gap-2 px-6 py-3 text-lg font-medium text-white bg-emerald-600 rounded-full shadow-lg hover:bg-emerald-700 transition"
            >
              Track Shipment <ArrowRight size={20} />
            </Link>
          </motion.div>

          {/* Image Section with Random Image Change */}
          <motion.div
            key={currentImage} // key triggers framer-motion animation when image changes
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <Image
              src={currentImage}
              alt="Courier on Bike"
              width={500}
              height={500}
              className="w-full h-auto object-contain drop-shadow-2xl"
              priority
            />
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="px-6 md:px-16 py-20 bg-white">
        <div className="max-w-6xl mx-auto text-center">
          <motion.h2
            className="text-3xl sm:text-4xl font-bold text-emerald-700 mb-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            Why Choose Our Platform?
          </motion.h2>
          <p className="text-gray-600 mb-12">
            Powerful tools, real-time insights, and peace of mind — everything you need to track your deliveries effortlessly.
          </p>

          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-10">
            {/* Feature 1 */}
            <motion.div
              className="bg-emerald-50 p-6 rounded-xl shadow hover:shadow-lg transition"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.6 }}
              viewport={{ once: true }}
            >
              <MapPin className="text-emerald-600 w-10 h-10 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Live Location Updates</h3>
              <p className="text-gray-600">Know where your package is, every step of the way. We provide accurate, real-time tracking data.</p>
            </motion.div>

            {/* Feature 2 */}
            <motion.div
              className="bg-emerald-50 p-6 rounded-xl shadow hover:shadow-lg transition"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              viewport={{ once: true }}
            >
              <Clock className="text-emerald-600 w-10 h-10 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Fast Delivery Tracking</h3>
              <p className="text-gray-600">Speed is everything. Our system updates fast so you’re never left guessing or waiting for info.</p>
            </motion.div>

            {/* Feature 3 */}
            <motion.div
              className="bg-emerald-50 p-6 rounded-xl shadow hover:shadow-lg transition"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              viewport={{ once: true }}
            >
              <ShieldCheck className="text-emerald-600 w-10 h-10 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Secure & Reliable</h3>
              <p className="text-gray-600">Built with security and stability in mind so your data and packages are always protected.</p>
            </motion.div>
          </div>
        </div>
      </section>
      {/* Call to Action Section */}
<section className="py-12 bg-white text-center">
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6 }}
    viewport={{ once: true }}
  >
    <h3 className="text-2xl font-semibold mb-4 text-emerald-700">
      Ready to track your next shipment?
    </h3>
    <Link
      href="/tracking"
      className="inline-flex items-center gap-2 px-6 py-3 text-lg font-medium text-white bg-emerald-600 rounded-full shadow-lg hover:bg-emerald-700 transition"
    >
      Track Shipment <ArrowRight size={20} />
    </Link>
  </motion.div>
</section>

    </main>
  );
}
