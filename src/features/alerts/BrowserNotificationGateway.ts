import type { NotificationGateway, NotificationMessage } from "./NotificationGateway";

export class BrowserNotificationGateway implements NotificationGateway {
  async notify(message: NotificationMessage): Promise<void> {
    if (typeof Notification === "undefined") {
      return;
    }

    if (Notification.permission === "default") {
      await Notification.requestPermission();
    }

    if (Notification.permission !== "granted") {
      return;
    }

    new Notification(message.title, {
      body: message.body,
      tag: message.kind,
    });
  }
}
