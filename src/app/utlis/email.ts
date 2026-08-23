// /* eslint-disable @typescript-eslint/no-explicit-any */
// import nodemailer from 'nodemailer'
// import { envVars } from '../config/env';

// const transporter = nodemailer.createTransport({
//   host: envVars.EMAIL_SENDER.SMTP_HOST,
  
//   secure: true, // use STARTTLS (upgrade connection to TLS after connecting)
//   auth: {
//     user: envVars.EMAIL_SENDER.SMTP_USER,
//     pass: envVars.EMAIL_SENDER.SMTP_PASS,
//   },
//   port: Number(envVars.EMAIL_SENDER.SMTP_PORT),
// });

// interface SendEmailOptions {
//     to: string;
//     subject: string;
//     templateName: string;
//     templateData: Record<string, any>;
//     attachments?: {
//         filename: string;
//         content: Buffer | string;
//         contentType: string;
//     }[]
// }