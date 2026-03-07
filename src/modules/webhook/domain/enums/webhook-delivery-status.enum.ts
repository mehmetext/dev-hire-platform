export const WebhookDeliveryStatus = {
  PENDING: 'PENDING',
  SUCCESS: 'SUCCESS',
  FAILED: 'FAILED',
  RETRYING: 'RETRYING',
} as const;

export type WebhookDeliveryStatus =
  (typeof WebhookDeliveryStatus)[keyof typeof WebhookDeliveryStatus];
