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
    <section className="dashboard-page">
      <header className="dashboard-page__header">
        <h1>Dashboard</h1>
        <p>Bem-vindo de volta, Administrador.</p>
      </header>

      <div className="dashboard-content">
        <div className="dashboard-content__left">
          <article className="dashboard-card dashboard-card--metric">
            <span className="dashboard-card__label">
              Gasto recorrente
            </span>

            <strong className="dashboard-card__main-value">
              {formatCurrency(monthlyTotal)}
            </strong>

            <span className="dashboard-card__support-text">
              /mês
            </span>

            <span className="dashboard-card__icon">
              $
            </span>
          </article>

          <article className="dashboard-card dashboard-card--metric">
            <span className="dashboard-card__label">
              Próxima fatura
            </span>

            {nextSubscription ? (
              <>
                <strong className="dashboard-card__main-value dashboard-card__main-value--date">
                  {new Intl.DateTimeFormat("pt-BR", {
                    day: "2-digit",
                    month: "long",
                  }).format(
                    nextSubscription.billingDate,
                  )}
                </strong>

                <span className="dashboard-card__support-text">
                  {daysUntilBilling === 0
                    ? "Cobrança hoje"
                    : daysUntilBilling === 1
                      ? "Falta 1 dia"
                      : `Faltam ${daysUntilBilling} dias`}
                </span>
              </>
            ) : (
              <>
                <strong className="dashboard-card__empty-value">
                  Nenhuma cobrança
                </strong>

                <span className="dashboard-card__support-text">
                  Cadastre uma assinatura ativa
                </span>
              </>
            )}

            <svg
              className="dashboard-card__svg-icon"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <circle
                cx="12"
                cy="12"
                r="9"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
              />

              <path
                d="M12 7v5l3 2"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </article>
        </div>

        <article className="dashboard-card dashboard-card--chart">
          <span className="dashboard-card__label">
            Distribuição por categoria
          </span>

          <div className="dashboard-chart">
            <div
              className="dashboard-chart__donut"
              style={{
                background: chartBackground,
              }}
              role="img"
              aria-label="Distribuição das assinaturas por categoria"
            >
              <div className="dashboard-chart__center">
                {mainCategory ? (
                  <>
                    <span>
                      {mainCategory.category}
                    </span>

                    <strong>
                      {mainCategory.percentage}%
                    </strong>
                  </>
                ) : (
                  <>
                    <span>Sem dados</span>
                    <strong>0%</strong>
                  </>
                )}
              </div>
            </div>

            <div className="dashboard-chart__legend">
              {categoryDistribution.length > 0 ? (
                categoryDistribution.map(
                  ({ category, quantity }) => (
                    <div
                      key={category}
                      className="dashboard-chart__legend-item"
                    >
                      <span
                        className="dashboard-chart__legend-color"
                        style={{
                          backgroundColor:
                            CATEGORY_COLORS[category],
                        }}
                      />

                      <span>{category}</span>
                      <strong>{quantity}</strong>
                    </div>
                  ),
                )
              ) : (
                <p>
                  Nenhuma assinatura ativa cadastrada.
                </p>
              )}
            </div>
          </div>
        </article>

        <article className="dashboard-card dashboard-card--subscriptions">
          <span className="dashboard-card__label">
            Assinaturas ativas
          </span>

          <div className="dashboard-active-subscriptions">
            <strong>
              {activeSubscriptions.length}{" "}
              {activeSubscriptions.length === 1
                ? "Assinatura"
                : "Assinaturas"}
            </strong>

            <div className="dashboard-active-subscriptions__icons">
              {activeSubscriptions
                .slice(0, 3)
                .map((subscription) => (
                  <span
                    key={subscription.id}
                    title={subscription.name}
                  >
                    {subscription.name
                      .trim()
                      .charAt(0)
                      .toUpperCase()}
                  </span>
                ))}

              {activeSubscriptions.length > 3 && (
                <span>
                  +{activeSubscriptions.length - 3}
                </span>
              )}
            </div>
          </div>
        </article>
      </div>
    </section>
  );
}

export default Dashboard;
