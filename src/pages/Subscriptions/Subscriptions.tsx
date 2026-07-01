import {
  useEffect,
  useMemo,
  useState,
  type MouseEvent,
} from "react";

import { useNavigate } from "react-router-dom";

import ConfirmDialog from "../../components/ConfirmDialog/ConfirmDialog";

import {
  deleteSubscription,
  getSubscriptions,
} from "../../services/subscriptionStorage";

import {
  SUBSCRIPTION_CATEGORIES,
  SUBSCRIPTION_STATUS,
  type Subscription,
} from "../../types/subscription";

import "./Subscriptions.css";

const ITEMS_PER_PAGE = 5;

function formatCurrency(value: number): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
}

function getNextBillingDate(billingDay: number): string {
  const today = new Date();

  let billingDate = new Date(
    today.getFullYear(),
    today.getMonth(),
    billingDay,
  );

  if (billingDate < today) {
    billingDate = new Date(
      today.getFullYear(),
      today.getMonth() + 1,
      billingDay,
    );
  }

  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(billingDate);
}

function getInitial(name: string): string {
  return name.trim().charAt(0).toUpperCase();
}

function Subscriptions() {
  const navigate = useNavigate();

  const [subscriptions, setSubscriptions] =
    useState<Subscription[]>(getSubscriptions);

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("Todos");
  const [status, setStatus] = useState("Todos");
  const [currentPage, setCurrentPage] = useState(1);

  const [subscriptionToDelete, setSubscriptionToDelete] =
    useState<Subscription | null>(null);

  const filteredSubscriptions = useMemo(() => {
    return subscriptions.filter((subscription) => {
      const matchesSearch = subscription.name
        .toLowerCase()
        .includes(search.trim().toLowerCase());

      const matchesCategory =
        category === "Todos" ||
        subscription.category === category;

      const matchesStatus =
        status === "Todos" ||
        subscription.status === status;

      return (
        matchesSearch &&
        matchesCategory &&
        matchesStatus
      );
    });
  }, [subscriptions, search, category, status]);

  const totalPages = Math.max(
    1,
    Math.ceil(
      filteredSubscriptions.length / ITEMS_PER_PAGE,
    ),
  );

  const visibleSubscriptions = useMemo(() => {
    const firstItem =
      (currentPage - 1) * ITEMS_PER_PAGE;

    return filteredSubscriptions.slice(
      firstItem,
      firstItem + ITEMS_PER_PAGE,
    );
  }, [filteredSubscriptions, currentPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [search, category, status]);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  function clearFilters() {
    setSearch("");
    setCategory("Todos");
    setStatus("Todos");
    setCurrentPage(1);
  }

  function openSubscription(id: string) {
    navigate(`/subscriptions/${id}`);
  }

  function handleDeleteClick(
    event: MouseEvent<HTMLButtonElement>,
    subscription: Subscription,
  ) {
    event.stopPropagation();
    setSubscriptionToDelete(subscription);
  }

  function confirmDelete() {
    if (!subscriptionToDelete) {
      return;
    }

    const deleted = deleteSubscription(
      subscriptionToDelete.id,
    );

    if (deleted) {
      setSubscriptions(getSubscriptions());
    }

    setSubscriptionToDelete(null);
  }

  function cancelDelete() {
    setSubscriptionToDelete(null);
  }

  return (
    <section className="subscriptions-page">
      <header className="subscriptions-page__header">
        <div>
          <h1>Minhas Assinaturas</h1>
          <p>Controle seus gastos.</p>
        </div>

        <button
          type="button"
          className="subscriptions-page__new-button"
          onClick={() =>
            navigate("/subscriptions/new")
          }
        >
          <span aria-hidden="true">+</span>
          Nova Assinatura
        </button>
      </header>

      <div className="subscriptions-filters">
        <div className="subscriptions-filters__search">
          <label htmlFor="subscription-search">
            Pesquisa por nome
          </label>

          <input
            id="subscription-search"
            type="search"
            placeholder="Ex: Netflix, Adobe..."
            value={search}
            onChange={(event) =>
              setSearch(event.target.value)
            }
          />
        </div>

        <div className="subscriptions-filters__field">
          <label htmlFor="category-filter">
            Categoria
          </label>

          <select
            id="category-filter"
            value={category}
            onChange={(event) =>
              setCategory(event.target.value)
            }
          >
            <option value="Todos">Todos</option>

            {SUBSCRIPTION_CATEGORIES.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </div>

        <div className="subscriptions-filters__field">
          <label htmlFor="status-filter">
            Status
          </label>

          <select
            id="status-filter"
            value={status}
            onChange={(event) =>
              setStatus(event.target.value)
            }
          >
            <option value="Todos">Todos</option>

            {SUBSCRIPTION_STATUS.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </div>

        <button
          type="button"
          className="subscriptions-filters__clear"
          onClick={clearFilters}
        >
          Limpar
        </button>
      </div>

      <div className="subscriptions-table">
        {filteredSubscriptions.length === 0 ? (
          <div className="subscriptions-table__empty">
            <h2>Nenhuma assinatura encontrada</h2>

            <p>
              Cadastre uma assinatura ou altere os
              filtros utilizados.
            </p>

            <button
              type="button"
              onClick={() =>
                navigate("/subscriptions/new")
              }
            >
              Nova assinatura
            </button>
          </div>
        ) : (
          <>
            <div className="subscriptions-table__scroll">
              <table>
                <thead>
                  <tr>
                    <th>Nome</th>
                    <th>Categoria</th>
                    <th>Valor</th>
                    <th>Renovação</th>
                    <th>Status</th>

                    <th className="subscriptions-table__actions-column">
                      Ações
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {visibleSubscriptions.map(
                    (subscription) => (
                      <tr
                        key={subscription.id}
                        onClick={() =>
                          openSubscription(
                            subscription.id,
                          )
                        }
                      >
                        <td>
                          <div className="subscription-name">
                            <span className="subscription-name__icon">
                              {getInitial(
                                subscription.name,
                              )}
                            </span>

                            <div>
                              <strong>
                                {subscription.name}
                              </strong>

                              <span>
                                {subscription.plan ||
                                  "Sem plano informado"}
                              </span>
                            </div>
                          </div>
                        </td>

                        <td>
                          {subscription.category}
                        </td>

                        <td>
                          <strong>
                            {formatCurrency(
                              subscription.monthlyValue,
                            )}
                          </strong>
                        </td>

                        <td>
                          {getNextBillingDate(
                            subscription.billingDay,
                          )}
                        </td>

                        <td>
                          <span
                            className={`subscription-status subscription-status--${subscription.status.toLowerCase()}`}
                          >
                            {subscription.status}
                          </span>
                        </td>

                        <td className="subscriptions-table__actions-column">
                          <button
                            type="button"
                            className="subscription-delete-button"
                            aria-label={`Excluir ${subscription.name}`}
                            title="Excluir assinatura"
                            onClick={(event) =>
                              handleDeleteClick(
                                event,
                                subscription,
                              )
                            }
                          >
                            <svg
                              viewBox="0 0 24 24"
                              aria-hidden="true"
                            >
                              <path
                                d="M4 7h16M9 7V4h6v3m-8 0 1 13h8l1-13M10 11v5m4-5v5"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="1.8"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                          </button>
                        </td>
                      </tr>
                    ),
                  )}
                </tbody>
              </table>
            </div>

            <footer className="subscriptions-table__footer">
              <span>
                Mostrando {visibleSubscriptions.length} de{" "}
                {filteredSubscriptions.length} assinaturas
              </span>

              <div className="subscriptions-pagination">
                <button
                  type="button"
                  aria-label="Página anterior"
                  disabled={currentPage === 1}
                  onClick={() =>
                    setCurrentPage(
                      (page) => page - 1,
                    )
                  }
                >
                  <span aria-hidden="true">‹</span>
                </button>

                <span>{currentPage}</span>

                <button
                  type="button"
                  aria-label="Próxima página"
                  disabled={
                    currentPage === totalPages
                  }
                  onClick={() =>
                    setCurrentPage(
                      (page) => page + 1,
                    )
                  }
                >
                  <span aria-hidden="true">›</span>
                </button>
              </div>
            </footer>
          </>
        )}
      </div>

      <ConfirmDialog
        isOpen={subscriptionToDelete !== null}
        title="Excluir assinatura?"
        message={
          subscriptionToDelete
            ? `A assinatura ${subscriptionToDelete.name} será removida do Assina Fácil. Esta ação não poderá ser desfeita.`
            : ""
        }
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
      />
    </section>
  );
}

export default Subscriptions;
