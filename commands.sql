drop table if exists companies;
drop table if exists apps;
drop table if exists api_keys;
drop table if exists users;
drop table if exists channels;
drop table if exists messages;
drop table if exists user_app;
drop table if exists company_app;
drop table if exists api_key_app;
drop table if exists user_channel;
drop table if exists message_channel;
drop table if exists message_user;
drop table if exists developers;
drop table if exists company_developer;
drop table if exists developer_app;
drop table if exists api_key_developer;

CREATE TABLE companies (
    id UUID PRIMARY KEY default uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

CREATE TABLE apps (
    id UUID PRIMARY KEY default uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

CREATE TABLE api_keys (
    id UUID PRIMARY KEY default uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    api_key VARCHAR(255) NOT NULL,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

CREATE TABLE developers (
    id UUID PRIMARY KEY default uuid_generate_v4(),
    username VARCHAR(255) NOT NULL,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

CREATE TABLE users (
    id UUID PRIMARY KEY default uuid_generate_v4(),
    username VARCHAR(255) NOT NULL,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

CREATE TABLE channels (
    id UUID PRIMARY KEY default uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    owner_user_id UUID REFERENCES users(id) on delete set null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

CREATE TABLE messages (
    id UUID PRIMARY KEY default uuid_generate_v4(),
    message TEXT NOT NULL,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

CREATE TABLE company_developer (
    id UUID PRIMARY KEY default uuid_generate_v4(),
    company_id UUID REFERENCES companies(id) on delete cascade,
    developer_owner_id UUID REFERENCES developers(id) on delete cascade
);

CREATE TABLE developer_app (
    id UUID PRIMARY KEY default uuid_generate_v4(),
    developer_id UUID REFERENCES developers(id) on delete cascade,
    app_id UUID REFERENCES apps(id) on delete cascade
);

CREATE TABLE company_app (
    id UUID PRIMARY KEY default uuid_generate_v4(),
    company_id UUID REFERENCES companies(id) on delete cascade,
    app_id UUID REFERENCES apps(id) on delete cascade
);
CREATE TABLE channel_app (
    id UUID PRIMARY KEY default uuid_generate_v4(),
    channel_id UUID REFERENCES channels(id) on delete cascade,
    app_id UUID REFERENCES apps(id) on delete cascade
);

CREATE TABLE api_key_app (
    id UUID PRIMARY KEY default uuid_generate_v4(),
    api_key_id UUID REFERENCES api_keys(id) on delete set null,
    app_id UUID REFERENCES apps(id) on delete cascade
);

CREATE TABLE api_key_developer (
    id UUID PRIMARY KEY default uuid_generate_v4(),
    api_key_id UUID REFERENCES api_keys(id) on delete set null,
    developer_id UUID REFERENCES developers(id) on delete cascade
);

CREATE TABLE user_app (
    id UUID PRIMARY KEY default uuid_generate_v4(),
    user_id UUID REFERENCES users(id) on delete set null,
    app_id UUID REFERENCES apps(id) on delete cascade
);

CREATE TABLE user_channel (
    id UUID PRIMARY KEY default uuid_generate_v4(),
    user_id UUID REFERENCES users(id) on delete set null,
    channel_id UUID REFERENCES channels(id) on delete cascade
);

CREATE TABLE message_channel (
    id UUID PRIMARY KEY default uuid_generate_v4(),
    message_id UUID REFERENCES messages(id) on delete set null,
    channel_id UUID REFERENCES channels(id) on delete cascade
);

CREATE TABLE message_user (
    id UUID PRIMARY KEY default uuid_generate_v4(),
    message_id UUID REFERENCES messages(id) on delete set null,
    user_id UUID REFERENCES users(id) on delete cascade
);


CREATE OR REPLACE FUNCTION trigger_set_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = timezone('utc'::text, now());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_timestamp
BEFORE UPDATE ON apps
FOR EACH ROW
EXECUTE PROCEDURE trigger_set_timestamp();

CREATE TRIGGER set_timestamp
BEFORE UPDATE ON api_keys
FOR EACH ROW
EXECUTE PROCEDURE trigger_set_timestamp();

CREATE TRIGGER set_timestamp
BEFORE UPDATE ON  companies
FOR EACH ROW
EXECUTE PROCEDURE trigger_set_timestamp();

CREATE TRIGGER set_timestamp
BEFORE UPDATE ON users
FOR EACH ROW
EXECUTE PROCEDURE trigger_set_timestamp();

CREATE TRIGGER set_timestamp
BEFORE UPDATE ON channels
FOR EACH ROW
EXECUTE PROCEDURE trigger_set_timestamp();

CREATE TRIGGER set_timestamp
BEFORE UPDATE ON messages
FOR EACH ROW
EXECUTE PROCEDURE trigger_set_timestamp();