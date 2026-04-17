const express = require('express');
const QRCode = require('qrcode');
 
const app = express();
const PORT = process.env.PORT || 3000;
 
app.use(express.json());
 
let tickets = {};
app.get('/pay', (req, res) => {
  const { type, price } = req.query;
 
  res.send(`
    <html>
    <body style="font-family:Arial;text-align:center;padding:40px;">
      <h2>💳 Betaling</h2>
      <p>${type}</p>
      <p>${price} kr</p>
 
      <button onclick="pay()">Fullfør betaling</button>
 
      <script>
        function pay(){
          document.body.innerHTML = "<h2>⏳ Behandler betaling...</h2>";
          setTimeout(()=>{
            window.location.href = "/success?type=${type}";
          },2000);
        }
      </script>
    </body>
    </html>
  `);
});
 
