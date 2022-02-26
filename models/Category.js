const mongoose = require("mongoose")
const Schema = mongoose.Schema;

//create a new Collection
const categories = new Schema({
      name: {
            type: String,
            required: true
      },
      slug: {
            type: String,
            required: true
      },
      date: {
            type: Date,
            default: Date.now()
      }
})
            //(name of collection, Schema)
mongoose.model("categories", categories)