import { MongoClient } from 'mongodb';

export function routes(app) {
  app.route('/gallery')
    .get(async (req, res) => {
      try {
        const db = await getDB('gallery');
        const data =  await db.collection("gallery").findOne({name: "main"});
        return res.json(data);
      } catch(e) {
        console.error(e);
      }
    })
    .post(async(req,res) => {
      const db = await getDB('gallery');
      const images = req.body.images;
      const collection =  await db.collection("gallery");
      await collection.updateOne({name: "main"}, {$set: {images}});
      return res.json({
        success: true
      })
  });
}

async function getDB(database: string) {
  let client;
  const connectionString = "mongodb://root:root@localhost:27017";
  client = await MongoClient.connect(connectionString, { useNewUrlParser: true });
  return client.db(database);
}
