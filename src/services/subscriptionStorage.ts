import type {
  Subscription,
  SubscriptionFormData,
} from "../types/subscription";

const STORAGE_KEY = "assina-facil:subscriptions";

function saveSubscriptions(
  subscriptions: Subscription[],
): void {
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(subscriptions),
  );
}

export function getSubscriptions(): Subscription[] {
  const storedData = localStorage.getItem(STORAGE_KEY);

  if (!storedData) {
    return [];
  }

  try {
    const parsedData: unknown = JSON.parse(storedData);

    if (!Array.isArray(parsedData)) {
      localStorage.removeItem(STORAGE_KEY);
      return [];
    }

    return parsedData as Subscription[];
  } catch {
    localStorage.removeItem(STORAGE_KEY);
    return [];
  }
}

export function getSubscriptionById(
  id: string,
): Subscription | undefined {
  const subscriptions = getSubscriptions();

  return subscriptions.find(
    (subscription) => subscription.id === id,
  );
}

export function createSubscription(
  data: SubscriptionFormData,
): Subscription {
  const subscriptions = getSubscriptions();
  const currentDate = new Date().toISOString();

  const newSubscription: Subscription = {
    ...data,
    id: crypto.randomUUID(),
    createdAt: currentDate,
    updatedAt: currentDate,
  };

  saveSubscriptions([
    ...subscriptions,
    newSubscription,
  ]);

  return newSubscription;
}

export function updateSubscription(
  id: string,
  data: SubscriptionFormData,
): Subscription | null {
  const subscriptions = getSubscriptions();

  const existingSubscription =
    subscriptions.find(
      (subscription) => subscription.id === id,
    );

  if (!existingSubscription) {
    return null;
  }

  const updatedSubscription: Subscription = {
    ...existingSubscription,
    ...data,
    id,
    updatedAt: new Date().toISOString(),
  };

  const updatedSubscriptions =
    subscriptions.map((subscription) =>
      subscription.id === id
        ? updatedSubscription
        : subscription,
    );

  saveSubscriptions(updatedSubscriptions);

  return updatedSubscription;
}

export function deleteSubscription(
  id: string,
): boolean {
  const subscriptions = getSubscriptions();

  const updatedSubscriptions =
    subscriptions.filter(
      (subscription) => subscription.id !== id,
    );

  if (
    updatedSubscriptions.length ===
    subscriptions.length
  ) {
    return false;
  }

  saveSubscriptions(updatedSubscriptions);

  return true;
}
