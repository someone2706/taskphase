import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { NavLink } from 'react-router-dom';

const Home = () => {
    const [movieAllData, setMovieAllData] = useState([]);
    const [inputValue, setInputValue] = useState("");
    const [searchValue, setSearchValue] = useState("movie");
    const [isDataAvailable, setIsDataAvailable] = useState(true);
    const [loading, setLoading] = useState(false);

    const getMovieData = async () => {
        try {
            setLoading(true);
            const { data } = await axios.get(
                `https://www.omdbapi.com/?apikey=c37d2ee9&s=${searchValue}`
            );

            if (data.Response === "True") {
                setMovieAllData(data.Search);
                setIsDataAvailable(true);
            } else {
                setIsDataAvailable(false);
            }
        } catch (error) {
            console.log("Error fetching movie data:", error);
            setIsDataAvailable(false);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getMovieData();
    }, [searchValue]);

    const handleSearch = () => {
        if (inputValue.trim()) {
            setSearchValue(inputValue);
        }
    };

    return (
        <>
            <div className='container-fluid'>
                <div className="col-auto text-center mb-4">
                    <h1 className="text-light mb-2 text-center">
                        Watch Your Favourite Movies Here.
                    </h1>
                    <p className="text-light mb-0">
                        Discover movies from every genre and decade.
                        <br />
                        Search instantly, explore details, and find what to watch next.
                    </p>
                </div>
                <div className='d-flex gap-2'>
                    <input
                        type="text"
                        className="input-field w-75 h-60 border-0 rounded px-2"
                        placeholder="Search for movies..."
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                    />
                    <button
                        className='search-button w-25 h-60 border-0 rounded'
                        onClick={handleSearch}
                        disabled={loading}
                    >
                        {loading ? "Loading..." : "Search"}
                    </button>
                </div>
            </div>

            <div className='row-movie px-4'>
                {isDataAvailable ? (
                    movieAllData.map((movie) => (
                        <div
                            className="movie-poster mt-5 my-5 justify-content-between"
                            key={movie.imdbID}
                        >
                            <NavLink className="text-decoration-none" to={`/single/${movie?.imdbID}`}>
                                <div className='card-bg movie-card-container'>
                                    <div>
                                        <img
                                            src={movie.Poster}
                                            alt={movie.Title}
                                            className="movie-card img-fluid rounded-top"
                                            loading="lazy"
                                        />
                                    </div>
                                    <div className='py-2'>
                                        <p className='movie-title m-0 text-center'>{movie.Title}</p>
                                    </div>
                                </div>
                            </NavLink>

                        </div>
                    ))
                ) : (
                    <h1 className='fs-1 text-center text-white'>No Result Found</h1>
                )}
            </div>
        </>
    );
};

export default Home;
