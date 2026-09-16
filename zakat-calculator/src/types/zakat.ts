/**
 * Zakat Calculator Type Definitions
 * 
 * These types define the data structures used throughout the Zakat calculation engine.
 * All monetary values use Decimal for precision (handled at runtime).
 */

// ============================================================================
// METHODOLOGY TYPES
// ============================================================================

export type NisabMethod = 'gold' | 'silver' | 'custom';

export type JewelryPolicy = 
  | 'include_all'           // Hanafi: all gold is zakatable
  | 'exclude_personal'      // Other schools: personal use excluded
  | 'ask_purpose';          // Ask user and apply appropriate rule

export type LiabilityPolicy = 
  | 'ImmediateDueAmount'    // Only what's due now
  | 'Next12LunarMonths'     // Amounts due in next lunar year
  | 'CurrentLiability'      // Accounting current liabilities
  | 'CustomScholarProfile'; // Institution-specific

export type PropertyPolicy = 
  | 'intent_based'          // Classify by owner's intention
  | 'market_value_all'      // All property at market value (not standard)
  | 'income_only';         // Only rental income, not property value

export type InvestmentPolicy = 
  | 'trading_market_value'  // Trading shares at full market value
  | 'underlying_assets'     // Proportion of zakatable underlying assets
  | 'proxy_method';         // Fixed percentage approved by scholars

export interface ZakatMethodology {
  id: string;
  name: string;
  nisabMethod: NisabMethod;
  goldNisabGrams: number;
  silverNisabGrams: number;
  zakatRate: number;        // e.g., 0.025 for 2.5%
  jewelryPolicy: JewelryPolicy;
  liabilityPolicy: LiabilityPolicy;
  propertyPolicy: PropertyPolicy;
  investmentPolicy: InvestmentPolicy;
  reviewedBy?: string;
  reviewedAt?: string;
  version: string;
  description?: string;
}

// ============================================================================
// MARKET DATA TYPES
// ============================================================================

export interface MetalPrice {
  provider: string;
  symbol: 'XAU' | 'XAG';    // XAU = Gold, XAG = Silver
  currency: string;
  unit: 'gram' | 'ounce' | 'tola';
  price: number;            // Price per unit in currency
  timestamp: string;        // ISO 8601
  source?: string;
}

export interface ExchangeRate {
  base_currency: string;
  target_currency: string;
  rate: number;
  timestamp: string;        // ISO 8601
  provider: string;
}

export interface MarketDataSnapshot {
  goldPrice: MetalPrice;
  silverPrice: MetalPrice;
  exchangeRates: ExchangeRate[];
  capturedAt: string;       // ISO 8601
}

// ============================================================================
// ASSET TYPES
// ============================================================================

export type GoldUnit = 'gram' | 'tola' | 'ounce';
export type GoldPurity = '24K' | '22K' | '21K' | '18K' | '14K' | 'custom';

export interface GoldItem {
  id: string;
  weight: number;
  unit: GoldUnit;
  purity: GoldPurity;
  customPurityRatio?: number;  // For custom purity (0-1)
  purpose: 'investment' | 'personal_jewelry' | 'trade';
  notes?: string;
}

export interface SilverItem {
  id: string;
  weight: number;
  unit: GoldUnit;  // Reusing same units
  purity: GoldPurity;
  customPurityRatio?: number;
  purpose: 'investment' | 'personal' | 'trade';
  notes?: string;
}

export interface CashItem {
  id: string;
  amount: number;
  currency: string;
  type: 'cash_in_hand' | 'current_account' | 'savings_account' | 'digital_wallet' | 'foreign_currency' | 'other';
  institution?: string;
  notes?: string;
}

export interface ReceivableItem {
  id: string;
  amount: number;
  currency: string;
  likelihood: 'certain' | 'likely' | 'doubtful' | 'bad';
  dueDate?: string;  // ISO 8601
  type: 'trade_receivable' | 'service_receivable' | 'loan_to_other' | 'other';
  debtorName?: string;
  notes?: string;
}

export type PropertyIntent = 
  | 'primary_residence'
  | 'personal_family_use'
  | 'rental_property'
  | 'purchased_for_resale'
  | 'development_stock'
  | 'land_for_resale'
  | 'long_term_investment'
  | 'mixed_purpose';

export interface PropertyItem {
  id: string;
  intent: PropertyIntent;
  currentMarketValue: number;
  currency: string;
  address?: string;
  purchaseDate?: string;
  intentionChangeDate?: string;  // If intent changed from original
  originalIntent?: PropertyIntent;
  rentalIncomeRetained?: number;  // Cash rental income saved (not spent)
  mortgageOutstanding?: number;
  mortgagePrincipalDueWithinYear?: number;
  notes?: string;
}

export type InvestmentIntent = 'trading' | 'long_term';
export type InvestmentType = 'shares' | 'etf' | 'fund' | 'private_equity' | 'other';

export interface InvestmentItem {
  id: string;
  type: InvestmentType;
  intent: InvestmentIntent;
  currentMarketValue: number;
  currency: string;
  tickerOrName?: string;
  quantity?: number;
  averageCost?: number;
  underlyingZakatablePercentage?: number;  // For long-term investments using underlying method
  notes?: string;
}

