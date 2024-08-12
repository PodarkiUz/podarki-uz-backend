create table user
(
    id         varchar(24) not null primary key,
    phone      varchar(12) not null unique,
    otp        varchar(5)  null,
    first_name varchar(24) null,
    last_name  varchar(24) null,
    status     smallint    not null,
    is_deleted bool        not null     default false,
    created_at timestamp with time zone default now()
);

create table category
(
    id         varchar(24) not null primary key,
    name_uz    varchar(64) not null,
    name_en    varchar(64) not null,
    name_ru    varchar(64) not null,
    -- original_image      text        null,
    avif_image      text        null,
    small_image      text        null,
    is_deleted bool        not null     default false,
    created_at timestamp with time zone default now()
);

create table sub_category
(
    id         varchar(24) not null primary key,
    name_uz    varchar(64) not null,
    name_en    varchar(64) not null,
    name_ru    varchar(64) not null,
    -- original_image      text        null,
    avif_image      text        null,
    small_image      text        null,
    category_id  varchar(24),
    constraint fk_parent_category foreign key (category_id) references category (id),
    is_deleted bool        not null     default false,
    created_at timestamp with time zone default now()
);

create table shop
(
    id             varchar(24) not null primary key,
    name           varchar(64) not null,
    description    text,
    avif_image      text        null,
    small_image      text        null,
    login           varchar(24) not null,
    password        text        not null,
    status         smallint     not null default 1,
    is_deleted     bool        not null     default false,
    created_at     timestamp with time zone default now()
);

create table product
(
    id             varchar(24) not null primary key,
    name_uz        varchar(64) not null,
    name_en        varchar(64) not null,
    name_ru        varchar(64) not null,
    image          text        null,
    sub_category_id    varchar(24),
    constraint fk_sub_category foreign key (sub_category_id) references sub_category (id),
    price          integer       not null,
    discount_price     integer,
    avif_images      text        null,
    small_image      text        null,
    status          smallint    default 1,
    on_sale         bool        default false,
    count        smallint,
    shop_id       varchar(24),
    constraint fk_shop foreign key (shop_id) references shop (id),
    description    text,
    is_deleted     bool        not null     default false,
    created_at     timestamp with time zone default now()
);

create table orders
(
    id         varchar(24) not null primary key,
    product_id    varchar(64) not null,
    count   smallint not null default 1,
    is_deleted bool        not null     default false,
    created_at timestamp with time zone default now(),
    client_data jsonb not null,
    price integer not null,
    seller_id varchar(24) not null,
    status smallint not null default 0
);

create table advertisements
(
    id         varchar(24) not null primary key,
    title      varchar(255),
    image          text        null,
    link          text        null,
    is_deleted bool        not null     default false,
    created_at timestamp with time zone default now(),
);



-- New STROY-MARKET DATABASE DESIGN

-- Create extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create enum type
CREATE TYPE product_attribute_type AS ENUM ('color', 'size');

-- Create tables
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    avatar VARCHAR,
    first_name VARCHAR,
    last_name VARCHAR,
    username VARCHAR NOT NULL UNIQUE,
    email VARCHAR NOT NULL UNIQUE,
    password VARCHAR,
    birth_of_date DATE,
    phone_number VARCHAR,
    is_deleted BOOLEAN default false,
    created_at TIMESTAMP with time zone default CURRENT_TIMESTAMP  not null,
    deleted_at TIMESTAMP
);

CREATE TABLE addresses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id INTEGER REFERENCES users(id),
    title VARCHAR,
    address_line_1 VARCHAR,
    address_line_2 VARCHAR,
    country VARCHAR,
    city VARCHAR,
    postal_code VARCHAR,
    landmark VARCHAR,
    phone_number VARCHAR,
    is_deleted BOOLEAN default false,
    created_at TIMESTAMP with time zone default CURRENT_TIMESTAMP  not null,
    deleted_at TIMESTAMP
);

