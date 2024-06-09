import { Hono } from 'hono';
import { userRouter } from './Routes/user';
import { blogRouter } from './Routes/blog';


const app = new Hono<{
	Bindings: {
		DATABASE_URL: string,
		JWT_SECRET: string,
	}
}>();

app.route("/api/v1/user/signup", userRouter);
app.route("/api/v1/blog", blogRouter);

userRouter.use('api/v1/blog/*', async (c, next) => {
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


export default app
