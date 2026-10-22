import { logAsError, logAsInfo, getEnvValue } from "utils";
import { serve } from "deno";
import { checkAuthForEdgeFunction } from "services/auth.ts";
import {
  readMessageFromQueue,
  deleteMessageFromQueue,
  getUserTableData,
} from "services/supabase.ts";
import { sendEmail } from "services/emails.ts";
import { templateObject } from "templates/email.ts";

serve(async (req) => {
  const apiKey = req.headers.get("X-EDGE-FUNCTION-API-KEY");

  const requestId = crypto.randomUUID();
  if (!checkAuthForEdgeFunction(apiKey)) {
    logAsError({ message: "Authentication error encountered" }, requestId);
    return new Response("Error encountered", { status: 500 });
  }

  logAsInfo({ message: "Processing email webhook" }, requestId);

  try {
    const queueName = "send-email-queue";
    const visibilityTimeout = 15; // Visibility timeout in seconds
    const messageCount = 1; // Number of messages to retrieve

    const { data: messages, error: readError } = await readMessageFromQueue(
      queueName,
      messageCount,
      visibilityTimeout,
    );

    if (readError) {
      throw new Error(
        `Error reading messages from queue: ${readError.message}`,
      );
    }

    if (!messages || messages.length === 0) {
      logAsInfo({ message: "No messages in the queue." }, requestId);
      return new Response("Email webhook processed", { status: 200 });
    }

    const fromEmail = getEnvValue("WELCOME_FROM_EMAIL");

    for (const message of messages) {
      try {
        // Process the message
        logAsInfo(
          { message: `Processing message`, payload: message },
          requestId,
        );

        const payload = message.message;

        const template = templateObject.find(
          (template: any) => template.type === payload.type,
        );

        const { data, error: userError } = await getUserTableData(
          payload.userId,
        );

        if (userError) {
          throw new Error(
            `Unable to fetch data for user with id: ${payload.userId}`,
          );
        }
        const subject = template.getSubject();
        const htmlContent = template.getTemplate({ name: data.name });

        // Send the email using Resend
        const { error } = await sendEmail(
          fromEmail,
          [data.email],
          subject,
          htmlContent,
          `${payload.type}/${message.msg_id}`,
        );

        if (error) {
          throw new Error(
            `Error while sending email through resend api: ${error.message}`,
          );
        }

        logAsInfo({ message: "Email sent successfully." }, requestId);

        // After successful processing, delete the message from the queue
        const { error: deleteError } = await deleteMessageFromQueue(
          queueName,
          message.msg_id,
        );

        if (deleteError) {
          throw new Error(
            `Error deleting message from queue: ${deleteError.message}`,
          );
        }
        logAsInfo({ message: "Message deleted from the queue." }, requestId);
      } catch (processingError) {
        logAsError(
          { message: "Error processing message", processingError },
          requestId,
        );
        // Optionally, implement retry logic or move the message to a dead-letter queue
      }
    }

    return new Response("Email webhook processed", { status: 200 });
  } catch (err: any) {
    logAsError(
      { message: "Error encountered", error: err.message ?? err },
      requestId,
    );
    return new Response("Error encountered", { status: 500 });
  }
});
