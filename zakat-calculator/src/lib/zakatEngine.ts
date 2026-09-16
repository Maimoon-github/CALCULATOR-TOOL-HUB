/**
 * Zakat Calculation Engine
 * 
 * Pure calculation functions with no UI dependencies.
 * Uses Decimal.js for precise financial arithmetic.
 * 
 * @module lib/zakatEngine
 */

import Decimal from 'decimal.js';
import {
  ZakatCalculationInput,
  ZakatCalculationResult,
  ZakatMethodology,
  AssetBreakdown,
  GoldItem,
  SilverItem,
  CashItem,
  ReceivableItem,
  PropertyItem,
  InvestmentItem,
  BusinessAssetItem,
  BusinessLiabilityItem,
  PersonalLiabilityItem,
  GOLD_PURITIES,
  UNIT_CONVERSIONS_TO_GRAM,
  DEFAULT_METHODOLOGY,
} from '@/types/zakat';

// Configuration
const CALCULATOR_VERSION = '1.0.0';
const INTERNAL_PRECISION = 10;  // Decimal places for internal calculations
const DISPLAY_PRECISION = 2;     // Decimal places for display

/**
 * Convert a number to Decimal with proper precision
 */
function toDecimal(value: number): Decimal {
  return new Decimal(value).toDecimalPlaces(INTERNAL_PRECISION);
}

/**
 * Round final result for display
 */
function roundForDisplay(value: Decimal): number {
  return value.toDecimalPlaces(DISPLAY_PRECISION).toNumber();
}

/**
 * Calculate pure gold weight from item
 */
function calculatePureGoldWeight(item: GoldItem): Decimal {
  const weightInGrams = toDecimal(item.weight)
    .times(toDecimal(UNIT_CONVERSIONS_TO_GRAM[item.unit]));
  
  const purityRatio = item.customPurityRatio ?? GOLD_PURITIES[item.purity];
  
  return weightInGrams.times(toDecimal(purityRatio));
}

/**
 * Calculate pure silver weight from item
 */
function calculatePureSilverWeight(item: SilverItem): Decimal {
  const weightInGrams = toDecimal(item.weight)
    .times(toDecimal(UNIT_CONVERSIONS_TO_GRAM[item.unit]));
  
  const purityRatio = item.customPurityRatio ?? GOLD_PURITIES[item.purity];
  
  return weightInGrams.times(toDecimal(purityRatio));
}

/**
 * Value gold items according to methodology
 */
function valueGoldItems(
  items: GoldItem[],
  goldPricePerGram: number,
  methodology: ZakatMethodology
): { totalValue: Decimal; breakdown: AssetBreakdown[]; notices: string[] } {
  let totalValue = new Decimal(0);
  const breakdown: AssetBreakdown[] = [];
  const notices: string[] = [];

  for (const item of items) {
    const pureWeight = calculatePureGoldWeight(item);
    const value = pureWeight.times(toDecimal(goldPricePerGram));
    
    // Apply jewelry policy
    if (item.purpose === 'personal_jewelry') {
      if (methodology.jewelryPolicy === 'exclude_personal') {
        notices.push(`Personal jewellery excluded per methodology: ${methodology.name}`);
        continue; // Skip this item
      } else if (methodology.jewelryPolicy === 'ask_purpose') {
        notices.push('Personal jewellery included based on selected methodology. Note: Scholarly opinions differ on this.');
      }
    }
    
    totalValue = totalValue.plus(value);
    breakdown.push({
      category: 'Gold',
      subcategory: `${item.purity} ${item.purpose}`,
      amount: roundForDisplay(value),
      currency: 'PKR', // Will be converted later
      notes: `${item.weight} ${item.unit} at ${goldPricePerGram}/gram`,
    });
  }

  return { totalValue, breakdown, notices };
}

/**
 * Value silver items
 */
function valueSilverItems(
  items: SilverItem[],
  silverPricePerGram: number
): { totalValue: Decimal; breakdown: AssetBreakdown[] } {
  let totalValue = new Decimal(0);
  const breakdown: AssetBreakdown[] = [];

  for (const item of items) {
    const pureWeight = calculatePureSilverWeight(item);
    const value = pureWeight.times(toDecimal(silverPricePerGram));
    
    totalValue = totalValue.plus(value);
    breakdown.push({
      category: 'Silver',
      subcategory: `${item.purity} ${item.purpose}`,
      amount: roundForDisplay(value),
      currency: 'PKR',
      notes: `${item.weight} ${item.unit} at ${silverPricePerGram}/gram`,
    });
  }

  return { totalValue, breakdown };
}

