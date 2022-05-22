const {ApolloServer} = require('apollo-server');
const fs = require('fs');
const path = require('path');
const {PrismaClient} = require('@prisma/client');
const {getUserId} = require('./utils');
const {PubSub} = require('apollo-server');
const pubsub = new PubSub();


const Query = require('./resolvers/Query')
const Mutation = require('./resolvers/Mutation')
const User = require('./resolvers/User')
const Link = require('./resolvers/Link')
const Subscription = require('./resolvers/Subscriptions')
const Vote = require('./resolvers/Vote')

//implementation of the graphql schema
//all fields on the types in a Graphql schema have resolver functions
const resolvers = {

    Query,
    Mutation,
    Subscription,
    User,
    Link,
    Vote,

    // updateLink: (parent, args) => {
    //     let updatedLink;

    //     links = links.map(link => {
    //         if (link.id === args.id) {
    //             updatedLink = { ...link, ...args};
    //             return updatedLink;
    //         }
    //         return link;
    //     });
    //     return updatedLink;
    // },

    // updateLink: (parent, args) => {
    //     links.forEach((link) => {
    //         if(link.id === args.id) {
    //             link.d = args.id;
    //             link.url = args.url;
    //             link.description = args.description;
    //         }
    //         return link;
    //     })
    // },

    // deleteLink: (parent, args) => {
    //     const removeIndex = links.findIndex(item => item.id === args.id);
    //     const removedLink = links[removeIndex];
    //     links.splice(removeIndex, 1);

    //     return removedLink;
    // }

}

const prisma = new PrismaClient()

//tell the server about the API operations
const server = new ApolloServer({
    typeDefs: fs.readFileSync(
        path.join(__dirname, 'schema.graphql'),
        'utf8'
    ),
    resolvers,
    context: ({req}) => {
        return {
            ...req,
            prisma,
            pubsub,
            userId:
                req && req.headers.authorization
                    ? getUserId(req)
                    : null
        };
    }
});

server
    .listen()
    .then(({url}) =>
        console.log(`Server is running on ${url}`)
    );

