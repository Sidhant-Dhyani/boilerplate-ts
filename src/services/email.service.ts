import nodemailer from "nodemailer";
import { env } from "../config/env";
import { ISendEmailOptions, ISendEmailResult } from "../interfaces";
import { AppError } from "../utils/AppError";

const createTransporter = () => {
  if (!env.SMTP_HOST || !env.EMAIL_FROM) {
    throw new AppError(
      "Email is not configured. Set SMTP_HOST and EMAIL_FROM in your environment.",
      500,
    );
  }

  return nodemailer.createTransport({
    host: env.SMTP_HOST,
    port: env.SMTP_PORT,
    secure: env.SMTP_SECURE,
    auth:
      env.SMTP_USER && env.SMTP_PASS
        ? {
            user: env.SMTP_USER,
            pass: env.SMTP_PASS,
          }
        : undefined,
  });
};

const sendEmail = async (
  options: ISendEmailOptions,
): Promise<ISendEmailResult> => {
  if (!options.to || !options.subject) {
    throw new AppError("Email 'to' and 'subject' are required", 400);
  }

  if (!options.text && !options.html) {
    throw new AppError("Provide either text or html email content", 400);
  }

  try {
    const transporter = createTransporter();
    const info = await transporter.sendMail({
      from: env.EMAIL_FROM,
      to: options.to,
      subject: options.subject,
      text: options.text,
      html: options.html,
      cc: options.cc,
      bcc: options.bcc,
      replyTo: options.replyTo,
    });

    return {
      messageId: info.messageId,
      accepted: info.accepted.map(String),
      rejected: info.rejected.map(String),
    };
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }

    throw new AppError("Failed to send email", 500);
  }
};

export const emailService = {
  sendEmail,
};
