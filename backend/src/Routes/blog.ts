import { createBlogInput, updateBlogInput } from "@chitrajain/medium-common";
import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { Hono } from "hono";
import { verify } from "hono/jwt";

export const blogRouter = new Hono<{
    Bindings: {
		DATABASE_URL: string;
		JWT_SECRET: string;
	},
    Variables: {
        userId: string;
    }
}>();

blogRouter.use("/*", async (c,next)=>{
    const authHeader = c.req.header("authorization") || "";
    const user = await verify(authHeader, c.env.JWT_SECRET);
    if(user){
        c.set("userId",String(user.id))
        await next();
    }else{
        c.status(403)
        return c.json({
            message: "You are not logged in"
        })
    }

})

blogRouter.post('/', async (c) => {
    const body = await c.req.json();
    const authorId = c.get("userId");
	const {success} = createBlogInput.safeParse(body);
    if(!success){
      c.status(411)
      return c.json({
        message: "Input not correct"
      })
    }
    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate())

    console.log("before");

    const blog = await prisma.post.create({
        data: {
            title: body.title,
            content: body.content,
            authorId: Number(authorId)
        }
    })
    console.log("after");

    return c.json({
        id: blog.id
    })

  })
blogRouter.put('/', async (c) => {
    const body = await c.req.json();
	const {success} = updateBlogInput.safeParse(body);
    if(!success){
      c.status(411)
      return c.json({
        message: "Input not correct"
      })
    }
    const prisma = new PrismaClient({
        datasourceUrl:c.env.DATABASE_URL,
    }).$extends(withAccelerate())

    const blog = await prisma.post.update({
        where: {
            id: body.id
        },
        data: {
            title: body.title,
            content: body.content,
        }
    })

    return c.json({
        id: blog.id
    })
  })

  blogRouter.get('/bulk', async(c) => {
    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate())
    const posts = await prisma.post.findMany();

    return c.json({
        posts
    })
  })


blogRouter.get('/:id', async (c) => {
    const id =  c.req.param("id");
    const prisma = new PrismaClient({
        datasourceUrl:c.env.DATABASE_URL,
    }).$extends(withAccelerate())

    try{
        const blog = await prisma.post.findFirst({
            where: {
                id: Number(id)
            },
        })
        return c.json({
            blog
        })
    }catch(e){
        c.status(411);
        return c.json({
            message: "Error while fetching"
        })
    }

    
  })