import { useNavigate } from "react-router-dom";
import SubscriptionForm from "../../components/SubscriptionForm/SubscriptionForm";
import { createSubscription } from "../../services/subscriptionStorage";
import type { SubscriptionFormData } from "../../types/subscription";

import "./NewSubscription.css";

function NewSubscription() {
  const navigate = useNavigate();

  function handleSubmit(data: SubscriptionFormData) {
    createSubscription(data);
    navigate("/subscriptions");
  }

  function handleCancel() {
    navigate("/subscriptions");
  }

  return (
    <section className="new-subscription-page">
      <header className="new-subscription-page__header">
        <h1>Adicionar Nova Assinatura</h1>

        <p>
          Insira os detalhes técnicos para gerenciar seu novo
          serviço recorrente.
        </p>
      </header>

      <SubscriptionForm
        mode="create"
        onSubmit={handleSubmit}
        onCancel={handleCancel}
      />
    </section>
  );
}

export default NewSubscription;
