CREATE TABLE IF NOT EXISTS contact_messages (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  name varchar(100) NOT NULL,
  email varchar(254) NOT NULL,
  message varchar(4000) NOT NULL,
  client_hash char(64) NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS contact_messages_client_created_idx ON contact_messages (client_hash, created_at);

CREATE TABLE IF NOT EXISTS analytics_events (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  event varchar(32) NOT NULL CHECK (event IN ('page_view', 'contact_submit')),
  path varchar(200) NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS analytics_events_created_idx ON analytics_events (created_at);

-- Hashes are operational rate-limit data, separate from anonymous events.
CREATE TABLE IF NOT EXISTS analytics_rate_limits (
  client_hash char(64) PRIMARY KEY,
  window_start timestamptz NOT NULL,
  count integer NOT NULL CHECK (count > 0)
);
