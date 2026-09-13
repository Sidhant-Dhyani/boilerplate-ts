export interface ISendEmailOptions {
  to: string | string[];
  subject: string;
  text?: string;
  html?: string;
  cc?: string | string[];
  bcc?: string | string[];
  replyTo?: string;
}

export interface ISendEmailResult {
  messageId: string;
  accepted: string[];
  rejected: string[];
}
