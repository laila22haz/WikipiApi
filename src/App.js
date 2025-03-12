import { useState, useEffect, useRef } from "react";
import axios from "axios";
import usePrevState from "./hooks/usePrevState";

export default function App() {
  const [term, setTerm] = useState("");
  const [result, setResult] = useState([]);
  const prevTerm = usePrevState(term);
  

  useEffect(() => {
    const search = async () => {
      const respond = await axios.get("https://en.wikipedia.org/w/api.php", {
        params: {
          action: "query",
          list: "search",
          origin: "*",
          format: "json",
          srsearch: term,
        },
      });
      setResult(respond.data.query.search);
      //console.log(respond.data.query.search);
    };

    if (!result.length) {
      if (term) {
        search();
      }
    } else if(prevTerm !== term){
      const DebounceSearch = setTimeout(() => {
        if (term) {
          search();
        }
      }, 2500);
      return () => {
        clearTimeout(DebounceSearch);
      }
    }
  }, [term, result.length, prevTerm]);

  const fetchResult = result.map((elm) => {
    return (
      <tr key={elm.pageid}>
        <td scope="row">
          1
        </td>
        <td>{elm.title}</td>
        <td>
          <span dangerouslySetInnerHTML={{ __html: elm.snippet }} />
        </td>
      </tr>
    );
  });

  return (
    <div className="container">
      <div className="row">
        <div className="col">
          <div className="my-3">
            <label htmlFor="exampleFormControlInput1" className="form-label">
              Search Input
            </label>
            <input
              type="text"
              className="form-control"
              id="exampleFormControlInput1"
              onChange={(e) => setTerm(e.target.value)}
              value={term}
            />
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col">
          <table className="table">
            <thead>
              <tr>
                <th scope="col">#</th>
                <th scope="col">Title</th>
                <th scope="col">Desc</th>
              </tr>
            </thead>
            <tbody>{fetchResult}</tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
