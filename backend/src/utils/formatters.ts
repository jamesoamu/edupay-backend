export const formatCurrency = (
  amount: number | null | undefined,
  currency: string = 'NGN'
): string => {
  const num = typeof amount === 'number' ? amount : 0;
  const symbolMap: Record<string, string> = {
    NGN: '₦',
    USD: '$',
    GBP: '£',
    GHS: 'GH₵',
    KES: 'KSh ',
  };
  const symbol = symbolMap[currency] || `${currency} `;
  return `${symbol}${num.toLocaleString('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  })}`;
};

export const generateReference = (prefix: string = 'EDP'): string => {
  const randomPart = Math.random().toString(36).substring(2, 8).toUpperCase();
  const timestamp = Date.now().toString().slice(-4);
  return `${prefix}-${timestamp}-${randomPart}`;
};

export const generateReceiptNumber = (): string => {
  const year = new Date().getFullYear();
  const rand = Math.floor(100000 + Math.random() * 900000);
  return `RCP-${year}-${rand}`;
};
