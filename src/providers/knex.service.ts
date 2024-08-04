import knex, { Knex } from 'knex';

export class KnexService {
  instance: Knex;

  constructor() {
    this.instance = knex({
      client: 'postgresql',
      connection: {
        host: 'john.db.elephantsql.com',
        database: 'zrdldrse',
        password: 'vW-QMd6vea2sG9HRJxwexLS8heaQVX97',
        user: 'zrdldrse',
      },
      pool: {
        min: 1,
        max: 3,
      },
    });
  }
}

// import knex, { Knex } from 'knex';

// export class KnexService {
//   instance: Knex;

//   constructor() {
//     this.instance = knex({
//       client: 'postgresql',
//       connection: {
//         host: 'localhost',
//         database: 'store',
//         password: '5432',
//         user: 'postgres',
//       },
//       pool: {
//         min: 2,
//         max: 75,
//       },
//     });
//   }
// }
