import nodemailer from 'nodemailer' 
import { nodemailerMjmlPlugin } from "nodemailer-mjml";
import { fileURLToPath } from 'url';
import path , { join } from "path";


export const sendEmail = async(options) => {
    const attachments= [
        {
            filename: 'logo.png',
            path: './mail/mailTemplates/logo.png',
            cid: 'logo' //same cid value as in the html img src
        },
        {
            filename: 'logo.png',
            path: './mail/mailTemplates/logo-xl.png',
            cid: 'logo-xl' //same cid value as in the html img src
        }
      
    ]

    if(options.hasOwnProperty('attachments')){
        options.attachments.map((attachment) => attachments.push(attachment));
    }

    const transporter = nodemailer.createTransport({
        service : "hotmail",
        auth : {
            user : process.env.EMAIL,
            pass : process.env.EMAIL_PASS
        }   
    })
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    transporter.use('compile', nodemailerMjmlPlugin({ templateFolder: join(__dirname, "mailTemplates") }))
    
    try {
        transporter.sendMail({...options, attachments}, (error, info) =>{
            if(error) return ({"ERROR":error})
            else return ({ message: "Enviando correo de recuperación" });
        })
    } catch (error) {
        return ({"ERROR":error});
    }
}