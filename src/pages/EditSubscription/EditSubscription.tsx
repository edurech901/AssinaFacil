import { useNavigate, useParams } from "react-router-dom";

import SubscriptionForm from "../../components/SubscriptionForm/SubscriptionForm";

import {
  getSubscriptionById,
  updateSubscription,
} from "../../services/subscriptionStorage";

import type { SubscriptionFormData } from "../../types/subscription";

import "./EditSubscription.css";

function EditSubscription() {
  const navigate = useNavigate();
  const { id } = useParams();

  const subscription = id
    ? getSubscriptionById(id)
    : undefined;

  if (!subscription) {
    return (
      <section className="edit-subscription-page edit-subscription-page--empty">
        <h1>Assinatura não encontrada</h1>

        <p>
          O registro solicitado não existe ou foi removido.
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

  const subscriptionId = subscription.id;

  const initialData: SubscriptionFormData = {
    name: subscription.name,
    category: subscription.category,
    plan: subscription.plan,
    monthlyValue: subscription.monthlyValue,
    startDate: subscription.startDate,
    renewalType: subscription.renewalType,
    paymentMethod: subscription.paymentMethod,
    billingDay: subscription.billingDay,
    accountEmail: subscription.accountEmail,
    profiles: subscription.profiles,
    status: subscription.status,
  };

  function handleSubmit(data: SubscriptionFormData) {
    const updatedSubscription = updateSubscription(
      subscriptionId,
      data,
    );

    if (updatedSubscription) {
      navigate(`/subscriptions/${subscriptionId}`);
    }
  }

  function handleCancel() {
    navigate(`/subscriptions/${subscriptionId}`);
  }

  return (
    <section className="edit-subscription-page">
      <header className="edit-subscription-page__header">
        <h1>Editar Assinatura</h1>

        <p>Atualize as informações da sua conta.</p>
      </header>

      <SubscriptionForm
        mode="edit"
        initialData={initialData}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
      />
    </section>
  );
}

export default EditSubscription;
