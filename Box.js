import React, { useMemo, useState } from 'react';

const Box = ({ guesses, currentGuess, maxAttempts, targetWordLength ,targetWordArray , value ,currwriting}) => {
  // Preparing the grid data with empty spaces for unattempted guesses

  const preparedGuesses = guesses.concat(Array(maxAttempts - guesses.length).fill('')); // in this line it says that fill '' in the remaining part of the array guesses for example in start there is nothing written so maxattempts - guess.length will be  6-0 = 6 so it will fill '' in all 6 columns
  if (currentGuess) preparedGuesses[guesses.length] = currentGuess;  // this line will replace '' with the current guess

  // Function to get the character at [row, col], or '' if not available
  // const getCharAt = (col, row) => {
  //   const guess = preparedGuesses[row];
  //   return guess[col] || '';
  // }
  const getLetterState = (guess, colIndex) => {
    // console.log(value)
    // console.log(guesses.length)
    // console.log(currwriting)
    if ((value ==='ENTER' && guess.length===targetWordLength)  ){
     if (!guess || guess.length <= colIndex || !guess[colIndex]) return 'unattempted';
    const letter = guess[colIndex] || '';
     if (letter === targetWordArray[colIndex]) return 'correct';
    if (targetWordArray.includes(letter)) return 'present';
    return 'absent';
    }
    
    if (guesses.length<currwriting  && guesses.length>0 && currentGuess.length===targetWordLength){
       for(let i=0;i<currwriting;i++){
        
        if (!guess || guess.length <= colIndex || !guess[colIndex]) return 'unattempted';
        const letter = guess[colIndex] || '';
        if (letter === targetWordArray[colIndex]) return 'correct';
        if (targetWordArray.includes(letter)) return 'present';
        return 'absent';
       }
    }
    
   
    
   
  };
  
  return (
    <div className="grid">
      {Array.from({ length: targetWordLength }).map((_, colIndex) => (  
        //  targetWordLength is the length of the word that players are trying to guess. This value dictates how many columns the grid will have, as each column represents a letter in the word.
 //Array.from({ length: targetWordLength }) creates an array with a size equal to the length of the target word. The array is filled with undefined values, but they're not directly used here.
//.map((_, colIndex) => ... iterates over this array. The first argument of the callback function (_) is the current element, which is irrelevant here (hence the underscore, which is a convention to indicate an unused variable). The second argument, colIndex, is the index of the current element in the array, effectively representing the current column number in the grid.
<div key={colIndex} className="grid-column">
{preparedGuesses.map((guess, rowIndex) => {
  //.map((guess, rowIndex) => {...}): This function iterates over each guess in preparedGuesses. For each iteration, guess represents the current guess (a string), and rowIndex is the index of that guess within the array.
// console.log(guess)
            const letter = guess[colIndex] || '';
            // console.log(letter)
            const letterState = getLetterState(guess, colIndex);
            return (
              <div key={rowIndex} className={`grid-item ${letterState}`}>
                {letter.toUpperCase()}
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
};

export default Box;