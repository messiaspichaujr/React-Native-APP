import {neon} from "@neondatabase/serverless"

import "dotenv/config";

//Cria uma conexão usando a url do banco de dados
export const sql = neon(process.env.DATABASE_URL);