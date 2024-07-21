import { z } from "@hono/zod-openapi"
import { createRoute } from "@hono/zod-openapi"
import { OpenAPIHono } from "@hono/zod-openapi"
import { swaggerUI } from '@hono/swagger-ui'


const ParamsSchema = z.object({
  id: z.string().min(3).openapi({
    param:{
      name: "id",
      in: "path"
    },
    example:"1212121"

  })
})


const userSchema = z.object({
  id: z.string().openapi({
    example:"123"
  }),
  
  name: z.string().openapi({
    example:"john doe"
  }),

  age: z.string().openapi({
    example: "15"
  })
}).openapi("User")


const route = createRoute({
  method:"get",
  path: "/user/{id}",
  request: {
    params: ParamsSchema
  },
  responses:{
    200:{
      content:{
        "application/json":{
          schema:userSchema
        }
      },
      description:"Retrieve the user"
    }
  }
})
 




const app = new OpenAPIHono()

app.openapi(route,(c:any)=>{
  const { id } = c.req.valid("param")
  return c.json({ 
    id,
    age:20,
    name:"ultra-man"
  })
})


app.doc("/doc",{
  openapi: "3.0.0",
  info: {
    version: "1.0.0",
    title: "My API"
  }
})

app.get("/ui", swaggerUI({url: "/doc"}))

export default app