CREATE TABLE companies (
    id UUID PRIMARY KEY default uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    owner_user_id UUID REFERENCES users(id) NOT NULL,
    created_at TIMESTAMP NOT NULL
);

CREATE TABLE apps (
    id UUID PRIMARY KEY default uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    owner_user_id UUID REFERENCES users(id) NOT NULL,
    company_id UUID references companies(id) NOT NULL,
    created_at TIMESTAMP NOT NULL
);

CREATE TABLE api_keys (
    id UUID PRIMARY KEY default uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    key_hash VARCHAR(255) NOT NULL,
    owner_user_id UUID REFERENCES users(id) NOT NULL,
    company_id UUID references companies(id) NOT NULL,
    app_id UUID references apps(id) NOT NULL,
    created_at TIMESTAMP NOT NULL
);


CREATE TRIGGER set_timestamp
BEFORE UPDATE ON apps, api_keys, companies, channels,messages,users
FOR EACH ROW
EXECUTE PROCEDURE trigger_set_timestamp();