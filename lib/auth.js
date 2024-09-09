import { Lucia } from 'lucia';
import { BetterSqlite3Adapter } from '@lucia-auth/adapter-sqlite'

import db from './db';

// adapter to tell Lucia where w're going to store sessions and where users are stored
const adapter = new BetterSqlite3Adapter(db, {
  user: 'users',
  session: 'sessions'
});

// create a new Lucia auth instance
const lucia = new Lucia(adapter, {
  sessionCookie: {
    expires: false,
    attributes: {
        // to enforce this cookie to only work accross https
      secure: process.env.NODE_ENV === 'production'
    }
  }
});