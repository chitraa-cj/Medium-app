import { Hono } from "hono";
import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'
import { sign, verify } from 'hono/jwt'
export const userRouter = new Hono<{
    Bindings: {
		DATABASE_URL: string,
		JWT_SECRET: string,
	}
}>();
  
  userRouter.post('/signup', async (c) => {
    const prisma = new PrismaClient({
      datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate())
  
    const body = await c.req.json();
  
    // Check if the user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: body.email }
    });
  
    if (existingUser) {
      c.status(400);
      return c.json({ error: "User with this email already exists" });
    }
  
    try {
      const user = await prisma.user.create({
        data: {
          email: body.email,
          password: body.password,
        }
      });
      console.log("data")
      const jwt =await sign({ id: user.id }, c.env.JWT_SECRET);
  
      return c.json({ jwt });
    } catch (error) {
      // Handle other possible errors
      c.status(500);
      return c.json({ error: "Internal Server Error" });
    }
  });
  
  
  userRouter.post('/signin', async (c) => {
      const prisma = new PrismaClient({
          datasourceUrl: c.env?.DATABASE_URL	,
      }).$extends(withAccelerate());
    
      const body = await c.req.json();
      const user = await prisma.user.findFirst({
          where: {
              email: body.email,
        password: body.password
          }
      });
  
      if (!user) {
          c.status(403);
          return c.json({ error: "user not found" });
      }
  
      const jwt = await sign({ id: user.id }, c.env.JWT_SECRET);
      return c.json({ jwt });
  })

