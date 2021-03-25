import './Chessboard.css';
import { useState, useEffect } from 'react';
import Tile from './Tile.js';
import ChessSolidity from '../abis/ChessSolidity.json';
import Web3 from 'web3';
import { horizontalAxis, verticalAxis, initialBoardState} from '../Costanti/Costanti.js';

function Chessboard() {
    const [pieces, setPieces] = useState(initialBoardState)
    const [pezzoAttivoX, setPezzoAttivoX] = useState(null);
    const [pezzoAttivoY, setPezzoAttivoY] = useState(null);
    const [winner, setWinner] = useState(null);
    let mosseDisponibili = [];
    const [turno, setTurno] = useState('w');
    const [accounts, setAccount] = useState();
    const [token, setToken] = useState();
    const [balanceOf, setBalanceOf] = useState();
    const [balanceOfContract, setBalanceOfContract] = useState();

    useEffect(() => {
		loadWeb3()
        loadBlockchainData()
	},[]);

    
    const loadWeb3 = async () => {
        if (window.ethereum) {
        window.web3 = new Web3(window.ethereum)
        await window.ethereum.enable()
        }
        else if (window.web3) {
        window.web3 = new Web3(window.web3.currentProvider)
        }
        else {
        window.alert('Non-Ethereum browser detected. You should consider trying MetaMask!')
        }
    }
    
      const loadBlockchainData = async () => {
		const web3 = window.web3
		const accounts = await web3.eth.getAccounts()
		setAccount(accounts[0])
	
		// Load smart contract
		const networkId = await web3.eth.net.getId()
		const networkData = ChessSolidity.networks[networkId]
		if(networkData) {
		  const abi = ChessSolidity.abi
		  const address = networkData.address
		  const token = new web3.eth.Contract(abi, address)
		  setToken(token)
		  setBalanceOf(await token.methods.balanceOf(accounts[0]).call())
          setBalanceOfContract(await token.methods.balanceOf(address).call())
		} else {
		  alert('Smart contract not deployed to detected network.')
		}
      }
    
    function handleClick(x, y){
        if(pezzoAttivoX === null && pezzoAttivoY === null){
            setPezzoAttivoX(x);
            setPezzoAttivoY(y);
        }else{
            setPieces((value) => {
                const pieces = value.map((p) => {
                    if(p.x === horizontalAxis[pezzoAttivoX] && p.y === (pezzoAttivoY+1).toString()){
                        switch(p.type){
                            case 'pawn':
                                console.log('pawn');
                                mosseDisponibili = [];
                                var checkMove = false;
                                let possibleMove = 1;
                                if((p.y === '2' && p.team === 'w') || (p.y === '7' && p.team === 'b')){possibleMove = 2;}
                                for(let i = 0 ; i <= verticalAxis.length; i++){
                                    // se è sulla posizione iniziale 2 passi consentiti altrimenti 1
                                    if(x === pezzoAttivoX && ((y >= pezzoAttivoY && i < y && i > pezzoAttivoY && (y - pezzoAttivoY) <= possibleMove && p.team === 'w') || (y <= pezzoAttivoY && i > y && i < pezzoAttivoY && (pezzoAttivoY - y) <= possibleMove && p.team === 'b'))){
                                        console.log({x: horizontalAxis[pezzoAttivoX], y: verticalAxis[i]})
                                        mosseDisponibili.push({x: horizontalAxis[pezzoAttivoX], y: verticalAxis[i]});
                                    }else if(Math.abs(x - pezzoAttivoX) <= 1 && ((y >= pezzoAttivoY && i === y && i > pezzoAttivoY && (y - pezzoAttivoY) <= 1 && p.team === 'w') || (y <= pezzoAttivoY && i === y && i < pezzoAttivoY && (pezzoAttivoY - y) <= 1 && p.team === 'b'))){
                                        checkMove = checkMangiataPedone(p.team, x, y);
                                    }
                                }
                                break;
                            case 'rook':
                                console.log('rook');
                                mosseDisponibili = [];
                                var checkMove = false;
                                for(let i = 0 ; i < verticalAxis.length; i++){
                                    if(x === pezzoAttivoX){
                                        // controllo che io stia andando in alto o in basso senza muovermi orizzontalmente
                                        if((i > y && y <= pezzoAttivoY && i < pezzoAttivoY) || (i < y && y >= pezzoAttivoY && i > pezzoAttivoY)){
                                            mosseDisponibili.push({x: horizontalAxis[pezzoAttivoX], y: verticalAxis[i]});
                                        }else if(i === y){
                                            checkMove = checkArrivoLibero(p.team, x, y);
                                        }
                                    }else if(y === pezzoAttivoY){
                                        // controllo che io stia andando a destra o sinistra senza muovermi verticalmente
                                        if((i > x && x <= pezzoAttivoX && i < pezzoAttivoX) || (i < x && x >= pezzoAttivoX && i > pezzoAttivoX)){
                                            mosseDisponibili.push({x: horizontalAxis[i], y: verticalAxis[pezzoAttivoY]});
                                        }else if(i === y){
                                            checkMove = checkArrivoLibero(p.team, x, y);
                                        }
                                    }
                                }
                                break;
                            case 'knight':
                                console.log('knight');
                                mosseDisponibili = [];
                                var checkMove = false;
                                // controllo che ci si muova prima di due caselle e poi di una in qualsiasi direzione
                                if((((y - pezzoAttivoY) === 2) ||  ((y - pezzoAttivoY) === -2)) && (((x - pezzoAttivoX) === 1) ||  ((x - pezzoAttivoX) === -1)) || 
                                (((y - pezzoAttivoY) === 1) ||  ((y - pezzoAttivoY) === -1)) && (((x - pezzoAttivoX) === 2) ||  ((x - pezzoAttivoX) === -2))){
                                    checkMove = checkArrivoLibero(p.team, x, y);
                                }
                                break;
                            case 'bishop':
                                console.log('bishop') 
                                mosseDisponibili = [];
                                var checkMove = false;
                                for(let i = 0 ; i < Math.abs(x-pezzoAttivoX); i++){
                                    // controllo che ci si muova dello stesso numero di caselle orizzontali e verticali, così da andare in obliquo
                                    if(Math.abs(x-pezzoAttivoX) === Math.abs(y-pezzoAttivoY)){
                                        // basso DX
                                        if(y-pezzoAttivoY < 0 && x-pezzoAttivoX > 0 && Math.abs(pezzoAttivoX+i+1) !== x){
                                            mosseDisponibili.push({x: horizontalAxis[Math.abs(pezzoAttivoX+i+1)], y: verticalAxis[Math.abs(pezzoAttivoY-i-1)]});
                                        // controllo se la mossa è di una casella a destra
                                        }else if(Math.abs(pezzoAttivoX+i+1) === x){
                                            checkMove = checkArrivoLibero(p.team, x, y);
                                        // controllo se la mossa è di una casella a sinistra
                                        }else if(Math.abs(pezzoAttivoX-i-1) === x){
                                            checkMove = checkArrivoLibero(p.team, x, y);
                                        // basso SX
                                        }else if(y-pezzoAttivoY < 0 && x-pezzoAttivoX < 0 && Math.abs(pezzoAttivoX-i-1) !== x){
                                            mosseDisponibili.push({x: horizontalAxis[Math.abs(pezzoAttivoX-i-1)], y: verticalAxis[Math.abs(pezzoAttivoY-i-1)]});
                                        // alto DX
                                        }else if(y-pezzoAttivoY > 0 && x-pezzoAttivoX > 0 && Math.abs(pezzoAttivoX+i+1) !== x){
                                            mosseDisponibili.push({x: horizontalAxis[Math.abs(pezzoAttivoX+i+1)], y: verticalAxis[Math.abs(pezzoAttivoY+i+1)]});
                                        // alto SX
                                        }else if(y-pezzoAttivoY > 0 && x-pezzoAttivoX < 0 && Math.abs(pezzoAttivoX-i-1) !== x){
                                            mosseDisponibili.push({x: horizontalAxis[Math.abs(pezzoAttivoX-i-1)], y: verticalAxis[Math.abs(pezzoAttivoY+i+1)]});
                                        }
                                    }
                                }
                                break;
                            case 'king':
                                console.log('king');
                                mosseDisponibili = [];
                                var checkMove = false;
                                // movimento di una casella in qualsiasi direzione
                                if((Math.abs(x-pezzoAttivoX) <= 1) && (Math.abs(y-pezzoAttivoY) <= 1)){
                                    checkMove = checkArrivoLibero(p.team, x, y);
                                }
                                break;
                            case 'queen':
                                console.log('queen');
                                mosseDisponibili = [];
                                var checkMove = false;
                                // stessi controlli dell'alfiere e della torre
                                for(let i = 0 ; i < verticalAxis.length; i++){
                                    if(x === pezzoAttivoX){
                                        if((i > y && y <= pezzoAttivoY && i < pezzoAttivoY) || (i < y && y >= pezzoAttivoY && i > pezzoAttivoY)){
                                            mosseDisponibili.push({x: horizontalAxis[pezzoAttivoX], y: verticalAxis[i]});
                                        }else if(i === y){
                                            checkMove = checkArrivoLibero(p.team, x, y);
                                        }
                                    }else if(y === pezzoAttivoY){
                                        if((i > x && x <= pezzoAttivoX && i < pezzoAttivoX) || (i < x && x >= pezzoAttivoX && i > pezzoAttivoX)){
                                            mosseDisponibili.push({x: horizontalAxis[i], y: verticalAxis[pezzoAttivoY]});
                                        }else if(i === y){
                                            checkMove = checkArrivoLibero(p.team, x, y);
                                        }
                                    }
                                }
                                for(let i = 0 ; i < Math.abs(x-pezzoAttivoX); i++){
                                    // controllo che ci si muova dello stesso numero di caselle orizzontali e verticali, così da andare in obliquo
                                    if(Math.abs(x-pezzoAttivoX) === Math.abs(y-pezzoAttivoY)){
                                        // basso DX
                                        if(y-pezzoAttivoY < 0 && x-pezzoAttivoX > 0 && Math.abs(pezzoAttivoX+i+1) !== x){
                                            mosseDisponibili.push({x: horizontalAxis[Math.abs(pezzoAttivoX+i+1)], y: verticalAxis[Math.abs(pezzoAttivoY-i-1)]});
                                        // controllo se la mossa è di una casella a destra
                                        }else if(Math.abs(pezzoAttivoX+i+1) === x){
                                            checkMove = checkArrivoLibero(p.team, x, y);
                                        // controllo se la mossa è di una casella a sinistra
                                        }else if(Math.abs(pezzoAttivoX-i-1) === x){
                                            checkMove = checkArrivoLibero(p.team, x, y);
                                        // basso SX
                                        }else if(y-pezzoAttivoY < 0 && x-pezzoAttivoX < 0 && Math.abs(pezzoAttivoX-i-1) !== x){
                                            mosseDisponibili.push({x: horizontalAxis[Math.abs(pezzoAttivoX-i-1)], y: verticalAxis[Math.abs(pezzoAttivoY-i-1)]});
                                        // alto DX
                                        }else if(y-pezzoAttivoY > 0 && x-pezzoAttivoX > 0 && Math.abs(pezzoAttivoX+i+1) !== x){
                                            mosseDisponibili.push({x: horizontalAxis[Math.abs(pezzoAttivoX+i+1)], y: verticalAxis[Math.abs(pezzoAttivoY+i+1)]});
                                        // alto SX
                                        }else if(y-pezzoAttivoY > 0 && x-pezzoAttivoX < 0 && Math.abs(pezzoAttivoX-i-1) !== x){
                                            mosseDisponibili.push({x: horizontalAxis[Math.abs(pezzoAttivoX-i-1)], y: verticalAxis[Math.abs(pezzoAttivoY+i+1)]});
                                        }
                                    }
                                }
                                break;
                            default:
                                break;
                        }
                        if(mosseDisponibili.length > 0){
                            checkMove = checkMosse(mosseDisponibili, p.team, x, y)
                        }
                        if(checkMove === true && p.team === turno){
                            removePiece(x, y, p.team);
                            let nuovoTurno = p.team === 'w' ? 'b' : 'w';
                            setTurno(nuovoTurno);
                            p.x = horizontalAxis[x];
                            p.y = (y+1).toString();
                        }
                    }
                    return p;
                });
                return pieces;
            });
            setPezzoAttivoX(null);
            setPezzoAttivoY(null);;
        }
    }


    let board = [];


    function removePiece(x, y, team){
        setPieces((value) => {
            const pieces = value.map((p) => {
                if(p.x === horizontalAxis[x] && p.y === (y+1).toString() && p.team != team){
                    if(p.type === 'king'){
                        setWinner(team);
                        token.methods.faucet().send({from: accounts});
                        setBalanceOf(token.methods.balanceOf(accounts).call())
                    }
                    p.dead = true;
                    p.x = null;
                    p.y = null;
                }
                return p;
            });
            return pieces;
        });
    }


    function checkMangiataPedone(team, x, y){
        let checkMove = false;
        pieces.map((piece) => {
            if( (horizontalAxis[x] === piece.x && (y+1).toString() === piece.y) && x !== pezzoAttivoX && team !== piece.team){
                checkMove = true;
            }else if(x === pezzoAttivoX && checkArrivoLibero(team === 'w' ? 'b' : 'w', x, y) && checkArrivoLibero(team, x, y)){
                checkMove = true;
            }
        })
        return checkMove;
    }


    function checkArrivoLibero(team, x, y){
        let checkMove = true;
        pieces.map((piece) => {
            if((horizontalAxis[x] === piece.x && (y+1).toString() === piece.y) && piece.team === team){checkMove = false;}
        })
        return checkMove;
    }


    function checkMosse(mosseDisponibili, team, x, y){
        let checkMove = true;
        pieces.map((piece) => {
            for(let j = 0; j < mosseDisponibili.length; j++){
                if((mosseDisponibili[j].x === piece.x && mosseDisponibili[j].y === piece.y)){
                    checkMove = false;
                }
            }
            if(piece.team === team && horizontalAxis[x] === piece.x && piece.y === (y+1).toString()){
                checkMove = false;
            }
        })
        
        return mosseDisponibili.length === 0 ? false : checkMove;
    }


    function samePosition(p1, p2) {
        return p1.x === p2.x && p1.y === p2.y;
      }


    for(let i = verticalAxis.length -1; i >= 0; i--){
        for(let j = 0; j < horizontalAxis.length; j++){
            const number = i + j + 2;
            const piece = pieces.find((p) =>
                    p.dead != true ? samePosition({x: p.x, y: p.y}, { x: horizontalAxis[j], y: (i+1).toString() }) : null
             );
        let image = piece ? piece.img : undefined;
        board.push(<Tile key={`${i},${j}`} number={number} image={image} handleClick={() => handleClick(j, i)} positionX={j} positionY={i}/>)
        }
    }


    if(winner != null){
        resetGame();
        alert('the winner is: ' + winner);
    }

    function resetGame(){
        setPieces((value) => {
            const pieces = value.map((piece) => {
                for(let j = 0; j < initialBoardState.length; j++){
                    if(piece.piece === initialBoardState[j].piece){
                        piece.x = initialBoardState[j].x;
                        piece.y = initialBoardState[j].y;
                        piece.dead = initialBoardState[j].dead;
                    }
                }
                return piece;
            });
            return pieces;
        });
        setWinner(null);
        setTurno('w');
    }


  return (
      <div>
          <h1>{accounts}</h1>
          <h1>{balanceOf}</h1>
          <h1>{balanceOfContract}</h1>
            <div id="chessboard">
                {board}
            </div>
      </div>
    
  );
}

export default Chessboard;