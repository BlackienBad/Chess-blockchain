import './Chessboard.css';
function Tile({number, image, handleClick, positionX, positionY}) {
    if(number % 2 === 0){
        return(<div className="tile black-tile" onClick={() => handleClick(positionX, positionY)}>
                    {image && <div style={{backgroundImage: `url(${image})`}} className="chess-piece" ></div>}
                </div>);
    }else{
        return(<div className="tile white-tile" onClick={() => handleClick(positionX, positionY)}>
                    {image && <div style={{backgroundImage: `url(${image})`}} className="chess-piece" ></div>}
                </div>);
    }
}

export default Tile;