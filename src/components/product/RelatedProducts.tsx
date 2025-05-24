import React from 'react';
import { Product } from '../../types';
import ProductGrid from './ProductGrid';

interface RelatedProductsProps {
  currentProductId: string;
  category: string;
  products: Product[];
}

const RelatedProducts: React.FC<RelatedProductsProps> = ({
  currentProductId,
  category,
  products,
}) => {
  // Filter products by category and exclude current product
  const relatedProducts = products
    .filter(
      (product) => product.category === category && product.id !== currentProductId
    )
    .slice(0, 4); // Limit to 4 products

  if (relatedProducts.length === 0) {
    return null;
  }

  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl font-bold mb-6">You May Also Like</h2>
        <ProductGrid products={relatedProducts} columns={4} />
      </div>
    </section>
  );
};

export default RelatedProducts;