export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <h1 className="text-4xl font-poppins font-bold text-dark-green mb-8 text-center">About Booti Natural</h1>
      
      <div className="prose prose-lg text-gray-700 mx-auto">
        <p className="mb-6">
          Welcome to <strong>Booti Natural</strong>, your premier destination for 100% organic and natural health products. 
          Our journey started with a simple belief: nature provides the best remedies and nutrients for a healthy life.
        </p>
        
        <p className="mb-6">
          We specialize in high-quality herbal powders and seeds, carefully sourced from organic farms. 
          From the stress-relieving properties of Ashwagandha to the nutrient-dense Moringa and the heart-healthy Chia seeds, 
          every product we offer is packed with nature&apos;s goodness.
        </p>
        
        <h2 className="text-2xl font-bold text-dark-green mt-10 mb-4">Our Mission</h2>
        <p className="mb-6">
          Our mission is to make natural wellness accessible to everyone. We believe in transparency, purity, and 
          sustainability. That&apos;s why our products contain zero artificial additives, preservatives, or hidden chemicals.
        </p>
        
        <h2 className="text-2xl font-bold text-dark-green mt-10 mb-4">Why Choose Us?</h2>
        <ul className="list-disc pl-6 space-y-2 mb-8">
          <li>100% Organic & Natural ingredients</li>
          <li>Ethically sourced from trusted farmers</li>
          <li>Carefully processed to retain maximum nutrients</li>
          <li>Eco-friendly packaging</li>
        </ul>
      </div>
    </div>
  );
}
