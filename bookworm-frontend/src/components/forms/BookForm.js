import React from "react";
import PropTypes from "prop-types";
import { Form, Button, Segment, Grid, Image } from "semantic-ui-react";

class BookForm extends React.Component {
  state = {
    data: {
      goodreadsId: this.props.book.goodreadsId,
      title: this.props.book.title,
      authors: this.props.book.authors,
      cover: this.props.book.covers[0],
      pages: this.props.book.pages
    },
    covers: this.props.book.covers,
    index: 0,
    loading: false,
    errors: {}
  };

  componentWillReceiveProps(props) {
    this.setState({
      data: {
        goodreadsId: props.book.goodreadsId,
        title: props.book.title,
        authors: props.book.authors,
        cover: props.book.covers[0],
        pages: props.book.pages
      },
      covers: props.book.covers
    });
  }

  onChange = e =>
    this.setState({
      ...this.state,
      data: { ...this.state.data, [e.target.name]: e.target.value }
    });

  onChangeNumber = e =>
    this.setState({
      ...this.state,
      data: {
        ...this.state.data,
        [e.target.name]: parseInt(e.target.value, 10)
      }
    });

  onSubmit = e => {
    e.preventDefault();
    const errors = this.validate(this.state.data);
    this.setState({ errors });
    if (Object.keys(errors).lenght === 0) {
      this.setState({ loading: true });
      this.props
        .submit(this.state.data)
        .catch(err =>
          this.setState({ errors: err.response.data.errors, loading: false })
        );
    }
  };

  changeCover = () => {
    const { index, covers } = this.state;
    const newIndex = index + 1 > covers.length ? 0 : index + 1;
    this.setState({
      index: newIndex,
      data: { ...this.state.data, cover: covers[newIndex] }
    });
  };

  validate = data => {
    const errors = {};
    if (!data.title) errors.title = "Title field can't be blank!";
    if (!data.author) errors.author = "Author field can't be blank!";
    if (!data.pages) errors.Pages = "Pages field can't be blank!";
    return errors;
  };
  render() {
    const { errors, data, loading } = this.state;
    return (
      <Segment>
        <Form onSubmit={this.onSubmit} loading={loading}>
          <Grid columns={2} fluid stackable>
            <Grid.Row>
              <Grid.Collumn>
                <Form.Field errors={errors.title}>
                  <label htmlFor="title">Book title</label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    placeholder="Title"
                    value={data.title}
                    onChange={this.onChange}
                  />
                </Form.Field>
                <Form.Field errors={errors.authors}>
                  <label htmlFor="authors">Book authrors:</label>
                  <input
                    type="text"
                    id="authors"
                    name="authors"
                    placeholder="Author"
                    value={data.authors}
                    onChange={this.onChange}
                  />
                </Form.Field>
                <Form.Field errors={errors.pages}>
                  <label htmlFor="pages">Number of pages:</label>
                  <input
                    type="number"
                    id="pages"
                    name="pages"
                    value={data.pages}
                    onChange={this.onChangeNumber}
                  />
                </Form.Field>
              </Grid.Collumn>
              <Grid.Collumn>
                <Image size="small" src={data.cover} />
                {this.state.covers.length > 1 && (
                  <a role="button" tabIndex={0} onClick={this.changeCover}>
                    Another cover
                  </a>
                )}
              </Grid.Collumn>
            </Grid.Row>
            <Grid.Row>
              <Button primary>Save</Button>
            </Grid.Row>
          </Grid>
        </Form>
      </Segment>
    );
  }
}

BookForm.propTypes = {
  submit: PropTypes.func.isRequired,
  book: PropTypes.shape({
    goodreadsId: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    authors: PropTypes.string.isRequired,
    covers: PropTypes.arrayOf(PropTypes.string.isRequired).isRequired,
    pages: PropTypes.number.isRequired
  }).isRequired
};

export default BookForm;