export interface BusinessAssetItem {
  id: string;
  type: 'business_cash' | 'bank_balance' | 'stock_inventory' | 'raw_materials' 
      | 'work_in_progress' | 'trade_receivables' | 'other_current_assets';
  amount: number;
  currency: string;
  valuationMethod?: 'market' | 'cost' | 'lower_of_cost_market';
  notes?: string;
}

export interface BusinessLiabilityItem {
  id: string;
  type: 'trade_payables' | 'short_term_debt' | 'current_tax' | 'accrued_obligations' | 'other';
  amount: number;
  currency: string;
  dueDate?: string;
  notes?: string;
}

// ============================================================================
// LIABILITY TYPES
// ============================================================================

export interface PersonalLiabilityItem {
  id: string;
  type: 'immediate_debt' | 'short_term_debt' | 'long_term_debt' | 'deferred_mahr' 
      | 'unpaid_zakat_previous' | 'other';
  totalOutstanding: number;
  amountDueWithinYear: number;  // Amount due within next 12 lunar months
  currency: string;
  dueDate?: string;
  interestComponent?: number;   // Should be separated (not deductible)
  creditorName?: string;
  notes?: string;
}

// ============================================================================
// CALCULATION INPUT/OUTPUT TYPES
// ============================================================================

export interface ZakatCalculationInput {
  currency: string;              // Base currency for calculation
  calculationDate: string;       // ISO 8601 date
  methodologyId: string;
  nisabMethod: NisabMethod;
  
  // Assets
  goldItems: GoldItem[];
  silverItems: SilverItem[];
  cashItems: CashItem[];
  receivables: ReceivableItem[];
  investments: InvestmentItem[];
  properties: PropertyItem[];
  businessAssets: BusinessAssetItem[];
  businessLiabilities: BusinessLiabilityItem[];
  personalLiabilities: PersonalLiabilityItem[];
  
  // Market data (snapshot at calculation date)
  marketData: MarketDataSnapshot;
}

export interface AssetBreakdown {
  category: string;
  subcategory?: string;
  amount: number;
  currency: string;
  notes?: string;
  methodologyNote?: string;
}

export interface ZakatCalculationResult {
  // Input summary
  calculationDate: string;
  currency: string;
  methodology: ZakatMethodology;
  nisabMethod: NisabMethod;
  
  // Market rates used
  ratesUsed: {
    goldPricePerGram: number;
    silverPricePerGram: number;
    goldPriceTimestamp: string;
    silverPriceTimestamp: string;
    exchangeRates: ExchangeRate[];
  };
  
  // Asset totals
  totalGoldValue: number;
  totalSilverValue: number;
  totalCashValue: number;
  totalReceivablesValue: number;
  totalInvestmentsValue: number;
  totalPropertyValue: number;
  totalBusinessAssetsValue: number;
  
  // Calculated totals
  totalZakatableAssets: number;
  totalDeductibleLiabilities: number;
  netZakatableWealth: number;
  
  // Nisab comparison
  nisabValue: number;
  nisabReached: boolean;
  nisabShortfall?: number;  // If below nisab
  
  // Final calculation
  zakatRate: number;
  zakatDue: number;
  
  // Detailed breakdown for transparency
  assetBreakdown: AssetBreakdown[];
  liabilityBreakdown: AssetBreakdown[];
  
  // Warnings and notices
  warnings: string[];
  methodologyNotices: string[];
  
  // Metadata
  calculatedAt: string;      // ISO 8601
  calculatorVersion: string;
}

// ============================================================================
// UI STATE TYPES
// ============================================================================

export interface CalculatorStep {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
}

export interface FormValidationErrors {
  [field: string]: string[];
}

export interface LocalStorageCalculation {
  id: string;
  savedAt: string;
  input: ZakatCalculationInput;
  result?: ZakatCalculationResult;
}

// ============================================================================
// CONSTANTS & DEFAULTS
// ============================================================================

export const DEFAULT_CURRENCIES = [
  'PKR', 'USD', 'GBP', 'EUR', 'AED', 'SAR', 'CAD', 'AUD'
] as const;

export const GOLD_PURITIES: Record<GoldPurity, number> = {
  '24K': 1.000,
  '22K': 0.9167,
  '21K': 0.875,
  '18K': 0.750,
  '14K': 0.5833,
  'custom': 1.0  // Will be overridden by customPurityRatio
};

export const UNIT_CONVERSIONS_TO_GRAM = {
  'gram': 1,
  'tola': 11.6638,  // Standard tola (Pakistan/India)
  'ounce': 31.1035  // Troy ounce for precious metals
};

export const DEFAULT_METHODOLOGY: ZakatMethodology = {
  id: 'default-v1',
  name: 'Standard Sunni Methodology',
  nisabMethod: 'silver',
  goldNisabGrams: 87.48,
  silverNisabGrams: 612.36,
  zakatRate: 0.025,
  jewelryPolicy: 'ask_purpose',
  liabilityPolicy: 'Next12LunarMonths',
  propertyPolicy: 'intent_based',
  investmentPolicy: 'trading_market_value',
  reviewedBy: 'Pending Scholar Review',
  reviewedAt: undefined,
  version: '1.0.0',
  description: 'Default methodology based on mainstream scholarly positions. Requires formal scholar review before production.'
};
