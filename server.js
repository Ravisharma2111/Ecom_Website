const express = require("express");
const cors = require("cors");
const { v4: uuidv4 } = require("uuid");
const stripe = require("stripe")(
  "sk_test_51MwfEtSE5DfloJ5OnmmppIpuLVGfsOVrwVGEdJ0Znamosat5eego5YgELW04wlQfHHMvz8qs86zgy1pQTnXcezMw00Pltm3jae"
);

const app = express();
app.use(cors());

app.use(express.json());

app.get("/home",(req,res) => {
  res.send("Welcome to Online E-Kart");
});
// app.post("/checkout",async (req,res) => {
//   console.log("reqqqqqqqqqq",req)
//   let error;
//   let status;
//   try {

//     const { cart,token } = req.body;
//     console.log("cart",cart + "token",)
//     const customer = await stripe.customers.create({
//       email: token.email,
//       source: token.id,
//     });
//     const key = uuidv4();
//     const charge = await stripe.charges.create(
//       {
//         amount: cart.price * 100,
//         currency: "usd",
//         customer: customer.id,
//         receipt_email: token.email,
//         description: "products description here",
//         shipping: {
//           name: token.card.name,
//           address: {
//             line1: token.card.address_line1,
//             line2: token.card.address_line2,
//             city: token.card.address_city,
//             country: token.card.address_country,
//             postal_code: token.card.address_zip,
//           },
//         },
//       },
//       { idempotencyKey: key });
//     status = "success";
//   } catch (error) {
//     console.log(error);
//     status = "error";
//   }
//   res.json({ status });
// });


app.post("/checkout",async (req,res) => {
  // console.log("checkout ",req.body);

  const { token,item } = req.body;
  let priceDataList = item.reduce((total,mydata) =>total +  mydata.quantity * (mydata.price -(mydata.price * mydata.discountPercentage) / 100).toFixed(0),0 )
  console.log("reqqqqqq",priceDataList)
  const customer = await stripe.customers.create({
    email: token.email,
    source: token.id,
  });

  stripe.paymentIntents
    .create({
      payment_method_types: ["card"],
      amount: priceDataList * 100, // Charging Rs 25
      description: "products description here",
      currency: "usd",
      customer: customer.id,
      shipping: {
        name: token.card.name,
        address: {
          line1: token.card.address_line1,
          line2: token.card.address_line2,
          city: token.card.address_city,
          country: token.card.address_country,
          postal_code: token.card.address_zip,
        },
      },

    })
    .then((charge) => {
      console.log('ssssssp',item)
      res.status(200).send({ item });
    })
    .catch((err) => {
      console.log('ssssssf',err)
      res.send(err);
    });
});

app.listen(8080,() => {
  console.log("Your APP IS RUNNING ON PORT 8081");
});
