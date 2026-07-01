export const SUBSCRIPTION_CATEGORIES = [
  "Streaming",
  "Música",
  "Jogos",
  "Educação",
  "Saúde/Esporte",
  "Produtividade",
  "Outros",
] as const;

export const RENEWAL_TYPES = [
  "Mensal",
  "Trimestral",
  "Semestral",
  "Anual",
] as const;

export const PAYMENT_METHODS = [
  "Cartão de Crédito",
  "PIX",
  "Débito Automático",
  "Outro",
] as const;

export const SUBSCRIPTION_STATUS = [
  "Ativa",
  "Inativa",
] as const;

export type SubscriptionCategory =
  (typeof SUBSCRIPTION_CATEGORIES)[number];

export type RenewalType =
  (typeof RENEWAL_TYPES)[number];

export type PaymentMethod =
  (typeof PAYMENT_METHODS)[number];

export type SubscriptionStatus =
  (typeof SUBSCRIPTION_STATUS)[number];

export interface Subscription {
  id: string;
  name: string;
  category: SubscriptionCategory;
  plan: string;
  monthlyValue: number;
  startDate: string;
  renewalType: RenewalType;
  paymentMethod: PaymentMethod;
  billingDay: number;
  accountEmail: string;
  profiles: number;
  status: SubscriptionStatus;
  createdAt: string;
  updatedAt: string;
}

export type SubscriptionFormData = Omit<
  Subscription,
  "id" | "createdAt" | "updatedAt"
>;
