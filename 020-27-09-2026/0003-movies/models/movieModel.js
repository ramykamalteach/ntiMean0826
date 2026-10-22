const { MongoClient, ObjectId, mongoConnection } = require('./mongodbConnection');

async function index() {
    const client = await MongoClient.connect(mongoConnection);
    const db = client.db();
    const movies = await db.collection("movies").find().sort({ year: -1 }).limit(20).toArray();
    client.close();
    return movies;
}

async function moviesSearch(partOfMovieTitle) {
    const client = await MongoClient.connect(mongoConnection);
    const db = client.db();
    const movies = await db.collection("movies").find({ title: { $regex: partOfMovieTitle, $options: 'i' } }).sort({ year: -1 }).limit(20).toArray();
    client.close();
    return movies;
}

module.exports = {
    index,
    moviesSearch,
}