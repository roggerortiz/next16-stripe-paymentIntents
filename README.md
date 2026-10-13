# Accept a Payment

Build a simple checkout form to collect payment details. Included are some basic
build and run scripts you can use to start up the application (https://docs.stripe.com/payments/quickstart-payment-intents).

## Running the sample

### Development
1. Build the application
~~~shell
$ npm install
~~~

2. Download and run the [Stripe CLI](https://stripe.com/docs/stripe-cli). The Stripe CLI is a developer tool that helps you build, test, and manage your integration with Stripe directly from the command line.
~~~shell
$ stripe listen --forward-to localhost:3000/api/webhooks
~~~

3. Run the application
~~~shell
$ STRIPE_WEBHOOK_SECRET=$(stripe listen --print-secret) npm run dev
~~~

4. Go to [localhost:3000](http://localhost:3000)

### Production
1. Build the application
~~~shell
$ npm install

$ npm build
~~~

2. Run the application
~~~shell
$ npm start
~~~