/**
 * Value cash items with currency conversion
 */
function valueCashItems(
  items: CashItem[],
  exchangeRates: Array<{ base_currency: string; target_currency: string; rate: number }>,
  baseCurrency: string
): { totalValue: Decimal; breakdown: AssetBreakdown[] } {
  let totalValue = new Decimal(0);
  const breakdown: AssetBreakdown[] = [];

  for (const item of items) {
    let valueInBaseCurrency: Decimal;
    
    if (item.currency === baseCurrency) {
      valueInBaseCurrency = toDecimal(item.amount);
    } else {
      // Find exchange rate
      const rate = exchangeRates.find(
        r => r.base_currency === item.currency && r.target_currency === baseCurrency
      );
      
      if (rate) {
        valueInBaseCurrency = toDecimal(item.amount).times(toDecimal(rate.rate));
      } else {
        // No rate found - skip with warning (should be validated before)
        continue;
      }
    }
    
    totalValue = totalValue.plus(valueInBaseCurrency);
    breakdown.push({
      category: 'Cash & Savings',
      subcategory: item.type.replace('_', ' '),
      amount: roundForDisplay(valueInBaseCurrency),
      currency: baseCurrency,
      notes: item.institution || undefined,
    });
  }

  return { totalValue, breakdown };
}

/**
 * Value receivables based on likelihood and methodology
 */
function valueReceivables(
  items: ReceivableItem[],
  exchangeRates: Array<{ base_currency: string; target_currency: string; rate: number }>,
  baseCurrency: string
): { totalValue: Decimal; breakdown: AssetBreakdown[]; notices: string[] } {
  let totalValue = new Decimal(0);
  const breakdown: AssetBreakdown[] = [];
  const notices: string[] = [];

  for (const item of items) {
    // Only include certain/likely receivables in standard methodology
    if (item.likelihood === 'bad') {
      notices.push(`Bad debt excluded: ${item.debtorName || 'Unknown debtor'}`);
      continue;
    }
    
    if (item.likelihood === 'doubtful') {
      notices.push(`Doubtful receivable may require different treatment: ${item.debtorName || 'Unknown debtor'}`);
      // Include but note the uncertainty
    }
    
    let valueInBaseCurrency: Decimal;
    
    if (item.currency === baseCurrency) {
      valueInBaseCurrency = toDecimal(item.amount);
    } else {
      const rate = exchangeRates.find(
        r => r.base_currency === item.currency && r.target_currency === baseCurrency
      );
      
      if (rate) {
        valueInBaseCurrency = toDecimal(item.amount).times(toDecimal(rate.rate));
      } else {
        continue;
      }
    }
    
    totalValue = totalValue.plus(valueInBaseCurrency);
    breakdown.push({
      category: 'Receivables',
      subcategory: `${item.likelihood} - ${item.type.replace('_', ' ')}`,
      amount: roundForDisplay(valueInBaseCurrency),
      currency: baseCurrency,
      notes: item.debtorName || undefined,
    });
  }

  return { totalValue, breakdown, notices };
}

/**
 * Value investments based on intent and methodology
 */
