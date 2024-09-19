import BsonObjectId from 'bson-objectid';

const ObjectId = () => {
  return new BsonObjectId().toHexString();
};

exports.seed = async function (knex) {
  // Deletes ALL existing entries
  await knex('reason_idea_group').del();
  await knex('idea_catalog').del();
  await knex('product').del();
  await knex('catalog').del();
  await knex('idea').del();
  await knex('idea_group').del();
  await knex('reasons').del();

  const data = [
    {
      id: ObjectId(),
      description: 'For celebrating a birthday',
      image: 'birthday.png',
      title: 'Birthday',
    },
    {
      id: ObjectId(),
      description: 'For celebrating a wedding',
      image: 'wedding.png',
      title: 'Wedding',
    },
    {
      id: ObjectId(),
      description: 'For celebrating a promotion',
      image: 'promotion.png',
      title: 'Promotion',
    },
  ];

  console.log('data', data);

  // Insert seed entries for reasons
  const reasonIds = await knex('reasons').insert(data).returning('id');

  // Insert seed entries for idea_group
  const ideaGroupIds = await knex('idea_group')
    .insert([
      { id: ObjectId(), title: 'Luxury Gifts' },
      { id: ObjectId(), title: 'Budget-Friendly Gifts' },
      { id: ObjectId(), title: 'Personalized Gifts' },
    ])
    .returning('id');

  // Associate reasons with idea_groups
  await knex('reason_idea_group').insert([
    { reason_id: reasonIds[0].id, idea_group_id: ideaGroupIds[0].id },
    { reason_id: reasonIds[1].id, idea_group_id: ideaGroupIds[1].id },
    { reason_id: reasonIds[2].id, idea_group_id: ideaGroupIds[2].id },
  ]);

  // Insert seed entries for idea
  const ideaIds = await knex('idea')
    .insert([
      {
        id: ObjectId(),
        description: 'Luxury watch',
        image: 'watch.png',
        title: 'Luxury Watch',
        idea_group_id: ideaGroupIds[0].id,
      },
      {
        id: ObjectId(),
        description: 'Personalized mug',
        image: 'mug.png',
        title: 'Personalized Mug',
        idea_group_id: ideaGroupIds[2].id,
      },
      {
        id: ObjectId(),
        description: 'Gift basket',
        image: 'basket.png',
        title: 'Gift Basket',
        idea_group_id: ideaGroupIds[1].id,
      },
    ])
    .returning('id');

  // Insert seed entries for catalog
  const catalogIds = await knex('catalog')
    .insert([
      { id: ObjectId(), title: 'Holiday Specials' },
      { id: ObjectId(), title: 'Top Sellers' },
      { id: ObjectId(), title: 'New Arrivals' },
    ])
    .returning('id');

  // Associate ideas with catalogs
  await knex('idea_catalog').insert([
    { idea_id: ideaIds[0].id, catalog_id: catalogIds[0].id },
    { idea_id: ideaIds[1].id, catalog_id: catalogIds[1].id },
    { idea_id: ideaIds[2].id, catalog_id: catalogIds[2].id },
  ]);

  // Insert seed entries for product
  await knex('product').insert([
    {
      id: ObjectId(),
      description: 'Elegant luxury watch',
      image: 'watch.png',
      title: 'Luxury Watch',
      price: 1999.99,
      catalog_id: catalogIds[0].id,
    },
    {
      id: ObjectId(),
      description: 'Custom mug with your name',
      image: 'mug.png',
      title: 'Personalized Mug',
      price: 19.99,
      catalog_id: catalogIds[1].id,
    },
    {
      id: ObjectId(),
      description: 'A basket full of gourmet treats',
      image: 'basket.png',
      title: 'Gift Basket',
      price: 49.99,
      catalog_id: catalogIds[2].id,
    },
  ]);
};
