CREATE DATABASE videoteca;

CREATE TABLE users (
  admin BOOL NOT NULL,
  hash TEXT NOT NULL,
  salt TEXT NOT NULL,
  scope TEXT NOT NULL,
  username TEXT PRIMARY KEY NOT NULL
);

CREATE TABLE movies (
  countries TEXT[] NOT NULL,
  genres TEXT[] NOT NULL,
  feedback TEXT,
  id TEXT PRIMARY KEY NOT NULL,
  languages TEXT[] NOT NULL,
  modified TEXT NOT NULL,
  original_title TEXT NOT NULL,
  plot TEXT NOT NULL,
  publish_date INT NOT NULL,
  published_by TEXT NOT NULL,
  release_date INT NOT NULL,
  sf BOOL NOT NULL,
  sv BOOL NOT NULL,
  translated_title TEXT NOT NULL,
  type TEXT NOT NULL,
  year INT NOT NULL,
  poster TEXT NOT NULL
);