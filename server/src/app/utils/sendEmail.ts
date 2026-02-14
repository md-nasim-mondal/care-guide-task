/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */

// Transporter setup removed for mock
const transporter = null;

interface SendEmailOptions {
  to: string;
  subject: string;
  templateName: string;
  templateData?: Record<string, any>;
  attachments?: {
    filename: string;
    content: Buffer | string;
    contentType: string;
  }[];
}

export const sendEmail = async ({ to, subject }: SendEmailOptions) => {
  console.log(`[MOCK] Email sent to ${to} with subject: ${subject}`);
};
