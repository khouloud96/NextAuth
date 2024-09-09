# NextAuth
NextAuth is a online application that allows users to do some online trainings. 

It is based on NextJs:
* User signup
* User signin
* Protecting Routes

## Chosing a Third-Party Auth Package (Lucia) 
Lucia is an auth library for your server that abstracts away the complexity of handling sessions. 
It works alongside your database to provide an API that's easy to use, understand, and extend.

This external library will allow us to store auth sessions and use them to identify authenticated users.
* npm install lucia @lucia-auth/adapter-sqlite 
