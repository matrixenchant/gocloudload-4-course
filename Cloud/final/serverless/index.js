const functions = require('@google-cloud/functions-framework');
const Knex = require('knex');

console.log('INIT FUNCTIONS ==============================================');

const knex = Knex({
  client: 'pg',
  connection: {
    host: '/cloudsql/app-cloud-final:asia-east1:main-db',
    user: 'postgres',
    password: 'cLYnP3T5',
    database: 'app',
  },
});

functions.http('events', async (req, res) => {
  try {
    const result = await knex('events');
    res.status(201).json(result);
  } catch (error) {
    console.error('Error handling event:', error);
    res.status(500).json({ message: 'Internal Server Error', error: error });
  }
});

functions.http('get-notifications', async (req, res) => {
  const { user_id, event_id } = req.body;
  try {
    const result = await knex('notifications').where({ user_id, event_id });
    res.status(201).json(result);
  } catch (error) {
    console.error('Error handling event:', error);
    res.status(500).json({ message: 'Internal Server Error', error: error });
  }
});

functions.http('register-event', async (req, res) => {
  const { user_id, event_id, ticket_id, number_of_tickets } = req.body;

  if (!event_id || !ticket_id || !number_of_tickets) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const ticket = await knex('tickets').where({ event_id, id: ticket_id }).first();
    if (!ticket) {
      return res.status(404).json({ message: 'Ticket not found' });
    }

    if (ticket.availability < number_of_tickets) {
      return res.status(400).json({ message: 'Not enough tickets available' });
    }

    const [newEvent] = await knex('registrations').insert(
      {
        event_id,
        user_id,
        ticket_id,
        number_of_tickets,
        registration_date: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      ['id', 'event_id', 'user_id', 'ticket_id', 'number_of_tickets', 'registration_date']
    );

    await knex('tickets')
      .where({ id: ticket_id })
      .update('availability', ticket.availability - number_of_tickets);

    const [payment] = await knex('payments').insert(
      {
        registration_id: newEvent.id,
        amount: ticket.price * number_of_tickets,
        payment_date: new Date(),
        status: 'pending',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      ['id', 'registration_id', 'status', 'amount', 'payment_date']
    );

    res.status(201).json({ payment, event: newEvent });
  } catch (error) {
    console.error('Error handling event:', error);
    res.status(500).json({ message: 'Internal Server Error', error: error });
  }
});

/*
gcloud functions deploy get-all-events \
  --gen2 \
  --runtime=nodejs20 \
  --region=asia-east1 \
  --source=. \
  --entry-point=events \
  --trigger-http \
  --allow-unauthenticated

gcloud functions deploy register-event \
  --gen2 \
  --runtime=nodejs20 \
  --region=asia-east1 \
  --source=. \
  --entry-point=register-event \
  --trigger-http \
  --allow-unauthenticated

gcloud functions deploy get-notifications \
  --gen2 \
  --runtime=nodejs20 \
  --region=asia-east1 \
  --source=. \
  --entry-point=get-notifications \
  --trigger-http \
  --allow-unauthenticated

gcloud run services update register-event --region=asia-east1 --add-cloudsql-instances=app-cloud-final:asia-east1:main-db
gcloud run services update get-notifications --region=asia-east1 --add-cloudsql-instances=app-cloud-final:asia-east1:main-db

gcloud functions logs read \
  --gen2 \
  --region=asia-east1 \
  --limit=10 \
  get-all-events
*/
