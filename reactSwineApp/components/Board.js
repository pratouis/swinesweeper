import React, { Component } from 'React';
// import ReactDOM from 'react-dom';
import { range } from 'underscore';
const DEFAULT_DIM = 10;
const DEFAULT_NUM_PIGS = 1;

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
  while(num>0){
    let x = Math.floor(Math.random()*dim);
    let y = Math.floor(Math.random()*dim);
    if(!isNaN(arr[x][y].val)){
      arr[x][y].val = NaN;
      applyFnToNeighbors(x,y,dim,arr, (a,b,arr) => {
        try{ arr[a][b].val++ }catch(e){ /*do nothing*/ }
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
      numPigs: 0,
      gameOver: false,
      length: 0,
      visited: []
    }
  }


  sweep(stack, newState){
    if(! stack.length){ return; }
    let curr = stack.shift();
    if(isNaN(newState[curr.x][curr.y].val)){
      stack = stack.filter(box => box.pass !== curr.pass)
    }else{
      newState[curr.x][curr.y].show = true;
      this.state.visited[curr.x][curr.y] = true;
      for(let i=-1; i<=1; i++){
        for(let j=-1; j<=1; j++){
          if((i||j) && inBounds(curr.x+i,curr.y+j,newState.length) &&
                        !this.state.visited[curr.x+i][curr.y+j]) {
             stack.push({ x: curr.x+i, y: curr.y+j, pass: curr.pass+1 });
           }
        }
      }
    }
    this.sweep(stack,newState);
  }

  componentDidMount(){
    this.setState({
      gridInfo: initializeState(DEFAULT_DIM, DEFAULT_NUM_PIGS),
      numPigs: DEFAULT_NUM_PIGS,
      length: DEFAULT_DIM,
      visited: range(10).map(() => range(10).fill(false))
    });
  }

  handleBoxClick(e){
    e.preventDefault();
    let dims = e.target.id.split('_').map((str) => Number(str));
    if(dims.length > 1){

        let newState = this.state.gridInfo.map((x) => x.map((obj) => Object.assign({}, obj)));
        if(isNaN(this.state.gridInfo[dims[0]][dims[1]].val)) {
          newState[dims[0]][dims[1]].show = true;
          this.setState({gridInfo: newState});
          this.gameOver(0);
          return;
        }
        this.sweep([{x: dims[0], y: dims[1], pass: 0}], newState);
        let movesLeft = this.state.visited.reduce((acc, arr) => { return acc + arr.filter(x => !x).length; }, 0)
        if(this.state.numPigs === movesLeft ){
          this.gameOver(1);
          return;
        }
        console.log(movesLeft);
        this.setState({gridInfo: newState});
    }
  }

  gameOver(status){
    if(status){
      this.setState({gameOver: true});
    }else{
      alert('you lost');
    }
  }
  render(){
    return(
      <div>
      <h2>SwineSweeper</h2>
      <div className={this.state.gameOver ? 'grow': 'hidden'}>
        <img src="../../img/pinkPig.png" />
      </div>
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
                    (<img src='../../img/pinkPig.png' height="25px" width="25px" />) :
                    (<span className={`pigScare-${Math.max(num.val,4)}`}>{num.val}</span>)
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
