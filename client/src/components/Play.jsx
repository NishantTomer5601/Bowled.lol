import React, { useEffect } from 'react';
import { Settings, HelpCircle, Coffee } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

function Play() {
    const [playersData, setPlayersData] = useState([]);
    const [guessInput, setGuessInput] = useState('');
    const [guesses, setGuesses] = useState([]);
    const [remainingGuesses, setRemainingGuesses] = useState(5);
    const [suggestions, setSuggestions] = useState([]);
    const targetPlayer = 'Dinesh Karthik';

    useEffect(() => {
        axios.get("http://localhost:8000/api/players")
            .then(response => setPlayersData(response.data))
            .catch(error => console.error('Error fetching player data: ',error));
    }, []);

    const handleGuess = () => {
        if(remainingGuesses > 0 && guessInput.trim() !== ""){
            axios.get('http://localhost:8000/api/guess' , {
                params: {
                            guessedPlayerName: guessInput.trim(),
                            targetPlayerName: targetPlayer
                        }
            })
                .then(response => {
                    setGuesses([...guesses, response.data]);
                    setRemainingGuesses(remainingGuesses-1);
                    setGuessInput('');
                })
                .catch(error => {
                    alert('Player not found')
                });
        }
            
    };

    const handleSearchInputChange = (e) => {
        const input = e.target.value;
        setGuessInput(input);

        if (input.length > 0) {
            // Call the search API to get suggestions
            axios.get('http://localhost:8000/api/search', {
                params: { query: input }
            })
                .then(response => {
                    setSuggestions(response.data);
                })
                .catch(error => {
                    console.error('Error fetching search suggestions', error);
                });
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
            <h1 className="text-5xl font-bold text-center text-green-800 mb-4">STUMPLE</h1>
            <p className="text-xl text-center mb-8">Guess the international cricketer</p>

            {/* Input Section */}
            <div className="mb-8 realtive">
            <input
                type="text"
                value={guessInput}
                onChange={handleSearchInputChange}  // Adding new event handler for search  --> to be implemented
                placeholder="Guess any player, past, or present!"
                className="w-full p-3 border border-green-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            />

            {/* Dropdown for suggestions */}
                    {suggestions.length > 0 && (
                        <div className="relative w-full bg-white border border-gray-300 rounded-md mt-2 shadow-lg z-10">
                            {suggestions.map((player, index) => (
                                <div
                                    key={index}
                                    className="p-2 hover:bg-gray-100 cursor-pointer"
                                    onClick={() => handleSuggestionClick(player.fullname)}
                                >
                                    {player.fullname}
                                </div>
                            ))}
                        </div>
                    )}
            <button
                onClick={handleGuess}
                className="mt-4 px-4 py-2 bg-green-400 text-white rounded-md hover:bg-green-500"
            >
                Submit Guess
            </button>
            </div>

            {/* New Feature Section */}
            <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-2 rounded-md mb-4">
            <span className="font-bold">NEW FEATURE!</span> Play past Stumple games in the <Link to="/archive" className="text-green-700 hover:underline">Archive</Link>
            </div>

            {/* Help Section */}
            <p className="text-center mb-8">
            After a guess, click/hover on the [<HelpCircle className="inline w-4 h-4" />] in any yellow or blank square for help <span className="text-green-700">(disable in settings)</span>
            </p>

            {/* Table Section */}
            <table className="w-full border-collapse mb-8">
            <thead>
                <tr className="border-b border-green-300">
                <th className="p-2 text-left text-green-700">Nation</th>
                <th className="p-2 text-left text-green-700">Role</th>
                <th className="p-2 text-left text-green-700">Retired?</th>
                <th className="p-2 text-left text-green-700">Born</th>
                <th className="p-2 text-left text-green-700">Batting Hand</th>
                <th className="p-2 text-left text-green-700">Total Matches</th>
                <th className="p-2 text-left text-green-700">Current IPL Team</th>
                </tr>
            </thead>
            <tbody>
                {guesses.map((guess, index) => (
                    <tr key={index} className="border-b border-green-300">
                        <td className="p-2">{guess.fullname}</td>
                        <td className={`p-2 ${guess.nation ? 'bg-green-300' : ''}`}>{guess.nation ? 'Matched' : 'Not Matched'}</td>
                        <td className={`p-2 ${guess.role ? 'bg-green-300' : ''}`}>{guess.role ? 'Matched' : 'Not Matched'}</td>
                        <td className={`p-2 ${guess.retired ? 'bg-green-300' : ''}`}>{guess.retired ? 'Matched' : 'Not Matched'}</td>
                        <td className={`p-2 ${guess.born ? 'bg-green-300' : ''}`}>{guess.born ? 'Matched' : 'Not Matched'}</td>
                        <td className={`p-2 ${guess.battingHand ? 'bg-green-300' : ''}`}>{guess.battingHand ? 'Matched' : 'Not Matched'}</td>
                        <td className={`p-2 ${guess.totalMatches ? 'bg-green-300' : ''}`}>{guess.totalMatches ? 'Matched' : 'Not Matched'}</td>
                        <td className={`p-2 ${guess.currentIPLTeam ? 'bg-green-300' : ''}`}>{guess.currentIPLTeam ? 'Matched' : 'Not Matched'}</td>
                    </tr>
                ))}
            </tbody>
            </table>
            <p>{remainingGuesses} guesses remaining</p>
        </main>

        {/* Footer Section */}
        <footer className="text-center mt-8">
            <p>
            Enjoying Stumple?{' '}
            <Link to="/donate" className="text-green-700 hover:underline">
                Buy us a <Coffee className="inline w-4 h-4" />
            </Link>{' '}
            |{' '}
            <Link to="/feedback" className="text-green-700 hover:underline">
                Give us feedback!
            </Link>
            </p>
        </footer>
        </div>
    );
    }

export default Play;