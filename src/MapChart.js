import React, { Component, memo } from "react";
import {
    ZoomableGroup,
    ComposableMap,
    Geographies,
    Geography
} from "react-simple-maps";

import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/Button'

const geoUrl =
    "https://raw.githubusercontent.com/zcreativelabs/react-simple-maps/master/topojson-maps/world-110m.json";

const fetchGeographies = (url) => {
return fetch(url)
    .then(res => {
    if (!res.ok) {
        throw Error(res.statusText)
    }
    return res.json()
    }).catch(error => {
    console.log("There was a problem when fetching the data: ", error)
    })
}

const geographies = fetchGeographies(geoUrl);

const rounded = num => {
    if (num > 1000000000) {
        return Math.round(num / 100000000) / 10 + "Bn";
    } else if (num > 1000000) {
        return Math.round(num / 100000) / 10 + "M";
    } else {
        return Math.round(num / 100) / 10 + "K";
    }
};


class MapChart extends Component {
    x = 5;

    constructor(props) {
        super(props);
        this.state = { showModal: false };
    }

    test() {
        alert("ok");
    }

    render() {
        const hideModal = () => {
            this.setState({ showModal: false });
            this.setState({ class: "default" });
            this.test();
        };
        return (
            <>
                <Modal show={this.state.showModal} onHide={hideModal}>
                    <Modal.Header closeButton>
                        <Modal.Title>Modal heading</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>Woohoo {this.x}, you're reading this text in a modal!</Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={hideModal}>
                            Close
                        </Button>
                        <Button variant="primary" onClick={hideModal}>
                            Save Changes
                        </Button>
                    </Modal.Footer>
                </Modal>
                <div>wtf</div>

                <ComposableMap data-tip="" projectionConfig={{ scale: 200 }}>
                    <ZoomableGroup>
                        <Geographies geography={geoUrl}>
                            {
                                ({ geographies }) => geographies.map(
                                    geo => {
                                        console.log(geo.properties.ISO_A3);
                                        return (
                                            <Geography key={geo.rsmKey} geography={geo} onClick={() => {
                                                const { NAME, POP_EST } = geo.properties;
                                                this.setState({ showModal: true });
                                                // setTooltipContent(`${NAME} — ${rounded(POP_EST)}`);
                                            }} onMouseLeave={() => {
                                                this.setState({ class: "default" });
                                            }} style={{
                                                default: {
                                                    fill: "#D6D6DA",
                                                    outline: "none"
                                                },
                                                hover: {
                                                    fill: "#F53",
                                                    outline: "none"
                                                },
                                                pressed: {
                                                    fill: "#E42",
                                                    outline: "none"
                                                }
                                            }} />)
                                    }
                                )
                            }
                        </Geographies>
                    </ZoomableGroup>
                </ComposableMap>
            </>
        )
    }
}

export default MapChart;
