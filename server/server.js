/** This file is exclusively for running the app separately from app.js
 * to allow supertest to work correctly
 * */

const app = require("./app");
const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
