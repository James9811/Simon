import { useState, useEffect, useRef } from 'react'
import useSound from 'use-sound';
import simon from './assets/sounds/sprite.mp3'
import './App.css'

function App() {
const blueRef = useRef(null);
const yellowRef = useRef(null);
const greenRef = useRef(null);
const redRef = useRef(null);

const [play] = useSound(simon, {
	sprite :{
		one: [0, 500],
		two: [1000, 500],
		three: [2000, 500],
		four: [3000, 500],
		fail: [4000, 1000]

	},
});

const colors =[
	{color:'#FAF303',
	ref: yellowRef,
	sound:'one'
	},
	{color:'#030AFA',
	ref: blueRef,
	sound:'two'
	},
	{color:'#FA0E03',
	ref: redRef,
	sound:'three'
	},
	{color:'#0AFA03',
	ref: greenRef,
	sound:'four'
	}
]

const minNumber = 0;
const maxNumber = 3;
const speedGame = 400;

const [sequence, setSequence] = useState([]);
const [currentGame, setCurrentGame] = useState([]);
const [isAllowedToPlay, setIsAllowedToPlay] = useState(false);
const [speed, setSpeed] = useState(speedGame);
const [turn, setTurn] = useState(0);
const [pulses, setPulses] = useState(0);
const [success, setSuccess] = useState(0);
const [isGameOn, setIsGameOn] = useState(false);
const [record, setRecord] = useState([]);
const [lastSequence, setLastSequence] = useState([]);
const [lastTurn, setLastTurn] =useState([]);

const initGame = () => {
	randomNumber();
	setIsGameOn(true);
}

const prevGame = () => {
	setSequence(lastSequence);
	setIsGameOn(true);
	setTurn(lastTurn);
}

const randomNumber = () => {
	setIsAllowedToPlay(false);
	const randomNumber = Math.floor(Math.random() * (maxNumber - minNumber + 1) + minNumber);
	setSequence([...sequence, randomNumber]);
	setTurn(turn + 1);
	setLastTurn(turn);
	setRecord(lastTurn);
}

const handleClick = (index) => {
	if(isAllowedToPlay) {
		play({id: colors[index].sound})
		colors[index].ref.current.style.opacity = (1);
		colors[index].ref.current.style.scale = (0.9);
		setTimeout(() => {
			colors[index].ref.current.style.opacity = (0.5);
			colors[index].ref.current.style.scale = (1);
			setCurrentGame([...currentGame, index]);
			setPulses(pulses + 1);
		}, speed / 2)
	}
}

useEffect(() => {
	if(pulses > 0) {
		if (Number(sequence[pulses - 1]) === Number(currentGame[pulses - 1])){
		setSuccess(success + 1);
		} else {
			const index = sequence[pulses - 1]
			if (index) colors[index].ref.current.style.opacity = (1);
			setLastSequence(sequence);
			play({id:'error'})
			setTimeout(() =>{
				if (index) colors[index].ref.current.style.opacity = (0.5);
				setIsGameOn(false);
			}, speed * 2)
			setIsAllowedToPlay(false);
		}
	}
},[pulses])

useEffect(() => {
	if(!isGameOn) {
		setSequence([]);
		setCurrentGame([]);
		setIsAllowedToPlay(false);
		setSpeed(speedGame);
		setSuccess(0);
		setPulses(0);
		setTurn(0);
	}
}, [isGameOn])

useEffect(() => {
	if(success === sequence.length && success > 0) {
		setSpeed(speed - sequence.length * 2);
		setTimeout(() => {
			setSuccess(0);
			setPulses(0);
			setCurrentGame([])
			randomNumber();
		}, 500)
	}
}, [success])

 useEffect(() => {
	if(!isAllowedToPlay) {
		sequence.map((item, index) => {
			setTimeout(() => {
				play({id: colors[item].sound})
				colors[item].ref.current.style.opacity = (1);
				setTimeout(() => {
					colors[item].ref.current.style.opacity = (0.5);
					setIsAllowedToPlay(true); 
				}, speed / 2)
			}, speed * index)
		})
	}
	
 }, [sequence])

return (
	<>
   {
	isGameOn
	?
	<>
	<div className='header'>
		<h1>Turn {turn}</h1>
		
	</div>
	<div className='container'>
		{colors.map((item, index) => {
			return (
				<div
    				key={index}
    				ref={item.ref}
    				className={`pad pad-${index}`}
    				style={{backgroundColor:`${item.color}`, opacity:0.6}}
    				onClick={() => handleClick(index)}>
				</div>
				
				)
			}
		)}
		
	</div>
	</>
	:
	<>
		<div className='header'>
			<h1>SUPER SIMON</h1>
			<h2>RECORD {record}</h2>
		</div>
		<button onClick={initGame}>START</button>
		<button onClick={prevGame}>ULTIMO JUEGO</button>
	</>
   }
    </>
)
}

export default App