function valueInvestments(
  items: InvestmentItem[],
  exchangeRates: Array<{ base_currency: string; target_currency: string; rate: number }>,
  baseCurrency: string,
  methodology: ZakatMethodology
): { totalValue: Decimal; breakdown: AssetBreakdown[]; notices: string[] } {
  let totalValue = new Decimal(0);
  const breakdown: AssetBreakdown[] = [];
  const notices: string[] = [];

  for (const item of items) {
    let valueInBaseCurrency: Decimal;
    
    if (item.currency === baseCurrency) {
      valueInBaseCurrency = toDecimal(item.currentMarketValue);
    } else {
      const rate = exchangeRates.find(
        r => r.base_currency === item.currency && r.target_currency === baseCurrency
      );
      
      if (rate) {
        valueInBaseCurrency = toDecimal(item.currentMarketValue).times(toDecimal(rate.rate));
      } else {
        continue;
      }
    }
    
    // Apply investment policy based on intent
    if (item.intent === 'trading') {
      // Trading shares: full market value
      totalValue = totalValue.plus(valueInBaseCurrency);
      breakdown.push({
        category: 'Investments',
        subcategory: `Trading - ${item.type}`,
        amount: roundForDisplay(valueInBaseCurrency),
        currency: baseCurrency,
        notes: item.tickerOrName,
      });
    } else if (item.intent === 'long_term') {
      // Long-term: depends on methodology
      if (methodology.investmentPolicy === 'underlying_assets' && item.underlyingZakatablePercentage) {
        const zakatablePortion = valueInBaseCurrency.times(toDecimal(item.underlyingZakatablePercentage / 100));
        totalValue = totalValue.plus(zakatablePortion);
        breakdown.push({
          category: 'Investments',
          subcategory: `Long-term - ${item.type} (${item.underlyingZakatablePercentage}% underlying)`,
          amount: roundForDisplay(zakatablePortion),
          currency: baseCurrency,
          notes: item.tickerOrName,
          methodologyNote: 'Calculated using underlying assets method',
        });
        notices.push('Long-term investments valued using underlying zakatable assets method.');
      } else if (methodology.investmentPolicy === 'trading_market_value') {
        // Use full market value as default
        totalValue = totalValue.plus(valueInBaseCurrency);
        breakdown.push({
          category: 'Investments',
          subcategory: `Long-term - ${item.type}`,
          amount: roundForDisplay(valueInBaseCurrency),
          currency: baseCurrency,
          notes: item.tickerOrName,
          methodologyNote: 'Valued at full market value per selected methodology',
        });
      }
    }
  }

  return { totalValue, breakdown, notices };
}

/**
 * Value properties based on intent
 */
function valueProperties(
  items: PropertyItem[],
  exchangeRates: Array<{ base_currency: string; target_currency: string; rate: number }>,
  baseCurrency: string,
  methodology: ZakatMethodology
): { totalValue: Decimal; breakdown: AssetBreakdown[]; rentalIncomeRetained: Decimal; notices: string[] } {
  let totalValue = new Decimal(0);
  let rentalIncomeRetained = new Decimal(0);
  const breakdown: AssetBreakdown[] = [];
  const notices: string[] = [];

  for (const item of items) {
    let valueInBaseCurrency: Decimal;
    
    if (item.currency === baseCurrency) {
      valueInBaseCurrency = toDecimal(item.currentMarketValue);
    } else {
      const rate = exchangeRates.find(
        r => r.base_currency === item.currency && r.target_currency === baseCurrency
      );
      
      if (rate) {
        valueInBaseCurrency = toDecimal(item.currentMarketValue).times(toDecimal(rate.rate));
      } else {
        continue;
      }
    }
    
    // Classify by intent
    switch (item.intent) {
      case 'primary_residence':
      case 'personal_family_use':
        notices.push(`Personal residence excluded: ${item.address || 'Property'}`);
        // Not zakatable - do not add to total
        break;
        
      case 'rental_property':
        // Only rental income retained is zakatable, not property value
        if (item.rentalIncomeRetained && item.rentalIncomeRetained > 0) {
          let rentalInBaseCurrency: Decimal;
          if (item.currency === baseCurrency) {
            rentalInBaseCurrency = toDecimal(item.rentalIncomeRetained);
          } else {
            const rate = exchangeRates.find(
              r => r.base_currency === item.currency && r.target_currency === baseCurrency
            );
            rentalInBaseCurrency = rate 
              ? toDecimal(item.rentalIncomeRetained!).times(toDecimal(rate.rate))
              : new Decimal(0);
          }
          
          rentalIncomeRetained = rentalIncomeRetained.plus(rentalInBaseCurrency);
          breakdown.push({
            category: 'Property',
            subcategory: 'Rental income retained',
            amount: roundForDisplay(rentalInBaseCurrency),
            currency: baseCurrency,
            notes: item.address,
            methodologyNote: 'Only retained rental income is zakatable, not property value',
          });
        }
        notices.push(`Rental property: Only saved rental income is zakatable, not the property value.`);
        break;
        
      case 'purchased_for_resale':
      case 'development_stock':
      case 'land_for_resale':
        // Trade inventory - fully zakatable
        totalValue = totalValue.plus(valueInBaseCurrency);
        breakdown.push({
          category: 'Property',
          subcategory: item.intent.replace('_', ' '),
          amount: roundForDisplay(valueInBaseCurrency),
          currency: baseCurrency,
          notes: item.address,
          methodologyNote: 'Valued as trade inventory',
        });
        notices.push('Property held for resale treated as trade inventory.');
        break;
        
      case 'long_term_investment':
        notices.push(`Long-term investment property: Treatment varies by scholarly opinion. ${item.address || 'Property'}`);
        // Disputed - show notice but don't include by default
        break;
        
      case 'mixed_purpose':
        notices.push(`Mixed-purpose property requires detailed analysis: ${item.address || 'Property'}`);
        // Requires scholar review
        break;
    }
  }

  return { totalValue, breakdown, rentalIncomeRetained, notices };
}

