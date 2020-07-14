require('dotenv').config();
const knex = require('knex');
const knexInstance = knex({
  client: 'pg',
  connection: process.env.DB_URL,
});

knexInstance.from('shopping_list');

function searchByProductName(searchTerm) {
  knexInstance
    .select('*')
    .from('shopping_list')
    .whereRAW('LOWER(item_name) LIKE ?', '%' + searchTerm.toLowerCase() + '%')
    .then((result) => {
      console.log(result);
    })
    .catch((err) => console.log(err))
    .finally(() => db.destroy());
}
searchByProductName();

function paginateProducts(pageNumber) {
  const productPerPage = 6;
  const offset = productPerPage * (pageNumber - 1);
  knexInstance
    .select('*')
    .from('shopping_list')
    .limit(productPerPage)
    .offset(offset)
    .then((result) => {
      console.log(result);
    })
    .catch((err) => console.log(err))
    .finally(() => db.destroy());
}
paginateProducts();

function addedDaysAgo(daysAgo) {
  knexInstance
    .select('*')
    .where(
      'date_added',
      '>',
      knexInstance.raw(`now() - '?? days':: INTERVAL`, daysAgo)
    )
    .from('shopping_list')
    .groupBy('item_name', 'date_added')
    .then((result) => {
      console.log(result);
    })
    .catch((err) => console.log(err))
    .finally(() => db.destroy());
}
addedAfterDate();

function totalCost() {
  knexInstance
    .select('category')
    .sum('price as total')
    .from('shopping_list')
    .groupBy('category')
    .then((result) => {
      console.log('CATEGORY COST');
      console.log(result);
    })
    .catch((err) => console.log(err))
    .finally(() => db.destroy());
}
totalCost();

//item_name, price, category, checked, date_added
