import React from 'react';

import './Proto.css';

export default class Proto extends React.Component {
    constructor(props) {
        super(props);

        this.state = {

        }
    }

    optOnClick = (event) => {
        event.preventDefault();
        prompt("Enter your DCA Licence Number");
        prompt("Enter your business email.");
        alert("We have emailed you a verification code to you DCA Licence associated contact number.")
    }


    render() {
        return (
            <div className="ProtoWrapper">
                <div className="ProtoTopContainer">
                    <div className='headerSection'>
                        <h1>Welcome to <span>Serve</span></h1>
                        <h2>Join as: </h2>
                    </div>

                    <div className="joinOptions">
                        <div onClick={this.optOnClick} className="opt joinOption-bakery">
                            <h2>Bakery</h2>
                        </div>
                        <div onClick={this.optOnClick} className="opt joinOption-restaurant">
                            <h2>Restaurant</h2>
                        </div>
                        <div onClick={this.optOnClick} className="opt joinOption-supermarket-grocery">
                            <h2>Supermarket/Grocery shop</h2>
                        </div>
                        <div onClick={this.optOnClick} className="opt joinOption-vendor-truck-stand">
                            <h2>Food vendor/truck/stand</h2>
                        </div>
                        <div onClick={this.optOnClick} className="opt joinOption-conv">
                            <h2>Convinience shop</h2>
                        </div>
                    </div>

                </div>
            </div>
        )
    }
}