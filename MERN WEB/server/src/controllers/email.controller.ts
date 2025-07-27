import { Request, Response } from "express"
import { sendOverdueEmail } from "../utils/mailer"
import { logAudit } from "../utils/AuditLogger"

export const sendOverdueNotification = async (req: Request, res: Response) => {
  try {
    const { email, readerName, books } = req.body
    if (!email || !readerName || !books) return res.status(400).json({ error: "Missing fields" })

    await sendOverdueEmail(email, readerName, books)
    res.json({ success: true, message: "Email sent" })
    // Audit log for overdue notification
    await logAudit({
      req,
      action: "SEND_EMAIL",
      entity: "Overdue Notification",
      entityId: email, // Using email as identifier
      description: `Sent overdue notification to ${readerName} (${email}) for books: ${books.join(", ")}`,
    })

  } catch (err) {
    console.error(err)
    res.status(500).json({ error: "Failed to send email" })
  }
}
