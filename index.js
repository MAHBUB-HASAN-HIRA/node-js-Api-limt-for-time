const express = require("express");
const app = express();
const fs = require("fs");
const https = require("https");
const port = 3000;

const saveLocation = "./AppData/mainApiData.json";
const mainSiteApiLink = "https://jsonplaceholder.typicode.com/posts";

function loadData() {
	https
		.get(mainSiteApiLink, (response) => {
			let data = "";
			// A chunk of data has been received.
			response.on("data", (chunk) => {
				data += chunk;
			});

			// The whole response has been received. Print out the result.
			response.on("end", () => {
				fs.writeFile(saveLocation, data, (err) => {
					if (err) throw err;
				});
			});
		})
		.on("error", (err) => {
			console.log("Error: " + err.message);
		});
}
// Update api data after every one hour
setInterval(loadData, 60 * 60 * 1000);

app.get("/", (req, res) => {
    //parse data to create my new api
    const jsonData = JSON.parse(fs.readFileSync(saveLocation));
    //modify and create my custom data
	const myAllData = jsonData.map((data) => {
		const myObj = {
			id_hobe: data.id,
			name_hobe: "mahbub" + data.userId,
			body_data: data.title,
		};
		return myObj;
	});
	res.status(200).json(myAllData);
});

app.listen(port, () => {
	console.log(`Example app listening at http://localhost:${port}`);
});
