
const urlModel = require("../model/urlModel");
const shortid = require("shortid");


const validUrl = (value) => {
    let Reg = /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-]*)?\??(?:[-\+=&;%@.\w]*)#?(?:[\w]*))?)/
    return Reg.test(value)
}
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

    if (!validUrl(baseUrl)) {
        return res
        .status(400)
        .send({ status: false, Message: "invalid Base Url" });
    }

    const urlCode = shortid.generate().toLowerCase();

    if (!validUrl(longUrl)) {
        return res
            .status(400)
            .send({ status: false, Message: "Invalid Long Url" });
    }

    let isUrlExist = await urlModel.findOne({ longUrl }).select({longUrl : 1, urlCode : 1, shortUrl: 1, _id: 0});
    if (isUrlExist) {
        return res
        .status(200)
        .send({ status: true, Message: "Success", Data: isUrlExist });
    }

    const shortUrl = baseUrl + "/" + urlCode;
    shortUrl.toLowerCase();
    
    const urlData = {
        longUrl,
        shortUrl,
        urlCode,
    };

    let newUrl = await urlModel.create(urlData)

    let finalData = {
        urlCode : newUrl.urlCode,
        longUrl : newUrl.longUrl,
        shortUrl: newUrl.shortUrl
    }
    return res
    .status(201)
    .send({ status: true, Message: "success", Data: finalData });

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
        .send({ status: false, Message: "No Url Found, Please Check Url Code", });
        }
        return res.redirect(isUrlExist.longUrl);
    }

} catch (error) {
    res.status(500).send({ status: false, Message: error.message });
}
};

module.exports.getUrl = getUrl;
