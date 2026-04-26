import type { NotificationGateway, NotificationMessage } from "./NotificationGateway";

export class InMemoryNotificationGateway implements NotificationGateway {
  private readonly notifications: NotificationMessage[] = [];

  notify(message: NotificationMessage) {
    this.notifications.push(message);
  }

  getNotifications(): NotificationMessage[] {
    return [...this.notifications];
  }

  reset() {
    this.notifications.length = 0;
  }
}
