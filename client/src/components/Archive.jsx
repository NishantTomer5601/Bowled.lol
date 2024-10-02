import React, { useEffect, useState } from 'react';
import { Settings, Coffee } from 'lucide-react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Confetti from 'react-confetti';

function Archive() {
    const [availableDates, setAvailableDates] = useState([]);  // List of available dates
    const [selectedDate, setSelectedDate] = useState('');      // User-selected date
    const [archivedPlayer, setArchivedPlayer] = useState(null); // The player for the selected date
    const [guessInput, setGuessInput] = useState('');
    const [guesses, setGuesses] = useState([]);
    const [remainingGuesses, setRemainingGuesses] = useState(5);
    const [suggestions, setSuggestions] = useState([]);
    const [showAllSuggestions, setShowAllSuggestions] = useState(false);
    const [showCongratulations, setShowCongratulations] = useState(false);
    const [playerImagePath, setPlayerImagePath] = useState(''); 
    const [popupVisible, setPopupVisible] = useState(true);
    const [isGameClosed, setIsGameClosed] = useState(false);
    const [showFailurePopup, setShowFailurePopup] = useState(false);
    const [correctPlayer, setCorrectPlayer] = useState({});

    useEffect(() => {
        axios.get('http://localhost:8000/api/archive')  
            .then(response => setAvailableDates(response.data))
            .catch(error => console.error('Error fetching available archive dates:', error));
    }, []);

    const handleDateSelection = () => {
        if (selectedDate) {
            axios.get('http://localhost:8000/api/archive-player', {
                params: { date: selectedDate }
            })
            .then(response => {
                setArchivedPlayer(response.data); 
                setPlayerImagePath(response.data.image_path); 
                resetGame(); 
            })
            .catch(error => console.error('Error fetching archived player:', error));
        }
    };

    const resetGame = () => {
        setGuesses([]);
        setRemainingGuesses(5);
        setGuessInput('');
        setShowCongratulations(false);
        setShowFailurePopup(false);
        setPopupVisible(true);
        setIsGameClosed(false);
        setCorrectPlayer(null);
    };

    const handleGuess = () => {
    if (remainingGuesses > 0 && guessInput.trim() !== "") {
        axios.get('http://localhost:8000/api/guess', {
            params: { guessedPlayerName: guessInput.trim() }
        })
        .then(response => {
            setGuesses([...guesses, response.data]);
            setRemainingGuesses(remainingGuesses - 1);
            setGuessInput('');

            if (response.data.fullname === guessInput.trim() && response.data.country_match && response.data.position_match && response.data.birthyear_match && response.data.battingstyle_match && response.data.bowlingstyle_match) {
                setPlayerImagePath(response.data.image_path);
                setShowCongratulations(true);
                setPopupVisible(true);
            }

            if (remainingGuesses - 1 === 0 && !showCongratulations) {
            axios.get('http://localhost:8000/api/target-player')
              .then(res => {
                setCorrectPlayer(res.data); 
                setShowFailurePopup(true);  
                setIsGameClosed(true);      
              })
              .catch(error => console.error('Error fetching correct player:', error));
          }

 
        })
        .catch(error => alert('Player not found'));
    }
};

    const handleSearchInputChange = (e) => {
        const input = e.target.value;
        setGuessInput(input);

        // Fetch player suggestions based on input
        if (input.length > 0) {
            axios.get('http://localhost:8000/api/search', { params: { query: input } })
                .then(response => setSuggestions(response.data))
                .catch(error => console.error('Error fetching search suggestions', error));
        } else {
            setSuggestions([]);
        }
    };

    const handleSuggestionClick = (suggestion) => {
        setGuessInput(suggestion); 
        setSuggestions([]);
    };

    return (
        <div className="min-h-screen bg-stone-100 text-stone-800 p-4">
            {showCongratulations && (
                <Confetti width={window.innerWidth} height={window.innerHeight} />
            )}
            {showCongratulations && popupVisible && (
                <div className="fixed inset-0 flex items-center justify-center z-50">
                    <div className="relative bg-white p-6 rounded-lg shadow-lg text-center" style={{ maxWidth: '500px', width: '100%' }}>
                        <img src={playerImagePath} alt="Player" className="rounded-full w-32 h-32 mx-auto mb-4 shadow-lg" />
                        <h2 className="text-4xl font-bold text-green-700 mb-4">Congratulations!</h2>
                        <p className="text-xl mb-6">You guessed the right player!</p>
                        
                        <button
                            onClick={() => {
                                resetGame();
                                setPopupVisible(false);
                                setIsGameClosed(true);
                            }}
                            className="mt-4 px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 mr-4"
                        >
                            Close
                        </button>
                        
                        <button
                            onClick={resetGame}
                            className="mt-4 px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
                        >
                            Play Again
                        </button>
                    </div>
                </div>
            )}

            {/* Failure Popup */}
            {showFailurePopup && (
                <div className="fixed inset-0 flex items-center justify-center z-50">
                    <div className="relative bg-white p-6 rounded-lg shadow-lg text-center" style={{ maxWidth: '500px', width: '100%' }}>
                        {correctPlayer && (
                            <>
                                <img src={correctPlayer.image_path} alt="Player" className="rounded-full w-32 h-32 mx-auto mb-4 shadow-lg" />
                                <h2 className="text-4xl font-bold text-red-700 mb-4">Game Over!</h2>
                                <p className="text-xl mb-6">The correct player was: <span className="font-bold">{correctPlayer.fullname}</span></p>
                            </>
                        )}
                        <button onClick={resetGame} className="mt-4 px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600">
                            Play Again
                        </button>
                    </div>
                </div>
            )}

            {/* Header Section */}
            <header className="flex justify-between items-center mb-8">
                <nav className="space-x-4">
                    <Link to="/how-to-play" className="text-green-700 hover:underline">HOW TO PLAY</Link>
                    <Link to="/stats" className="text-green-700 hover:underline">STATS</Link>
                    <Link to="/archive" className="text-green-700 hover:underline">ARCHIVE</Link>
                </nav>
                <Settings className="text-green-700 w-6 h-6" />
            </header>

            {/* Main Section */}
            <main className="max-w-3xl mx-auto">
                <h1 className="text-5xl font-bold text-center text-green-800 mb-4">BOWLED - ARCHIVE</h1>
                <p className="text-xl text-center mb-8">Guess the cricketer for the selected date from the archive</p>

                {/* Date Selection */}
                <div className="mb-8">
                    <select
                        className="w-full p-3 border border-green-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                    >
                        <option value="">Select a date</option>
                        {availableDates.map((dateObj, index) => (
                            <option key={index} value={dateObj.date}>
                                {dateObj.date}
                            </option>
                        ))}
                    </select>
                    <button
                        onClick={handleDateSelection}
                        className="mt-4 px-4 py-2 bg-green-400 text-white rounded-md hover:bg-green-500"
                    >
                        Load Archived Game
                    </button>
                </div>

                {archivedPlayer && (
                <>

                {/* Input Section */}
                <div className="mb-8">
                    <input
                        type="text"
                        value={guessInput}
                        onChange={handleSearchInputChange}
                        placeholder="Guess any player, past, or present!"
                        className="w-full p-3 border border-green-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                        disabled={isGameClosed}
                    />

                    {/* Dropdown for suggestions */}
                    {suggestions.length > 0 && (
                        <div className="relative w-full bg-white border border-gray-300 rounded-md mt-2 shadow-lg z-10">
                            {suggestions.slice(0, 3).map((player, index) => (
                                <div key={index} className="p-2 hover:bg-gray-100 cursor-pointer" onClick={() => handleSuggestionClick(player.fullname)}>
                                    {player.fullname}
                                </div>
                            ))}
                            {suggestions.length > 3 && (
                                <div className="p-2 hover:bg-gray-100 cursor-pointer text-blue-600 font-semibold" onClick={() => setShowAllSuggestions(true)}>
                                    <i>See more</i>
                                </div>
                            )}
                            {showAllSuggestions && (
                                suggestions.map((player, index) => (
                                    <div key={index} className="p-2 hover:bg-gray-100 cursor-pointer" onClick={() => handleSuggestionClick(player.fullname)}>
                                        {player.fullname}
                                    </div>
                                ))
                            )}
                        </div>
                    )}
                    {showAllSuggestions && (
                        <div className="p-2 hover:bg-gray-100 cursor-pointer text-blue-600 font-semibold" onClick={() => setShowAllSuggestions(false)}>
                            See less
                        </div>
                    )}

                    <button
                        onClick={handleGuess}
                        className="mt-4 px-4 py-2 bg-green-400 text-white rounded-md hover:bg-green-500"
                    >
                        Submit Guess
                    </button>
                </div>

                {/* Table Section */}
                <table className="w-full border-collapse mb-8">
                    <thead>
                        <tr className="border-b border-green-300">
                            <th className="p-2 text-left text-green-700">Player</th>
                            <th className="p-2 text-left text-green-700">Nation</th>
                            <th className="p-2 text-left text-green-700">Role</th>
                            <th className="p-2 text-left text-green-700">DOB/Year</th>
                            <th className="p-2 text-left text-green-700">Batting Style</th>
                            <th className="p-2 text-left text-green-700">Bowling Style</th>
                        </tr>
                    </thead>
                    <tbody>
                        {guesses.map((guess, index) => (
                            <tr key={index} className="border-b border-green-300">
                                <td className="p-2">{guess.fullname}</td>
                                <td className={`p-2 ${guess.country_match ? 'bg-green-300' : ''}`}>{guess.country_name}</td>
                                <td className={`p-2 ${guess.position_match ? 'bg-green-300' : ''}`}>{guess.position}</td>
                                <td className={`p-2 ${guess.birthyear_match ? 'bg-green-300' : ''}`}>{guess.birthyear}</td>
                                <td className={`p-2 ${guess.battingstyle_match ? 'bg-green-300' : ''}`}>{guess.battingstyle}</td>
                                <td className={`p-2 ${guess.bowlingstyle_match ? 'bg-green-300' : ''}`}>{guess.bowlingstyle}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <p>{remainingGuesses} guesses remaining</p>
                </>
                )}
            </main>

            {/* Footer Section */}
            <footer className="text-center mt-8">
                <p>
                    Enjoying Stumple?{' '}
                    <a
            href="https://www.buymeacoffee.com/bowled"
            target="_blank"
            rel="noopener noreferrer"
            className="text-green-700 hover:underline"
        >
            Buy us a <Coffee className="inline w-4 h-4" />
        </a>{' '}
                    |{' '}
                    <Link to="/feedback" className="text-green-700 hover:underline">
                        Give us feedback!
                    </Link>
                </p>
            </footer>
        </div>
    );
}

export default Archive;
