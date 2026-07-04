import { niche } from '../config/niche';

/**
 * Scaffold for RevenueCat subscriptions. Swap the bodies of these functions
 * for real `react-native-purchases` calls once a RevenueCat project + API
 * keys exist and a native/EAS build is set up (Expo Go can't load native
 * purchase SDKs). The call sites in PaywallScreen won't need to change.
 */

export interface PurchaseResult {
  success: boolean;
  isPremium: boolean;
}

export async function getOfferings() {
  return {
    identifier: niche.paywall.revenueCatOfferingId,
    trialDays: niche.paywall.trialDays,
    annualPrice: niche.paywall.annualPrice,
    monthlyPrice: niche.paywall.monthlyPrice,
    currencySymbol: niche.paywall.currencySymbol,
  };
}

export async function purchaseAnnualPackage(): Promise<PurchaseResult> {
  await new Promise((resolve) => setTimeout(resolve, 400));
  return { success: true, isPremium: true };
}

export async function restorePurchases(): Promise<PurchaseResult> {
  await new Promise((resolve) => setTimeout(resolve, 300));
  return { success: true, isPremium: false };
}