/**
 * Value business assets
 */
function valueBusinessAssets(
  items: BusinessAssetItem[],
  exchangeRates: Array<{ base_currency: string; target_currency: string; rate: number }>,
  baseCurrency: string
): { totalValue: Decimal; breakdown: AssetBreakdown[] } {
  let totalValue = new Decimal(0);
  const breakdown: AssetBreakdown[] = [];

  for (const item of items) {
    let valueInBaseCurrency: Decimal;
    
    if (item.currency === baseCurrency) {
      valueInBaseCurrency = toDecimal(item.amount);
    } else {
      const rate = exchangeRates.find(
        r => r.base_currency === item.currency && r.target_currency === baseCurrency
      );
      
      if (rate) {
        valueInBaseCurrency = toDecimal(item.amount).times(toDecimal(rate.rate));
      } else {
        continue;
      }
    }
    
    totalValue = totalValue.plus(valueInBaseCurrency);
    breakdown.push({
      category: 'Business Assets',
      subcategory: item.type.replace('_', ' '),
      amount: roundForDisplay(valueInBaseCurrency),
      currency: baseCurrency,
      notes: item.valuationMethod ? `Valuation: ${item.valuationMethod}` : undefined,
    });
  }

  return { totalValue, breakdown };
}

/**
 * Calculate deductible liabilities
 */
function calculateDeductibleLiabilities(
  businessLiabilities: BusinessLiabilityItem[],
  personalLiabilities: PersonalLiabilityItem[],
  exchangeRates: Array<{ base_currency: string; target_currency: string; rate: number }>,
  baseCurrency: string,
  liabilityPolicy: string
): { totalDeductible: Decimal; breakdown: AssetBreakdown[] } {
  let totalDeductible = new Decimal(0);
  const breakdown: AssetBreakdown[] = [];

  // Business liabilities
  for (const item of businessLiabilities) {
    let valueInBaseCurrency: Decimal;
    
    if (item.currency === baseCurrency) {
      valueInBaseCurrency = toDecimal(item.amount);
    } else {
      const rate = exchangeRates.find(
        r => r.base_currency === item.currency && r.target_currency === baseCurrency
      );
      
      if (rate) {
        valueInBaseCurrency = toDecimal(item.amount).times(toDecimal(rate.rate));
      } else {
        continue;
      }
    }
    
    totalDeductible = totalDeductible.plus(valueInBaseCurrency);
    breakdown.push({
      category: 'Business Liabilities',
      subcategory: item.type.replace('_', ' '),
      amount: -roundForDisplay(valueInBaseCurrency),
      currency: baseCurrency,
      notes: item.dueDate ? `Due: ${item.dueDate}` : undefined,
    });
  }

  // Personal liabilities based on policy
  for (const item of personalLiabilities) {
    let deductibleAmount: number;
    
    switch (liabilityPolicy) {
      case 'ImmediateDueAmount':
        deductibleAmount = item.amountDueWithinYear;
        break;
      case 'Next12LunarMonths':
        deductibleAmount = item.amountDueWithinYear;
        break;
      case 'CurrentLiability':
        deductibleAmount = item.amountDueWithinYear;
        break;
      default:
        deductibleAmount = item.amountDueWithinYear;
    }
    
    // Separate interest component (not deductible)
    if (item.interestComponent && item.interestComponent > 0) {
      // Interest is not deductible in Islamic finance
    }
    
    if (deductibleAmount <= 0) {
      continue;
    }
    
    let valueInBaseCurrency: Decimal;
    
    if (item.currency === baseCurrency) {
      valueInBaseCurrency = toDecimal(deductibleAmount);
    } else {
      const rate = exchangeRates.find(
        r => r.base_currency === item.currency && r.target_currency === baseCurrency
      );
      
      if (rate) {
        valueInBaseCurrency = toDecimal(deductibleAmount).times(toDecimal(rate.rate));
      } else {
        continue;
      }
    }
    
    totalDeductible = totalDeductible.plus(valueInBaseCurrency);
    breakdown.push({
      category: 'Personal Liabilities',
      subcategory: item.type.replace('_', ' '),
      amount: -roundForDisplay(valueInBaseCurrency),
      currency: baseCurrency,
      notes: item.creditorName || (item.interestComponent ? `Interest excluded: ${item.interestComponent}` : undefined),
    });
  }

  return { totalDeductible, breakdown };
}

