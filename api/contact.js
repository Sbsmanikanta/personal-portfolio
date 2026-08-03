const nodemailer = require('nodemailer')
const querystring = require('querystring')

function readPayload(req){
    if(req.body && typeof req.body === 'object' && !Buffer.isBuffer(req.body)){
        return req.body
    }

    const rawBody = typeof req.body === 'string' ? req.body : ''
    const contentType = (req.headers['content-type'] || '').toLowerCase()

    if(contentType.includes('application/json')){
        try{
            return JSON.parse(rawBody)
        }catch(error){
            return {}
        }
    }

    return querystring.parse(rawBody)
}

module.exports = async (req, res) => {
    if(req.method === 'OPTIONS'){
        res.setHeader('Allow', 'GET,POST,OPTIONS')
        return res.status(204).end()
    }

    if(req.method === 'GET'){
        return res.status(200).json({
            ok: true,
            message: 'Contact API is ready. Send a POST request with name, email, and message.'
        })
    }

    if(req.method !== 'POST'){
        res.setHeader('Allow', 'GET,POST,OPTIONS')
        return res.status(405).json({ error: 'Method not allowed' })
    }

    const body = readPayload(req)
    const name = String(body.name || '').trim()
    const email = String(body.email || '').trim()
    const message = String(body.message || '').trim()

    if(!name || !email || !message){
        return res.status(400).json({ error: 'Please fill in your name, email, and message.' })
    }

    const smtpHost = process.env.SMTP_HOST
    const smtpPort = Number(process.env.SMTP_PORT || 587)
    const smtpUser = process.env.SMTP_USER
    const smtpPass = process.env.SMTP_PASS
    const recipient = process.env.CONTACT_TO_EMAIL || 'manikantasodapaneedi27@gmail.com'
    const sender = process.env.CONTACT_FROM_EMAIL || smtpUser
    const useSecure = String(process.env.SMTP_SECURE || '').toLowerCase() === 'true' || smtpPort === 465

    if(!smtpHost || !smtpUser || !smtpPass || !sender){
        return res.status(500).json({
            error: 'Email service is not configured. Add SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, and CONTACT_FROM_EMAIL in Vercel.'
        })
    }

    const transporter = nodemailer.createTransport({
        host: smtpHost,
        port: smtpPort,
        secure: useSecure,
        auth: {
            user: smtpUser,
            pass: smtpPass,
        },
    })

    try{
        await transporter.sendMail({
            from: sender,
            to: recipient,
            replyTo: email,
            subject: `Portfolio Contact from ${name}`,
            text: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
        })

        return res.status(200).json({ message: 'Thanks! Your message has been sent.' })
    }catch(error){
        return res.status(500).json({ error: 'Unable to send message. Check your SMTP settings.' })
    }
}
