import React from 'react';

const Navbar = () => {
    return (
        <div className="container-fluid  py-5">
            <div className="logo-size align-items-center justify-content-center">
                <div className="col-auto text-center">
                    <img
                        src="public/movie-f.avif"
                        alt="Movie Logo"
                        className="logo-size me-4"
                    />
                </div>

            </div>
        </div>
    )
};

export default Navbar;