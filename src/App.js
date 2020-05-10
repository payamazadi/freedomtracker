import React, { Component, useState } from "react";
import ReactTooltip from "react-tooltip";
import { hot } from "react-hot-loader";

import "./App.css";

import MapChart from "./MapChart";

import 'bootstrap/dist/css/bootstrap.min.css';

// const x = 5;

class App extends Component {
    constructor(props) {
        super(props);
        this.state = { content: "" };
    }

    render() {
        return (
            <div>
                <MapChart setTooltipContent={(x) => this.setState({ content: x })} />
                {/* <MapChart  /> */}
                <ReactTooltip>{this.state.content}</ReactTooltip>
                
            </div>

        );
    }
}

export default hot(module)(App);