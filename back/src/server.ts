import express, { Request, Response, NextFunction } from 'express';
import axios, { AxiosResponse } from 'axios';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';

import {
  ConversionRequest,
  ConversionResponse,
  HistoricalResponse,
  BulkConversionRequest,
  BulkConversionResponse,
  CurrenciesResponse,
  ExchangeRatesResponse,
  HealthResponse,
  ErrorResponse,
  Currency,
  ExchangeRateApiResponse,
  ExchangeRateApiCodesResponse,
  ExchangeRateApiHistoryResponse,
  ExchangeRateApiLatestResponse
} from './types';

// Load environment variables
dotenv.config();

const app = express();

// Rate limiting
const appLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: {
    error: 'Too many requests from this IP, please try again later.'
  }
});

const API_URL = "https://v6.exchangerate-api.com/v6/";
const API_KEY = process.env['EXCHANGE_RATE_API_KEY'];

if (!API_KEY) {
  console.error('❌ EXCHANGE_RATE_API_KEY is not set in environment variables');
  process.exit(1);
}

// CORS configuration
const corsOptions: cors.CorsOptions = {
  origin: [
    "https://currency-converter-mern-melekus-websites.onrender.com",
    "http://localhost:5173",
    "http://localhost:3000"
  ],
  credentials: true
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(appLimiter);

// Health check endpoint
app.get('/api/health', (_req: Request, res: Response<HealthResponse>) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    service: 'Currency Converter API'
  });
});

