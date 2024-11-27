import Link from 'next/link'
import React from 'react'

export default function LegalDocument() {
  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-lg">
        
        {/* Page Title */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-gray-800">Legal Document</h1>
          <p className="text-gray-500 mt-2">Effective Date: January 1, 2024</p>
        </div>

        {/* Section 1: Introduction */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold text-gray-800">1. Introduction</h2>
          <p className="text-gray-600 mt-4 leading-relaxed">
            This legal document outlines the terms and conditions for the use of our services. By accessing or using our website, 
            you agree to comply with and be bound by the following terms.
          </p>
        </section>

        {/* Section 2: Privacy Policy */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold text-gray-800">2. Privacy Policy</h2>
          <p className="text-gray-600 mt-4 leading-relaxed">
            We are committed to protecting your privacy. This policy outlines how we collect, use, and safeguard your personal information. 
            We will not share your data with third parties without your consent.
          </p>
        </section>

        {/* Section 3: User Responsibilities */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold text-gray-800">3. User Responsibilities</h2>
          <p className="text-gray-600 mt-4 leading-relaxed">
            As a user, you agree to use our website responsibly. You are prohibited from using our services for any unlawful or prohibited activities.
          </p>
        </section>

        {/* Section 4: Liability Disclaimer */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold text-gray-800">4. Liability Disclaimer</h2>
          <p className="text-gray-600 mt-4 leading-relaxed">
            We are not responsible for any direct or indirect damages resulting from the use of our services. The use of our website is at your own risk.
          </p>
        </section>

        {/* Important Notice */}
        <div className="mt-10 bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4" role="alert">
          <p className="font-bold">Important Notice</p>
          <p className="text-sm">
            Please read these terms carefully before using our services. If you do not agree with any part of the terms, you should not use our website.
          </p>
        </div>

        {/* Download PDF Button */}
        <div className="mt-8 text-center">
          <Link
            href="/pdfs/constitution.pdf" // Link to the PDF in the public folder
            download
            target='_blank'
            className="bg-blue-600 text-white py-3 px-6 rounded-md shadow hover:bg-blue-700 transition-colors"
          >
            Download Constitution PDF
          </Link>
        </div>
      </div>
    </div>
  )
}