/**
 * Main calculation function
 */
export function calculateZakat(input: ZakatCalculationInput): ZakatCalculationResult {
  const warnings: string[] = [];
  const methodologyNotices: string[] = [];

  // Extract market data
  const { goldPrice, silverPrice, exchangeRates } = input.marketData;
  
  // Normalize prices to per-gram in base currency
  let goldPricePerGram = goldPrice.price;
  if (goldPrice.unit !== 'gram') {
    goldPricePerGram = goldPrice.price / UNIT_CONVERSIONS_TO_GRAM[goldPrice.unit];
  }
  
  let silverPricePerGram = silverPrice.price;
  if (silverPrice.unit !== 'gram') {
    silverPricePerGram = silverPrice.price / UNIT_CONVERSIONS_TO_GRAM[silverPrice.unit];
  }
  
  // Convert metal prices to base currency if needed
  if (goldPrice.currency !== input.currency) {
    const rate = exchangeRates.find(
      r => r.base_currency === goldPrice.currency && r.target_currency === input.currency
    );
    if (rate) {
      goldPricePerGram *= rate.rate;
    } else {
      warnings.push(`Could not convert gold price from ${goldPrice.currency} to ${input.currency}`);
    }
  }
  
  if (silverPrice.currency !== input.currency) {
    const rate = exchangeRates.find(
      r => r.base_currency === silverPrice.currency && r.target_currency === input.currency
    );
    if (rate) {
      silverPricePerGram *= rate.rate;
    } else {
      warnings.push(`Could not convert silver price from ${silverPrice.currency} to ${input.currency}`);
    }
  }

  // Get methodology
  const methodology: ZakatMethodology = {
    ...DEFAULT_METHODOLOGY,
    id: input.methodologyId,
    nisabMethod: input.nisabMethod,
  };

  // Value all assets
  const goldResult = valueGoldItems(input.goldItems, goldPricePerGram, methodology);
  methodologyNotices.push(...goldResult.notices);

  const silverResult = valueSilverItems(input.silverItems, silverPricePerGram);

  const cashResult = valueCashItems(input.cashItems, exchangeRates, input.currency);

  const receivablesResult = valueReceivables(input.receivables, exchangeRates, input.currency);
  warnings.push(...receivablesResult.notices);

  const investmentsResult = valueInvestments(
    input.investments,
    exchangeRates,
    input.currency,
    methodology
  );
  methodologyNotices.push(...investmentsResult.notices);

  const propertyResult = valueProperties(
    input.properties,
    exchangeRates,
    input.currency,
    methodology
  );
  methodologyNotices.push(...propertyResult.notices);

  const businessAssetsResult = valueBusinessAssets(input.businessAssets, exchangeRates, input.currency);

  // Calculate totals
  const totalGoldValue = goldResult.totalValue;
  const totalSilverValue = silverResult.totalValue;
  const totalCashValue = cashResult.totalValue;
  const totalReceivablesValue = receivablesResult.totalValue;
  const totalInvestmentsValue = investmentsResult.totalValue;
  const totalPropertyValue = propertyResult.totalValue;
  const totalBusinessAssetsValue = businessAssetsResult.totalValue;

  const totalZakatableAssets = totalGoldValue
    .plus(totalSilverValue)
    .plus(totalCashValue)
    .plus(totalReceivablesValue)
    .plus(totalInvestmentsValue)
    .plus(totalPropertyValue)
    .plus(totalBusinessAssetsValue)
    .plus(propertyResult.rentalIncomeRetained);

  // Calculate deductible liabilities
  const liabilitiesResult = calculateDeductibleLiabilities(
    input.businessLiabilities,
    input.personalLiabilities,
    exchangeRates,
    input.currency,
    methodology.liabilityPolicy
  );

  const totalDeductibleLiabilities = liabilitiesResult.totalDeductible;

  // Net zakatable wealth
  const netZakatableWealth = totalZakatableAssets.minus(totalDeductibleLiabilities);

  // Calculate nisab value
  const nisabGrams = input.nisabMethod === 'gold' 
    ? methodology.goldNisabGrams 
    : methodology.silverNisabGrams;
  
  const nisabPricePerGram = input.nisabMethod === 'gold' 
    ? goldPricePerGram 
    : silverPricePerGram;
  
  const nisabValue = toDecimal(nisabGrams).times(toDecimal(nisabPricePerGram));

  // Check if nisab is reached
  const nisabReached = netZakatableWealth.greaterThanOrEqualTo(nisabValue);

  // Calculate zakat due
  let zakatDue = new Decimal(0);
  if (nisabReached) {
    zakatDue = netZakatableWealth.times(toDecimal(methodology.zakatRate));
  }

  // Build asset breakdown
  const assetBreakdown: AssetBreakdown[] = [
    ...goldResult.breakdown,
    ...silverResult.breakdown,
    ...cashResult.breakdown,
    ...receivablesResult.breakdown,
    ...investmentsResult.breakdown,
    ...propertyResult.breakdown,
    ...businessAssetsResult.breakdown,
  ];

  // Add rental income if applicable
  if (propertyResult.rentalIncomeRetained.greaterThan(0)) {
    // Already included in property breakdown
  }

  // Build result
  const result: ZakatCalculationResult = {
    calculationDate: input.calculationDate,
    currency: input.currency,
    methodology,
    nisabMethod: input.nisabMethod,
    
    ratesUsed: {
      goldPricePerGram: goldPricePerGram,
      silverPricePerGram: silverPricePerGram,
      goldPriceTimestamp: goldPrice.timestamp,
      silverPriceTimestamp: silverPrice.timestamp,
      exchangeRates,
    },
    
    totalGoldValue: roundForDisplay(totalGoldValue),
    totalSilverValue: roundForDisplay(totalSilverValue),
    totalCashValue: roundForDisplay(totalCashValue),
    totalReceivablesValue: roundForDisplay(totalReceivablesValue),
    totalInvestmentsValue: roundForDisplay(totalInvestmentsValue),
    totalPropertyValue: roundForDisplay(totalPropertyValue),
    totalBusinessAssetsValue: roundForDisplay(totalBusinessAssetsValue),
    
    totalZakatableAssets: roundForDisplay(totalZakatableAssets),
    totalDeductibleLiabilities: roundForDisplay(totalDeductibleLiabilities),
    netZakatableWealth: roundForDisplay(netZakatableWealth),
    
    nisabValue: roundForDisplay(nisabValue),
    nisabReached,
    nisabShortfall: nisabReached ? undefined : roundForDisplay(nisabValue.minus(netZakatableWealth)),
    
    zakatRate: methodology.zakatRate,
    zakatDue: roundForDisplay(zakatDue),
    
    assetBreakdown,
    liabilityBreakdown: liabilitiesResult.breakdown,
    
    warnings,
    methodologyNotices,
    
    calculatedAt: new Date().toISOString(),
    calculatorVersion: CALCULATOR_VERSION,
  };

  return result;
}

/**
 * Calculate nisab values for both gold and silver methods
 */
export function calculateNisabValues(
  goldPricePerGram: number,
  silverPricePerGram: number,
  methodology: ZakatMethodology
): { goldNisabValue: number; silverNisabValue: number } {
  const goldNisabValue = toDecimal(methodology.goldNisabGrams)
    .times(toDecimal(goldPricePerGram));
  
  const silverNisabValue = toDecimal(methodology.silverNisabGrams)
    .times(toDecimal(silverPricePerGram));
  
  return {
    goldNisabValue: roundForDisplay(goldNisabValue),
    silverNisabValue: roundForDisplay(silverNisabValue),
  };
}

// Re-export types for convenience
export type { ZakatCalculationInput, ZakatCalculationResult };
