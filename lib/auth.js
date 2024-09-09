import { Lucia } from 'lucia';
import { BetterSqlite3Adapter } from '@lucia-auth/adapter-sqlite'

import db from './db';
import { cookies } from 'next/headers';

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

// for a given user, this function should create and store a new session
//and set a cookie with the data that should be set 
export async function createAuthSession(userId) {
    const session = await lucia.createSession(userId, {});
    const sessionCookie = lucia.createSessionCookie(session.id);
    cookies().set(
      sessionCookie.name,
      sessionCookie.value,
      sessionCookie.attributes
    );
  }

// this function check whether an incoming request is coming from an 
// authenticated user (existing of the cookie + validity of the cookie) 
export async function verifyAuth() {
    const sessionCookie = cookies().get(lucia.sessionCookieName);
  
    if (!sessionCookie) {
      return {
        user: null,
        session: null,
      };
    }
  
    const sessionId = sessionCookie.value;
  
    if (!sessionId) {
      return {
        user: null,
        session: null,
      };
    }
  
    const result = await lucia.validateSession(sessionId);
  
    try {
        // chck if we have a true active session 
      if (result.session && result.session.fresh) {
        const sessionCookie = lucia.createSessionCookie(result.session.id);
        //prelong the cookie session
        cookies().set(
          sessionCookie.name,
          sessionCookie.value,
          sessionCookie.attributes
        );
      }
      // we didn't find a session on the result => it's invalid => clear the cookie session
      if (!result.session) {
        const sessionCookie = lucia.createBlankSessionCookie();
        cookies().set(
          sessionCookie.name,
          sessionCookie.value,
          sessionCookie.attributes
        );
      }
    } catch {}
  
    return result;
  }

  export async function destroySession() {
    const { session } = await verifyAuth();
    if (!session) {
      return {
        error: 'Unauthorized!',
      };
    }
  
    await lucia.invalidateSession(session.id);
  
    const sessionCookie = lucia.createBlankSessionCookie();
    cookies().set(
      sessionCookie.name,
      sessionCookie.value,
      sessionCookie.attributes
    );
  }