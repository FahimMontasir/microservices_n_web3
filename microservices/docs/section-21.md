## **Section 21: Handling Payments**

## Table of Contents
- [**Section 21: Handling Payments**](#section-21-handling-payments)
- [Table of Contents](#table-of-contents)
  - [The Payments Service](#the-payments-service)
  - [Initial Setup](#initial-setup)
  - [Replicated Fields](#replicated-fields)
  - [Another Order Model!](#another-order-model)
  - [Update-If-Current](#update-if-current)
  - [Replicating Orders](#replicating-orders)
  - [Testing Order Creation](#testing-order-creation)
  - [Marking an Order as Cancelled](#marking-an-order-as-cancelled)
  - [Cancelled Testing](#cancelled-testing)
  - [Starting the Listeners](#starting-the-listeners)
  - [Payments Flow with Stripe](#payments-flow-with-stripe)
  - [Implementing the Create Charge Handler](#implementing-the-create-charge-handler)
  - [Validating Order Payment](#validating-order-payment)
  - [Testing Order Validation Before Payment](#testing-order-validation-before-payment)
  - [Testing Same-User Validation](#testing-same-user-validation)
  - [Stripe Setup](#stripe-setup)
  - [Creating a Stripe Secret](#creating-a-stripe-secret)
  - [Creating a Charge with Stripe](#creating-a-charge-with-stripe)
  - [Manual Testing of Payments](#manual-testing-of-payments)
  - [Automated Payment Testing](#automated-payment-testing)
  - [Mocked Stripe Client](#mocked-stripe-client)
  - [A More Realistic Test Setup](#a-more-realistic-test-setup)
  - [Realistic Test Implementation](#realistic-test-implementation)
  - [Tying an Order and Charge Together](#tying-an-order-and-charge-together)
  - [Testing Payment Creation](#testing-payment-creation)
  - [Publishing a Payment Created Event](#publishing-a-payment-created-event)
  - [More on Publishing](#more-on-publishing)
  - [Marking an Order as Complete](#marking-an-order-as-complete)

### The Payments Service

![](section-21/order-created.jpg)
![](section-21/order-cancelled.jpg)
![](section-21/charge-created.jpg)

**[⬆ back to top](#table-of-contents)**

### Initial Setup

![](section-21/payments.jpg)

```console
docker build -t chesterheng/payments .
docker push chesterheng/payments
```

**[⬆ back to top](#table-of-contents)**

### Replicated Fields

![](section-21/payments-service.jpg)
![](section-21/props.jpg)

**[⬆ back to top](#table-of-contents)**

### Another Order Model!

```typescript
import mongoose from 'mongoose';
import { OrderStatus } from '@chticketing/common';

interface OrderAttrs {
  id: string;
  version: number;
  userId: string;
  price: number;
  status: OrderStatus;
}

interface OrderDoc extends mongoose.Document {
  version: number;
  userId: string;
  price: number;
  status: OrderStatus;
}

interface OrderModel extends mongoose.Model<OrderDoc> {
  build(attrs: OrderAttrs): OrderDoc;
}

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      required: true,
    },
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
      },
    },
  }
);

orderSchema.statics.build = (attrs: OrderAttrs) => {
  return new Order({
    _id: attrs.id,
    version: attrs.version,
    price: attrs.price,
    userId: attrs.userId,
    status: attrs.status,
  });
};

const Order = mongoose.model<OrderDoc, OrderModel>('Order', orderSchema);

export { Order };
```

**[⬆ back to top](#table-of-contents)**

### Update-If-Current

```typescript
orderSchema.set('versionKey', 'version');
orderSchema.plugin(updateIfCurrentPlugin);
```

**[⬆ back to top](#table-of-contents)**

### Replicating Orders

```typescript
import { Message } from 'node-nats-streaming';
import { Listener, OrderCreatedEvent, Subjects } from '@chticketing/common';
import { queueGroupName } from './queue-group-name';
import { Order } from '../../models/order';

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  subject: Subjects.OrderCreated = Subjects.OrderCreated;
  queueGroupName = queueGroupName;

  async onMessage(data: OrderCreatedEvent['data'], msg: Message) {
    const order = Order.build({
      id: data.id,
      price: data.ticket.price,
      status: data.status,
      userId: data.userId,
      version: data.version,
    });
    await order.save();

    msg.ack();
  }
}
```

**[⬆ back to top](#table-of-contents)**

### Testing Order Creation

```typescript
const setup = async () => {
  const listener = new OrderCreatedListener(natsWrapper.client);

  const data: OrderCreatedEvent['data'] = {
    id: mongoose.Types.ObjectId().toHexString(),
    version: 0,
    expiresAt: 'alskdjf',
    userId: 'alskdjf',
    status: OrderStatus.Created,
    ticket: {
      id: 'alskdfj',
      price: 10,
    },
  };

  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { listener, data, msg };
};

it('replicates the order info', async () => {
  const { listener, data, msg } = await setup();

  await listener.onMessage(data, msg);

  const order = await Order.findById(data.id);

  expect(order!.price).toEqual(data.ticket.price);
});

it('acks the message', async () => {
  const { listener, data, msg } = await setup();

  await listener.onMessage(data, msg);

  expect(msg.ack).toHaveBeenCalled();
});
```

**[⬆ back to top](#table-of-contents)**

### Marking an Order as Cancelled

```typescript
import {
  OrderCancelledEvent,
  Subjects,
  Listener,
  OrderStatus,
} from '@chticketing/common';
import { Message } from 'node-nats-streaming';
import { queueGroupName } from './queue-group-name';
import { Order } from '../../models/order';

export class OrderCancelledListener extends Listener<OrderCancelledEvent> {
  subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
  queueGroupName = queueGroupName;

  async onMessage(data: OrderCancelledEvent['data'], msg: Message) {
    const order = await Order.findOne({
      _id: data.id,
      version: data.version - 1,
    });

    if (!order) {
      throw new Error('Order not found');
    }

    order.set({ status: OrderStatus.Cancelled });
    await order.save();

    msg.ack();
  }
}
```

**[⬆ back to top](#table-of-contents)**

### Cancelled Testing

```typescript
it('updates the status of the order', async () => {
  const { listener, data, msg, order } = await setup();

  await listener.onMessage(data, msg);

  const updatedOrder = await Order.findById(order.id);

  expect(updatedOrder!.status).toEqual(OrderStatus.Cancelled);
});

it('acks the message', async () => {
  const { listener, data, msg, order } = await setup();

  await listener.onMessage(data, msg);

  expect(msg.ack).toHaveBeenCalled();
});
```

**[⬆ back to top](#table-of-contents)**

### Starting the Listeners

```typescript
  new OrderCreatedListener(natsWrapper.client).listen();
  new OrderCancelledListener(natsWrapper.client).listen();
```

**[⬆ back to top](#table-of-contents)**

### Payments Flow with Stripe

![](section-21/stripe-1.jpg)
![](section-21/stripe-2.jpg)

**[⬆ back to top](#table-of-contents)**

### Implementing the Create Charge Handler

![](section-21/charge-handler-1.jpg)
![](section-21/charge-handler-2.jpg)

```typescript
import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import {
  requireAuth,
  validateRequest,
  BadRequestError,
  NotFoundError,
} from '@chticketing/common';
import { Order } from '../models/order';

const router = express.Router();

router.post(
  '/api/payments',
  requireAuth,
  [body('token').not().isEmpty(), body('orderId').not().isEmpty()],
  validateRequest,
  async (req: Request, res: Response) => {
    res.send({ success: true });
  }
);

export { router as createChargeRouter };
```

**[⬆ back to top](#table-of-contents)**

### Validating Order Payment

```typescript
import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import {
  requireAuth,
  validateRequest,
  BadRequestError,
  NotAuthorizedError,
  NotFoundError,
  OrderStatus,
} from '@chticketing/common';
import { Order } from '../models/order';

const router = express.Router();

router.post(
  '/api/payments',
  requireAuth,
  [body('token').not().isEmpty(), body('orderId').not().isEmpty()],
  validateRequest,
  async (req: Request, res: Response) => {
    const { token, orderId } = req.body;

    const order = await Order.findById(orderId);

    if (!order) {
      throw new NotFoundError();
    }
    if (order.userId !== req.currentUser!.id) {
      throw new NotAuthorizedError();
    }
    if (order.status === OrderStatus.Cancelled) {
      throw new BadRequestError('Cannot pay for an cancelled order');
    }

    res.send({ success: true });
  }
);

export { router as createChargeRouter };
```

**[⬆ back to top](#table-of-contents)**

### Testing Order Validation Before Payment

```typescript
it('returns a 404 when purchasing an order that does not exist', async () => {
  await request(app)
    .post('/api/payments')
    .set('Cookie', global.signin())
    .send({
      token: 'asldkfj',
      orderId: mongoose.Types.ObjectId().toHexString(),
    })
    .expect(404);
});

it('returns a 401 when purchasing an order that doesnt belong to the user', async () => {
  const order = Order.build({
    id: mongoose.Types.ObjectId().toHexString(),
    userId: mongoose.Types.ObjectId().toHexString(),
    version: 0,
    price: 20,
    status: OrderStatus.Created,
  });
  await order.save();

  await request(app)
    .post('/api/payments')
    .set('Cookie', global.signin())
    .send({
      token: 'asldkfj',
      orderId: order.id,
    })
    .expect(401);
});
```

**[⬆ back to top](#table-of-contents)**

### Testing Same-User Validation

```typescript
it('returns a 400 when purchasing a cancelled order', async () => {
  const userId = mongoose.Types.ObjectId().toHexString();
  const order = Order.build({
    id: mongoose.Types.ObjectId().toHexString(),
    userId,
    version: 0,
    price: 20,
    status: OrderStatus.Cancelled,
  });
  await order.save();

  await request(app)
    .post('/api/payments')
    .set('Cookie', global.signin(userId))
    .send({
      orderId: order.id,
      token: 'asdlkfj',
    })
    .expect(400);
});
```

**[⬆ back to top](#table-of-contents)**

### Stripe Setup

![](section-21/stripe-setup.jpg)

**[⬆ back to top](#table-of-contents)**

### Creating a Stripe Secret

```console
kubectl create secret generic stripe-secret --from-literal STRIPE_KEY=sk_test_...
kubectl get secrets
```

```yaml
  - name: STRIPE_KEY
  valueFrom:
    secretKeyRef:
      name: stripe-secret
      key: STRIPE_KEY
```

**[⬆ back to top](#table-of-contents)**

### Creating a Charge with Stripe

```
import Stripe from 'stripe';

export const stripe = new Stripe(process.env.STRIPE_KEY!, {
  apiVersion: '2020-03-02',
});
```

[Charges](https://stripe.com/docs/api/charges)

Endpoints

- POST /v1/charges
- GET /v1/charges/:id
- POST /v1/charges/:id
- POST /v1/charges/:id/capture
- GET /v1/charges

```typescript
  await stripe.charges.create({
    currency: 'usd',
    amount: order.price * 100,
    source: token,
  });
```

**[⬆ back to top](#table-of-contents)**

### Manual Testing of Payments

- Signup
- Create ticket
- Create Order
- Create Payment
- Check stripe dashboard - Payments

**[⬆ back to top](#table-of-contents)**

### Automated Payment Testing

```typescript
export const stripe = {
  charges: {
    create: jest.fn().mockResolvedValue({}),
  },
};
```

```typescript
it('returns a 204 with valid inputs', async () => {
  const userId = mongoose.Types.ObjectId().toHexString();
  const order = Order.build({
    id: mongoose.Types.ObjectId().toHexString(),
    userId,
    version: 0,
    price: 20,
    status: OrderStatus.Created,
  });
  await order.save();

  await request(app)
    .post('/api/payments')
    .set('Cookie', global.signin(userId))
    .send({
      token: 'tok_visa',
      orderId: order.id,
    });
});
```

**[⬆ back to top](#table-of-contents)**

### Mocked Stripe Client

```typescript
  await request(app)
    .post('/api/payments')
    .set('Cookie', global.signin(userId))
    .send({
      token: 'tok_visa',
      orderId: order.id,
    })
    .expect(201);

  const chargeOptions = (stripe.charges.create as jest.Mock).mock.calls[0][0];
  expect(chargeOptions.source).toEqual('tok_visa');
  expect(chargeOptions.amount).toEqual(20 * 100);
  expect(chargeOptions.currency).toEqual('usd');
```

**[⬆ back to top](#table-of-contents)**

### A More Realistic Test Setup

![](section-21/test-setup.jpg)
![](section-21/test-setup-2.jpg)

- add process.env.STRIPE_KEY to setup.ts
```typescript
// setup.ts
process.env.STRIPE_KEY = 'sk_test_...'
```
- remove jest.mock('../../stripe'); to run real stripe API
- remove code to check mock chargeOptions 
```typescript
  const chargeOptions = (stripe.charges.create as jest.Mock).mock.calls[0][0];
  expect(chargeOptions.source).toEqual('tok_visa');
  expect(chargeOptions.amount).toEqual(20 * 100);
  expect(chargeOptions.currency).toEqual('usd');
```

**[⬆ back to top](#table-of-contents)**

### Realistic Test Implementation

![](section-21/test-implementation.jpg)

```typescript
it('returns a 201 with valid inputs', async () => {
  const userId = mongoose.Types.ObjectId().toHexString();
  const price = Math.floor(Math.random() * 100000);
  const order = Order.build({
    id: mongoose.Types.ObjectId().toHexString(),
    userId,
    version: 0,
    price,
    status: OrderStatus.Created,
  });
  await order.save();

  await request(app)
    .post('/api/payments')
    .set('Cookie', global.signin(userId))
    .send({
      token: 'tok_visa',
      orderId: order.id,
    })
    .expect(201);
  
    const stripeCharges = await stripe.charges.list({ limit: 50 });
    const stripeCharge = stripeCharges.data.find(charge => {
      return charge.amount === price * 100
    })

    expect(stripeCharge).toBeDefined();
    expect(stripeCharge?.currency).toEqual('usd');
});
```

**[⬆ back to top](#table-of-contents)**

### Tying an Order and Charge Together

![](section-21/order-charge.jpg)

```typescript
import mongoose from 'mongoose';

interface PaymentAttrs {
  orderId: string;
  stripeId: string;
}

interface PaymentDoc extends mongoose.Document {
  orderId: string;
  stripeId: string;
}

interface PaymentModel extends mongoose.Model<PaymentDoc> {
  build(attrs: PaymentAttrs): PaymentDoc;
}

const paymentSchema = new mongoose.Schema(
  {
    orderId: {
      required: true,
      type: String,
    },
    stripeId: {
      required: true,
      type: String,
    },
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
      },
    },
  }
);

paymentSchema.statics.build = (attrs: PaymentAttrs) => {
  return new Payment(attrs);
};

const Payment = mongoose.model<PaymentDoc, PaymentModel>(
  'Payment',
  paymentSchema
);

export { Payment };
```

**[⬆ back to top](#table-of-contents)**

### Testing Payment Creation

```typescript
  const charge = await stripe.charges.create({
    currency: 'usd',
    amount: order.price * 100,
    source: token,
  });
  const payment = Payment.build({
    orderId,
    stripeId: charge.id,
  });
  await payment.save();
```

```typescript
  const payment = await Payment.findOne({
    orderId: order.id,
    stripeId: stripeCharge!.id,
  });
  expect(payment).not.toBeNull();
```

**[⬆ back to top](#table-of-contents)**

### Publishing a Payment Created Event

![](section-21/publish-payment.jpg)

```typescript
import { Subjects } from './subjects';

export interface PaymentCreatedEvent {
  subject: Subjects.PaymentCreated;
  data: {
    id: string;
    orderId: string;
    stripeId: string;
  };
}
```

```typescript
import { Subjects, Publisher, PaymentCreatedEvent } from '@chticketing/common';

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
  subject: Subjects.PaymentCreated = Subjects.PaymentCreated;
}
```

**[⬆ back to top](#table-of-contents)**

### More on Publishing

```typescript
  new PaymentCreatedPublisher(natsWrapper.client).publish({
    id: payment.id,
    orderId: payment.orderId,
    stripeId: payment.stripeId,
  });
```

**[⬆ back to top](#table-of-contents)**

### Marking an Order as Complete

![](section-21/payment-created.jpg)

```typescript
import {
  Subjects,
  Listener,
  PaymentCreatedEvent,
  OrderStatus,
} from '@chticketing/common';
import { Message } from 'node-nats-streaming';
import { queueGroupName } from './queue-group-name';
import { Order } from '../../models/order';

export class PaymentCreatedListener extends Listener<PaymentCreatedEvent> {
  subject: Subjects.PaymentCreated = Subjects.PaymentCreated;
  queueGroupName = queueGroupName;

  async onMessage(data: PaymentCreatedEvent['data'], msg: Message) {
    const order = await Order.findById(data.orderId);

    if (!order) {
      throw new Error('Order not found');
    }

    order.set({
      status: OrderStatus.Complete,
    });
    await order.save();

    msg.ack();
  }
}
```

**[⬆ back to top](#table-of-contents)**