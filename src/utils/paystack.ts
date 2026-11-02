import { generateReference } from './formatters.ts';

export interface PaystackInitConfig {
  key: string;
  email: string;
  amount: number; // in kobo or major units
  currency?: string;
  ref?: string;
  metadata?: Record<string, any>;
  onSuccess?: (response: { reference: string; message: string; trxref: string }) => void;
  onCancel?: () => void;
}

export const createPaystackReference = (studentAdmNo?: string): string => {
  const cleanAdm = (studentAdmNo || 'STU').replace(/[^a-zA-Z0-9]/g, '').slice(-4);
  return generateReference(`PAY-${cleanAdm}`);
};

export const verifyPaystackTransactionMock = async (reference: string) => {
  // Realistic mock/verification helper
  return {
    status: true,
    message: 'Verification successful',
    data: {
      id: Math.floor(Math.random() * 10000000),
      domain: 'test',
      status: 'success',
      reference,
      gateway_response: 'Successful',
      channel: 'card',
      currency: 'NGN',
      ip_address: '102.89.44.11',
    },
  };
};
