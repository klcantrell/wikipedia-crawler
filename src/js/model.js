import axios from 'axios';

export default function Model() {
  return {
    makeWikipediaRequest(userQuery) {
      const url = `https://7k1zglj62f.execute-api.us-east-2.amazonaws.com/v0/wikipedia-crawl/${userQuery}`;
      let data;
      return axios.get(url)
        .then((res) => {
          return res.data.query.search;
        });
    }
  }
}
