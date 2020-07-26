import { createTransport } from 'nodemailer';
import { config } from 'dotenv';

config();

export default function sendMail({ userEmail, authCode  }: { userEmail: string, authCode: number[] }) {
    const transporter = createTransport({
        host: 'smtp-relay.sendinblue.com',
        port: 587,
        secure: false,
        auth: {
            user: process.env['SMTP_USER'],
            pass: process.env['SMTP_PASS']
        },
        tls: { rejectUnauthorized: false }
    });

    transporter.sendMail({
        sender:"API Compass Support",
        from: 'apicompass@support.com',
        to: userEmail,
        subject: 'Auth Code API Compass',
        html: `<h3 style="font-family: sans-serif;" >Your code: <strong>${authCode.join(' ')}</strong></h3>`
    });
}