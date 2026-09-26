// Quick probe: does the CapCut similar-template search work through the proxy pool?
import axios from "axios";

const PROXY_API = "https://api.ikyyxd.my.id/v2l/proxy-free/ikyy-xsample";
const BASE_URL = "https://www.capcut.com";
const API_ENDPOINT = "/kep/api/getSimilarTemplates";

const res = await axios.get(PROXY_API, { timeout: 15000 });
const proxies = res.data.filter((p) => typeof p === "string" && p.trim().split(":").length === 4);
console.log("proxies:", proxies.length);

let lastError = "";
for (let i = 0; i < 5; i++) {
  const p = proxies[Math.floor(Math.random() * proxies.length)];
  const [host, port, user, pass] = p.trim().split(":");
  try {
    const client = axios.create({
      baseURL: BASE_URL,
      proxy: { host, port: parseInt(port), auth: { username: user, password: pass }, protocol: "http" },
      timeout: 30000,
      headers: {
        "User-Agent": "Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Mobile Safari/537.36",
        "Accept": "*/*",
        "Content-Type": "application/json",
        "Origin": BASE_URL,
        "Referer": `${BASE_URL}/template`,
        "Sec-Fetch-Dest": "empty",
        "Sec-Fetch-Mode": "cors",
        "Sec-Fetch-Site": "same-origin",
      },
    });
    const r = await client.post(API_ENDPOINT, {
      keyword: "aesthetic",
      tabs: ["video"],
      language: "en",
      regionCode: "US",
      size: 5,
    });
    console.log("attempt", i + 1, "status:", r.data.status);
    const list = r.data?.data?.videoTemplateList?.videoTemplates;
    const imageList = r.data?.data?.imageTemplateList;
    console.log("videoTemplates:", Array.isArray(list) ? list.length : "n/a", "| keys of data:", Object.keys(r.data?.data || {}));
    if (list && list.length) {
      console.log(JSON.stringify(list[0], null, 2).slice(0, 2500));
    }
    process.exit(0);
  } catch (err) {
    lastError = err.message;
    console.log("attempt", i + 1, "failed:", err.message.slice(0, 200));
  }
}
console.log("ALL FAILED:", lastError);
process.exit(1);
