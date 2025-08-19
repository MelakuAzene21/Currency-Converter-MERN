// Currency types
export interface Currency {
  code: string;
  name: string;
  flag: string;
}

// Form data types
export interface FormData {
  from: string;
  to: string;
  amount: string;
}

// Conversion result types
export interface ConversionResult {
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

export interface HistoricalData {
  success: boolean;
  from: string;
  to: string;
  historicalData: HistoricalDataPoint[];
  count: number;
}

// Bulk conversion types
export interface BulkConversionResult {
  amount: number;
  success: boolean;
  convertedAmount?: number;
  rate?: number;
  error?: string;
}

export interface BulkResults {
  bulkResults: BulkConversionResult[];
}

// API response types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

// Error types
export interface ApiError {
  message: string;
  details?: any;
  error?: string;
}

// Conversion modes
export type ConversionMode = 'standard' | 'bulk' | 'historical';

// Theme types
export type Theme = 'light' | 'dark';

// Event handler types
export interface ChangeEvent {
  target: {
    name: string;
    value: string;
  };
}

// Component props types
export interface CurrencySelectorProps {
  name: string;
  value: string;
  onChange: (e: ChangeEvent) => void;
  currencies: Currency[];
  onFavoriteToggle: (currency: Currency) => void;
  favorites: Currency[];
}

export interface ConversionResultProps {
  result: ConversionResult;
  formData: FormData;
}

export interface BulkResultsProps {
  result: BulkResults;
  formData: FormData;
}

export interface HistoricalDataProps {
  data: HistoricalDataPoint[];
}

export interface QuickConverterProps {
  amounts: number[];
  formData: FormData;
  onQuickConvert: (amount: number) => void;
}

export interface FavoritesProps {
  favorites: Currency[];
  onRemoveFavorite: (currency: Currency) => void;
}

// API endpoints
export const API_ENDPOINTS = {
  CONVERT: '/api/convert',
  CURRENCIES: '/api/currencies',
  HISTORICAL: '/api/historical',
  BULK_CONVERT: '/api/bulk-convert',
  RATES: '/api/rates',
  HEALTH: '/api/health'
} as const;

// Popular currencies data
export const POPULAR_CURRENCIES: Currency[] = [
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

// Quick conversion amounts
export const QUICK_AMOUNTS: number[] = [1, 10, 100, 1000];

// Bulk conversion amounts
export const BULK_AMOUNTS: number[] = [1, 10, 100, 1000];
