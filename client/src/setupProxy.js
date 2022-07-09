const { createProxyMiddleware } = require("http-proxy-middleware");
const proxy = createProxyMiddleware({
	target: process.env.REACT_APP_SERVER_URL, //internal address of server node app
});
module.exports = function (app) {
	app.use("/api", proxy);
};
