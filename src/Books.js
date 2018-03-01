import React, { Component } from "react";
// import { Query, graphql, compose } from "react-apollo";
// import { gql } from "apollo-boost";

class Books extends Component {
  onSubmit = e => {
    e.preventDefault();
    const [title, author] = e.target.children;
    // this.props.addBook({
    //   variables: { title: title.value, author: { name: author.value } }
    // });
    title.value = "";
    author.value = "";
  };

  onDelete = e => {
    e.preventDefault();
    // this.props.deleteBook({
    //   variables: { id: this.id.value }
    // });
    this.id.value = "";
  };

  render() {
    const data = { books: [] };
    return (
      <React.Fragment>
        {/* ------------------ Add new book section ----------------*/}
        <form onSubmit={this.onSubmit}>
          <input name="title" placeholder="title" />
          <input name="author" placeholder="author" />
          <button type="submit">Add new 📗</button>
        </form>
        {/* ------------------ Showing stuff section ----------------*/}
        {data.books.length === 0 && <div>Nothing to show 💩</div>}
        {data.books.map(book => (
          <div key={book.id}>
            {book.id} ---------- {book.title} --------- {book.author.name}
          </div>
        ))}
        {/* ------------------ Delete book section ----------------*/}
        <input
          style={{ width: 400 }}
          name="id"
          placeholder="id to delete"
          ref={id => (this.id = id)}
        />
        <button onClick={this.onDelete}> Delete 📕</button>
      </React.Fragment>
    );
  }
}

export default Books;
