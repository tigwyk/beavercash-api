const {PrismaClient} = require('@prisma/client')

const client = new PrismaClient();

const example_users = [
    {
        "id" : 0,
        "name" : "John Doe",
        "email" : "johndoe@example.com",
    },
    {
        "id" : 1,
        "name" : "Jane Doe",
        "email" : "janedoe@example.com",
    },
    {
        "id" : 2,
        "name" : "Alice",
        "email" : "alice@example.com",
    },
    {
        "id" : 3,
        "name" : "Bob",
        "email" : "bob@example.com",
    }
]

const seed = async(users) =>{
    console.log("Creating demo users...");

    for (const user of users) {
        console.log(`Creating user: ${user.name} (${user.email})`);
        await client.user.upsert({
            where: {id: user.id},
            update: {name: user.name, email: user.email},
            create: user,
        });
    }
}

seed(example_users)
    .then(() => {
    console.log("Demo users created successfully!");
})
    .catch((error) => {
    console.error("Error creating demo users: ", error);
})
    .finally(async () => {
    await client.$disconnect();
});