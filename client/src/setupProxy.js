const { createProxyMiddleware } = require("http-proxy-middleware");
const proxy = createProxyMiddleware({
	target: "http://server:5000", //internal address of server node app through docker network
});
module.exports = function (app) {
	app.use("/api", proxy);
};
