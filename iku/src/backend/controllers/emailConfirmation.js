// Import nodemail transporter
import transporter from "../config/email.js";

// Import function from email confirmation Model
import { createEmailConfirmation, findEmailConfirmation, deleteEmailConfirmation } from "../models/emailConfirmationModel.js";

// Create a new email confirmation with data
export const addEmailConfirmation = (req, res) => {
    const data = req.body;

    // Add a code
    data.code = "";
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    for (let i = 0; i < 6; i++) {
        data.code += characters.charAt(Math.floor(Math.random() * 6));
    }

    createEmailConfirmation(data, (err, results) => {
        if (err){
            res.send(err);
        }else{
            res.json(results);

            // If Successful, send email to User
            const mailData = {
                from: 'iku.soen490@gmail.com',  // sender address
                to: data.email,   // list of receivers
                subject: 'Iku Email Confirmation',
                text: '',
                html: `<b>A request to create an Iku account was done using your email</b><br>Please confirm using this code: ${data.code}`,
            };

            transporter.sendMail(mailData, function (err, info) {
                if(err)
                    console.log(err);
                else
                    console.log(info);
            });
        }
    });
}

// Attempt to get email confirmation data by email and code
export const getEmailConfirmation = (req, res) => {
    const data = req.body;
    findEmailConfirmation(data, (err, results) => {
        if (err){
            res.send(err);
        }else{
            res.json(results);
        }
    });
}

// Remove an email confirmation by _id
export const removeEmailConfirmation = (req, res) => {
    const data = req.body;
    deleteEmailConfirmation(data._id, (err, results) => {
        if (err){
            res.send(err);
        }else{
            res.json(results);
        }
    });
}