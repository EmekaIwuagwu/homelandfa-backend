const { Resend } = require('resend');

const resend = new Resend(process.env.RESEND_API_KEY);

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@homelandfa.com';
const FROM_EMAIL = 'Acme <onboarding@resend.dev>'; // Default Resend sender for testing

const sendApplicationNotification = async (application) => {
    try {
        const { data, error } = await resend.emails.send({
            from: FROM_EMAIL,
            to: ADMIN_EMAIL,
            subject: `New Application Received: ${application.player_name}`,
            html: `
        <h2>New Player Application</h2>
        <p><strong>Name:</strong> ${application.player_name}</p>
        <p><strong>Program:</strong> ${application.preferred_program}</p>
        <p><strong>Age:</strong> ${new Date().getFullYear() - new Date(application.date_of_birth).getFullYear()}</p>
        <p><strong>Parent:</strong> ${application.parent_name} (${application.phone})</p>
        <br/>
        <p>Login to dashboard to view full details.</p>
      `
        });

        if (error) {
            console.error('Email Error:', error);
            return false;
        }
        return true;
    } catch (err) {
        console.error('Email Exception:', err);
        return false;
    }
};

const sendStatusUpdate = async (application, status) => {
    let subject = '';
    let message = '';

    switch (status) {
        case 'approved':
            subject = 'Application Approved - Homeland Football Academy';
            message = `<p>Congratulations! Your application for <strong>${application.player_name}</strong> has been approved.</p>`;
            break;
        case 'rejected':
            subject = 'Application Update - Homeland Football Academy';
            message = `<p>Thank you for your interest. Unfortunately, we cannot proceed with your application for <strong>${application.player_name}</strong> at this time.</p>`;
            break;
        case 'enrolled':
            subject = 'Enrollment Confirmed - Homeland Football Academy';
            message = `<p>Welcome to the team! <strong>${application.player_name}</strong> has been officially enrolled.</p>`;
            break;
        default:
            return;
    }

    try {
        const { data, error } = await resend.emails.send({
            from: FROM_EMAIL,
            to: application.email,
            subject: subject,
            html: `
        <h2>Application Status Update</h2>
        ${message}
        <br/>
        <p>Regards,<br/>Homeland Football Academy Team</p>
      `
        });

        if (error) console.error('Email Error:', error);
    } catch (err) {
        console.error('Email Exception:', err);
    }
};

module.exports = {
    sendApplicationNotification,
    sendStatusUpdate
};
