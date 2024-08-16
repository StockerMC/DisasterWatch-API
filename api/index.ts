const fs = require('fs');
const path = require('path')
const admin = require("firebase-admin");
const express = require('express')
const cors = require("cors");

const app = express()

app.use(express.json());
app.use(cors());

const serviceAccount = require("../serviceAccountKey.json");

// Initialize Firebase
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

// Partial Push Notification
async function sendPartialNotification(token, data) {
  return admin.messaging().send({
    token,
    data: {
      type: "partial_notification",
      notifee: JSON.stringify({
        body: data,
        android: {
          channelId: "default",
        },
      }),
    },
  });
}

// Declare a notification route
app.post("/notifications", async (req, res) => {
  const data = req.body;
  console.log(data);
  await sendPartialNotification(data.token, data);
  res.json({status: "OK"});
});

app.get("/", async (req, res) => {
  res.send("OK");
});

// Run the server
const port = 4321
app.listen(port, () => {
  console.log(`listening on port ${port}`)
})

module.exports = app;
