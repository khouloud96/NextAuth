"use server";

import { hashUserPassword } from "@/lib/hash";
import { createUser } from "@/lib/user";
import { redirect } from "next/navigation";

export async function signup(prevState, formData){
    const email = formData.get('email');
    const password = formData.get('password');

    //validate formData values
    let errors = {};

    if(!email.includes('@')){
        errors.email = 'Please enter a valid email address.';
    }
    if(password.trim().length < 8){
        errors.password = 'Password must be at least 8 characters long.';
    }

    if(Object.keys(errors).length > 0){
        return {
            //errors: errors, if key and the value have the same name
            errors,
        };
    }

    // hash password
    const hashedPassword = hashUserPassword(password);
    //store formData in the database (create a new user)
    try {
        createUser(email, hashedPassword);
    } catch(error) {
        if (error.code === 'SQLITE_CONSTRAINT_UNIQUE'){
            return {
                errors: { 
                    email: 'It seems like an account for the chosen email already exists.'
                }
            };
        }
        throw error;
    }

    redirect('/training');
}