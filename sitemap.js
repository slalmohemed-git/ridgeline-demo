/* Ridgeline sitemap for the Salesforce Interactions SDK (Data 360 module).
   Paste into the Sitemap section of your Website connector, or self-host it.
   Event names follow the SDK's standard interactions; check them against the
   schema you uploaded to the connector (catalog, cart, cartItem, identity, contactPointEmail). */
SalesforceInteractions.init({
  consents: [{
    provider: 'Ridgeline POC banner',
    purpose: SalesforceInteractions.ConsentPurpose.Tracking,
    status: SalesforceInteractions.ConsentStatus.OptIn   // POC only: real sites must ask first
  }]
}).then(() => {
  const product = () => window.RL_CURRENT || {};
  SalesforceInteractions.initSitemap({
    global: {
      listeners: [
        // Newsletter sign-up -> known profile
        SalesforceInteractions.listener('click', '#nl-submit', () => {
          const email = document.querySelector('#nl-email').value.trim();
          const firstName = document.querySelector('#nl-first').value.trim();
          const lastName = document.querySelector('#nl-last').value.trim();
          if (!email) return;
          SalesforceInteractions.sendEvent({
            interaction: { name: 'Newsletter Signup' },
            user: { attributes: { eventType: 'identity', firstName, lastName, isAnonymous: '0' } }
          });
          SalesforceInteractions.sendEvent({
            interaction: { name: 'Newsletter Email' },
            user: { attributes: { eventType: 'contactPointEmail', email } }
          });
          document.querySelector('#nl-msg').textContent = 'Thanks! You are now identified.';
        })
      ]
    },
    pageTypes: [
      { name: 'home',
        isMatch: () => document.body.dataset.page === 'home',
        interaction: { name: 'Home Page View' } },
      { name: 'product_detail',
        isMatch: () => document.body.dataset.page === 'product',
        interaction: {
          name: SalesforceInteractions.CatalogObjectInteractionName.ViewCatalogObject,
          catalogObject: {
            type: 'Product',
            id: () => product().sku,
          }
        },
        listeners: [
          SalesforceInteractions.listener('click', '#add-to-cart', () => {
            const p = product();
            SalesforceInteractions.sendEvent({
              interaction: {
                name: SalesforceInteractions.CartInteractionName.AddToCart,
                lineItem: { catalogObjectType: 'Product', catalogObjectId: p.sku, quantity: 1, price: p.price, currency: 'GBP' }
              }
            });
          })
        ] },
      { name: 'cart',
        isMatch: () => document.body.dataset.page === 'cart',
        interaction: { name: 'Cart Page View' } }
    ]
  });
});
