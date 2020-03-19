const asyncHandler = require('express-async-handler');

const express = require('express');
const app = express();
const port = 3000;

const accountSid = process.env.TWILIO_ACCOUNT_SID || "hardcodefortesting";
const authToken = process.env.TWILIO_AUTH_TOKEN ||  "hardcodefortesting";
const twilioVerifySid = process.env.TWILIO_VERIFY_SID || "hardcodefortesting";

app.listen(port, () => console.log(`Example app listening on port ${port}!`));

const t = {
    async callTwilio() {
        // creating the client with wrong credentials preserves the stack
        const client = require('twilio')(accountSid, authToken);
        const preservedStack = new Error("preserved caller stack");
        const _ = await client.verify.services(twilioVerifySid).verifications.create({
            to:  Math.random(),
            channel: "sms"
        }).then(verification => {
            console.log("this will never be reached since we trigger exception");
        }).catch(e => {
            console.trace("value of e.stack (and also our own stack)----> " + e.stack);
            throw preservedStack;
        });
        log.debug("returning normally");
    }
};

const runner = {
    async wrap() {
        await t.callTwilio();
    }
};

app.get('/', asyncHandler(async (req, res, next) => {
    const result = await runner.wrap();
    res.send(result);
}));


// error handler
app.use(function(err, req, res, next) {
    console.error(err);

    res.status(err.status || 500);
    res.send(err.stack);
});