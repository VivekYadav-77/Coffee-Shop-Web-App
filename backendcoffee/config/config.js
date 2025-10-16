import "dotenv/config";
const conf = {
  dburl: String(process.env.MONGO_URI),
  tokenkey: String(process.env.JWT_SECRET),
};
export default conf;
