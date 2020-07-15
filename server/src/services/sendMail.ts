import { createTransport } from 'nodemailer';
import { config } from 'dotenv';

config();

export default function sendMail({ userEmail  }: { userEmail: string }) {
    const authCode = [];

    for ( let x = 1; x <= 6; x++ ) {
        const randomNumber = Math.floor(Math.random() * 10);

        if (randomNumber === 10) {
            authCode.push(9)
            continue;
        }

        authCode.push(randomNumber);
    }

    const transporter = createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: {
            user: process.env['SMTP_USER'],
            pass: process.env['SMTP_PASS']
        },
        tls: { rejectUnauthorized: false }
    });

    transporter.sendMail({
        from: 'apicompass@support.com',
        to: userEmail,
        subject: 'Auth Code API Compass',
        html: `<h3 style="font-family: sans-serif;" >Your code: <strong>${authCode.join(' ')}</strong></h3>`
    });

    return authCode.join('');
}