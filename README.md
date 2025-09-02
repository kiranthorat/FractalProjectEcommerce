# Fractal E-commerce Application

A full-stack e-commerce application built with Django REST Framework (backend) and React with Vite (frontend).

## 🚀 Features

- **User Authentication**: Registration, login, and profile management
- **Product Catalog**: Browse products with category filtering
- **Shopping Cart**: Add, remove, and manage cart items
- **Order Management**: Place orders and view order history
- **Address Management**: Multiple shipping addresses
- **Payment Integration**: Braintree payment gateway
- **Admin Panel**: Django admin for managing products, categories, and orders
- **Responsive Design**: Mobile-friendly interface

## 🛠️ Tech Stack

### Backend
- **Django 5.2.5**: Web framework
- **Django REST Framework**: API development
- **SQLite**: Database (development)
- **Braintree**: Payment processing
- **CORS Headers**: Cross-origin resource sharing
- **DRF Spectacular**: API documentation

### Frontend
- **React 19**: UI library
- **Vite**: Build tool and dev server
- **React Router**: Client-side routing
- **Bootstrap 5**: CSS framework
- **Axios**: HTTP client
- **Braintree Web Drop-in**: Payment UI

## 📁 Project Structure

```
Fractal-Capstone/
├── ecom/                    # Django backend
│   ├── api/                 # API apps
│   │   ├── user/           # User management
│   │   ├── product/        # Product catalog
│   │   ├── category/       # Product categories
│   │   ├── cart/           # Shopping cart
│   │   ├── order/          # Order management
│   │   ├── address/        # Address management
│   │   └── payment/        # Payment processing
│   ├── ecom/               # Django project settings
│   ├── media/              # Uploaded images
│   └── manage.py
├── frontend/               # React frontend
│   ├── src/
│   │   ├── auth/          # Authentication components
│   │   ├── core/          # Core components (Home, Cart, etc.)
│   │   ├── user/          # User-specific components
│   │   └── admin/         # Admin components
│   ├── public/
│   └── package.json
└── myenv/                 # Python virtual environment
```

## 🚦 Getting Started

### Prerequisites
- Python 3.11+
- Node.js 18+
- npm or yarn

### Backend Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/kiranthorat/FractalProjectEcommerce.git
   cd FractalProjectEcommerce
   ```

2. **Create and activate virtual environment**
   ```bash
   python -m venv myenv
   # On Windows:
   myenv\Scripts\activate
   # On macOS/Linux:
   source myenv/bin/activate
   ```

3. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

4. **Run migrations**
   ```bash
   cd ecom
   python manage.py migrate
   ```

5. **Create superuser (optional)**
   ```bash
   python manage.py createsuperuser
   ```

6. **Start Django server**
   ```bash
   python manage.py runserver
   ```

### Frontend Setup

1. **Install dependencies**
   ```bash
   cd frontend
   npm install
   ```

2. **Start development server**
   ```bash
   npm run dev
   ```

## 🌐 API Endpoints

### Authentication
- `POST /api/user/signup/` - User registration
- `POST /api/user/signin/` - User login

### Products
- `GET /api/product/` - List all products
- `GET /api/product/?category=<id>` - Filter by category
- `GET /api/product/<id>/` - Get product details

### Categories
- `GET /api/category/` - List all categories

### Cart
- `GET /api/cart/` - Get cart items
- `POST /api/cart/` - Add item to cart
- `PUT /api/cart/<id>/` - Update cart item
- `DELETE /api/cart/<id>/` - Remove from cart

### Orders
- `GET /api/order/` - List user orders
- `POST /api/order/` - Create new order

## 💳 Payment Integration

This application uses Braintree for payment processing. To set up payments:

1. Create a Braintree sandbox account
2. Update settings with your Braintree credentials:
   ```python
   BRAINTREE_MERCHANT_ID = 'your_merchant_id'
   BRAINTREE_PUBLIC_KEY = 'your_public_key'
   BRAINTREE_PRIVATE_KEY = 'your_private_key'
   BRAINTREE_ENVIRONMENT = 'sandbox'  # or 'production'
   ```

## 🚀 Deployment

Ready for deployment on platforms like:
- **Heroku** (Backend + Frontend)
- **Render** (Backend + Frontend)
- **Railway** (Backend)
- **Vercel/Netlify** (Frontend)

See deployment guide for detailed instructions.

## 📱 Features Overview

### User Features
- Browse products by category
- Search and filter products
- Add items to shopping cart
- Secure checkout with Braintree
- Order tracking and history
- Profile and address management

### Admin Features
- Product management
- Category management
- Order management
- User management
- Analytics and reporting

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Support

For support, email support@fractalcommerce.com or create an issue in the repository.

## 🙏 Acknowledgments

- Django and React communities
- Bootstrap for UI components
- Braintree for payment processing
- All contributors and testers

---

**Built with ❤️ by [Kiran Thorat](https://github.com/kiranthorat)**
