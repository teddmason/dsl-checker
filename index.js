const schedule = require('node-schedule')
const http = require('http')
const { parse } = require('node-html-parser')
require('log-timestamp')

let goodEmails = 0
const maxGoodEmails = 5

console.log('Starting dsl-checker')

const nodemailer = require('nodemailer')

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.DC_SENDEREMAIL,
    pass: process.env.DC_SENDERPASSWORD
  }
})

const getExchangeDetails = (cb) => {
  const data = `URL=&SP_NAME=a%2520service%2520provider&TelNo=${process.env.DC_PHONE}&VERSION=56&MS=E&CAP=no&AEA=Y`

  const options = {
    hostname: 'www.dslchecker.bt.com',
    path: '/adsl/ADSLChecker.TelephoneNumberOutput',
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Content-Length': data.length
    }
  }

  const req = http.request(options, (res) => {
    console.log(`statusCode: ${res.statusCode}`)
    let data = ''
    res.on('data', (d) => {
      data += d
    })
    res.on('end', () => {
      cb(data)
    })
  })

  req.on('error', (error) => {
    console.error(error)
  })

  req.write(data)
  req.end()
}

schedule.scheduleJob('*/1 * * * *', () => {
  console.log('Checking exchange details...')
  getExchangeDetails((data) => {
    const root = parse(data, {
      lowerCaseTagName: true
    })
    root.removeWhitespace()
    const fttcA = root.firstChild.childNodes[7].childNodes[6].text
    const fttcB = root.firstChild.childNodes[8].childNodes[6].text
    console.log(`FTTC A: ${fttcA}`)
    console.log(`FTTC B: ${fttcB}`)
    const mailOptions = {
      from: process.env.DC_SENDEREMAIL
    }
    console.log(`Emails sent to main recipient: ${goodEmails}`)
    if (fttcA === 'Waiting list' && fttcB === 'Waiting list') {
      mailOptions.to = process.env.DC_SENDEREMAIL
      mailOptions.subject = 'No Fibre Available'
      mailOptions.text = `FTTC A: ${fttcA} \\n FTTC B: ${fttcB}`
    } else {
      mailOptions.to = process.env.DC_RECEIVEEMAIL
      mailOptions.subject = '!!!!!FTTC !== Waiting list!!!!!'
      mailOptions.text = `FTTC A: ${fttcA} \\n FTTC B: ${fttcB}`
      goodEmails = goodEmails + 1
    }
    if (goodEmails <= maxGoodEmails) {
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.log(error)
        } else {
          console.log('Email sent: ' + info.response)
        }
      })
    } else {
      console.log(`${maxGoodEmails} emails sent to recipient, no email to send, continue to run and log results only until manual reset`)
    }
  })
})
