const urlModel = require("../model/urlModel");
const validUrl = require("valid-url");
const shortid = require("shortid");

// createShortUrl...................................................................

const shortenUrl = async (req, res) => {
    try {
        const baseUrl = "http://localhost:3000";

        if (Object.entries(req.body).length == 0) {
            return res
                .status(400)
                .send({ status: false, Message: "Invalid Request Params" });
        }

        const { longUrl } = req.body;

        if (!validUrl.isUri(baseUrl)) {
            return res
                .status(400)
                .send({ status: false, Message: "invalid Base Url" });
        }

        const urlCode = shortid.generate().toLowerCase();

        if (!validUrl.isUri(longUrl)) {
            return res
                .status(400)
                .send({ status: false, Message: "Invalid Long Url" });
        }

        let isUrlExist = await urlModel.findOne({ longUrl });
        if (isUrlExist) {
            return res
                .status(200)
                .send({ status: true, Message: "Success", url: isUrlExist });
        }

        const shortUrl = baseUrl + "/" + urlCode;
        shortUrl.toLowerCase();
        const urlData = {
            longUrl,
            shortUrl,
            urlCode,
        };

        let newUrl = await urlModel.create(urlData);
        return res
            .status(201)
            .send({ status: true, Message: "success", url: newUrl });

    } catch (error) {
        res
            .status(500)
            .send({ status: false, Err: error.message });
    }
};

module.exports.shortenUrl = shortenUrl;

//redirectToOriginalUrl....................................................................

const getUrl = async (req, res) => {
try {
    const urlC = req.params.urlCode.trim();
    const isUrlExist = await urlModel.findOne({ urlCode: urlC });

    if (isUrlExist) {
        if (urlC !== isUrlExist.urlCode) {
        return res
            .status(404)
            .send({ status: false, Message: "No Url Found, Please Check Url Code",});
        }
        return res.redirect(isUrlExist.longUrl);
    }

} catch (error) {
    res.status(500).send({ status: false, Message: error.message });
}
};

module.exports.getUrl = getUrl;
