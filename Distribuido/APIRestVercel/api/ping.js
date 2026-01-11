export default function handler(req, res) {
  console.log("PING OK");
  return res.status(200).json({ pong: true, ts: Date.now() });
}

export const config = { runtime: "nodejs" };
