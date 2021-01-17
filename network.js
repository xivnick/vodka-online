
let url = 'http://127.0.0.1:3333'
if(process.env.NODE_ENV === 'production'){
    url = 'http://158.247.222.204:3333'
}

module.exports = {
    url,
}