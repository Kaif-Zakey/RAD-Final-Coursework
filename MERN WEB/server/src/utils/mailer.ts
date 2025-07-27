// src/utils/mailer.ts
import nodemailer from "nodemailer"
import dotenv from 'dotenv';


dotenv.config();


export const transporter = nodemailer.createTransport({
  service: "gmail", // or use SendGrid SMTP
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
})

export const sendOverdueEmail = async (
  to: string,
  readerName: string,
  books: { title: string; dueDate: Date }[]
) => {
  const bookList = books
    .map((b) => `- ${b.title} (Due: ${new Date(b.dueDate).toLocaleDateString()})`)
    .join("\n")

  const message = {
    from: `"Book Club Library" <${process.env.EMAIL_USER}>`,
    to,
    subject: "Overdue Book Reminder",
    text: `Dear ${readerName},\n\nYou have overdue books:\n${bookList}\n\nPlease return them.\n\nThank you.`,
  }

  await transporter.sendMail(message)
}


// Send any custom email
export const sendEmail = async (to: string, subject: string, html: string) => {
  const message = {
    from: `"Book Club Library" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    html,
  };

  await transporter.sendMail(message);
};
