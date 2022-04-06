
const urlModel = require("../model/urlModel");
const shortid = require("shortid");


const validUrl = (value) => {
    if (!(/(ftp|http|https|FTP|HTTP|HTTPS):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-/]))?/.test(value.trim()))) {
        return false
    }
        return true
}


// createShortUrl...................................................................

const shortenUrl = async (req, res) => {
try {
    const baseUrl = "http://localhost:3000";
    
    if (Object.entries(req.body).length == 0 || Object.entries(req.body).length > 1) {
        return res
        .status(400)
        .send({ status: false, Message: "Invalid Request Params" });
    }

    if(!req.body.hasOwnProperty('longUrl')) {
        return res.status(400).send({ Status: false, Message: "Wrong Key Present" })
    }
    
    const { longUrl } = req.body;
    //wih The help of Object distucturing we can store the Ojects proporties in a Distinct Variable

    if(!longUrl) {
        return res.status(400).send({ Status : false, Message: "Url Is Required" })
    }

    if (!validUrl(baseUrl)) {
        return res
        .status(400)
        .send({ status: false, Message: "invalid Base Url" });
    }

    if (!validUrl(longUrl)) {
        return res
        .status(400)
        .send({ status: false, Message: "Invalid Long Url" });
    }

    let isUrlExist = await urlModel.findOne({ longUrl }).select({longUrl : 1, urlCode : 1, shortUrl: 1, _id: 0});
    if (isUrlExist) {
        return res
        .status(201)
        .send({ status: true, Message: "Success", Data: isUrlExist });
    }
    
    const urlCode = shortid.generate().toLowerCase();
    const shortUrl = baseUrl + "/" + urlCode;
    shortUrl.toLowerCase();

    const urlData = {
        longUrl,
        shortUrl : shortUrl.trim(),
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
