const { MongoClient } = require('mongodb');

// Prepare statement
const query = { username: req.params.username };
const projection = { _id: 0, username: 1, email: 1 };
const options = { collation: { locale: 'en', strength: 2 } };

// Use prepared statement in MongoDB query
const client = await MongoClient.connect(uri, { useNewUrlParser: true });
const collection = client.db('mydb').collection('users');
const result = await collection.findOne(query, projection, options);
