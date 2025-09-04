// lib/session.ts
import jwt from "jsonwebtoken";
import { GET_USER_BY_ID } from "@/graphql/Query/AuthorQuery";
import { print } from "graphql";

interface JwtPayloadCustom {
  userId: number;
  email?: string;
  name?: string;
  provider?:string,
}

export async function getCurrentUserFromToken(token: string | undefined) {
  if (!token) return null;

  try {
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET!) as JwtPayloadCustom;
    const queryString = print(GET_USER_BY_ID);

    const response = await fetch("http://localhost:3005/graphql", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        query: queryString,
        variables: { id: decoded.userId },
      }),
    });

    const data = await response.json();
    return  {
      data : {
        ...data.data.userDetail ,
        provider: decoded.provider
      }
    }
  } catch (err) {
    console.log(err);
    return null;
  }
}
