"use client";
import Image from "next/image";
import Navbar from "../../../components/Navbar";
import Footer from "../../../components/Footer";

export default function SizeGuide() {
  return (
    <>
    <Navbar />
    <div className="bg-white min-h-screen pb-16">
      <div className="w-full bg-teal-700 text-white text-2xl font-bold text-center py-4">HOW TO KNOW YOUR FACE SIZE?</div>
      <div className="max-w-6xl mx-auto px-4">
        {/* Credit Card Method */}
        <div className="mt-8">
          <div className="text-teal-600 font-semibold text-lg mb-2">1 CREDIT CARD METHOD:</div>
          <div className="flex flex-col md:flex-row gap-8 items-center justify-center bg-gray-100 p-6 rounded-lg">
            <div className="flex-1 flex flex-col items-center">
              <div className="font-medium mb-2">1. Take a Debit/Credit card</div>
              <Image src="https://static.lenskart.com/images/cust_mailer/frame-size-image-designs/credit-card-1-01.png" alt="Credit Card" width={200} height={120} className="mb-2" />
              <div className="flex items-center justify-center mt-2">
                <span className="text-teal-600 font-bold text-xl">&lt;&rarr;&gt;</span>
              </div>
              <div className="text-xs text-gray-700 mt-2">This is the approximate width of a medium Eyeglass, Sunglass</div>
            </div>
            <div className="flex-1 flex flex-col items-center">
              <div className="font-medium mb-2">2. Stand in front of a mirror.</div>
              <Image src="https://static.lenskart.com/images/cust_mailer/frame-size-image-designs/credit-card-1-02.png" alt="Stand in front of mirror" width={180} height={180} />
              <div className="text-xs text-gray-700 mt-2 text-center">Place one tip of the card on center of your nose and touch the other towards the edge of eye.</div>
            </div>
          </div>
        </div>
        {/* Card Position Check */}
        <div className="mt-10">
          <div className="font-medium mb-2">3. Now check the position of the card:</div>
          <div className="flex flex-col md:flex-row gap-8 items-center justify-center">
            {/* Small */}
            <div className="flex-1 flex flex-col items-center border p-4 rounded-lg">
              <Image src="https://static.lenskart.com/images/cust_mailer/credit-card-size-marks-01.png" alt="Small Face" width={180} height={120} />
              <div className="mt-2 font-bold">Size is SMALL</div>
              <div className="text-xs text-gray-700 mb-2">If card extends beyond the corner of the eye</div>
              <div className="flex gap-2">
                <button className="bg-teal-600 text-white px-4 py-1 rounded">Eyeglasses &gt;</button>
                <button className="bg-green-600 text-white px-4 py-1 rounded">Sunglasses &gt;</button>
              </div>
            </div>
            {/* Medium */}
            <div className="flex-1 flex flex-col items-center border p-4 rounded-lg">
              <Image src="https://static.lenskart.com/images/cust_mailer/credit-card-size-marks-02.png" alt="Medium Face" width={180} height={120} />
              <div className="mt-2 font-bold">Size is MEDIUM</div>
              <div className="text-xs text-gray-700 mb-2">If card roughly touches the corner of the eye</div>
              <div className="flex gap-2">
                <button className="bg-teal-600 text-white px-4 py-1 rounded">Eyeglasses &gt;</button>
                <button className="bg-green-600 text-white px-4 py-1 rounded">Sunglasses &gt;</button>
              </div>
            </div>
            {/* Large */}
            <div className="flex-1 flex flex-col items-center border p-4 rounded-lg">
            <Image src="https://static.lenskart.com/images/cust_mailer/credit-card-size-marks-03.png" alt="Large Face" width={180} height={120} />
              <div className="mt-2 font-bold">Size is LARGE</div>
              <div className="text-xs text-gray-700 mb-2">If card doesn&apos;t reach the corner of the eye</div>
              <div className="flex gap-2">
                <button className="bg-teal-600 text-white px-4 py-1 rounded">Eyeglasses &gt;</button>
                <button className="bg-green-600 text-white px-4 py-1 rounded">Sunglasses &gt;</button>
              </div>
            </div>
          </div>
        </div>
        {/* Existing Eyeglass Method */}
        <div className="mt-12">
          <div className="text-teal-600 font-semibold text-lg mb-2">2 IF YOU&apos;VE EXISTING EYEGLASS</div>
          <div className="text-center mb-4">You can easily found the size of frame by looking on the inside of your eyeglass temples (arm pieces). Below you&apos;ll find a quick guide to helping you identify your eyeglasses.</div>
          <div className="flex justify-center">
            <Image src="https://static.lenskart.com/images/cust_mailer/10-Oct-18/ic_measurements.jpg" alt="Eyeglass Frame" width={500} height={180} />
          </div>
        </div>
        {/* Lens Width Table */}
        <div className="mt-10">
          <div className="text-center font-bold text-xl mb-2">Lens Width & Frame Size</div>
          <div className="flex justify-center">
            <table className="border-collapse border border-gray-400">
              <thead className="bg-gray-100">
                <tr>
                  <th className="border border-gray-400 px-4 py-2">Frame Size</th>
                  <th className="border border-gray-400 px-4 py-2">Eyeglasses</th>
                  <th className="border border-gray-400 px-4 py-2">Sunglasses</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-gray-400 px-4 py-2">Small</td>
                  <td className="border border-gray-400 px-4 py-2">Below 48 mm</td>
                  <td className="border border-gray-400 px-4 py-2">Below 55 mm</td>
                </tr>
                <tr>
                  <td className="border border-gray-400 px-4 py-2">Medium</td>
                  <td className="border border-gray-400 px-4 py-2">48 mm - 55 mm</td>
                  <td className="border border-gray-400 px-4 py-2">56 mm - 64 mm</td>
                </tr>
                <tr>
                  <td className="border border-gray-400 px-4 py-2">Large</td>
                  <td className="border border-gray-400 px-4 py-2">Above 55 mm</td>
                  <td className="border border-gray-400 px-4 py-2">Above 64 mm</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="text-center text-xs text-red-500 mt-2">Please note that for some Eyeglasses/Sunglasses the frame size may not follow the above convention</div>
          <div className="text-center text-xs text-gray-700 mt-2">This is the only information you need when ordering your eyeglass or sunglass frames. If you need assistance identifying your frames, feel free to contact LensKart.com and our opticians will be more than happy to help.</div>
        </div>
        {/* Tips Section */}
        <div className="mt-10">
          <div className="text-teal-600 font-semibold text-lg mb-2">3 SIMPLEST METHOD:</div>
          <ul className="list-disc pl-6 text-sm text-gray-800 space-y-1">
            <li>Go for a <span className="font-bold">MEDIUM SIZE</span> frame because it suits <span className="font-bold">98%</span> of Indian faces.</li>
            <li>If it does not fit, we will pick it up very quickly (no-questions asked) at Zero cost and you will get FULL MONEY BACK.</li>
            <li>We have shipped over 12 Lac orders and less than 2% people have needed to return.</li>
            <li>Lot of frames also have Model Shots on Real Faces - these give a very good idea of frame size.</li>
            <li>Kids less than 10 years must go for Kid Size Frames. Between 10-14 years Kids should go for Small Size Frames.</li>
          </ul>
        </div>
      </div>
    </div>
    <Footer />
    </>
  );
} 