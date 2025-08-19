// Currency types
export interface Currency {
  code: string;
  name: string;
  flag: string;
}

// Conversion request types
export interface ConversionRequest {
  from: string;
  to: string;
  amount: string | number;
}

// Conversion response types
export interface ConversionResponse {
  success: boolean;
  base: string;
  target: string;
  originalAmount: number;
  conversionRate: number;
  convertedAmount: number;
  timestamp: string;
}

// Historical data types
export interface HistoricalDataPoint {
  date: string;
  rate: number;
  formattedDate: string;
}

export interface HistoricalResponse {
  success: boolean;
  from: string;
  to: string;
  historicalData: HistoricalDataPoint[];
  count: number;
}

// Bulk conversion types
export interface BulkConversionRequest {
  from: string;
  to: string;
  amounts: number[];
}

export interface BulkConversionResult {
  amount: number;
  success: boolean;
  convertedAmount?: number;
  rate?: number;
  error?: string;
}

export interface BulkConversionResponse {
  success: boolean;
  from: string;
  to: string;
  results: BulkConversionResult[];
  count: number;
}

// Currencies response types
export interface CurrenciesResponse {
  success: boolean;
  currencies: Currency[];
  count: number;
}

// Exchange rates response types
export interface ExchangeRatesResponse {
  success: boolean;
  base: string;
  rates: Record<string, number>;
  timestamp: string;
}

// Health check response types
export interface HealthResponse {
  status: string;
  timestamp: string;
  service: string;
}

// Error response types
export interface ErrorResponse {
  success: false;
  message: string;
  details?: any;
  error?: string;
}

// API response types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

// Express request extensions
export interface AuthenticatedRequest extends Request {
  user?: any;
}

// Environment variables types
export interface EnvironmentVariables {
  EXCHANGE_RATE_API_KEY: string;
  PORT: string;
  NODE_ENV: 'development' | 'production' | 'test';
  FRONTEND_URL?: string;
}

// ExchangeRate API response types
export interface ExchangeRateApiResponse {
  result: string;
  base_code: string;
  target_code: string;
  conversion_rate: number;
  conversion_result: number;
  time_last_update_utc: string;
}

export interface ExchangeRateApiCodesResponse {
  result: string;
  supported_codes: [string, string][];
}

export interface ExchangeRateApiHistoryResponse {
  result: string;
  base_code: string;
  target_code: string;
  rates: Record<string, number>;
  time_series: boolean;
  time_period: number;
  time_last_update_utc: string;
}

export interface ExchangeRateApiLatestResponse {
  result: string;
  base_code: string;
  conversion_rates: Record<string, number>;
  time_last_update_utc: string;
}
