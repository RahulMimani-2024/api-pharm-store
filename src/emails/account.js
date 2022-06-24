const nodemailer = require('nodemailer');
const {google} = require('googleapis');

const client_id = process.env.CLIENT_ID;
const client_secret = process.env.CLIENT_SECRET;
const refresh_token = process.env.REFRESH_TOKEN;
const redirect_uri = process.env.REDIRECT_URI;


const oAuth2Client = new google.auth.OAuth2(client_id,client_secret,redirect_uri);
oAuth2Client.setCredentials({
    refresh_token
})
const deleteAccount = async ({email,name}={}) =>{
    try{
        const access_token  = await oAuth2Client.getAccessToken();
        const transport = nodemailer.createTransport({
            service : 'gmail',
            auth :{
                type : 'oauth2',
                user  : process.env.MY_MAIL,
                clientId : client_id,
                clientSecret : client_secret,
                refreshToken : refresh_token,
                accessToken : access_token
            }
        })
        const mailOptions ={
            from : 'Rahul Mimani <process.env.MY_MAIL>',
            to : email.toString(),
            subject : 'Task App',
            text : `Thanks for using our services . ${name} don't forgot to give us your valuable feedback`,
        }
        const result = transport.sendMail(mailOptions);
    }catch(e){
        console.log(e);
    }
}


const sendWelcomeMail = async ({email,name}={}) => {
    try{
        const access_token  = await oAuth2Client.getAccessToken();
        const transport = nodemailer.createTransport({
            service : 'gmail',
            auth :{
                type : 'oauth2',
                user  : process.env.MY_MAIL,
                clientId : client_id,
                clientSecret : client_secret,
                refreshToken : refresh_token,
                accessToken : access_token
            }
        })


        const mailOptions ={
            from : 'Rahul Mimani <process.env.MY_MAIL>',
            to : email.toString(),
            subject : 'Task App',
            text : `Hello ${name} . Thanks for connecting to Task app`,
        }
        const result = transport.sendMail(mailOptions);
    }catch(e){
        // return console.log(e);
    }
}

module.exports = {
    sendWelcomeMail,
    deleteAccount
};