const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const { graphqlExpress, graphiqlExpress } = require("apollo-server-express");
const { makeExecutableSchema } = require("graphql-tools");
const uuid = require("uuid/v4");

const gql = rest => rest;

// Some fake data
let books = [
  {
    id: "fdda765f-fc57-5604-a269-52a7df8164ec",
    title: "Harry Potter and the Sorcerer's stone",
    author: "J.K. Rowling"
  },
  {
    id: "fdda765f-fc57-5604-a269-52afrgthy4ec",
    title: "Jurassic Park",
    author: "Michael Crichton"
  }
];

// The GraphQL schema in string form
const typeDefs = gql`
  type Query {
    books: [Book]
    book(title: String!): Book
  }

  type Mutation {
    addBook(title: String!, author: String): Book
    deleteBook(id: String!): Message
    updateBook(id: String!, changes: UpdateBook!): Book
  }

  input UpdateBook {
    title: String
    author: String
  }

  type Message {
    deletedId: ID
    message: String!
  }

  type Book {
    id: ID!
    title: String
    author: String
  }
`;

// The resolvers
const resolvers = {
  Query: {
    book: (_, { title }) => books.find(book => book.title === title),
    books: () => books
  },
  Mutation: {
    addBook: (_, book) => {
      book.id = uuid();
      books.push(book);
      return book;
    },
    deleteBook: (_, { id }) => {
      const preLength = books.length;
      books = books.filter(book => book.id !== id);
      return preLength > books.length
        ? { deletedId: id, message: "Success!" }
        : new Error("No book to delete!");
    },
    updateBook: (_, { id, changes }) => {
      const bookToUpdate = books.find(book => book.id === id);
      if (bookToUpdate) {
        const newBook = { ...bookToUpdate, ...changes };
        books = [...books.filter(book => book.id !== id), newBook];
        return newBook;
      }
      return new Error("No book to update!");
    }
  }
};

// Put together a schema
const schema = makeExecutableSchema({
  typeDefs,
  resolvers
});

// Initialize the app
const app = express();

// Allow all origins
app.use(cors());

// The GraphQL endpoint
app.use("/graphql", bodyParser.json(), graphqlExpress({ schema }));

// GraphiQL, a visual editor for queries
app.use("/graphiql", graphiqlExpress({ endpointURL: "/graphql" }));

// Start the server
app.listen(3000, () => {
  console.log("Go to http://localhost:3000/graphiql to run queries!");
});
