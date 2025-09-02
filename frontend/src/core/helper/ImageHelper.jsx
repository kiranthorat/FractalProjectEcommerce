import React from 'react';

const ImageHelper = ({ product }) => {
  // Handle both product.image and product.product_image for compatibility
  const imageUrl = product && (product.image || product.product_image)
    ? (product.image || product.product_image)
    : 'https://i.imgur.com/z7EiIyZ.jpg';
    
  return (
    <div className="position-relative mb-3" style={{ paddingBottom: '75%', overflow: 'hidden' }}>
      <img
        src={imageUrl}
        className="position-absolute top-0 start-0 w-100 h-100 rounded shadow-sm"
        style={{ 
          objectFit: 'cover',
          objectPosition: 'center'
        }}
        alt={product?.name || 'Product'}
        loading="lazy"
      />
    </div>
  );
};

export default ImageHelper;