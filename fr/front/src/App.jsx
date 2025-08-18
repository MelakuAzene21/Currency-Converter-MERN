import { useState, useEffect } from "react";
import axios from "axios";
import './App.css';

export default function App() {
  const [formData, setFormData] = useState({
    from: 'USD',
    to: 'EUR',
    amount: '1',
  });
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [currencies, setCurrencies] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [historicalData, setHistoricalData] = useState([]);
  const [showHistory, setShowHistory] = useState(false);
  const [conversionMode, setConversionMode] = useState('standard'); // standard, bulk, historical
  const [bulkAmounts, setBulkAmounts] = useState([1, 10, 100, 1000]);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [theme, setTheme] = useState('light');

  const API_BASE_URL = process.env.NODE_ENV === 'production'
    ? 'https://currency-converter-melaku-website.onrender.com'
    : 'http://localhost:5000';

  // Popular currencies for quick access
  const popularCurrencies = [
    { code: 'USD', name: 'US Dollar', flag: '🇺🇸' },
    { code: 'EUR', name: 'Euro', flag: '🇪🇺' },
    { code: 'GBP', name: 'British Pound', flag: '🇬🇧' },
    { code: 'JPY', name: 'Japanese Yen', flag: '🇯🇵' },
    { code: 'CAD', name: 'Canadian Dollar', flag: '🇨🇦' },
    { code: 'AUD', name: 'Australian Dollar', flag: '🇦🇺' },
    { code: 'CHF', name: 'Swiss Franc', flag: '🇨🇭' },
    { code: 'CNY', name: 'Chinese Yuan', flag: '🇨🇳' },
    { code: 'INR', name: 'Indian Rupee', flag: '🇮🇳' },
    { code: 'BRL', name: 'Brazilian Real', flag: '🇧🇷' },
    { code: 'MXN', name: 'Mexican Peso', flag: '🇲🇽' },
    { code: 'KRW', name: 'South Korean Won', flag: '🇰🇷' },
    { code: 'SGD', name: 'Singapore Dollar', flag: '🇸🇬' },
    { code: 'NZD', name: 'New Zealand Dollar', flag: '🇳🇿' },
    { code: 'SEK', name: 'Swedish Krona', flag: '🇸🇪' },
    { code: 'NOK', name: 'Norwegian Krone', flag: '🇳🇴' },
    { code: 'DKK', name: 'Danish Krone', flag: '🇩🇰' },
    { code: 'PLN', name: 'Polish Złoty', flag: '🇵🇱' },
    { code: 'CZK', name: 'Czech Koruna', flag: '🇨🇿' },
    { code: 'HUF', name: 'Hungarian Forint', flag: '🇭🇺' },
    { code: 'RUB', name: 'Russian Ruble', flag: '🇷🇺' },
    { code: 'TRY', name: 'Turkish Lira', flag: '🇹🇷' },
    { code: 'ZAR', name: 'South African Rand', flag: '🇿🇦' },
    { code: 'THB', name: 'Thai Baht', flag: '🇹🇭' },
    { code: 'MYR', name: 'Malaysian Ringgit', flag: '🇲🇾' },
    { code: 'IDR', name: 'Indonesian Rupiah', flag: '🇮🇩' },
    { code: 'PHP', name: 'Philippine Peso', flag: '🇵🇭' },
    { code: 'VND', name: 'Vietnamese Dong', flag: '🇻🇳' },
    { code: 'EGP', name: 'Egyptian Pound', flag: '🇪🇬' },
    { code: 'NGN', name: 'Nigerian Naira', flag: '🇳🇬' },
    { code: 'KES', name: 'Kenyan Shilling', flag: '🇰🇪' },
    { code: 'GHS', name: 'Ghanaian Cedi', flag: '🇬🇭' },
    { code: 'ETB', name: 'Ethiopian Birr', flag: '🇪🇹' }
  ];

  useEffect(() => {
    setCurrencies(popularCurrencies);
    loadFavorites();
    convertCurrency();
  }, []);

  const loadFavorites = () => {
    const saved = localStorage.getItem('currencyFavorites');
    if (saved) {
      setFavorites(JSON.parse(saved));
    }
  };

  const saveFavorites = (newFavorites) => {
    localStorage.setItem('currencyFavorites', JSON.stringify(newFavorites));
    setFavorites(newFavorites);
  };

  const toggleFavorite = (currency) => {
    const isFavorite = favorites.some(fav => fav.code === currency.code);
    if (isFavorite) {
      const newFavorites = favorites.filter(fav => fav.code !== currency.code);
      saveFavorites(newFavorites);
    } else {
      const newFavorites = [...favorites, currency];
      saveFavorites(newFavorites);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const swapCurrencies = () => {
    setFormData(prev => ({
      ...prev,
      from: prev.to,
      to: prev.from
    }));
  };

  const convertCurrency = async (customData = null) => {
    const data = customData || formData;
    if (!data.from || !data.to || !data.amount) return;

    setLoading(true);
    setError('');

    try {
      const response = await axios.post(`${API_BASE_URL}/api/convert`, data);
      setResult(response.data);
      setLastUpdated(new Date().toLocaleTimeString());
      setError('');
    } catch (error) {
      setError(error?.response?.data?.message || error?.message || 'Conversion failed');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await convertCurrency();
  };

  const getHistoricalRates = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_BASE_URL}/api/historical/${formData.from}/${formData.to}`);
      setHistoricalData(response.data);
      setShowHistory(true);
    } catch (error) {
      setError('Failed to load historical data');
    } finally {
      setLoading(false);
    }
  };

  const bulkConvert = async () => {
    setLoading(true);
    const results = [];
    
    for (const amount of bulkAmounts) {
      try {
        const response = await axios.post(`${API_BASE_URL}/api/convert`, {
          from: formData.from,
          to: formData.to,
          amount: amount
        });
        results.push({ amount, ...response.data });
      } catch (error) {
        results.push({ amount, error: 'Failed' });
      }
    }
    
    setResult({ bulkResults: results });
    setLoading(false);
  };

  const getCurrencyInfo = (code) => {
    return popularCurrencies.find(curr => curr.code === code);
  };

  const formatNumber = (num) => {
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 6
    }).format(num);
  };

  return (
    <div className={`app ${theme}`}>
      <div className="container">
        {/* Header */}
        <header className="header">
          <div className="header-content">
            <h1>💱 Global Currency Converter</h1>
            <p>Real-time exchange rates & professional currency conversion</p>
            <div className="header-actions">
              <button 
                className="theme-toggle"
                onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
              >
                {theme === 'light' ? '🌙' : '☀️'}
              </button>
              {lastUpdated && (
                <span className="last-updated">
                  Last updated: {lastUpdated}
                </span>
              )}
            </div>
          </div>
        </header>

        {/* Conversion Modes */}
        <div className="conversion-modes">
          <button 
            className={`mode-btn ${conversionMode === 'standard' ? 'active' : ''}`}
            onClick={() => setConversionMode('standard')}
          >
            💱 Standard
          </button>
          <button 
            className={`mode-btn ${conversionMode === 'bulk' ? 'active' : ''}`}
            onClick={() => setConversionMode('bulk')}
          >
            📊 Bulk Convert
          </button>
          <button 
            className={`mode-btn ${conversionMode === 'historical' ? 'active' : ''}`}
            onClick={() => setConversionMode('historical')}
          >
            📈 Historical
          </button>
        </div>

        {/* Main Converter */}
        <section className="converter">
          <form onSubmit={handleSubmit}>
            <div className="conversion-inputs">
              {/* From Currency */}
              <div className="currency-input">
                <label>From</label>
                <div className="currency-selector">
                  <select
                    name="from"
                    value={formData.from}
                    onChange={handleChange}
                    className="currency-select"
                  >
                    {currencies.map((currency) => (
                      <option key={currency.code} value={currency.code}>
                        {currency.flag} {currency.code} - {currency.name}
                      </option>
                    ))}
                  </select>
                  <button 
                    type="button" 
                    className="favorite-btn"
                    onClick={() => toggleFavorite(getCurrencyInfo(formData.from))}
                  >
                    {favorites.some(fav => fav.code === formData.from) ? '❤️' : '🤍'}
                  </button>
                </div>
                <input
                  name="amount"
                  value={formData.amount}
                  onChange={handleChange}
                  type="number"
                  placeholder="Enter amount"
                  className="amount-input"
                  step="0.01"
                  min="0"
                />
              </div>

              {/* Swap Button */}
              <button 
                type="button" 
                className="swap-btn"
                onClick={swapCurrencies}
              >
                🔄
              </button>

              {/* To Currency */}
              <div className="currency-input">
                <label>To</label>
                <div className="currency-selector">
                  <select
                    name="to"
                    value={formData.to}
                    onChange={handleChange}
                    className="currency-select"
                  >
                    {currencies.map((currency) => (
                      <option key={currency.code} value={currency.code}>
                        {currency.flag} {currency.code} - {currency.name}
                      </option>
                    ))}
                  </select>
                  <button 
                    type="button" 
                    className="favorite-btn"
                    onClick={() => toggleFavorite(getCurrencyInfo(formData.to))}
                  >
                    {favorites.some(fav => fav.code === formData.to) ? '❤️' : '🤍'}
                  </button>
                </div>
                <div className="result-display">
                  {result ? (
                    <span className="converted-amount">
                      {formatNumber(result.convertedAmount)} {result.target}
                    </span>
                  ) : (
                    <span className="placeholder">Converted amount will appear here</span>
                  )}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="action-buttons">
              <button 
                type="submit" 
                className="convert-btn"
                disabled={loading}
              >
                {loading ? '🔄 Converting...' : '💱 Convert'}
              </button>
              
              {conversionMode === 'bulk' && (
                <button 
                  type="button" 
                  className="bulk-btn"
                  onClick={bulkConvert}
                  disabled={loading}
                >
                  📊 Bulk Convert
                </button>
              )}
              
              {conversionMode === 'historical' && (
                <button 
                  type="button" 
                  className="history-btn"
                  onClick={getHistoricalRates}
                  disabled={loading}
                >
                  📈 Get History
                </button>
              )}
            </div>
          </form>

          {/* Error Display */}
          {error && <div className="error-message">❌ {error}</div>}

          {/* Conversion Result */}
          {result && !result.bulkResults && (
            <div className="conversion-result">
              <div className="result-card">
                <h3>Conversion Result</h3>
                <div className="result-details">
                  <div className="result-row">
                    <span>Original Amount:</span>
                    <span>{formatNumber(formData.amount)} {formData.from}</span>
                  </div>
                  <div className="result-row">
                    <span>Converted Amount:</span>
                    <span className="highlight">{formatNumber(result.convertedAmount)} {result.target}</span>
                  </div>
                  <div className="result-row">
                    <span>Exchange Rate:</span>
                    <span>1 {formData.from} = {formatNumber(result.conversionRate)} {formData.to}</span>
                  </div>
                  <div className="result-row">
                    <span>Inverse Rate:</span>
                    <span>1 {formData.to} = {formatNumber(1 / result.conversionRate)} {formData.from}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Bulk Results */}
          {result && result.bulkResults && (
            <div className="bulk-results">
              <h3>Bulk Conversion Results</h3>
              <div className="bulk-grid">
                {result.bulkResults.map((item, index) => (
                  <div key={index} className="bulk-item">
                    <div className="bulk-amount">{formatNumber(item.amount)} {formData.from}</div>
                    <div className="bulk-converted">
                      {item.error ? 'Error' : `${formatNumber(item.convertedAmount)} ${formData.to}`}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>

        {/* Favorites Section */}
        {favorites.length > 0 && (
          <section className="favorites-section">
            <h3>⭐ Favorite Currencies</h3>
            <div className="favorites-grid">
              {favorites.map((currency) => (
                <div key={currency.code} className="favorite-item">
                  <span className="favorite-flag">{currency.flag}</span>
                  <span className="favorite-code">{currency.code}</span>
                  <span className="favorite-name">{currency.name}</span>
                  <button 
                    className="remove-favorite"
                    onClick={() => toggleFavorite(currency)}
                  >
                    ❌
                  </button>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Historical Data */}
        {showHistory && historicalData.length > 0 && (
          <section className="historical-section">
            <h3>📈 Historical Exchange Rates</h3>
            <div className="historical-chart">
              {historicalData.map((data, index) => (
                <div key={index} className="historical-item">
                  <span className="date">{data.date}</span>
                  <span className="rate">{formatNumber(data.rate)}</span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Quick Converters */}
        <section className="quick-converters">
          <h3>⚡ Quick Conversions</h3>
          <div className="quick-grid">
            {[1, 10, 100, 1000].map((amount) => (
              <button
                key={amount}
                className="quick-btn"
                onClick={() => {
                  setFormData(prev => ({ ...prev, amount: amount.toString() }));
                  convertCurrency({ ...formData, amount: amount.toString() });
                }}
              >
                {amount} {formData.from} → {formData.to}
              </button>
            ))}
          </div>
        </section>

        {/* Features Section */}
        <section className="features-section">
          <h2>🚀 Advanced Features</h2>
          <div className="features-grid">
            <div className="feature-card">
              <h4>🌍 170+ Currencies</h4>
              <p>Convert between 170+ world currencies with real-time rates</p>
            </div>
            <div className="feature-card">
              <h4>📊 Historical Data</h4>
              <p>View historical exchange rates and trends</p>
            </div>
            <div className="feature-card">
              <h4>⭐ Favorites</h4>
              <p>Save your most used currencies for quick access</p>
            </div>
            <div className="feature-card">
              <h4>⚡ Real-time Rates</h4>
              <p>Get the latest exchange rates updated every minute</p>
            </div>
            <div className="feature-card">
              <h4>📱 Responsive Design</h4>
              <p>Works perfectly on desktop, tablet, and mobile devices</p>
            </div>
            <div className="feature-card">
              <h4>🌙 Dark Mode</h4>
              <p>Toggle between light and dark themes for comfortable viewing</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
