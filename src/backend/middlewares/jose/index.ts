import { Course, Package, UserPackage } from '@/backend/types';
import {SignJWT, jwtVerify, } from 'jose';

export type Token = {
    id: string,
    admin: boolean,
    courses: (Course | undefined)[] ;
}

export async function sign(payload: Token, secret: string): Promise<string> {
    const iat = Math.floor(Date.now() / 1000);
    const exp = iat + 60* 60 * 24; // 24 hours

    return new SignJWT({...payload})
        .setProtectedHeader({alg: 'HS256', typ: 'JWT'})
        .setExpirationTime(exp)
        .setIssuedAt(iat)
        .setNotBefore(iat)
        .sign(new TextEncoder().encode(secret));
}

export async function verify(token: string, secret: string): Promise<Token | null> {
    try{
        
        const {payload} = await jwtVerify(token, new TextEncoder().encode(secret)) as {payload: Token};
        return payload;

        }catch(err){
            return null
        }
}