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

The app can be deployed on Netlify. The build settings and React Router redirect
are in `netlify.toml`. Add the two Supabase environment variables before deploying.

Public URL: https://loquacious-tapioca-139023.netlify.app

## Test accounts

| Role | Email | Password |
| --- | --- | --- |
| Customer | `demo.kund@gmail.com` | `iamhangry` |
| Staff | `jn@thehiveresistance.com` | `iamhangry` |

## Database

The database migrations and security policies are in `supabase/migrations`.
Run them in order when setting up a new Supabase project.

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

### What the database enforces

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

The project was checked with customer and staff accounts. The checks include:

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

Code checks:

```bash
npm run lint
npm run build
npm run type-coverage
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
Git and Trello are used to organize and track the development process.
