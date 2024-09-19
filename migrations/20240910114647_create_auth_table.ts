import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.transaction(async (trx) => {
    await trx.raw(`
        create table permissions
        (
            id              varchar(255)                                       not null
                primary key,
            permission_name varchar(255)                                       not null
                constraint permissions_permission_name_unique
                    unique,
            created_at      timestamp with time zone default CURRENT_TIMESTAMP not null,
            is_deleted      boolean                  default false             not null
        );
    `);
    await trx.raw(`
        create table position
        (
            id            varchar(24)              default generate_object_id() not null
                constraint position_pk
                    primary key,
            created_at    timestamp with time zone default now()                not null,
            created_by    varchar(24)                                           not null,
            provider_type varchar(50),
            department_id varchar(24),
            is_deleted    boolean                  default false                not null,
            name_uz       varchar(255),
            name_uzl      varchar(255),
            name_ru       varchar(255)
        );`);

    await trx.raw(`
        create table roles
        (
            id         varchar(24)              default generate_object_id() not null
                primary key,
            role_name  varchar(255)                                          not null
                constraint roles_role_name_unique
                    unique,
            created_at timestamp with time zone default CURRENT_TIMESTAMP    not null,
            is_deleted boolean                  default false                not null,
            name_ru    varchar(50),
            name_uzl   varchar(50),
            name_uz    varchar(50)
        );

    `);

    await trx.raw(`
        create table role_permissions
        (
            role_id       varchar(24)                                        not null
                constraint role_permissions_role_id_foreign
                    references roles
                    on delete cascade,
            permission_id varchar(24)                                        not null
                constraint role_permissions_permission_id_foreign
                    references permissions
                    on delete cascade,
            created_at    timestamp with time zone default CURRENT_TIMESTAMP not null,
            is_deleted    boolean                  default false             not null,
            primary key (role_id, permission_id)
        );
    `);

    await trx.raw(`
        create table users
        (
            id            varchar(24)                                        not null
                primary key,
            created_at    timestamp with time zone default CURRENT_TIMESTAMP not null,
            is_deleted    boolean                  default false             not null,
            username      varchar(255),
            password      varchar(100)                                       not null,
            email         varchar(100),
            pinpp         varchar(14),
            phone_number  varchar(12),
            updated_at    timestamp with time zone default CURRENT_TIMESTAMP not null,
            first_name    varchar(255),
            last_name     varchar(255),
            middle_name   varchar(255),
            is_active     boolean                  default true,
            is_verified   boolean                  default false,
            region_id     varchar(30),
            district_id   varchar(30),
            department_id varchar(24),
            position_id   varchar(24),
            db_id         varchar(24),
            created_by    varchar(24),
            is_visible    boolean                  default true
        );`);

    await trx.raw(`
        create table auth_token
        (
            id            varchar(24)              not null
                primary key,
            created_at    timestamp with time zone default CURRENT_TIMESTAMP,
            user_id       varchar(255)
                constraint auth_token_user_id_foreign
                    references users,
            access_token  text,
            expires_at    timestamp with time zone not null,
            is_deleted    boolean                  default false,
            refresh_token text
        );`);

    await trx.raw(`
        create table user_roles
        (
            user_id    varchar(24)                                        not null
                constraint user_roles_user_id_foreign
                    references users
                    on delete cascade,
            role_id    varchar(24)                                        not null
                constraint user_roles_role_id_foreign
                    references roles
                    on delete cascade,
            created_at timestamp with time zone default CURRENT_TIMESTAMP not null,
            is_deleted boolean                  default false             not null,
            primary key (user_id, role_id)
        );
    `);
  });
}

export async function down(knex: Knex): Promise<void> {}
