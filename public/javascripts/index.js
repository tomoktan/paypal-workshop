const braintree = require('braintree-web');

braintree.client.create({
  authorization: clientToken
}, (err, clientInstance) => {
  braintree.paypal.create({
    client: clientInstance
  }, (err, paypalInstance) => {
    document.getElementById('paypal-button').addEventListener('click', () => {
      paypalInstance.tokenize({
        flow: 'checkout', // Required
        amount: 1000, // Required
        currency: 'JPY', // Required
        locale: 'ja_JP'
      }, (err, tokenizationPayload) => {
        const form = document.createElement('form');
        document.body.appendChild(form);

        const inputNonce = document.createElement('input');
        inputNonce.setAttribute('type', 'hidden');
        inputNonce.setAttribute('name', 'nonce');
        inputNonce.setAttribute('value', tokenizationPayload.nonce);
        form.appendChild(inputNonce);

        const inputAmount = document.createElement('input');
        inputAmount.setAttribute('type', 'hidden');
        inputAmount.setAttribute('name', 'amount');
        inputAmount.setAttribute('value', '1000');
        form.appendChild(inputAmount);

        form.setAttribute('action', '/checkout');
        form.setAttribute('method', 'post');
        form.submit();
      })
    })
  });
});
