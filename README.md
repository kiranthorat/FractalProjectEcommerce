# Fractal E-commerce Application
A full-stack e-commerce application built with Django REST Framework (backend) and React with Vite (frontend).
   

https://github.com/user-attachments/assets/8ca488ca-3094-47cc-8d16-ded9709a2f8d


https://github.com/user-attachments/assets/59b78925-ef63-4f0f-b8d9-fcb320e78f90



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
Facing issue with deployment so attaching images of app
<img width="1338" height="687" alt="welcome1" src="https://github.com/user-attachments/assets/55a3f4d7-34ac-4ec2-8232-302f7d8e17f5" />
<img width="1360" height="557" alt="cartbeforelogin" src="https://github.com/user-attachments/assets/bfcbebe0-71b0-4130-ba03-aeb20398a304" />
<img width="1362" height="492" alt="signup" src="https://github.com/user-attachments/assets/891099bd-186e-408b-aa0a-94a838def606" />
<img width="1366" height="487" alt="signin" src="https://github.com/user-attachments/assets/85b646de-0b9c-4a55-a545-249179931b7d" />
<img width="1361" height="537" alt="Cart" src="https://github.com/user-attachments/assets/a071650d-405a-4928-ab6b-12c12c841a14" />
<img width="1166" height="639" alt="selectby category" src="https://github.com/user-attachments/assets/e21ad09b-cb9b-481a-b48b-83e396e498cd" />
<img width="1338" height="638" alt="checkout" src="https://github.com/user-attachments/assets/9af0292d-af4b-40b1-8f59-bf5c0772bd07" />
<img width="1323" height="628" alt="addressmanagement" src="https://github.com/user-attachments/assets/f2ac29ca-5abf-4570-910f-5ee3598a95ef" />
<img width="1359" height="568" alt="orderhistory" src="https://github.com/user-attachments/assets/239f6930-7aa5-41f7-bc61-648cb6b0f7e0" />
<img width="1327" height="633" alt="orderdetails" src="https://github.com/user-attachments/assets/cd66c930-ea15-4112-88d3-3dd5f83baee7" />









