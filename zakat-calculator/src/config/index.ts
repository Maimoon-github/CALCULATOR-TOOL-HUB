/**
 * Zakat Calculator Configuration
 */

import { ZakatMethodology, DEFAULT_METHODOLOGY } from '@/types/zakat';

export const CONFIG = {
  // Application
  APP_NAME: 'Zakat Calculator',
  APP_VERSION: '1.0.0',
  
  // Default currency
  DEFAULT_CURRENCY: 'PKR',
  
  // Supported currencies
  SUPPORTED_CURRENCIES: ['PKR', 'USD', 'GBP', 'EUR', 'AED', 'SAR', 'CAD', 'AUD'] as const,
  
  // Nisab constants (in grams)
  GOLD_NISAB_GRAMS: 87.48,
  SILVER_NISAB_GRAMS: 612.36,
  
  // Zakat rate
  ZAKAT_RATE: 0.025, // 2.5%
  
  // Unit conversions to grams
  UNIT_CONVERSIONS: {
    gram: 1,
    tola: 11.6638,  // Standard tola (Pakistan/India)
    ounce: 31.1035, // Troy ounce for precious metals
  },
  
  // Gold purity ratios
  GOLD_PURITIES: {
    '24K': 1.000,
    '22K': 0.9167,
    '21K': 0.875,
    '18K': 0.750,
    '14K': 0.5833,
  },
  
  // Market data freshness (in milliseconds)
  MARKET_DATA_MAX_AGE: 3600000, // 1 hour
  
  // Price providers
  PRICE_PROVIDERS: {
    primary: 'manual', // MVP uses manual entry
    secondary: null,
  },
  
  // Methodology profiles
  METHODOLOGIES: {
    default: DEFAULT_METHODOLOGY,
  } as Record<string, ZakatMethodology>,
  
  // UI Settings
  UI: {
    MAX_WIDTH: 1600, // px
    CARD_RADIUS: 24, // px
    INPUT_RADIUS: 12, // px
    BUTTON_RADIUS: 24, // px
  },
  
  // Colors (from design system)
  COLORS: {
    primary: '#9fe870',
    canvas: '#ffffff',
    canvasSoft: '#e8ebe6',
    ink: '#0e0f0c',
    body: '#454745',
    muted: '#868685',
    positive: '#2ead4b',
    warning: '#ffd11a',
    negative: '#d03238',
  },
};

export default CONFIG;
