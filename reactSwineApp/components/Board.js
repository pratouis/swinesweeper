import React, { Component } from 'React';
import ReactDOM from 'react-dom';

class Board extends Component {
  render(){
    return(
      <div>
      <h2>SwineSweeper</h2>
      <div style={{display: 'flex'}}>
        {[0,1,2,3,4,5,6,7,8,9].map((num) => {
          return(<div>
            {[0,1,2,3,4,5,6,7,8,9].map((num2) =>
              <div className="gridBox-lg gridBox"></div>)}
            </div>)})}
      </div>
    </div>);
  }
}

export default Board;
