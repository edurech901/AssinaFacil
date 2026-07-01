import { useState, type FormEvent } from "react";
import {
  PAYMENT_METHODS,
  RENEWAL_TYPES,
  SUBSCRIPTION_CATEGORIES,
  SUBSCRIPTION_STATUS,
  type PaymentMethod,
  type RenewalType,
  type SubscriptionCategory,
  type SubscriptionFormData,
  type SubscriptionStatus,
} from "../../types/subscription";

import "./SubscriptionForm.css";

interface SubscriptionFormProps {
  mode: "create" | "edit";
  initialData?: SubscriptionFormData;
  onSubmit: (data: SubscriptionFormData) => void;
  onCancel: () => void;
}

interface FormState {
  name: string;
  category: SubscriptionCategory | "";
  plan: string;
  monthlyValue: string;
  startDate: string;
  renewalType: RenewalType;
  paymentMethod: PaymentMethod;
  billingDay: string;
  accountEmail: string;
  profiles: string;
  status: SubscriptionStatus;
}

function SubscriptionForm({
  mode,
  initialData,
  onSubmit,
  onCancel,
}: SubscriptionFormProps) {
  const [formData, setFormData] = useState<FormState>({
    name: initialData?.name ?? "",
    category: initialData?.category ?? "",
    plan: initialData?.plan ?? "",
    monthlyValue: initialData
      ? String(initialData.monthlyValue)
      : "",
    startDate: initialData?.startDate ?? "",
    renewalType: initialData?.renewalType ?? "Mensal",
    paymentMethod:
      initialData?.paymentMethod ?? "Cartão de Crédito",
    billingDay: initialData
      ? String(initialData.billingDay)
      : "",
    accountEmail: initialData?.accountEmail ?? "",
    profiles: initialData
      ? String(initialData.profiles)
      : "1",
    status: initialData?.status ?? "Ativa",
  });

  const [errorMessage, setErrorMessage] = useState("");

  function updateField<K extends keyof FormState>(
    field: K,
    value: FormState[K],
  ) {
    setFormData((currentData) => ({
      ...currentData,
      [field]: value,
    }));

    setErrorMessage("");
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const monthlyValue = Number(formData.monthlyValue);
    const billingDay = Number(formData.billingDay);
    const profiles = Number(formData.profiles);

    if (
      !formData.name.trim() ||
      !formData.category ||
      !formData.startDate ||
      !formData.accountEmail.trim()
    ) {
      setErrorMessage(
        "Preencha todos os campos obrigatórios.",
      );
      return;
    }

    if (monthlyValue <= 0) {
      setErrorMessage(
        "O valor mensal deve ser maior que zero.",
      );
      return;
    }

    if (billingDay < 1 || billingDay > 31) {
      setErrorMessage(
        "O dia da cobrança deve estar entre 1 e 31.",
      );
      return;
    }

    if (profiles < 1) {
      setErrorMessage(
        "A quantidade de perfis deve ser pelo menos 1.",
      );
      return;
    }

    onSubmit({
      name: formData.name.trim(),
      category: formData.category,
      plan: formData.plan.trim(),
      monthlyValue,
      startDate: formData.startDate,
      renewalType: formData.renewalType,
      paymentMethod: formData.paymentMethod,
      billingDay,
      accountEmail: formData.accountEmail.trim(),
      profiles,
      status: formData.status,
    });
  }

  return (
    <form
      className="subscription-form"
      onSubmit={handleSubmit}
    >
      <div className="subscription-form__grid">
        <div className="subscription-form__field">
          <label htmlFor="name">Nome do serviço</label>

          <input
            id="name"
            type="text"
            placeholder="Ex: Netflix, Adobe..."
            value={formData.name}
            onChange={(event) =>
              updateField("name", event.target.value)
            }
            required
          />
        </div>

        <div className="subscription-form__field">
          <label htmlFor="paymentMethod">
            Forma de pagamento
          </label>

          <select
            id="paymentMethod"
            value={formData.paymentMethod}
            onChange={(event) =>
              updateField(
                "paymentMethod",
                event.target.value as PaymentMethod,
              )
            }
          >
            {PAYMENT_METHODS.map((paymentMethod) => (
              <option
                key={paymentMethod}
                value={paymentMethod}
              >
                {paymentMethod}
              </option>
            ))}
          </select>
        </div>

        <div className="subscription-form__field">
          <label htmlFor="category">Categoria</label>

          <select
            id="category"
            value={formData.category}
            onChange={(event) =>
              updateField(
                "category",
                event.target.value as
                  | SubscriptionCategory
                  | "",
              )
            }
            required
          >
            <option value="">
              Selecione uma categoria
            </option>

            {SUBSCRIPTION_CATEGORIES.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        <div className="subscription-form__field">
          <label htmlFor="billingDay">
            Dia da cobrança
          </label>

          <input
            id="billingDay"
            type="number"
            min="1"
            max="31"
            placeholder="Ex: 15"
            value={formData.billingDay}
            onChange={(event) =>
              updateField(
                "billingDay",
                event.target.value,
              )
            }
            required
          />
        </div>

        <div className="subscription-form__row">
          <div className="subscription-form__field">
            <label htmlFor="plan">
              Plano (opcional)
            </label>

            <input
              id="plan"
              type="text"
              placeholder="Ex: Premium"
              value={formData.plan}
              onChange={(event) =>
                updateField("plan", event.target.value)
              }
            />
          </div>

          <div className="subscription-form__field">
            <label htmlFor="monthlyValue">
              Valor mensal
            </label>

            <input
              id="monthlyValue"
              type="number"
              min="0.01"
              step="0.01"
              placeholder="0,00"
              value={formData.monthlyValue}
              onChange={(event) =>
                updateField(
                  "monthlyValue",
                  event.target.value,
                )
              }
              required
            />
          </div>
        </div>

        <div className="subscription-form__field">
          <label htmlFor="accountEmail">
            E-mail da conta
          </label>

          <input
            id="accountEmail"
            type="email"
            placeholder="usuario@email.com"
            value={formData.accountEmail}
            onChange={(event) =>
              updateField(
                "accountEmail",
                event.target.value,
              )
            }
            required
          />
        </div>

        <div className="subscription-form__field">
          <label htmlFor="startDate">
            Data de início
          </label>

          <input
            id="startDate"
            type="date"
            value={formData.startDate}
            onChange={(event) =>
              updateField(
                "startDate",
                event.target.value,
              )
            }
            required
          />
        </div>

        <div className="subscription-form__field">
          <label htmlFor="profiles">
            Quantidade de perfis
          </label>

          <input
            id="profiles"
            type="number"
            min="1"
            value={formData.profiles}
            onChange={(event) =>
              updateField(
                "profiles",
                event.target.value,
              )
            }
            required
          />
        </div>

        <div className="subscription-form__field">
          <label htmlFor="renewalType">
            Tipo de renovação
          </label>

          <select
            id="renewalType"
            value={formData.renewalType}
            onChange={(event) =>
              updateField(
                "renewalType",
                event.target.value as RenewalType,
              )
            }
          >
            {RENEWAL_TYPES.map((renewalType) => (
              <option
                key={renewalType}
                value={renewalType}
              >
                {renewalType}
              </option>
            ))}
          </select>
        </div>

        <fieldset className="subscription-form__status">
          <legend>Status da assinatura</legend>

          <div className="subscription-form__status-options">
            {SUBSCRIPTION_STATUS.map((status) => (
              <label key={status}>
                <input
                  type="radio"
                  name="status"
                  value={status}
                  checked={formData.status === status}
                  onChange={() =>
                    updateField("status", status)
                  }
                />

                {status}
              </label>
            ))}
          </div>
        </fieldset>
      </div>

      {errorMessage && (
        <p className="subscription-form__error">
          {errorMessage}
        </p>
      )}

      <div className="subscription-form__actions">
        <button
          type="button"
          className="subscription-form__cancel"
          onClick={onCancel}
        >
          Cancelar
        </button>

        <button
          type="submit"
          className="subscription-form__submit"
        >
          {mode === "create"
            ? "Salvar Assinatura"
            : "Atualizar Assinatura"}
        </button>
      </div>
    </form>
  );
}

export default SubscriptionForm;