// Get all available currencies
app.get('/api/currencies', async (_req: Request, res: Response<CurrenciesResponse | ErrorResponse>) => {
  try {
    const response: AxiosResponse<ExchangeRateApiCodesResponse> = await axios.get(`${API_URL}${API_KEY}/codes`);
    
    if (response.data && response.data.result === "success") {
      const currencies: Currency[] = response.data.supported_codes.map(([code, name]) => ({
        code,
        name,
        flag: getCurrencyFlag(code)
      }));
      
      return res.json({
        success: true,
        currencies,
        count: currencies.length
      });
    } else {
      return res.status(400).json({
        success: false,
        message: "Failed to fetch currencies",
        details: response.data
      });
    }
  } catch (error) {
    console.error('Error fetching currencies:', error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Convert currency
app.post('/api/convert', async (req: Request<{}, {}, ConversionRequest>, res: Response<ConversionResponse | ErrorResponse>) => {
  try {
    const { from, to, amount } = req.body;

    // Validation
    if (!from || !to || !amount) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields: from, to, amount"
      });
    }

    const amountNum = typeof amount === 'string' ? parseFloat(amount) : amount;
    if (isNaN(amountNum) || amountNum <= 0) {
      return res.status(400).json({
        success: false,
        message: "Amount must be a positive number"
      });
    }

    const url = `${API_URL}${API_KEY}/pair/${from}/${to}/${amountNum}`;
    console.log('Converting:', url);

    const response: AxiosResponse<ExchangeRateApiResponse> = await axios.get(url);
    
    if (response.data && response.data.result === "success") {
      return res.json({
        success: true,
        base: from,
        target: to,
        originalAmount: amountNum,
        conversionRate: response.data.conversion_rate,
        convertedAmount: response.data.conversion_result,
        timestamp: new Date().toISOString()
      });
    } else {
      return res.status(400).json({
        success: false,
        message: "Error converting currency",
        details: response.data
      });
    }
  } catch (error) {
    console.error('Conversion error:', error);
    
    if (axios.isAxiosError(error) && error.response) {
      return res.status(error.response.status).json({
        success: false,
        message: "API Error",
        details: error.response.data
      });
    } else {
      return res.status(500).json({
        success: false,
        message: "Internal server error",
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }
});

// Get historical rates
app.get('/api/historical/:from/:to', async (req: Request<{ from: string; to: string }>, res: Response<HistoricalResponse | ErrorResponse>) => {
  try {
    const { from, to } = req.params;
    
    if (!from || !to) {
      return res.status(400).json({
        success: false,
        message: "Missing required parameters: from, to"
      });
    }

    // Get historical data for the last 7 days
    const historicalData: Array<{ date: string; rate: number; formattedDate: string }> = [];
    const today = new Date();
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().slice(0, 10);
      
      try {
        const response: AxiosResponse<ExchangeRateApiHistoryResponse> = await axios.get(`${API_URL}${API_KEY}/history/${from}/${dateStr}`);
        
        if (response.data && response.data.result === "success") {
          const rate = response.data.rates[to];
          if (rate) {
            historicalData.push({
              date: dateStr,
              rate: rate,
              formattedDate: date.toLocaleDateString('en-US', {
                weekday: 'short',
                month: 'short',
                day: 'numeric'
              })
            });
          }
        }
      } catch (error) {
        console.error(`Error fetching historical data for ${dateStr}:`, error);
      }
    }

    return res.json({
      success: true,
      from,
      to,
      historicalData,
      count: historicalData.length
    });
  } catch (error) {
    console.error('Historical data error:', error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch historical data",
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Bulk conversion
app.post('/api/bulk-convert', async (req: Request<{}, {}, BulkConversionRequest>, res: Response<BulkConversionResponse | ErrorResponse>) => {
  try {
    const { from, to, amounts } = req.body;

    if (!from || !to || !amounts || !Array.isArray(amounts)) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields: from, to, amounts (array)"
      });
    }

    if (amounts.length > 10) {
      return res.status(400).json({
        success: false,
        message: "Maximum 10 amounts allowed for bulk conversion"
      });
    }

    const results: Array<{ amount: number; success: boolean; convertedAmount?: number; rate?: number; error?: string }> = [];
    
    for (const amount of amounts) {
      try {
        if (isNaN(amount) || parseFloat(amount.toString()) <= 0) {
          results.push({
            amount: parseFloat(amount.toString()),
            success: false,
            error: "Invalid amount"
          });
          continue;
        }

        const response: AxiosResponse<ExchangeRateApiResponse> = await axios.get(`${API_URL}${API_KEY}/pair/${from}/${to}/${amount}`);
        
        if (response.data && response.data.result === "success") {
          results.push({
            amount: parseFloat(amount.toString()),
            success: true,
            convertedAmount: response.data.conversion_result,
            rate: response.data.conversion_rate
          });
        } else {
          results.push({
            amount: parseFloat(amount.toString()),
            success: false,
            error: "Conversion failed"
          });
        }
      } catch (error) {
        results.push({
          amount: parseFloat(amount.toString()),
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error'
        });
      }
    }

    return res.json({
      success: true,
      from,
      to,
      results,
      count: results.length
    });
  } catch (error) {
    console.error('Bulk conversion error:', error);
    return res.status(500).json({
      success: false,
      message: "Bulk conversion failed",
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Get exchange rates for multiple currencies
app.get('/api/rates/:base', async (req: Request<{ base: string }, {}, {}, { currencies?: string }>, res: Response<ExchangeRatesResponse | ErrorResponse>) => {
  try {
    const { base } = req.params;
    const { currencies } = req.query; // comma-separated list of currencies
    
    if (!base) {
      return res.status(400).json({
        success: false,
        message: "Missing base currency"
      });
    }

    const url = currencies 
      ? `${API_URL}${API_KEY}/latest/${base}?currencies=${currencies}`
      : `${API_URL}${API_KEY}/latest/${base}`;

    const response: AxiosResponse<ExchangeRateApiLatestResponse> = await axios.get(url);
    
    if (response.data && response.data.result === "success") {
      return res.json({
        success: true,
        base: response.data.base_code,
        rates: response.data.conversion_rates,
        timestamp: response.data.time_last_update_utc
      });
    } else {
      return res.status(400).json({
        success: false,
        message: "Failed to fetch exchange rates",
        details: response.data
      });
    }
  } catch (error) {
    console.error('Rates error:', error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch exchange rates",
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Currency flag mapping function
function getCurrencyFlag(code: string): string {
  const flagMap: Record<string, string> = {
    'USD': '🇺🇸', 'EUR': '🇪🇺', 'GBP': '🇬🇧', 'JPY': '🇯🇵', 'CAD': '🇨🇦',
    'AUD': '🇦🇺', 'CHF': '🇨🇭', 'CNY': '🇨🇳', 'INR': '🇮🇳', 'BRL': '🇧🇷',
    'MXN': '🇲🇽', 'KRW': '🇰🇷', 'SGD': '🇸🇬', 'NZD': '🇳🇿', 'SEK': '🇸🇪',
    'NOK': '🇳🇴', 'DKK': '🇩🇰', 'PLN': '🇵🇱', 'CZK': '🇨🇿', 'HUF': '🇭🇺',
    'RUB': '🇷🇺', 'TRY': '🇹🇷', 'ZAR': '🇿🇦', 'THB': '🇹🇭', 'MYR': '🇲🇾',
    'IDR': '🇮🇩', 'PHP': '🇵🇭', 'VND': '🇻🇳', 'EGP': '🇪🇬', 'NGN': '🇳🇬',
    'KES': '🇰🇪', 'GHS': '🇬🇭', 'ETB': '🇪🇹'
  };
  
  return flagMap[code] || '🏳️';
}

// Error handling middleware
app.use((error: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error('Unhandled error:', error);
  res.status(500).json({
    success: false,
    message: "Internal server error",
    error: process.env['NODE_ENV'] === 'development' ? error.message : 'Something went wrong'
  });
});

// 404 handler
app.use('*', (_req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: "Endpoint not found",
    availableEndpoints: [
      'GET /api/health',
      'GET /api/currencies',
      'POST /api/convert',
      'GET /api/historical/:from/:to',
      'POST /api/bulk-convert',
      'GET /api/rates/:base'
    ]
  });
});

const PORT = process.env['PORT'] || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Currency Converter API running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
  console.log(`🌍 Environment: ${process.env['NODE_ENV'] || 'development'}`);
});
