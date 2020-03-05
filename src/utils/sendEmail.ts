import Mailgun from "mailgun-js";

const mailGunClient = new Mailgun({
    apiKey: process.env.MAILGUN_API_KEY||'',
    domain:"sandboxac86c9122c4242429e531947a8769fd1.mailgun.org"
});

//to: string으로 parameter를 넣고
//sendEmail(User.email)이런식으로 하면 상대한테 보내는게 가능
//지금은 무료계정이라 상대한테보내는게 안댐
const sendEmail = (subject:string, html:string) =>{
    const emailData = {
        from:"psh090953@gmail.com",
        to:"psh090953@gmail.com",
        subject,
        html
    };
    return mailGunClient.messages().send(emailData);
};

export const sendVerificationEmail = (fullName:string, key:string) =>{
    const emailSubject = `Hello! ${fullName}, please verify your email`;
    const emailBody = `Verify your email by clicking <a href="http://nuber.com/verification/${key}/">here</a>`;
    return sendEmail(emailSubject,emailBody);
};
