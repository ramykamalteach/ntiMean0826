const express = require('express')
const app = express()
const path = require('path')

app.use(express.static(path.join(__dirname, "public")))

app.get('/', (req, res) => {
    res.send('<h1>Hello World!</h1>')
})
app.get('/nti', (req, res) => {
    res.send('welcome in NTI')
})

app.get('/about', (req, res) => {
    res.sendFile(path.join(__dirname, '/contacts.html'));
})

const port = 3000
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})
