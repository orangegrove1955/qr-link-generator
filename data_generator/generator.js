const qrcode = require("qrcode");
const axios = require("axios");
const fs = require("fs");

/** Get JSON based data from a remote endpoint
 * @returns JSON object containing information received
 */
const getData = async () => {
  try {
    const response = await axios.get(
      "https://hungryhungry.com/helping-hospo/hh_test_tabledata.json"
    );
    return response.data;
  } catch (error) {
    // console.error(error);
    throw new Error("Error occurred while getting data");
  }
};

/** Generate QR codes and endpoint data to be served by app */
const generateEndpointData = async (jsonData) => {
  if (!jsonData) throw new Error("Data cannot be empty");

  let endpointData = [];

  // Loop over all rooms of data
  for (room in jsonData) {
    const tables = jsonData[room].tables;

    // Loop over all tables
    for (tableID in tables) {
      // Add tableID to current table for QR generation
      const currentTable = tables[tableID];
      currentTable["tableID"] = tableID;

      // Add link to current table for QR generation
      const link = generateLink(tableID);
      currentTable["qrLink"] = link;

      await generateQR(currentTable);

      // If room is visible, add to list of rooms for endpoint
      if (tables[tableID]["visible"] != 0) {
        currentTable["room"] = room;
        endpointData.push(currentTable);
      }
    }
  }

  return endpointData;
};

/** Generate a link to input into QR code
 * @input tabletableID: string - tableID of a table to include in link
 * @returns Link of format https://dev.hungryhungry.com/oceana2/menu?locationtableID=1995257&tabletableID=[tabletableID]
 */
const generateLink = (tableID) => {
  if (!tableID) throw new Error("tableID cannot be undefined");
  return `https://dev.hungryhungry.com/oceana2/menu?locationID=1995257&tableID=${tableID}`;
};

/** Generate and save QR codes to image files
 * @input Table object with tableID and qrLink
 * @output file saved to './qrcode_output' with name of table as file name
 */
const generateQR = async ({ tableID, qrLink }) => {
  try {
    qrcode.toFile(`./qrcode_output/${tableID}.png`, qrLink);
  } catch (error) {
    console.error(error);
    throw new Error(`QR code generation failed for tabletableID: ${tableID}`);
  }
};

/** Write json data to files
 * @input location String of location to save file
 * @input json JSON data to be saved
 */
const writeJSONtoFile = async (location, json) => {
  if (!location) {
    throw new Error("Location cannot be undefined");
  }
  if (!json) {
    throw new Error("JSON cannot be undefined");
  }

  try {
    const data = JSON.stringify(json);
    await fs.writeFile(location, data, (error) => {
      if (error) throw new Error(error);
    });
  } catch (error) {
    console.error(error);
    throw new Error("Error writing JSON to file");
  }
};

/** Run generator to get data, save to file, then produce QR codes */
const runGenerator = async () => {
  console.log("Beginning generator");

  // Get data from web and save to file
  const jsonData = await getData();
  await writeJSONtoFile("./tableData.json", jsonData);

  // Convert and filter data to serve at endpoint
  const endpointData = await generateEndpointData(jsonData);
  await writeJSONtoFile("./endpointData.json", endpointData);

  return "Generator complete";
};

runGenerator().then(console.log);

module.exports = {
  getData,
  generateEndpointData,
  generateLink,
  generateQR,
  writeJSONtoFile,
  runGenerator,
};
