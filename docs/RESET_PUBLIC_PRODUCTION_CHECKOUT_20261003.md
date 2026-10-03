# Reset public production checkout — October 3, 2026

The public launch offers approved Studio project deposits and Event booking deposits through the existing active Stripe Payment Links. Studio: $250–$5,000 USD, default $500. Events: $500–$10,000 USD, default $1,000. Amounts and link IDs were checked against live Stripe records; no price or product was changed.

The booking page requires the customer to acknowledge the approved scope before proceeding. Deposits are credited toward the agreed scope; availability, delivery, ownership and cancellation terms remain governed by the written agreement. This is a production-services booking flow, not instant digital fulfillment or a subscription.

Public unfinished membership tier promises and the empty library feed were removed from the launch page. Draft subscription work and approved plan records are retained. Subscription checkout is not certified or launched; zero cleared Studio library assets were found in the production publishable view.

Existing payment ingress verifies Stripe signatures with a five-minute tolerance, accepts only approved Reset links, handles completed and delayed successful payments only when paid, and records protected CreatorHub intake. It does not grant Discord membership or library rights.

Validation before merge: seven existing contract/payment ingress tests pass; changed browser JavaScript passes Node syntax checks. Production verification follows merge and published Netlify deployment. No live test charge, new paid service, plan upgrade or customer access test grant was made.
