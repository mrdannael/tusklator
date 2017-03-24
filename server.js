'use strict'

const express = require('express')
const translate = require('google-translate-api')
const Slapp = require('slapp')
const ConvoStore = require('slapp-convo-beepboop')
const Context = require('slapp-context-beepboop')

var slapp = Slapp({
    verify_token: process.env.SLACK_VERIFY_TOKEN,
    convo_store: ConvoStore(),
    context: Context(),
})

var HELP_TEXT = `
Oto lista rzeczy, które potrafię:
\`help\` - wyświetla tą wiadomość.
\`tusklate\` - tłumaczę Twoje zdanie na mój zaawansowany angielski.
\`pics\` - pokażę Ci ciekawy obrazek.
`

slapp.message('(.*)', ['mention', 'direct_message'], (msg) => {
    console.log('message')
    msg.say(HELP_TEXT)
})

var app = slapp.attachToExpress(express())

app.get('/', (req, res) => {
    res.send('Hello! I\'m Tusklator!')
})

app.listen(process.env.PORT, (err) => {
  if (err) {
    return console.error(err)
  }

  console.log(`Listening on port ${process.env.PORT}`)
})