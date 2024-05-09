import React, { useState, useEffect, useRef } from 'react';
import './game.css';
import Box from './Box';

const maxAttempts = 6;

const Game = () => {
    const [currentGuess, setCurrentGuess] = useState('');
    const [guesses, setGuesses] = useState([]);
    const [status, setStatus] = useState('playing');
    const gameRef = useRef(null);
    const [enterkey, setEnterkey] = useState(null);
    const [currwriting, setCurrwriting] = useState(1);
    const [targetWordArray, setTargetWordArray] = useState([]);
    const [targetWord, setTargetWord] = useState('');
    const [gameReady, setGameReady] = useState(false); // Track if game is ready

    useEffect(() => {
        const fetchRandomWord = async () => {
            try {
                const response = await fetch('https://random-word-api.herokuapp.com/word?length=5');
                const data = await response.json();
                if (Array.isArray(data) && data.length > 0) {
                    const word = data[0];
                    setTargetWord(word);
                    setTargetWordArray(word.split(''));
                    setGameReady(true); // Set game as ready after fetching the word
                } else {
                    throw new Error('Invalid data received from API');
                }
            } catch (error) {
                console.error('Error fetching random word:', error);
                setGameReady(true); // Ensure game is marked ready even on error
            }
        };

        fetchRandomWord();
    }, []);

    useEffect(() => {
        if (gameReady) {
            gameRef.current.focus();
        }
    }, [gameReady]);

    useEffect(() => {
        if (guesses.includes(targetWord)) {
            setStatus('won');
        } else if (guesses.length === maxAttempts) {
            setStatus('lost');
        }
    }, [guesses, targetWord]);

    const handleGuess = (value) => {
        if (!gameReady || status !== 'playing') return;

        if (value === 'ENTER' && currentGuess.length === targetWord.length) {
            setGuesses(prev => [...prev, currentGuess]);
            setCurrentGuess('');
            setEnterkey(value);
            setCurrwriting(currwriting + 1);
        } else if (value === 'BACKSPACE') {
            setCurrentGuess(prev => prev.slice(0, -1));
        } else if (currentGuess.length < targetWord.length && /^[a-zA-Z]$/.test(value)) {
            setCurrentGuess(prev => prev + value.toLowerCase());
        }
    };

    useEffect(() => {
        if (gameReady) {
            const handleKeyDown = (event) => {
                const { key } = event;
                if (key === 'Enter') {
                    handleGuess('ENTER');
                } else if (key === 'Backspace') {
                    handleGuess('BACKSPACE');
                } else if (/^[a-zA-Z]$/.test(key)) {
                    handleGuess(key);
                }
            };

            window.addEventListener('keydown', handleKeyDown);

            return () => {
                window.removeEventListener('keydown', handleKeyDown);
            };
        }
    }, [currentGuess, status, gameReady]);

    return (
        <div className='game' tabIndex={0} ref={gameRef} style={{ outline: 'none' }}>
            <div className='map'>
                <Box currentGuess={currentGuess} guesses={guesses} maxAttempts={maxAttempts} targetWordLength={targetWord.length} targetWordArray={targetWordArray} value={enterkey} currwriting={currwriting} />
            </div>
            <div className='button'>
                {['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P', 'A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', 'ENTER', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', 'BACKSPACE'].map((value) => (
                    <button key={value} onClick={() => handleGuess(value)}>{value}</button>
                ))}
            </div>
            {status !== 'playing' && (
                <div className='status'>{status === 'won' ? 'Congratulations!' : 'Try Again!'}</div>
            )}
        </div>
    );
};

export default Game;
