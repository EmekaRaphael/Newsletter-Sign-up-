const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");

dotenv.config();

const app = express();
const port = process.env.PORT;

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

async function connectToMongoDB() {
    try {
        await mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('Connected to MongoDB');
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
    }
}

connectToMongoDB();

const clientSchema = new mongoose.Schema({
    firstName: String,
    lastName: String,
    email: String
});

const Client = mongoose.model('Client', clientSchema);

app.get("/", (request, response) => {
    response.sendFile(__dirname + "/signup.html");
});

app.post("/", async (req, res) => {
    const { firstName, lastName, email } = req.body;

    try {
        const client = new Client({
            firstName,
            lastName,
            email
        });

        await client.save();
        console.log('Client data saved to MongoDB');
        res.sendFile(__dirname + "/success.html");
    } catch (err) {
        console.error('Error saving client data:', err);
        res.sendFile(__dirname + "/failure.html");
    }
});

app.post("/failure", (req, res) => {
    res.redirect("/");
});

app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${port}!`);
});
