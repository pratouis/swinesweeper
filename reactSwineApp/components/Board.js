import React, { Component } from 'React';
// import ReactDOM from 'react-dom';
import { range } from 'underscore';
const DEFAULT_DIM = 10;
const DEFAULT_NUM_PIGS = 10;

const initializeState = (dim, numPigs) => {
  let newState = range(dim).map(() => range(dim).map(() => ({
    show: false,
    val: 0
  })));
  generatePigs(numPigs, dim, newState);
  return newState;
}

const inBounds = (x, y, dim) => {
  return x < dim &&
         y < dim &&
         x > -1 &&
         y > -1;
}

const applyFnToNeighbors = (x, y, dim, arr, fn) =>{
  for(let i = -1; i<=1; i++){
    for(let j =-1; j<=1; j++){
      if((i||j) && inBounds(x+i,y+j,dim)){
        fn(x+i,y+j, arr);
      }
    }
  }
}

const generatePigs = (num, dim, arr) => {
  // const markNeighbors = (x,y) => {
  //   for(let i = -1; i<=1; i++){
  //     for(let j =-1; j<=1; j++){
  //       if((i||j) && ((x+i) > -1) && ((x+i) < dim) && ((y+j) > -1) && ((y+j)< dim)){
  //         try{
  //           arr[x+i][y+j].val++;
  //         }catch(e){ /* do nothing */}
  //       }
  //     }
  //   }
  // }
  while(num>0){
    let x = Math.floor(Math.random()*dim);
    let y = Math.floor(Math.random()*dim);
    if(!isNaN(arr[x][y].val)){
      arr[x][y].val = NaN;
      // markNeighbors(x,y);
      applyFnToNeighbors(x,y,dim,arr, (a,b,arr) => {
        try{
          arr[a][b].val++
        }catch(e){
          /*do nothing*/
        }
      });
      num--;
    }
  }
}

class Board extends Component {
  constructor(props){
    super(props);
    this.state = {
      gridInfo: [],
      length: 0
    }
    // this.expand = this.expand.bind(this);
  }

  expand(x,y, arr){
    if(!inBounds(x,y, arr.length) ||
       isNaN(arr[x][y].val) ||
       arr[x][y].show){ return null; }
    arr[x][y].show = true;
    for(let i=-1; i<=1; i++){
      for(let j=-1; j<=1; j++){
        if(i||j){
          if(!this.expand(x+i, y+j, arr)) break;
        }
      }
    }
  }



  componentDidMount(){
    this.setState({
      gridInfo: initializeState(DEFAULT_DIM, DEFAULT_NUM_PIGS),
      length: DEFAULT_DIM
    });
  }

  handleBoxClick(e){
    e.preventDefault();
    let dims = e.target.id.split('_').map((str) => Number(str));
    if(dims.length > 1){

      let newState = this.state.gridInfo.map((x) => x.map((obj) => Object.assign({}, obj)));
      // newState[dims[0]][dims[1]].show = true;
      // applyFnToNeighbors(dims[0],dims[1], newState.length, newState, (a,b,arr) => {
      //   if(isNaN(arr[a][b].val)){ return; }
      //   arr[a][b].show = true;
      //   applyFnToNeighbors(a,b,arr.length,)
      // });
      this.expand(dims[0],dims[1], newState);
      this.setState({gridInfo: newState});
    }

  }

  render(){
    return(
      <div>
      <h2>SwineSweeper</h2>
      <div style={{display: 'flex'}}>
        {this.state.gridInfo.map((row, x) =>
          (<div>
            {row.map((num, y) =>
              <div id={`${x}_${y}`}
                key={x*this.state.length+y}
                className="gridBox-lg gridBox"
                onClick= {(e) => this.handleBoxClick(e)}>
                <div className={num.show ? "not-hidden" : 'hidden'}>
                  {isNaN(num.val) ?
                    (<img src='../../img/pinkPig.png' height="25px" width="25px" />) : num.val
                 }
                 </div>
              </div>
            )}
          </div>)
        )}
      </div>
    </div>);
  }
}

export default Board;
