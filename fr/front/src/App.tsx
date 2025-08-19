import { useState, useEffect, FormEvent, ChangeEvent } from "react";
import axios, { AxiosResponse } from "axios";
import './App.css';

import {
  Currency,
  FormData,
  ConversionResult,
  HistoricalDataPoint,
  BulkConversionResult,
  BulkResults,
  ConversionMode,
  Theme,
  POPULAR_CURRENCIES,
  QUICK_AMOUNTS,
  BULK_AMOUNTS
} from './types';

export default function App(): JSX.Element {
  const [formData, setFormData] = useState<FormData>({
    from: 'USD',
    to: 'EUR',
    amount: '1',
  });
  const [result, setResult] = useState<ConversionResult | BulkResults | null>(null);
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [currencies, setCurrencies] = useState<Currency[]>([]);
  const [favorites, setFavorites] = useState<Currency[]>([]);
  const [historicalData, setHistoricalData] = useState<HistoricalDataPoint[]>([]);
  const [showHistory, setShowHistory] = useState<boolean>(false);
  const [conversionMode, setConversionMode] = useState<ConversionMode>('standard');
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);
  const [theme, setTheme] = useState<Theme>('light');

  const API_BASE_URL = import.meta.env.PROD
    ? 'https://currency-converter-melaku-website.onrender.com'
    : 'http://localhost:5000';

  useEffect(() => {
    setCurrencies(POPULAR_CURRENCIES);
    loadFavorites();
    convertCurrency();
  }, []);

  const loadFavorites = (): void => {
    const saved = localStorage.getItem('currencyFavorites');
    if (saved) {
      try {
        setFavorites(JSON.parse(saved));
      } catch (error) {
        console.error('Error loading favorites:', error);
        setFavorites([]);
      }
    }
  };

  const saveFavorites = (newFavorites: Currency[]): void => {
    localStorage.setItem('currencyFavorites', JSON.stringify(newFavorites));
    setFavorites(newFavorites);
  };

  const toggleFavorite = (currency: Currency): void => {
    const isFavorite = favorites.some(fav => fav.code === currency.code);
    if (isFavorite) {
      const newFavorites = favorites.filter(fav => fav.code !== currency.code);
      saveFavorites(newFavorites);
    } else {
      const newFavorites = [...favorites, currency];
      saveFavorites(newFavorites);
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>): void => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const swapCurrencies = (): void => {
    setFormData(prev => ({
      ...prev,
      from: prev.to,
      to: prev.from
    }));
  };

  const convertCurrency = async (customData?: FormData): Promise<void> => {
    const data = customData || formData;
    if (!data.from || !data.to || !data.amount) return;

    setLoading(true);
    setError('');

    try {
      const response: AxiosResponse<ConversionResult> = await axios.post(`${API_BASE_URL}/api/convert`, data);
      setResult(response.data);
      setLastUpdated(new Date().toLocaleTimeString());
      setError('');
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setError(error.response?.data?.message || error.message || 'Conversion failed');
      } else {
        setError('Conversion failed');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    await convertCurrency();
  };

  const getHistoricalRates = async (): Promise<void> => {
    setLoading(true);
    try {
      const response: AxiosResponse<{ success: boolean; from: string; to: string; historicalData: HistoricalDataPoint[]; count: number }> = 
        await axios.get(`${API_BASE_URL}/api/historical/${formData.from}/${formData.to}`);
      setHistoricalData(response.data.historicalData);
      setShowHistory(true);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setError(error.response?.data?.message || 'Failed to load historical data');
      } else {
        setError('Failed to load historical data');
      }
    } finally {
      setLoading(false);
    }
  };

  const bulkConvert = async (): Promise<void> => {
    setLoading(true);
    const results: BulkConversionResult[] = [];
    
    for (const amount of BULK_AMOUNTS) {
      try {
        const response: AxiosResponse<ConversionResult> = await axios.post(`${API_BASE_URL}/api/convert`, {
          from: formData.from,
          to: formData.to,
          amount: amount
        });
        results.push({ 
          amount, 
          success: true,
          convertedAmount: response.data.convertedAmount,
          rate: response.data.conversionRate
        });
      } catch (error) {
        results.push({ 
          amount, 
          success: false, 
          error: 'Failed' 
        });
      }
    }
    
    setResult({ bulkResults: results });
    setLoading(false);
  };

  const getCurrencyInfo = (code: string): Currency | undefined => {
    return POPULAR_CURRENCIES.find(curr => curr.code === code);
  };

  const formatNumber = (num: number): string => {
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 6
    }).format(num);
  };

  const handleQuickConvert = (amount: number): void => {
    const newFormData = { ...formData, amount: amount.toString() };
    setFormData(newFormData);
    convertCurrency(newFormData);
  };

  const isConversionResult = (result: ConversionResult | BulkResults | null): result is ConversionResult => {
    return result !== null && 'convertedAmount' in result;
  };

  const isBulkResults = (result: ConversionResult | BulkResults | null): result is BulkResults => {
    return result !== null && 'bulkResults' in result;
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
                    onClick={() => {
                      const currency = getCurrencyInfo(formData.from);
                      if (currency) toggleFavorite(currency);
                    }}
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
                    onClick={() => {
                      const currency = getCurrencyInfo(formData.to);
                      if (currency) toggleFavorite(currency);
                    }}
                  >
                    {favorites.some(fav => fav.code === formData.to) ? '❤️' : '🤍'}
                  </button>
                </div>
                <div className="result-display">
                  {isConversionResult(result) ? (
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
          {isConversionResult(result) && (
            <div className="conversion-result">
              <div className="result-card">
                <h3>Conversion Result</h3>
                <div className="result-details">
                  <div className="result-row">
                    <span>Original Amount:</span>
                    <span>{formatNumber(result.originalAmount)} {result.base}</span>
                  </div>
                  <div className="result-row">
                    <span>Converted Amount:</span>
                    <span className="highlight">{formatNumber(result.convertedAmount)} {result.target}</span>
                  </div>
                  <div className="result-row">
                    <span>Exchange Rate:</span>
                    <span>1 {result.base} = {formatNumber(result.conversionRate)} {result.target}</span>
                  </div>
                  <div className="result-row">
                    <span>Inverse Rate:</span>
                    <span>1 {result.target} = {formatNumber(1 / result.conversionRate)} {result.base}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Bulk Results */}
          {isBulkResults(result) && (
            <div className="bulk-results">
              <h3>Bulk Conversion Results</h3>
              <div className="bulk-grid">
                {result.bulkResults.map((item, index) => (
                  <div key={index} className="bulk-item">
                    <div className="bulk-amount">{formatNumber(item.amount)} {formData.from}</div>
                    <div className="bulk-converted">
                      {item.success && item.convertedAmount 
                        ? `${formatNumber(item.convertedAmount)} ${formData.to}`
                        : item.error || 'Error'
                      }
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
                  <span className="date">{data.formattedDate}</span>
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
            {QUICK_AMOUNTS.map((amount) => (
              <button
                key={amount}
                className="quick-btn"
                onClick={() => handleQuickConvert(amount)}
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
