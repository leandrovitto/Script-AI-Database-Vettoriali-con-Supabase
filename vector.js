import { config } from "dotenv";
config();

import { SupabaseVectorStore } from 'langchain/vectorstores/supabase'
import { OpenAIEmbeddings } from 'langchain/embeddings/openai'
import { createClient } from '@supabase/supabase-js'

const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY
if (!supabaseKey) throw new Error(`Expected SUPABASE_SERVICE_ROLE_KEY`)

const url = process.env.SUPABASE_URL
if (!url) throw new Error(`Expected env var SUPABASE_URL`)

export const run = async () => {
    const client = createClient(url, supabaseKey)
  
    const vectorStore = await SupabaseVectorStore.fromTexts(
      ['Ciao Mondo', 'Prodotto in offertà', "Un ristorante a Napoli"],
      [{ id: 2 }, { id: 1 }, { id: 3 }],
      new OpenAIEmbeddings(),
      {
        client,
        tableName: 'documents',
        queryName: 'match_documents',
      }
    ).then((vectorStore) => {
      console.log(vectorStore)
      return vectorStore
    }).catch((error) => {
      console.log(error)
    })
  
  
   /*  const resultOne = await vectorStore.similaritySearch('Hello world', 1)
  
    console.log(resultOne) */
  }
  

  export const search = async () => {
    const client = createClient(url, supabaseKey)
  
    const vectorStore = await SupabaseVectorStore.fromExistingIndex(new OpenAIEmbeddings(),{
      client,
      tableName: 'documents',
      queryName: 'match_documents',
    });
  
    const resultOne = await vectorStore.similaritySearch('Hai qualcosa su Napoli?', 1)
  
    console.log(resultOne)
  }

  search();