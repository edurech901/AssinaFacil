import { initialSubscriptions } from "../data/initialSubscriptions";
import type {
  Subscription,
  SubscriptionFormData,
} from "../types/subscription";

const STORAGE_KEY = "assina-facil:subscriptions";

function saveSubscriptions(subscriptions: Subscription[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(subscriptions));
}

function createInitialData(): Subscription[] {
  return initialSubscriptions.map((subscription) => ({
    ...subscription,
  }));
}

export function getSubscriptions(): Subscription[] {
  const storedData = localStorage.getItem(STORAGE_KEY);

  if (!storedData) {
    const initialData = createInitialData();
    saveSubscriptions(initialData);

    return initialData;
  }

  try {
    const subscriptions = JSON.parse(storedData);

    if (!Array.isArray(subscriptions)) {
      throw new Error("Dados de assinaturas inválidos.");
    }

    return subscriptions as Subscription[];
  } catch {
    const initialData = createInitialData();
    saveSubscriptions(initialData);

    return initialData;
  }
}

export function getSubscriptionById(
  id: string,
): Subscription | undefined {
  return getSubscriptions().find(
    (subscription) => subscription.id === id,
  );
}

export function createSubscription(
  data: SubscriptionFormData,
): Subscription {
  const now = new Date().toISOString();

  const newSubscription: Subscription = {
    ...data,
    id: crypto.randomUUID(),
    createdAt: now,
    updatedAt: now,
  };

  const subscriptions = getSubscriptions();

  saveSubscriptions([...subscriptions, newSubscription]);

  return newSubscription;
}

export function updateSubscription(
  id: string,
  data: SubscriptionFormData,
): Subscription | null {
  const subscriptions = getSubscriptions();
  const subscriptionIndex = subscriptions.findIndex(
    (subscription) => subscription.id === id,
  );

  if (subscriptionIndex === -1) {
    return null;
  }

  const updatedSubscription: Subscription = {
    ...subscriptions[subscriptionIndex],
    ...data,
    id,
    updatedAt: new Date().toISOString(),
  };

  subscriptions[subscriptionIndex] = updatedSubscription;
  saveSubscriptions(subscriptions);

  return updatedSubscription;
}

export function deleteSubscription(id: string): boolean {
  const subscriptions = getSubscriptions();

  const updatedSubscriptions = subscriptions.filter(
    (subscription) => subscription.id !== id,
  );

  if (updatedSubscriptions.length === subscriptions.length) {
    return false;
  }

  saveSubscriptions(updatedSubscriptions);

  return true;
}
