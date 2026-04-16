import type { AlertKind } from "./AlertEngine";

export type NotificationMessage = {
  kind: AlertKind;
  title: string;
  body: string;
};

export interface NotificationGateway {
  notify(message: NotificationMessage): Promise<void> | void;
}