CREATE TABLE categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name_uz VARCHAR(64),
    name_ru VARCHAR(64),
    description VARCHAR,
    is_deleted BOOLEAN default false,
    created_at TIMESTAMP with time zone default CURRENT_TIMESTAMP  not null,
    deleted_at TIMESTAMP
);

CREATE TABLE sub_categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    parent_id INTEGER REFERENCES categories(id),
    name_uz VARCHAR(64),
    name_ru VARCHAR(64),
    description VARCHAR,
    is_deleted BOOLEAN default false,
    created_at TIMESTAMP with time zone default CURRENT_TIMESTAMP  not null,
    deleted_at TIMESTAMP
);

CREATE TABLE products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name_uz VARCHAR(96),
    name_ru VARCHAR(96),
    description VARCHAR,
    summary VARCHAR,
    cover VARCHAR,
    category_id INTEGER REFERENCES categories(id),
    sub_category_id INTEGER REFERENCES sub_categories(id),
    is_deleted BOOLEAN default false,
    created_at TIMESTAMP with time zone default CURRENT_TIMESTAMP  not null,
    deleted_at TIMESTAMP
);

CREATE TABLE product_attributes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    type product_attribute_type,
    value VARCHAR,
    is_deleted BOOLEAN default false,
    created_at TIMESTAMP with time zone default CURRENT_TIMESTAMP  not null,
    deleted_at TIMESTAMP
);

CREATE TABLE products_skus (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id INTEGER REFERENCES products(id),
    size_attribute_id INTEGER REFERENCES product_attributes(id),
    color_attribute_id INTEGER REFERENCES product_attributes(id),
    sku VARCHAR,
    price VARCHAR,
    quantity INTEGER,
    is_deleted BOOLEAN default false,
    created_at TIMESTAMP with time zone default CURRENT_TIMESTAMP  not null,
    deleted_at TIMESTAMP
);

CREATE TABLE wishlist (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id INTEGER REFERENCES users(id),
    product_id INTEGER REFERENCES products(id),
    is_deleted BOOLEAN default false,
    created_at TIMESTAMP with time zone default CURRENT_TIMESTAMP  not null,
    deleted_at TIMESTAMP
);

CREATE TABLE cart (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id INTEGER REFERENCES users(id),
    total INTEGER,
    is_deleted BOOLEAN default false,
    created_at TIMESTAMP with time zone default CURRENT_TIMESTAMP  not null,
    updated_at TIMESTAMP
);

CREATE TABLE cart_item (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    cart_id INTEGER REFERENCES cart(id),
    product_id INTEGER REFERENCES products(id),
    products_sku_id INTEGER REFERENCES products_skus(id),
    quantity INTEGER,
    is_deleted BOOLEAN default false,
    created_at TIMESTAMP with time zone default CURRENT_TIMESTAMP  not null,
    updated_at TIMESTAMP
);

CREATE TABLE order_details (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id INTEGER REFERENCES users(id),
    payment_id INTEGER,
    total INTEGER,
    is_deleted BOOLEAN default false,
    created_at TIMESTAMP with time zone default CURRENT_TIMESTAMP  not null,
    updated_at TIMESTAMP
);

CREATE TABLE order_item (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id INTEGER REFERENCES order_details(id),
    product_id INTEGER REFERENCES products(id),
    products_sku_id INTEGER REFERENCES products_skus(id),
    quantity INTEGER,
    is_deleted BOOLEAN default false,
    created_at TIMESTAMP with time zone default CURRENT_TIMESTAMP  not null,
    updated_at TIMESTAMP
);

CREATE TABLE payment_details (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id INTEGER REFERENCES order_details(id),
    amount INTEGER,
    provider VARCHAR,
    status VARCHAR,
    is_deleted BOOLEAN default false,
    created_at TIMESTAMP with time zone default CURRENT_TIMESTAMP  not null,
    updated_at TIMESTAMP
);