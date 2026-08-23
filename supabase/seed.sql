-- Optional sample menu, handy while developing. Run it in the SQL editor after
-- the migrations. Safe to run more than once.

insert into public.dishes (name, description, category, price, is_active)
values
  (
    'Halloumi burger',
    'Grilled halloumi, tomato, pickled red onion and garlic sauce in a brioche bun.',
    'Burgers',
    139.00,
    true
  ),
  (
    'Double cheeseburger',
    'Two beef patties, cheddar, crispy onion and burger sauce.',
    'Burgers',
    159.00,
    true
  ),
  (
    'Falafel bowl',
    'Falafel, bulgur, roasted vegetables, hummus and lemon dressing.',
    'Bowls',
    129.00,
    true
  ),
  (
    'Chicken teriyaki bowl',
    'Marinated chicken, jasmine rice, edamame, cucumber and sesame.',
    'Bowls',
    149.00,
    true
  ),
  (
    'Sweet potato fries',
    'Served with chipotle mayo.',
    'Sides',
    49.00,
    true
  ),
  (
    'Chocolate brownie',
    'Warm brownie with sea salt.',
    'Desserts',
    45.00,
    true
  ),
  (
    'Summer melon salad',
    'Seasonal dish from last summer, kept for the order history.',
    'Salads',
    119.00,
    false
  )
on conflict (name) do nothing;
