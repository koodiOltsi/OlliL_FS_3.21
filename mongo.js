const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log('give password as argument')
  process.exit(1)
}

const password = process.argv[2]

const url = `mongodb+srv://olliloyttyniemi_db_user:${password}@cluster0.9avnjgk.mongodb.net/personApp?retryWrites=true&w=majority&appName=Cluster0`

mongoose.set('strictQuery', false)

// Add this BEFORE your MongoDB connection code
// Ilman tätä, Node.js saattaa käyttää IPv6-osoitteita, mikä voi aiheuttaa ongelmia joidenkin MongoDB-palvelimien kanssa. Tämä asetus pakottaa Node.js:n käyttämään IPv4-osoitteita.
const dns = require('dns')
dns.setServers(['8.8.8.8', '8.8.4.4']) // Google DNS

//mongoose.connect(url)
mongoose.connect(url, { family: 4 })

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
})

const Person = mongoose.model('Person', personSchema)

/*
 const person = new Person({
   name: 'Aku Ankka',
   number: '03-0303030',
 })
*/

if (process.argv.length < 4) {
  console.log('Phonebook:' )
  Person
    .find({}).then((persons) => {
      persons.forEach((person) => {
        console.log(person.name, person.number)
      })
      mongoose.connection.close()
    })
}

if (process.argv.length > 4) {
  const person = new Person({
    name: process.argv[3],
    number: process.argv[4],
  })

  person.save().then(() => {
    console.log('added', person.name, 'number', person.number, 'to phonebook')
    mongoose.connection.close()
  })
}



