import { serve } from 'bun';

const PORT = 3000;

interface Post {
    id: string;
    title: string;
    content: string;
}

interface User {
    id: string;
    name: string;
    email: string;
}

let blogPosts : Post[] = [];
let users : User[] = [];

// Post handlers
function handleGetAllPosts() {
    return new Response(
        JSON.stringify(blogPosts), {
            headers: { 'Content-Type': 'application/json' }
        });
}

function handleGetPostById(id: string) {
    const post = blogPosts.find(post => post.id === id);
    if (!post) {
        return new Response('Not Found', { status: 404 });
    }
    return new Response(
        JSON.stringify(post), {
            headers: { 'Content-Type': 'application/json' }
        });
}

function handleCreatePost(title: string, content: string) {
    const newPost : Post = {
        id: `${blogPosts.length}`,
        title,
        content
    };

    blogPosts.push(newPost);
    console.log('New post created:', newPost);
    return new Response(
        JSON.stringify(newPost), {
            headers: { 'Content-Type': 'application/json' },
            status: 201
        });
}

function handleUpdatePost(id: string, title: string, content: string) {
    const postIndex = blogPosts.findIndex((post) => post.id === id);
    if (postIndex === -1) {
        return new Response('Not Found', { status: 404 });
    }

    blogPosts[postIndex] = {
        ... blogPosts[postIndex],
        title,
        content
    } as Post

    return new Response('Updated', { status: 200 });
}

function handleDeletePost(id: string) {
    const postIndex = blogPosts.findIndex((post) => post.id === id);
    if (postIndex === -1) {
        return new Response('Not Found', { status: 404 });
    }

    blogPosts.splice(postIndex, 1);

    return new Response('Deleted', { status: 200 });
}

// User handlers
function handleGetAllUsers() {
    return new Response(
        JSON.stringify(users), {
            headers: { 'Content-Type': 'application/json' }
        });
}

function handleGetUserById(id: string) {
    const user = users.find(user => user.id === id);
    if (!user) {
        return new Response('Not Found', { status: 404 });
    }
    return new Response(
        JSON.stringify(user), {
            headers: { 'Content-Type': 'application/json' }
        });
}

function handleCreateUser(name: string, email: string) {
    const newUser : User = {
        id: `${users.length}`,
        name,
        email
    };

    users.push(newUser);
    console.log('New user created:', newUser);
    return new Response(
        JSON.stringify(newUser), {
            headers: { 'Content-Type': 'application/json' },
            status: 201
        });
}

function handleUpdateUser(id: string, name: string, email: string) {
    const userIndex = users.findIndex((user) => user.id === id);
    if (userIndex === -1) {
        return new Response('Not Found', { status: 404 });
    }

    users[userIndex] = {
        ...users[userIndex],
        name,
        email
    } as User

    return new Response('Updated', { status: 200 });
}

function handleDeleteUser(id: string) {
    const userIndex = users.findIndex((user) => user.id === id);
    if (userIndex === -1) {
        return new Response('Not Found', { status: 404 });
    }

    users.splice(userIndex, 1);

    return new Response('Deleted', { status: 200 });
}

serve({
    port: PORT,
    async fetch(request) {
        const { method } = request;
        const { pathname } = new URL(request.url);
        const postIDRegex = /^\/api\/posts\/(\d+)$/;
        const userIDRegex = /^\/api\/users\/(\d+)$/;

        if (method === 'GET' && pathname === '/api/hello') {
            return new Response('Hello, World!');
        }
        if (method === 'GET' && pathname === '/api/goodbye') {
            return new Response('Goodbye, World!');
        }
        
        // User routes
        if (method === 'GET' && pathname === '/api/users') {
            return handleGetAllUsers();
        }
        if (method === 'GET' && pathname.match(userIDRegex)) {
            const userID = pathname.match(userIDRegex)?.[1];
            if (userID) {
                return handleGetUserById(userID);
            }
        }
        if (method === 'POST' && pathname === '/api/users') {
            const body = await request.json();
            return handleCreateUser(body.name, body.email);
        }
        if (method === 'UPDATE' && pathname.match(userIDRegex)) {
            const userID = pathname.match(userIDRegex)?.[1];
            if (userID) {
                const body = await request.json();
                return handleUpdateUser(userID, body.name, body.email);
            }
        }
        if (method === 'DELETE' && pathname.match(userIDRegex)) {
            const userID = pathname.match(userIDRegex)?.[1];
            if (userID) {
                return handleDeleteUser(userID);
            }
        }
        
        // Post routes
        if (method === 'GET' && pathname === '/api/posts') {
            return handleGetAllPosts();
        }
        if (method === 'GET' && pathname.match(postIDRegex)) {
            const postID = pathname.match(postIDRegex)?.[1];
            if (postID) {
                return handleGetPostById(postID);
            }    
        }
        if (method === 'POST' && pathname === '/api/posts') {
            const body = await request.json();
            return handleCreatePost(body.title, body.content);
        }
        if (method === 'UPDATE' && pathname.match(postIDRegex)) {
            const postID = pathname.match(postIDRegex)?.[1];
            if (postID) {
                const body = await request.json();
                return handleUpdatePost(postID, body.title, body.content);
            }
        }
        if (method === 'DELETE' && pathname.match(postIDRegex)) {
            const postID = pathname.match(postIDRegex)?.[1];
            if (postID) {
                return handleDeletePost(postID);
            }
        }
        
        return new Response('Not Found', { status: 404 });
    },
});

console.log(`Server running at http://localhost:${PORT}`);