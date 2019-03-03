import { MongoClient } from 'mongodb';
import { S3, Endpoint } from 'aws-sdk';
import * as multer from 'multer';
import * as multerS3 from 'multer-s3';

export function routes(app) {
  app.route('/gallery/:name')
    .get(async(req, res) => {
      try {
        const { name } = req.params;
        const db = await getDB('gallery');
        const data =  await db.collection("gallery").findOne({name});
        return res.json(data);
      } catch(e) {
        console.error(e);
      }
    })
    .post(async(req,res) => {
      console.log(req.params);
      console.log(req.body);
      const { name } = req.params;
      const db = await getDB('gallery');
      const images = req.body.images;
      const collection =  await db.collection("gallery");
      console.log(name, images);
      await collection.updateOne({name}, {$set: {images}});
      return res.json({
        success: true
      })
  });
  app.route('/gallery/:name/image')
    .put((req, res) => {
      const url = 'https://mmcdn.sfo2.digitaloceanspaces.com';
      const s3 = new S3({
        endpoint: 'sfo2.digitaloceanspaces.com',
        accessKeyId: "LEC6W5JKKKWPIDFBA3DT",
        secretAccessKey: "fdsF6INasmU96k2KvaWtxZ8L3L8JX7sxg09oH42w82Y"
      });

      // Change bucket property to your Space name
      const upload = multer({
        storage: multerS3({
          s3,
          bucket: 'mmcdn',
          acl: 'public-read',
          key: function (request, file, cb) {
            filename = file.originalname; // Could / Should replace with hashed name
            cb(null, file.originalname);
          }
        })
      }).array('files', 1);

      let filename;

      const uploadRes = upload(req, res, function (error) {
        if (error) {
          console.log(error);
          return res.status(500).json({ error: "Error Upload" });
        }
        return res.status(201).json({
          success: true,
          url: `${url}/${filename}`
        });
      });
    });
  app.route('/gallery/:name/imageTest')
    .put(async(req, res) => {
      const test = new Promise((resolve) => {
        setTimeout(resolve, 3000);
      });
      await test;
      res.json({
        success: true,
        url: `http://fakeimage/fake1`
      });
    });
  app.route('/health')
    .get((req,res) => res.send("I'm alive!"));
}

async function getDB(database: string) {
  let client;
  const connectionString = "mongodb://root:root@localhost:27017";
  client = await MongoClient.connect(connectionString, { useNewUrlParser: true });
  return client.db(database);
}
