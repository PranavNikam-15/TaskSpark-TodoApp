require('dotenv').config();
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS // App Password
    }
});

const sendMail = async (to, subject, task) => {
    // Build HTML table
    let htmlContent = `
        <h2 style="color: #4CAF50;">New Task Created ✔️</h2>
        <table border="1" cellpadding="10" cellspacing="0" style="border-collapse: collapse; font-family: Arial, sans-serif;">
            <thead>
                <tr style="background-color: #f2f2f2;">
                    <th>Title</th>
                    <th>Description</th>
                    <th>Start Date</th>
                    <th>Due Date</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>${task.title}</td>
                    <td>${task.description}</td>
                    <td>${task.start_date}</td>
                    <td>${task.due_date}</td>
                </tr>
            </tbody>
        </table>

        <br><br>
        Thank you for using <strong>TaskSpark</strong>! 🚀 <br>
        Stay focused, stay sharp - TaskSpark is with you! <br><br>
        Best regards,<br>
        Team TaskSpark
    `;

    try {
        let info = await transporter.sendMail({
            from: `"TaskSpark" <${process.env.EMAIL_USER}>`,
            to: to,
            subject: subject,
            html: htmlContent
        });
        console.log('Email sent: ' + info.response);
    } catch (err) {
        console.error('Error sending email:', err);
    }
};

module.exports = sendMail;