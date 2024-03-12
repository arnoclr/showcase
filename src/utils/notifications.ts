import { deleteToken, getToken } from "firebase/messaging";
import { messaging } from "../firebase";

const VAPID_KEY =
  "BIJf564X3t7wur264Hj_A8eWLVw3-CNSbLZVp086Pdg_yjGd2Mb4HBPk-aVe7MUazNVp1OWbvZcP_FRyk767jeM";

function notificationsAreSupported() {
  return (
    "Notification" in window &&
    "serviceWorker" in navigator &&
    "PushManager" in window
  );
}

function navigatorIsSubscribed(): boolean {
  return (
    localStorage.getItem(VAPID_KEY) === "1" && notificationPermissionIsGranted()
  );
}

function notificationPermissionIsGranted(): boolean {
  return Notification.permission === "granted";
}

async function requestNotificationPermission(): Promise<NotificationPermission> {
  return await Notification.requestPermission();
}

async function subscribe(): Promise<void> {
  if (!notificationsAreSupported() || !messaging) {
    throw new Error(
      "Les notifications ne sont pas supportées sur votre navigateur."
    );
  }

  await requestNotificationPermission();

  if (!notificationPermissionIsGranted()) {
    throw new Error("Vous avez refusé les notifications.");
  }

  const token = await getToken(messaging, {
    vapidKey: VAPID_KEY,
  });

  if (token) {
    localStorage.setItem(VAPID_KEY, "1");

    try {
      const sampleNotification = new Notification("Parfait !", {
        body: "Vous recevrez une notification comme celle-ci lorsque des nouveautés seront ajoutées sur mon portfolio.",
      });

      setTimeout(() => {
        sampleNotification.close();
      }, 6000);
    } catch (e) {}
  } else {
    throw new Error(
      "Impossible de s'abonner aux notifications. Réessayez plus tard."
    );
  }
}

async function unsubscribe(): Promise<void> {
  if (messaging === null) {
    return;
  }
  await deleteToken(messaging);
  localStorage.removeItem(VAPID_KEY);
}

export {
  subscribe,
  unsubscribe,
  navigatorIsSubscribed,
  notificationsAreSupported,
};
