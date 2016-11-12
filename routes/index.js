const express = require('express');
const router = express.Router();
const braintree = require('braintree');
const accessToken = 'access_token$sandbox$6dpdkgcswgggk2pv$e63120a846fa2812b18d539bdbeece90';

/* GET home page. */
router.get('/', function(req, res, next) {
  braintree.connect({
    accessToken: accessToken
  }).clientToken.generate({}, (err, response) => {
    res.render('index', {
      clientToken: response.clientToken
    });
  })
});

router.post('/checkout', function(req, res, next) {
  braintree.connect({
    accessToken: accessToken
  })
  .transaction.sale({
    amount: req.body.amount,
    merchantAccountId: "JPY",
    paymentMethodNonce: req.body.nonce,
    options: {
      submitForSettlement: true
    }
  }, (err, result) => {
    if (err) res.send("<h1>Error:  " + err + "</h1>");
    else if (result.success) res.send("<h1>Success! Transaction ID: " + result.transaction.id + "</h1>");
    else res.send("<h1>Error:  " + result.message + "</h1>");
  });
});

module.exports = router;
