import React from 'react';

const ImageHelper = ({ product }) => {
  // Handle multiple image field formats for compatibility
  let imageUrl = 'https://i.imgur.com/z7EiIyZ.jpg'; // Default fallback image
  
  if (product) {
    // Check for image_url first (new format)
    if (product.image_url) {
      imageUrl = product.image_url;
    }
    // Fallback to image field
    else if (product.image) {
      imageUrl = product.image;
    }
    // Fallback to product_image (legacy)
    else if (product.product_image) {
      imageUrl = product.product_image;
    }
  }
  
  // Ensure the image URL is absolute and points to Django backend
  if (imageUrl && !imageUrl.startsWith('http') && !imageUrl.startsWith('data:')) {
    // If it's a relative URL, make it absolute to Django backend
    if (imageUrl.startsWith('/')) {
      imageUrl = `http://localhost:8000${imageUrl}`;
    } else {
      imageUrl = `http://localhost:8000/media/${imageUrl}`;
    }
  } else if (imageUrl && imageUrl.startsWith('/media/')) {
    // If it's a Django media URL, make it absolute
    imageUrl = `http://localhost:8000${imageUrl}`;
  }
    
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
        onError={(e) => {
          console.error('Image failed to load:', imageUrl);
          e.target.src = 'https://i.imgur.com/z7EiIyZ.jpg';
        }}
      />
    </div>
  );
};

export default ImageHelper;