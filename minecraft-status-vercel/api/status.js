import net from "net";

// Minecraft Java Edition Server List Ping protocol
function pingMinecraft(host, port = 25565, timeout = 5000) {
  return new Promise((resolve, reject) => {
    const socket = new net.Socket();
    let data = Buffer.alloc(0);
    let resolved = false;

    const done = (result) => {
      if (!resolved) {
        resolved = true;
        socket.destroy();
        resolve(result);
      }
    };

    const fail = (err) => {
      if (!resolved) {
        resolved = true;
        socket.destroy();
        reject(err);
      }
    };

    socket.setTimeout(timeout);
    socket.on("timeout", () => fail(new Error("Connection timed out")));
    socket.on("error", fail);

    socket.connect(port, host, () => {
      // Build Handshake packet
      const hostBuf = Buffer.from(host, "utf8");
      const handshake = Buffer.concat([
        Buffer.from([0x00]),                        // Packet ID: Handshake
        Buffer.from([0xf5, 0x05]),                  // Protocol version (varInt 757 = 1.18)
        Buffer.from([hostBuf.length]),              // Host length
        hostBuf,                                    // Host
        Buffer.from([0x63, 0xdd]),                  // Port (big-endian 25565)
        Buffer.from([0x01]),                        // Next state: status
      ]);

      const handshakeLength = Buffer.from([handshake.length]);
      const statusRequest = Buffer.from([0x01, 0x00]); // Length 1, Packet ID: Status request

      socket.write(Buffer.concat([handshakeLength, handshake, statusRequest]));
    });

    socket.on("data", (chunk) => {
      data = Buffer.concat([data, chunk]);

      // Try to parse once we have enough data
      if (data.length < 5) return;

      try {
        // Skip packet length varint and packet id
        let offset = 0;
        // Read packet length
        let packetLen = 0, shift = 0, byte;
        do {
          byte = data[offset++];
          packetLen |= (byte & 0x7f) << shift;
          shift += 7;
        } while (byte & 0x80);

        if (data.length < offset + packetLen) return; // Need more data

        offset++; // Skip packet ID (0x00)

        // Read JSON string length
        let jsonLen = 0; shift = 0;
        do {
          byte = data[offset++];
          jsonLen |= (byte & 0x7f) << shift;
          shift += 7;
        } while (byte & 0x80);

        const json = data.slice(offset, offset + jsonLen).toString("utf8");
        done(JSON.parse(json));
      } catch {
        // Not enough data yet, wait for more
      }
    });
  });
}

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Cache-Control", "s-maxage=30, stale-while-revalidate=60");

  const host = process.env.MC_HOST || req.query.host;
  const port = parseInt(process.env.MC_PORT || req.query.port || "25565", 10);

  if (!host) {
    return res.status(400).json({ online: false, error: "No host configured. Set MC_HOST env var." });
  }

  try {
    const start = Date.now();
    const data = await pingMinecraft(host, port);
    const ping = Date.now() - start;

    const description =
      typeof data.description === "string"
        ? data.description
        : data.description?.text || data.description?.extra?.map((e) => e.text).join("") || "";

    return res.status(200).json({
      online: true,
      host,
      port,
      ping,
      players: {
        online: data.players?.online ?? 0,
        max: data.players?.max ?? 0,
        list: data.players?.sample?.map((p) => p.name) ?? [],
      },
      version: data.version?.name ?? "Unknown",
      motd: description,
      favicon: data.favicon ?? null,
    });
  } catch (err) {
    return res.status(200).json({
      online: false,
      host,
      port,
      error: err.message,
    });
  }
}
