import { useNavigate, useParams } from "react-router-dom";

import { getSubscriptionById } from "../../services/subscriptionStorage";

import "./SubscriptionDetails.css";

function formatCurrency(value: number): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
}

function formatDate(date: string): string {
  const [year, month, day] = date
    .split("-")
    .map(Number);

  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "2-digit",
  }).format(new Date(year, month - 1, day));
}

function createBillingDate(
  year: number,
  month: number,
  billingDay: number,
): Date {
  const lastDayOfMonth = new Date(
    year,
    month + 1,
    0,
  ).getDate();

  return new Date(
    year,
    month,
    Math.min(billingDay, lastDayOfMonth),
  );
}

function getNextBillingDate(billingDay: number): Date {
  const today = new Date();

  const currentDate = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate(),
  );

  let billingDate = createBillingDate(
    today.getFullYear(),
    today.getMonth(),
    billingDay,
  );

  if (billingDate < currentDate) {
    billingDate = createBillingDate(
      today.getFullYear(),
      today.getMonth() + 1,
      billingDay,
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

  const difference =
    date.getTime() - currentDate.getTime();

  return Math.max(
    0,
    Math.ceil(difference / (1000 * 60 * 60 * 24)),
  );
}

function getInitial(name: string): string {
  return name.trim().charAt(0).toUpperCase();
}

function SubscriptionDetails() {
  const navigate = useNavigate();
  const { id } = useParams();

  const subscription = id
    ? getSubscriptionById(id)
    : undefined;

  if (!subscription) {
    return (
      <section className="subscription-details-page subscription-details-page--empty">
        <h1>Assinatura não encontrada</h1>

        <p>
          O registro solicitado não existe ou foi
          removido.
        </p>

        <button
          type="button"
          onClick={() => navigate("/subscriptions")}
        >
          Voltar para assinaturas
        </button>
      </section>
    );
  }

  const nextBillingDate = getNextBillingDate(
    subscription.billingDay,
  );

  const daysUntilBilling =
    getDaysUntil(nextBillingDate);

  return (
    <section className="subscription-details-page">
      <header className="subscription-details-page__header">
        <div>
          <h1>Sua Assinatura</h1>
          <p>Veja as informações cadastradas.</p>
        </div>

        <div className="subscription-details-page__actions">
          <button
            type="button"
            className="subscription-details-page__button subscription-details-page__button--secondary"
            onClick={() => navigate("/subscriptions")}
          >
            <span aria-hidden="true">‹</span>
            Voltar
          </button>

          <button
            type="button"
            className="subscription-details-page__button subscription-details-page__button--primary"
            onClick={() =>
              navigate(
                `/subscriptions/${subscription.id}/edit`,
              )
            }
          >
            <svg
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                d="m4 16.5-.5 4 4-.5L18 9.5 14.5 6 4 16.5ZM13 7.5l3.5 3.5"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>

            Editar
          </button>
        </div>
      </header>

      <article className="subscription-details-card">
        <div className="subscription-details-card__identity">
          <div className="subscription-details-card__logo">
            {getInitial(subscription.name)}
          </div>

          <div>
            <span className="subscription-details-card__category">
              {subscription.category}
            </span>

            <div className="subscription-details-card__name">
              <h2>{subscription.name}</h2>

              <span
                className={`subscription-details-card__status subscription-details-card__status--${subscription.status.toLowerCase()}`}
              >
                {subscription.status}
              </span>
            </div>

            {subscription.plan && (
              <p>{subscription.plan}</p>
            )}
          </div>
        </div>

        <div className="subscription-details-card__grid">
          <div className="subscription-details-card__item">
            <span>Valor mensal</span>
            <strong className="subscription-details-card__value">
              {formatCurrency(
                subscription.monthlyValue,
              )}
            </strong>
          </div>

          <div className="subscription-details-card__item">
            <span>Dia da cobrança</span>
            <strong>{subscription.billingDay}</strong>
          </div>

          <div className="subscription-details-card__item">
            <span>Data de início</span>
            <strong>
              {formatDate(subscription.startDate)}
            </strong>
          </div>

          <div className="subscription-details-card__item">
            <span>Forma de pagamento</span>
            <strong>
              {subscription.paymentMethod}
            </strong>
          </div>

          <div className="subscription-details-card__item">
            <span>Categoria</span>
            <strong>{subscription.category}</strong>
          </div>

          <div className="subscription-details-card__item">
            <span>E-mail da conta</span>
            <strong>
              {subscription.accountEmail}
            </strong>
          </div>
        </div>
      </article>

      <div className="subscription-details-summary">
        <article className="subscription-summary-card">
          <h2>Contas e Perfis</h2>

          <div className="subscription-summary-card__content">
            <strong>{subscription.profiles}</strong>

            <span>
              {subscription.profiles === 1
                ? "Perfil ativo"
                : "Perfis ativos"}
            </span>
          </div>

          <svg
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              d="M16 21v-2a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v2m6.5-10a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm7.5-3v6m3-3h-6"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </article>

        <article className="subscription-summary-card">
          <h2>Frequência</h2>

          <div className="subscription-summary-card__content subscription-summary-card__content--column">
            <strong>
              {subscription.renewalType}
            </strong>

            <span>Renovação automática</span>
          </div>

          <svg
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              d="M3 12a9 9 0 0 1 15-6.7L21 8m0-5v5h-5M21 12a9 9 0 0 1-15 6.7L3 16m0 5v-5h5"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </article>

        <article className="subscription-summary-card">
          <h2>Próxima Fatura</h2>

          <div className="subscription-summary-card__content subscription-summary-card__content--column">
            <strong>
              {new Intl.DateTimeFormat("pt-BR", {
                day: "2-digit",
                month: "short",
              }).format(nextBillingDate)}
            </strong>

            <span>
              {daysUntilBilling === 0
                ? "Cobrança hoje"
                : `Faltam ${daysUntilBilling} dias`}
            </span>
          </div>

          <svg
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
    </section>
  );
}

export default SubscriptionDetails;
