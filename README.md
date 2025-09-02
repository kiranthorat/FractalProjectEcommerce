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



---
Core API Documentation
   Swagger UI: http://127.0.0.1:8000/api/docs/ ✅
   ReDoc: http://127.0.0.1:8000/api/redoc/ ✅
   API Schema: http://127.0.0.1:8000/api/schema/ ✅

Authentication
   Token Auth: http://127.0.0.1:8000/api/api-token-auth/
   DRF Auth: http://127.0.0.1:8000/api-auth/   


   
**Built with ❤️ by [Kiran Thorat](https://github.com/kiranthorat)**
