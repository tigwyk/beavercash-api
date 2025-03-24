import { serve } from 'bun';
import db from './db';

const PORT = 3000;

// User handlers
async function handleGetAllUsers() {
    return new Response(
        JSON.stringify(await db.user.findMany({orderBy:{
            createdAt: 'asc'
        }})), {
            headers: { 'Content-Type': 'application/json' }
        });
}

async function handleGetUserById(id: number) {
    const user = await db.user.findUnique({
        where: {
            id
        }
    });
    if (!user) {
        return new Response('Not Found', { status: 404 });
    }
    return new Response(
        JSON.stringify(user), {
            headers: { 'Content-Type': 'application/json' }
        });
}

async function handleCreateUser(name: string, email: string) {
    const newUser = await db.user.create({
        data: {
            name,
            email
        }
    });

    console.log('New user created:', newUser);
    return new Response(
        JSON.stringify(newUser), {
            headers: { 'Content-Type': 'application/json' },
            status: 201
        });
}

async function handleUpdateUser(id: number, options: { name?: string, email?: string}) {
    const { name, email } = options;
    await db.user.update({
        where: {
            id
        },
        data: {
            ... (name ? { name } : {}),
            ... (email ? { email } : {})
        }
    });

    return new Response('Updated', { status: 200 });
}

async function handleDeleteUser(id: number) {
    await db.user.delete({
        where: {
            id
        }
    });

    return new Response('Deleted', { status: 200 });
}

serve({
    port: PORT,
    routes: {
        // Static routes
        "/api/status": new Response("OK"),
    
        // Dynamic routes
        "/api/users/:id": async req => {
            const id = req.params.id;
            return handleGetUserById(parseInt(id));
                },
        "/api/users" : {
        GET: () => handleGetAllUsers(),
        POST: async req => {
            const body = await req.json();
            return handleCreateUser(body.name, body.email);
        },
        PUT: async req => {
            const body = await req.json();
            return handleUpdateUser(parseInt(body.id), { name: body.name, email: body.email });
        },
        DELETE: async req => {
            const body = await req.json();
            return handleDeleteUser(parseInt(body.id));
        }
        },
    
        // Wildcard route for all routes that start with "/api/" and aren't otherwise matched
        "/api/*": Response.json({ message: "Not found" }, { status: 404 }),
      },
    
      // (optional) fallback for unmatched routes:
      // Required if Bun's version < 1.2.3
      fetch(req) {
        return new Response("Not Found", { status: 404 });
      },
});

console.log(`BeavercashAPI Server running at http://localhost:${PORT}`);