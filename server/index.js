const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const Connection = require("./Database/Connection");
const ProductData = require("./Schema/ProductData");
const app = express();
app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

const PORT = 4001;
Connection();

app.post("/getData", async (req, res) => {
  const months = req.body.months;
  try {
    let data = await ProductData.find().lean();
    // Filter data where the month is March (3)
    data = data.filter((item) => {
      return new Date(item.dateOfSale).getMonth() + 1 === months; // Month is 0-indexed, so March is 2
    });
    // Sort the filtered data by dateOfSale
    data.sort((a, b) => new Date(a.dateOfSale) - new Date(b.dateOfSale));

    // console.log(data.length);
    console.log(data);
    res.send(data);
  } catch (error) {
    console.log("Error fetching Product data:", error);
    res.status(500).send("Error fetching Product data");
  }
});

app.listen(PORT, () => {
  console.log(`Server is runing on port ${PORT} `);
});
