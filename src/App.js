import React from "react";
import Die from "./components/Die";
import { nanoid } from "nanoid";
import { useReward } from "react-rewards";

function App() {
  const { reward, isAnimating } = useReward('rewardId', 'balloons');

  const [dice, setDice] = React.useState(allNewDice());
  const [moves, setMoves] = React.useState(0);
  const [tenzies, setTenzies] = React.useState(false);

  React.useEffect(() => {
    const allHeld = dice.every(die => die.isHeld);
    const firstValue = dice[0].value;
    const allSameValue = dice.every(die => die.value === firstValue);
    if(allHeld && allSameValue){
      setTenzies(true);
      reward();
    }
  }, [dice]);

  function generateNewDie() {
    return {
      value: Math.ceil(Math.random() * 6),
      isHeld: false,
      id: nanoid()
    }
  }

  function allNewDice() {
    const diceArray = [];
    for (let i = 0; i < 10; i++) {
      diceArray.push(generateNewDie())
    }
    return diceArray;
  }

  function rollDice() {
    if(tenzies){
      setDice(allNewDice());
      setTenzies(false);
      setMoves(0)
    } else {
      setDice(prevDice => prevDice.map(die => {
        return die.isHeld ? die : generateNewDie()
      }));
      setMoves(prevMoves => prevMoves + 1);
    }
  }

  function holdDice(id) {
    setDice(prevDice => prevDice.map(die => {
      return die.id === id ? { ...die, isHeld: !die.isHeld } : die
    }))
  }

  const diceElements = dice.map(die => (
    <Die key={die.id} value={die.value} isHeld={die.isHeld} holdDice={() => holdDice(die.id)} />
  ))

  return (
    <main>
      <h1 className="title">Space Tenzies</h1>
      <p className="instructions">Roll until all dice are the same. Click each die to freeze it at its current value between rolls.</p>
      <h2 className="moves">{tenzies ? `Game over with ${moves} rolls.` : `Rolls: ${moves}`} </h2>
      <div onClick={holdDice} className="dice-container">
        {diceElements}
      </div>
      <button className="roll-dice" onClick={rollDice} >
        {tenzies ? 'New Game' : 'Roll'}
      </button>
      <span id="rewardId" />
    </main>
  )
}

export default App;
