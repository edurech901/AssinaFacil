import { useMemo } from "react";

import { getSubscriptions } from "../../services/subscriptionStorage";
import type {
  Subscription,
  SubscriptionCategory,
} from "../../types/subscription";

import "./Dashboard.css";

const CATEGORY_COLORS: Record<
  SubscriptionCategory,
  string
> = {
  Streaming: "#358cff",
  Música: "#0755b8",
  Jogos: "#7c3aed",
  Educação: "#0f766e",
  "Saúde/Esporte": "#16a34a",
  Produtividade: "#f59e0b",
  Outros: "#64748b",
};

function formatCurrency(value: number): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
}

function createBillingDate(
  year: number,
  month: number,
  billingDay: number,
): Date {
  const lastDay = new Date(
    year,
    month + 1,
    0,
  ).getDate();

  return new Date(
    year,
    month,
    Math.min(billingDay, lastDay),
  );
}

function getNextBillingDate(
  subscription: Subscription,
): Date {
  const today = new Date();

  const currentDate = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate(),
  );

  let billingDate = createBillingDate(
    today.getFullYear(),
    today.getMonth(),
    subscription.billingDay,
  );

  if (billingDate < currentDate) {
    billingDate = createBillingDate(
      today.getFullYear(),
      today.getMonth() + 1,
      subscription.billingDay,
    );
  }

  return billingDate;
}

function getDaysUntil(date: Date): number {
  const today = new Date();

  const currentDate = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate(),
  );

  return Math.max(
    0,
    Math.ceil(
      (date.getTime() - currentDate.getTime()) /
        (1000 * 60 * 60 * 24),
    ),
  );
}

function Dashboard() {
  const subscriptions = useMemo(
    () => getSubscriptions(),
    [],
  );

  const activeSubscriptions = useMemo(
    () =>
      subscriptions.filter(
        (subscription) =>
          subscription.status === "Ativa",
      ),
    [subscriptions],
  );

  const monthlyTotal = activeSubscriptions.reduce(
    (total, subscription) =>
      total + subscription.monthlyValue,
    0,
  );

  const nextSubscription = useMemo(() => {
    return activeSubscriptions
      .map((subscription) => ({
        subscription,
        billingDate:
          getNextBillingDate(subscription),
      }))
      .sort(
        (first, second) =>
          first.billingDate.getTime() -
          second.billingDate.getTime(),
      )[0];
  }, [activeSubscriptions]);

  const categoryDistribution = useMemo(() => {
    const counts = new Map<
      SubscriptionCategory,
      number
    >();

    activeSubscriptions.forEach((subscription) => {
      counts.set(
        subscription.category,
        (counts.get(subscription.category) ?? 0) + 1,
      );
    });

    return Array.from(counts.entries())
      .map(([category, quantity]) => ({
        category,
        quantity,
        percentage:
          activeSubscriptions.length === 0
            ? 0
            : Math.round(
                (quantity /
                  activeSubscriptions.length) *
                  100,
              ),
      }))
      .sort(
        (first, second) =>
          second.quantity - first.quantity,
      );
  }, [activeSubscriptions]);

  const chartBackground = useMemo(() => {
    if (categoryDistribution.length === 0) {
      return "#e2e8f0";
    }

    let accumulatedPercentage = 0;

    const segments = categoryDistribution.map(
      ({ category, percentage }) => {
        const start = accumulatedPercentage;
        const end = start + percentage;

        accumulatedPercentage = end;

        return `${CATEGORY_COLORS[category]} ${start}% ${end}%`;
      },
    );

    return `conic-gradient(${segments.join(", ")})`;
  }, [categoryDistribution]);

  const mainCategory = categoryDistribution[0];

  const daysUntilBilling = nextSubscription
    ? getDaysUntil(nextSubscription.billingDate)
    : null;

  return (
    <div className="container">
      <h1>Dashboard</h1>

    </div>
  );
}

export default Dashboard;
