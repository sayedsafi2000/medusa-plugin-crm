import sgMail from "@sendgrid/mail"
import twilio from "twilio"

export type InjectedDependencies = {
  logger: any
}

interface EmailPayload {
  to: string
  subject: string
  html: string
}

interface SMSPayload {
  to: string
  body: string
}

interface WhatsAppPayload {
  to: string
  body: string
}

class CampaignService {
  private logger: any
  private sendgridClient: any
  private twilioClient: any

  constructor({ logger }: InjectedDependencies) {
    this.logger = logger

    // Initialize SendGrid
    if (process.env.SENDGRID_API_KEY) {
      sgMail.setApiKey(process.env.SENDGRID_API_KEY)
      this.sendgridClient = sgMail
    }

    // Initialize Twilio
    if (process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN) {
      this.twilioClient = twilio(
        process.env.TWILIO_ACCOUNT_SID,
        process.env.TWILIO_AUTH_TOKEN
      )
    }
  }

  async sendEmail(payload: EmailPayload): Promise<{ success: boolean; messageId?: string; error?: string }> {
    try {
      if (!this.sendgridClient) {
        throw new Error("SendGrid not configured. Set SENDGRID_API_KEY")
      }

      const msg = {
        to: payload.to,
        from: process.env.SENDGRID_FROM_EMAIL || "noreply@musafir.com",
        subject: payload.subject,
        html: payload.html,
      }

      const response = await this.sendgridClient.send(msg)
      this.logger.info(`[CRM] Email sent to ${payload.to}`)
      return { success: true, messageId: response[0].messageId }
    } catch (error: any) {
      this.logger.error(`[CRM] Failed to send email to ${payload.to}: ${error.message}`)
      return { success: false, error: error.message }
    }
  }

  async sendSMS(payload: SMSPayload): Promise<{ success: boolean; messageId?: string; error?: string }> {
    try {
      if (!this.twilioClient) {
        throw new Error("Twilio not configured")
      }

      const message = await this.twilioClient.messages.create({
        body: payload.body,
        from: process.env.TWILIO_PHONE_NUMBER,
        to: payload.to,
      })

      this.logger.info(`[CRM] SMS sent to ${payload.to} (SID: ${message.sid})`)
      return { success: true, messageId: message.sid }
    } catch (error: any) {
      this.logger.error(`[CRM] Failed to send SMS to ${payload.to}: ${error.message}`)
      return { success: false, error: error.message }
    }
  }

  async sendWhatsApp(payload: WhatsAppPayload): Promise<{ success: boolean; messageId?: string; error?: string }> {
    try {
      if (!this.twilioClient) {
        throw new Error("Twilio not configured")
      }

      const message = await this.twilioClient.messages.create({
        body: payload.body,
        from: `whatsapp:${process.env.TWILIO_WHATSAPP_NUMBER}`,
        to: `whatsapp:${payload.to}`,
      })

      this.logger.info(`[CRM] WhatsApp sent to ${payload.to} (SID: ${message.sid})`)
      return { success: true, messageId: message.sid }
    } catch (error: any) {
      this.logger.error(`[CRM] Failed to send WhatsApp to ${payload.to}: ${error.message}`)
      return { success: false, error: error.message }
    }
  }

  async sendBatch(
    channels: string[],
    recipients: string[],
    subject: string,
    body: string
  ): Promise<{ sent: number; failed: number; results: any[] }> {
    const results: any[] = []
    let sent = 0
    let failed = 0

    for (const recipient of recipients) {
      for (const channel of channels) {
        try {
          let result: any

          if (channel === "email") {
            result = await this.sendEmail({
              to: recipient,
              subject,
              html: body,
            })
          } else if (channel === "sms") {
            result = await this.sendSMS({
              to: recipient,
              body,
            })
          } else if (channel === "whatsapp") {
            result = await this.sendWhatsApp({
              to: recipient,
              body,
            })
          }

          if (result?.success) {
            sent++
          } else {
            failed++
          }

          results.push({
            channel,
            recipient,
            ...result,
          })
        } catch (error: any) {
          failed++
          results.push({
            channel,
            recipient,
            success: false,
            error: error.message,
          })
        }
      }
    }

    return { sent, failed, results }
  }
}

export default CampaignService
