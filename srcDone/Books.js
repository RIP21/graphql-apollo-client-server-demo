import React, { Component } from "react";
import { Query, graphql, compose } from "react-apollo";
import { gql } from "apollo-boost";

const GET_BOOKS = gql`
  query GetBooks {
    books {
      id
      title
      author
    }
  }
`;

const ADD_BOOK = gql`
  mutation($title: String!, $author: String) {
    addBook(title: $title, author: $author) {
      id
      author
      title
    }
  }
`;

const DELETE_BOOK = gql`
  mutation DeleteBook($id: String!) {
    deleteBook(id: $id) {
      deletedId
    }
  }
`;

class Books extends Component {
  onSubmit = e => {
    e.preventDefault();
    const [title, author] = e.target.children;
    this.props.addBook({
      variables: { title: title.value, author: author.value }
    });
    title.value = "";
    author.value = "";
  };

  onDelete = e => {
    e.preventDefault();
    this.props.deleteBook({
      variables: { id: this.id.value }
    });
    this.id.value = "";
  };

  render() {
    return (
      <Query query={GET_BOOKS}>
        {({ loading, data, error }) => {
          if (loading) return <div>Loading...</div>;
          if (error) return <div>Error :( </div>;

          return (
            <React.Fragment>
              {/* ------------------ Add new book section ----------------*/}
              <form onSubmit={this.onSubmit}>
                <input name="title" placeholder="title" />
                <input name="author" placeholder="author" />
                <button type="submit">Add author</button>
              </form>
              {/* ------------------ Showing stuff section ----------------*/}
              {data.books.map(book => (
                <div key={book.id}>
                  {book.title} --------- {book.author}
                </div>
              ))}
              {/* ------------------ Delete book section ----------------*/}
              <input
                style={{ width: 400 }}
                name="id"
                placeholder="id to delete"
                ref={id => (this.id = id)}
              />
              <button onClick={this.onDelete}> Delete book</button>
            </React.Fragment>
          );
        }}
      </Query>
    );
  }
}

export default compose(
  graphql(ADD_BOOK, {
    name: "addBook",
    options: {
      update: (proxy, { data }) => {
        const { books } = proxy.readQuery({ query: GET_BOOKS });
        books.push(data.addBook);
        proxy.writeData({ data: { books } });
      }
      //refetchQueries: ['GetBooks']
    }
  }),
  graphql(DELETE_BOOK, {
    name: "deleteBook",
    options: {
      update: (proxy, { data }) => {
        const { books } = proxy.readQuery({ query: GET_BOOKS });
        const filtered = books.filter(
          book => book.id !== data.deleteBook.deletedId
        );
        proxy.writeData({ data: { books: filtered } });
      }
      //refetchQueries: ['GetBooks']
    }
  })
)(Books);
