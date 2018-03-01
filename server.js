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
    authorId: "1"
  },
  {
    id: "fdda765f-fc57-5604-a269-52afrgthy4ec",
    title: "Jurassic Park",
    authorId: "2"
  }
];

let authors = [
  { id: "1", name: "J.K. Rowling" },
  { id: "2", name: "Michael Crichton" }
];

// The GraphQL schema in string form
const typeDefs = gql`
  type Book {
    id: ID!
    title: String
    author: Author
  }

  type Author {
    id: ID!
    name: String!
  }

  type Query {
    books: [Book]
    book(id: ID!): Book
    authors: [Author]
    author(id: ID!): Author
  }
  
  schema {
    query: Query
  }
`;

// The resolvers
const resolvers = {
  Query: {
    books() {
      return books;
    },
    authors() {
      return authors;
    }
  },
  // Mutation: {
  //   addBook(_, { title, authorId, author }) {
  //     let book = { id: uuid(), title };
  //     if (authorId) {
  //       book.authorId = authorId;
  //       books.push(book);
  //       return book;
  //     }
  //     const newAuthor = { id: uuid(), name: author.name };
  //     authors.push(newAuthor);
  //     book.authorId = newAuthor.id
  //     books.push(book);
  //     return book;
  //   },
  //   deleteBook(_, { id }) {
  //     const preLength = books.length;
  //     books = books.filter(book => book.id !== id);
  //     return preLength > books.length ? id : new Error("No book to delete!");
  //   },
  //   updateBook(_, { id, changes: { title, author, authorId } }) {
  //     const bookToUpdate = books.find(book => book.id === id);
  //     if (bookToUpdate) {
  //       const newBook = { ...bookToUpdate, title };
  //       if (authorId) {
  //         newBook.authorId = authorId;
  //       } else {
  //         const newAuthor = { id: uuid(), name: author.name }
  //         authors.push(newAuthor)
  //         newBook.authorId = newAuthor.id;
  //       }
  //       books = [...books.filter(book => book.id !== id), newBook];
  //       return newBook;
  //     }
  //     return new Error("No book to update!");
  //   },
  //   addAuthor(root, { name }) {
  //     return { id: uuid(), name };
  //   }
  // }
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
