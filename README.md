# 💱 Global Currency Converter

A professional, feature-rich currency converter application with real-time exchange rates, historical data, and a modern, responsive UI.

![Currency Converter](https://img.shields.io/badge/React-18.3.1-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.3.2-blue)
![Backend](https://img.shields.io/badge/Node.js-Express-green)
![API](https://img.shields.io/badge/ExchangeRate-API-orange)
![License](https://img.shields.io/badge/License-MIT-yellow)

## ✨ Features

### 🔄 Core Conversion
- **Real-time Exchange Rates**: Get the latest rates from ExchangeRate-API
- **170+ Currencies**: Support for major and minor world currencies
- **Instant Conversion**: Fast and accurate currency conversion
- **Bidirectional Conversion**: Convert from any currency to any other

### 📊 Advanced Features
- **Historical Data**: View exchange rate trends over the last 7 days
- **Bulk Conversion**: Convert multiple amounts at once (up to 10 amounts)
- **Quick Converters**: Pre-defined amounts for common conversions
- **Favorites System**: Save your most-used currencies for quick access

### 🎨 User Experience
- **Modern UI**: Clean, professional design with smooth animations
- **Dark/Light Theme**: Toggle between themes for comfortable viewing
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile
- **Real-time Updates**: Last updated timestamp for all conversions
- **Error Handling**: Comprehensive error messages and validation

### 🔧 Technical Features
- **Rate Limiting**: API protection with request limiting
- **CORS Support**: Cross-origin resource sharing enabled
- **Health Checks**: API health monitoring endpoint
- **Comprehensive Logging**: Detailed error logging and debugging
- **Input Validation**: Robust validation for all user inputs

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- ExchangeRate-API key (free at [exchangerate-api.com](https://exchangerate-api.com))

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/MelakuAzene21/Weather-Forecast-Web-App
   cd Currency-Converter
   ```

2. **Install backend dependencies**
   ```bash
   cd back
   npm install
   ```

3. **Install frontend dependencies**
   ```bash
   cd ../fr/front
   npm install
   ```

4. **Environment Setup**
   
   Create a `.env` file in the `back` directory:
   ```env
   EXCHANGE_RATE_API_KEY=your_api_key_here
   PORT=5000
   NODE_ENV=development
   ```

5. **Build and start the backend server**
   ```bash
   cd back
   npm run build
   npm start
   ```

6. **Start the frontend development server**
   ```bash
   cd fr/front
   npm run dev
   ```

7. **Open your browser**
   Navigate to `http://localhost:5173`

## 📚 API Endpoints

### Core Endpoints

#### `POST /api/convert`
Convert one currency to another.

**Request:**
```json
{
  "from": "USD",
  "to": "EUR",
  "amount": "100"
}
```

**Response:**
```json
{
  "success": true,
  "base": "USD",
  "target": "EUR",
  "originalAmount": 100,
  "conversionRate": 0.85,
  "convertedAmount": 85.00,
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

#### `GET /api/currencies`
Get all available currencies with flags and names.

**Response:**
```json
{
  "success": true,
  "currencies": [
    {
      "code": "USD",
      "name": "US Dollar",
      "flag": "🇺🇸"
    }
  ],
  "count": 170
}
```

#### `GET /api/historical/:from/:to`
Get historical exchange rates for the last 7 days.

**Response:**
```json
{
  "success": true,
  "from": "USD",
  "to": "EUR",
  "historicalData": [
    {
      "date": "2024-01-15",
      "rate": 0.85,
      "formattedDate": "Mon, Jan 15"
    }
  ],
  "count": 7
}
```

#### `POST /api/bulk-convert`
Convert multiple amounts at once.

**Request:**
```json
{
  "from": "USD",
  "to": "EUR",
  "amounts": [1, 10, 100, 1000]
}
```

**Response:**
```json
{
  "success": true,
  "from": "USD",
  "to": "EUR",
  "results": [
    {
      "amount": 1,
      "success": true,
      "convertedAmount": 0.85,
      "rate": 0.85
    }
  ],
  "count": 4
}
```

#### `GET /api/rates/:base`
Get current exchange rates for a base currency.

**Response:**
```json
{
  "success": true,
  "base": "USD",
  "rates": {
    "EUR": 0.85,
    "GBP": 0.73,
    "JPY": 110.25
  },
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

#### `GET /api/health`
Health check endpoint.

**Response:**
```json
{
  "status": "OK",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "service": "Currency Converter API"
}
```

## 🎯 Usage Guide

### Basic Conversion
1. Select the source currency from the dropdown
2. Enter the amount you want to convert
3. Select the target currency
4. Click "Convert" to see the result

### Using Favorites
1. Click the heart icon next to any currency to add it to favorites
2. Your favorites will appear in a dedicated section
3. Click the heart again to remove from favorites

### Historical Data
1. Switch to "Historical" mode
2. Select your currencies
3. Click "Get History" to view 7-day trends

### Bulk Conversion
1. Switch to "Bulk Convert" mode
2. Select your currencies
3. Click "Bulk Convert" to convert multiple amounts

### Quick Conversions
- Use the quick converter buttons for common amounts (1, 10, 100, 1000)
- Results update automatically when you change currencies

## 🛠️ Technology Stack

### Frontend
- **React 18**: Modern React with hooks
- **TypeScript**: Type-safe development
- **Vite**: Fast build tool and dev server
- **Axios**: HTTP client for API calls
- **CSS3**: Modern styling with CSS variables and flexbox/grid

### Backend
- **Node.js**: JavaScript runtime
- **TypeScript**: Type-safe development
- **Express.js**: Web framework
- **Axios**: HTTP client for external API calls
- **CORS**: Cross-origin resource sharing
- **express-rate-limit**: Rate limiting middleware

### External APIs
- **ExchangeRate-API**: Real-time and historical exchange rates

## 📱 Responsive Design

The application is fully responsive and optimized for:
- **Desktop**: Full-featured experience with all controls
- **Tablet**: Optimized layout with touch-friendly controls
- **Mobile**: Streamlined interface for small screens

## 🌙 Theme Support

- **Light Theme**: Clean, professional appearance
- **Dark Theme**: Easy on the eyes for low-light environments
- **Auto-save**: Theme preference is remembered

## 🔒 Security Features

- **Rate Limiting**: Prevents API abuse
- **Input Validation**: Sanitizes all user inputs
- **CORS Protection**: Secure cross-origin requests
- **Error Handling**: Graceful error management

## 📊 Performance

- **Fast Loading**: Optimized bundle size
- **Caching**: Efficient data caching strategies
- **Lazy Loading**: Components load as needed
- **Minimal API Calls**: Smart request management

## 🚀 Deployment

### Frontend (Vercel/Netlify)
```bash
cd fr/front
npm run build
# Deploy the dist folder
```

### Backend (Render/Railway)
```bash
cd back
# Set environment variables
npm start
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [ExchangeRate-API](https://exchangerate-api.com) for providing reliable exchange rate data
- [React](https://reactjs.org) for the amazing frontend framework
- [Express.js](https://expressjs.com) for the robust backend framework

## 📞 Support

If you encounter any issues or have questions:
- Create an issue in the repository
- Check the API documentation
- Verify your API key is valid

---

**Made with ❤️ for the global community**
