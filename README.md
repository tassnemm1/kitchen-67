# Kitchen 67

A food ordering service for a single restaurant. Guests browse the menu, add dishes
to a cart and place a pickup order. Restaurant staff manage the menu and incoming
orders.

Built with React, React Router, TypeScript and Supabase (Auth, Database and Storage).

## Features

### Customer


- Welcome landing page with a full-screen restaurant background video.
- Navigate from the welcome page to the restaurant menu.
- Sign up and sign in with Supabase Authentication.
- Browse active dishes on the menu.
- View dish details.
- Customize dishes with available options.
- Add dishes to the shopping cart.
- Change quantities in the cart.
- Remove dishes from the cart.
- Place a pickup order.
- View order confirmation after checkout.
- View previous orders.
- View order details.
- Customers can only access their own orders.

### Staff

- Staff dashboard for restaurant management.
- Create new dishes.
- Edit existing dishes.
- Archive and reactivate dishes.
- View active and archived dishes.
- View all customer orders.
- View individual order details.
- Update order status.
- Order status follows:
  `pending -> preparing -> ready -> picked_up`

### Security

Supabase Row Level Security (RLS) is used to protect the database.

Customers can only access their own orders and order items, while staff accounts
have additional permissions for managing dishes and orders.

Staff access cannot be assigned by a customer through the application.

## Getting started

```bash
npm install
cp .env.example .env.local
npm run dev
```

Fill in your Supabase values in `.env.local` before starting the application.

## Environment variables

The app needs a Supabase project.

Copy the Supabase project values into `.env.local`:

| Variable | Where to find it |
| --- | --- |
| `VITE_SUPABASE_URL` | Project Settings -> API -> Project URL |
| `VITE_SUPABASE_ANON_KEY` | Project Settings -> API -> anon public key |

`.env.local` is git-ignored.

Only client-safe keys belong in it. The `service_role` key must never be added
to the source code or repository.

## Deployment

The application is a static Vite build, deployed on Netlify. `netlify.toml` holds
the build command, the publish directory and one redirect rule.

That rule matters more than it looks. React Router owns the addresses, not the
file system, so a reload on `/menu` would otherwise ask Netlify for a file that
was never built and the guest would meet a 404 instead of the menu.

Set the two environment variables from `.env.example` under **Site settings ->
Environment variables** before the first deploy. They are read at build time, so
a build started before they exist will produce a site that cannot reach Supabase.

Public URL: _fill in once the site is live_

## Test accounts

| Role | Email | Password |
| --- | --- | --- |
| Customer | `demo.kund@gmail.com` | `iamhangry` |
| Staff | `jn@thehiveresistance.com` | `iamhangry` |

The customer account has two orders. One of them contains a dish that was
archived afterwards, so the order history can be seen holding on to something
the menu no longer offers.

## Database

The SQL that defines the schema, Row Level Security policies and storage policies
lives in `supabase/migrations`.

Run the migration files in order in the Supabase SQL Editor when setting up a
new project.

`supabase/seed.sql` can be used to add sample dishes.

### Data model

```text
auth.users 1 --- 1 profiles
profiles   1 --- * orders
orders     1 --- * order_items
dishes     1 --- * order_items
```

| Table | Holds |
| --- | --- |
| `profiles` | Name and role for every account |
| `dishes` | Name, description, category, price, image path and active flag |
| `orders` | Order number, customer, status, total and note |
| `order_items` | Ordered dishes with saved name, price and selected options |

An order item stores its own copy of `dish_name` and `unit_price`, so editing
the menu later does not change an old order.

`order_items.dish_id` uses `on delete restrict`. This means a dish that has
already been ordered cannot be deleted and should instead be archived.

### What the database enforces

The interface is not what protects the data. Important rules are also enforced
in the database.

- Roles are stored in `public.profiles.role`.
- A profile is created for a new authenticated user.
- Customers cannot give themselves staff access.
- Prices are calculated from the menu and the selected extras.
- Order totals are calculated from the order items.
- Archived dishes cannot be ordered.
- Customers can only read their own orders and order items.
- Staff have additional permissions for managing dishes and orders.
- Order status follows:
  `pending -> preparing -> ready -> picked_up`.

The first staff account can be promoted manually in Supabase:

```sql
update public.profiles
set role = 'staff'
where id = '<user-id>';
```

## Scripts

| Script | Description |
| --- | --- |
| `npm run dev` | Start the development server |
| `npm run build` | Type-check and build for production |
| `npm run lint` | Run Oxlint |
| `npm run preview` | Preview the production build locally |

Type coverage can also be checked with:

```bash
npx type-coverage --project tsconfig.app.json --detail
```

## Project structure

```text
src/
  lib/        Shared clients and low level helpers
  services/   Database, authentication and storage calls
  hooks/      Custom hooks
  context/    React context providers
  components/ Reusable UI components
  pages/      Route components
  types/      Shared TypeScript types
```

## Testing

The application is tested with different user accounts and permissions.

The tests verify that:

- Customers can browse active dishes.
- Customers can add dishes to the cart.
- Customers can place an order.
- Order items are saved correctly.
- Order totals are calculated correctly.
- Customers can view their own order history.
- Customers can view their own order details.
- Customers cannot access another customer's orders.
- Row Level Security prevents unauthorized access.
- Staff and customer permissions are separated.

Before finishing the project, the code can be checked with:

```bash
npm run lint
npm run build
npx type-coverage --project tsconfig.app.json --detail
```

## Known limitations

- Pickup only. There is no payment and no delivery.
- Dishes are archived, never deleted, so an old order keeps its contents. The
  database enforces this with `on delete restrict`.
- An order only moves forward, one step at a time. Nothing takes it back, and a
  customer cannot cancel one.
- Nothing updates by itself. Staff reload the order overview to see new orders.
- The menu has no search, filtering or sorting.
- Email confirmation is turned off in Supabase, so a new account can sign in
  straight away.
- The cart lives in one browser. It does not follow the customer to another
  device.

## Team

This project was developed as a group assignment by Tasnem and Rojina.
The work was divided between the team members using separate tasks and feature
areas. Both team members also participate in testing, database setup,
documentation and final integration.

Git and Trello are used to organize and track the development process.
