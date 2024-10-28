if (process.env.DATABASE_URL === undefined) {
    // Environment config
    const dotenv = require('dotenv');
    const path = require('path')
  
    // Determine which .env file to load based on NODE_ENV
    const envFile = process.env.NODE_ENV ? `.env.${process.env.NODE_ENV}` : '.env';
  
    // Load the environment variables
    dotenv.config({ path: path.resolve(process.cwd(), envFile) });
  
    console.log(`Current environment: ${process.env.NODE_ENV || 'default'}`);
  
    console.log("Database URL: ", process.env.FRONTEND_URL)
  }

const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// Convert the USERSMADE environment variable to Boolean
const USERSMADE = process.env.USERSMADE === 'true';

async function main() {
  // Fetch user data for existing usernames
  let testuser, guest, test, test2;

  if (USERSMADE) {
      testuser = await prisma.user.findFirst({
        where: { username: "testuser" },
      });
      guest = await prisma.user.findFirst({
        where: { username: "guest" },
      });
      test = await prisma.user.findFirst({
        where: { username: "test" },
      });
      test2 = await prisma.user.findFirst({
        where: { username: "test2" },
      });
    
      if (!testuser || !guest || !test || !test2) {
        throw new Error('One or more users do not exist. Please ensure users have been created before running this script.');
      }
  } else {
    testuser = await prisma.user.create({
        data: { 
            username: "testuser",
            email: "test@example.com",
            password: "$2b$10$GSeCSXxluFQiBJ9xR0bQWu8LLms9fxkenJDbNgLFARcvvae79/Wx.",
            admin: false,
        },
      });

      guest = await prisma.user.create({
        data: { 
            username: "guest",
            email: "guest@gmail.com",
            password: "$2b$10$Sx2BUI5XOGDDXHM2eJ6OqOMENp0kAdTdOZYYFwX3yVjduzIfKpvrW",
            admin: true,
        },
      });

      test = await prisma.user.create({
        data: { 
            username: "test",
            email: "test@gmail.com",
            password: "$2b$10$v7bUhGIALJPKrVQuxDQ.zu9TlfwV0zw5ocfY2YNxZgoOpHf/SO2LO",
            admin: false,
        },
      });

      test2 = await prisma.user.create({
        data: { 
            username: "test2",
            email: "test2@gmail.com",
            password: "$2b$10$l40h/v11nxKJgLqP8skp3OfgD7Xm5IwQ/LGy43GgFCZDXJPgQeyT6",
            admin: false,
        },
      });
  }

  // Post data with some humorous content
  const posts = [
    {
      title: "The Mystery of the Missing Semicolon",
      content: "They say a missing semicolon caused the Great Crash of '99. Who knew a tiny character could wreak such havoc?",
      authorId: testuser.id,
      published: true,
    },
    {
      title: "How to Train Your Code",
      content: "Training your code to behave takes patience and lots of caffeine. And remember, bugs are just features in disguise!",
      authorId: guest.id,
      published: true,
    },
    {
      title: "Why Tabs are Superior to Spaces",
      content: "In the age-old battle between tabs and spaces, one thing is certain: only true coders understand why tabs rule.",
      authorId: test.id,
      published: true,
    },
    {
      title: "Debugging Nightmares: A Short Story",
      content: "It was 3 AM, the code wouldn't work, and the debugger was laughing in my face... Sounds familiar?",
      authorId: guest.id,
      published: true,
    },
    {
      title: "Secrets of the Console.log Wizards",
      content: "Legend has it that true mastery of Console.log can make bugs vanish into thin air. Some say it’s a lost art.",
      authorId: test2.id,
      published: true,
    },
    {
      title: "An Ode to Async Await (Poetry Edition)",
      content: "Async await, you wonderful friend, making my code easier to comprehend...",
      authorId: testuser.id,
      published: true,
    },
    // Unpublished posts
    {
        title: "Unpublished Thoughts on JavaScript",
        content: "This is a post still under construction. JavaScript quirks await!",
        authorId: testuser.id,
        published: false,
      },
      {
        title: "Untold Secrets of Console.logs",
        content: "Another day, another console.log adventure that no one will see (yet).",
        authorId: guest.id,
        published: false,
      },
      {
        title: "Hidden Beauty of Async/Await",
        content: "This post is still a draft, waiting for the right moment to shine.",
        authorId: test.id,
        published: false,
      },
      {
        title: "Behind the Scenes of Coding Nightmares",
        content: "An unpublished story of sleepless nights and endless debugging.",
        authorId: test2.id,
        published: false,
      },
  ];

  // Insert posts
  for (const post of posts) {
    await prisma.post.create({ data: post });
  }

  // Fetch posts to add comments
  const fetchedPosts = await prisma.post.findMany();

  // Comment data
  const comments = [
    {
      content: "I feel this deeply. I've lost many hours to missing semicolons.",
      authorId: guest.id,
      postId: fetchedPosts[0].id,
    },
    {
      content: "Nothing worse than a stubborn bug at 3 AM!",
      authorId: testuser.id,
      postId: fetchedPosts[0].id,
    },
    {
      content: "Semicolons may be small, but they sure make a big impact!",
      authorId: test2.id,
      postId: fetchedPosts[0].id,
    },
    {
      content: "Console.log is a lifesaver! Just wish it could fix my typos too.",
      authorId: test.id,
      postId: fetchedPosts[4].id,
    },
    {
      content: "The battle between tabs and spaces... Will it ever end?",
      authorId: guest.id,
      postId: fetchedPosts[2].id,
    },
    {
      content: "For some, it's tabs. For others, it's a matter of pride.",
      authorId: testuser.id,
      postId: fetchedPosts[2].id,
    },
    {
      content: "Definitely prefer tabs, especially when I’m in the zone!",
      authorId: test2.id,
      postId: fetchedPosts[2].id,
    },
    {
      content: "Never underestimate the power of async/await.",
      authorId: guest.id,
      postId: fetchedPosts[5].id,
    },
    {
      content: "Async await has saved me from callback hell too many times to count.",
      authorId: test.id,
      postId: fetchedPosts[5].id,
    },
    {
      content: "Sometimes I dream in async/await. Is that a good thing?",
      authorId: test2.id,
      postId: fetchedPosts[5].id,
    },
    {
      content: "Only true console wizards understand the power of a well-timed log.",
      authorId: testuser.id,
      postId: fetchedPosts[4].id,
    },
    {
      content: "Console logs have saved my sanity more times than I care to admit.",
      authorId: guest.id,
      postId: fetchedPosts[4].id,
    },
  ];

  // Insert comments
  for (const comment of comments) {
    await prisma.comment.create({ data: comment });
  }

  console.log('Data has been seeded successfully!');
}

main()
  .catch((error) => {
    console.error('Error seeding data:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
