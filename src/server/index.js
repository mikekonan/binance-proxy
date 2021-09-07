import express from "express";
import cors from "cors";
import compression from "compression";
import { Router } from "express";
import { createProxyMiddleware } from "http-proxy-middleware";
import SocksProxyAgent from "socks-proxy-agent";

const socksAddr = process.env.SOCKS_ADDR;
const proxyTarget = process.env.PROXY_TARGET || "https://api.binance.com";

const getServer = async (client) => {
  const app = express();
  const router = new Router();

  app.use(cors());
  app.use(compression());
  app.use(express.json());

  router.get("/api/v3/klines", async (req, res) => {
    client
      .getCandles(req.query.symbol, req.query.interval)
      .then((result) => res.send(result));
  });

  if (!!socksAddr) {
    router.use(
      createProxyMiddleware({
        target: proxyTarget,
        changeOrigin: true,
        agent: new SocksProxyAgent(socksAddr),
      })
    );
  } else {
    router.use(
      createProxyMiddleware({
        target: proxyTarget,
        changeOrigin: true,
      })
    );
  }

  app.use("/", router);
  return app;
};

export default getServer;
