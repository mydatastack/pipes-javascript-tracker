const express = require('express')
const app = express()
const cors = require('cors')
const port = 8888
const bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.text())
app.use(cors())


app.post('/', (req, res) => console.log(req.headers, req.body) || res.status(200).send('success'))
app.listen(port, () => console.log(`Example app listening on port ${port}!`))
