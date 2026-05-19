import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const Single = () => {
    const id = useParams().imdbID;
    const [singlemovie, setsinglemovie] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null); 

    const getSingleData = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.get(
                `https://www.omdbapi.com/?apikey=c37d2ee9&i=${id}`
            );
            
            if (response?.data?.Response === "False") {
                setError(response.data.Error);
                setsinglemovie({});
            } else {
                setsinglemovie(response?.data);
            }
        } catch (err) {
            console.error("Error fetching single movie data:", err);
            setError("Could not fetch data. Check network connection.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getSingleData();
    }, [id]);

    if (loading) {
        return (
            <div className="container-fluid">
                <div className="row px-4 pt-5">
                    <div className="col-12 text-light">
                        <h1 className='mb-4'>Loading Movie Details...</h1>
                    </div>
                    <div className="col-4">
                        <div style={{ width: '100%', height: '400px', backgroundColor: '#333', borderRadius: '8px' }}></div>
                    </div>
                    <div className="col-8">
                        <div style={{ width: '70%', height: '30px', backgroundColor: '#444', marginBottom: '20px' }}></div>
                        <div style={{ width: '90%', height: '15px', backgroundColor: '#555', marginBottom: '10px' }}></div>
                        <div style={{ width: '80%', height: '15px', backgroundColor: '#555', marginBottom: '10px' }}></div>
                        <div style={{ width: '60%', height: '15px', backgroundColor: '#555', marginBottom: '10px' }}></div>
                    </div>
                </div>
            </div>
        );
    }
    
    if (error) {
        return <div className="text-center text-danger mt-5">Error: {error}</div>;
    }

   return (
        <div className="container-fluid">
            <div className="row px-4 ">
                <div className="col-12">
                    <h1 className='title text-light mb-4'>{singlemovie.Title}</h1>
                </div>

                <div className="col-4">
                    <div>
                        <img 
                            src={singlemovie.Poster} 
                            alt={singlemovie.Title}
                            className="single-poster img-fluid rounded" 
                        />
                    </div>
                </div>
                
                <div className="col-8">
                    <div className="mb-4">
                        <h3 className='text-light'>Plot:</h3>
                        <p className='headings text-light'>{singlemovie.Plot}</p>
                    </div>
                    
                    <div className="mb-4">
                        <p className='m-0 fs-5 text-gray'>Actors:</p>
                        <p className='headings text-light'>{singlemovie.Actors}</p>
                    </div>

                    <div className="mb-4">
                        <p className='m-0 fs-5 text-gray'>Country:</p>
                        <p className='headings text-light'>{singlemovie.Country}</p>
                    </div>

                    <div className="mb-4">
                        <p className='m-0 fs-5 text-gray'>Language:</p>
                        <p className='headings text-light'>{singlemovie.Language}</p>
                    </div>

                    <div className="mb-4">
                        <p className='headings m-0 fs-5 text-gray'>Rating:</p>
                        <p className='m-0 card-bg py-1 px-2 text-yello d-inline-block rounded mt-1'>
                            <span>
                                <i className='fa-solid fa-star font-size-12'></i>
                            </span>
                            <span>{singlemovie.imdbRating}</span> 
                        </p>
                    </div>
                    
                    <div className="mb-4">
                        <p className='headings m-0 fs-5 text-gray'>Awards:</p>
                        <p className='m-0 font-size-12 text-light'>{singlemovie.Awards}</p>
                    </div>
                </div>
            </div>
        </div>  
    );
}

export default Single;