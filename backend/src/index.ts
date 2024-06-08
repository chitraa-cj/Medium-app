import { Hono } from 'hono';
import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'
import { sign, verify } from 'hono/jwt'

const app = new Hono<{
	Bindings: {
		DATABASE_URL: string,
		JWT_SECRET: string,
	}
}>();

app.use('api/v1/blog/*', async (c, next) => {
  const header = c.req.header("authorization")
  const token = header?.split(" ")[1]
  //@ts-ignore
  const response = await verify(token, c.env.JWT_SECRET)
  if(response.id){
    next()
  }else{
    c.status(403)
    return c.json({error: "unauthorized"})
  }
})

app.post('/api/v1/user/signup', async (c) => {
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
    console.log(jwt)
    return c.json({ jwt });
  } catch (error) {
    // Handle other possible errors
    c.status(500);
    return c.json({ error: "Internal Server Error" });
  }
});


app.post('/api/v1/signin', async (c) => {
	const prisma = new PrismaClient({
		datasourceUrl: c.env?.DATABASE_URL	,
	}).$extends(withAccelerate());

	const body = await c.req.json();
	const user = await prisma.user.findUnique({
		where: {
			email: body.email,
		}
	});

	if (!user) {
		c.status(403);
		return c.json({ error: "user not found" });
	}

	const jwt = await sign({ id: user.id }, c.env.JWT_SECRET);
	return c.json({ jwt });
})

app.post('/api/v1/blog', (c) => {
  return c.text('blog')
})
app.put('/api/v1/blog', (c) => {
  return c.text('blog 2')
})
app.get('/api/v1/blog/:id', (c) => {
  return c.text('blod 3')
})
app.put('/api/v1/blog/bulk', (c) => {
  return c.text('blog bulk')
})


export default app
