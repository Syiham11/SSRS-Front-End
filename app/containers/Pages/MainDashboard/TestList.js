import React, { Component } from 'react';
import InfiniteScroll from 'react-infinite-scroller';

const style = {
  height: 30,
  border: '1px solid green',
  margin: 6,
  padding: 8
};

export class TestList extends Component {
  state = {
    items: Array.from({ length: 20 })
  };

  fetchMoreData = () => {
    const { items } = this.state;
    // a fake async api call like which sends
    // 20 more records in 1.5 secs
    setTimeout(() => {
      this.setState({
        items: items.concat(Array.from({ length: 20 }))
      });
    }, 1500);
  };

  render() {
    const { items } = this.state;
    return (
      <div>
        <h1>demo: react-infinite-scroll-component</h1>
        <hr />
        <InfiniteScroll
          pageStart={0}
          loadMore={this.fetchMoreData}
          hasMore
          loader={<h4>Loading...</h4>}
        >
          {items.map((i, index) => (
            <div style={style}>
div - #
              {index}
            </div>
          ))}
        </InfiniteScroll>
      </div>
    );
  }
}

export default TestList;
