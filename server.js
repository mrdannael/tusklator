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
\`/tusklate\` - tłumaczę Twoje zdanie na mój zaawansowany angielski.
\`/pics\` - pokażę Ci ciekawy obrazek.
`

slapp.message('help', ['mention', 'direct_mention', 'direct_message'], (msg) => {
    msg.say(HELP_TEXT)
})

slapp.command('/tusklate', (msg, text) => {
    let promises = text.split(" ").map((value) => {
        return translate(value.toLowerCase(), { from: 'pl', to: 'en' }).then(resp => resp.text.toLowerCase()).catch((err) => { console.log('Translate err', err)})
    })

    Promise.all(promises)
        .then(response => {
            msg.say(`${response.join(' ')} :tusk:`)
        })
        .catch(err => {
            console.log('All err', err)
            msg.say(`Niestety - Something is no yes :(`)
        })
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