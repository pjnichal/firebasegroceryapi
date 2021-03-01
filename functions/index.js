const functions = require("firebase-functions");
const admin = require("firebase-admin");

var serviceAccount = require("./permission.json");
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "Your DATABASE URL",
  storageBucket: "Your STORAGEBUKET URL",
});

const express = require("express");
const app = express();
const db = admin.firestore();
const cors = require("cors");
const { config } = require("firebase-functions");
app.use(cors({ origin: true }));

//Create
//Create User
app.post("/api/create", (req, res) => {
  (async () => {
    try {
      await db
        .collection("users")
        .doc("/" + req.body.id + "/")
        .create({
          full_name: req.body.full_name,
          mobile: req.body.mobile,
          address_l1: req.body.address_l1,
          address_l2: req.body.address_l2,
          town: req.body.town,
          city: req.body.city,
          state: req.body.state,
          pin_code: req.body.pin_code,
          description: req.body.description,
          price: req.body.price,
        });
      return res.status(200).send();
    } catch (error) {
      console.log(error);
      return res.status(500).send(error);
    }
  })();
});

//Create Products
app.post("/api/createproduct", (req, res) => {
  (async () => {
    try {
      await db.collection("products").doc().create({
        name: req.body.name,
        description: req.body.description,
        imageUrl: req.body.imageUrl,
        price: req.body.price,
      });
      return res.status(200).send();
    } catch (error) {
      console.log(error);
      return res.status(500).send(error);
    }
  })();
});

//Read
//Read User With User Id
app.get("/api/read/:id", (req, res) => {
  (async () => {
    try {
      const document = db.collection("users").doc(req.params.id);
      let user = await document.get();
      let response = user.data();
      return res.status(200).send(response);
    } catch (error) {
      console.log(error);
      return res.status(500).send(error);
    }
  })();
});
//Read All Product
app.get("/api/readproduct", (req, res) => {
  (async () => {
    try {
      let query = db.collection("products");
      let response = [];
      await query.get().then((querySnapshot) => {
        let docs = querySnapshot.docs;
        for (let doc of docs) {
          const selectedItem = {
            id: doc.id,
            name: doc.data().name,
            description: doc.data().description,
            imageUrl: doc.data().imageUrl,
            price: doc.data().price,
          };
          response.push(selectedItem);
        }
        return res.status(200).send(response);
      });
      return response;
    } catch (error) {
      console.log(error);
      return res.status(500).send(error);
    }
  })();
});

//Update

//Delete

//Rexport the api to Firebase
exports.app = functions.https.onRequest(app);
