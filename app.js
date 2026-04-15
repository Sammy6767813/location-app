const express = require('express');
const QRCode = require('qrcode');
const app = express();

app.use(express.json());

let tickets = {};

app.get('/', (req, res) => {
  res.send(`
  <!DOCTYPE html>
  <html>
  <head>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
      body { margin:0; font-family:Arial; background:#111; color:white; }
      header { background:#d71920; padding:15px; text-align:center; }
      .container { padding:15px; }
      .card { background:#222; padding:15px; border-radius:15px; }
      button { width:100%; padding:15px; border:none; border-radius:10px; background:#d71920; color:white; font-size:16px; }
    </style>
  </head>
  <body>
  <header>🚍 Min Billett</header>
  <div class="container">
    <div class="card">
      <h3>Kjøp billett</h3>
      <button onclick="buy('Enkeltbillett',30)">Enkelt - 30 kr</button><br><br>
      <button onclick="buy('30 dager',800)">30 dager - 800 kr</button>
    </div>
  </div>
  <script>
    function buy(type, price){
      window.location.href = `/fake-payment?type=${type}&price=${price}`;
    }
  </script>
  </body>
  </html>
  `);
});

app.get('/fake-payment', (req, res) => {
  const { type, price } = req.query;

  res.send(`
  <html>
  <body style="font-family:Arial;text-align:center;padding:40px;">
    <h2>💳 Betaling</h2>
    <p>${type}</p>
    <p>${price} kr</p>
    <button onclick="pay()">Betal</button>
    <script>
      function pay(){
        window.location.href = '/success?type=${type}';
      }
    </script>
  </body>
  </html>
  `);
});

app.get('/success', async (req, res) => {
  const type = req.query.type;
  const id = Date.now().toString();
  const expiry = new Date(Date.now() + 60*60*1000);

  tickets[id] = { type, expiry };

  const qr = await QRCode.toDataURL(`https://example.com/check/${id}`);

  res.send(`
  <html>
  <body style="background:#111;color:white;font-family:Arial;text-align:center;padding:40px;">
    <h2>🎫 Aktiv billett</h2>
    <p>${type}</p>
    <p>Gyldig til: ${expiry.toLocaleTimeString()}</p>
    <img src="${qr}" width="200"/>
    <p>ID: ${id}</p>
  </body>
  </html>
  `);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => console.log("Server running"));
