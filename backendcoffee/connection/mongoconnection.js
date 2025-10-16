import mongoose from "mongoose";
async function mongoconnectionforCoffee(url) {
  return await mongoose.connect(url);
}
export default mongoconnectionforCoffee;
