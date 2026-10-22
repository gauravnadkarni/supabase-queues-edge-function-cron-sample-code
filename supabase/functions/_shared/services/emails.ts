import { Resend } from "resendLib";
import { getEnvValue } from "utils";

const resendApiKey = getEnvValue("RESEND_API_KEY")!;

const resend = new Resend(resendApiKey);

export const sendEmail = async (
  from: string,
  to: Array<string>,
  subject: string,
  html: string,
  uniqueId: string,
) =>
  resend.emails.send(
    {
      from,
      to,
      subject,
      html,
    },
    {
      idempotencyKey: uniqueId,
    },
  );
