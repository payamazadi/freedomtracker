import React, { Component, memo } from "react";
import {
    ZoomableGroup,
    ComposableMap,
    Geographies,
    Geography
} from "react-simple-maps";

import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/Button'

import { scaleLinear } from "d3-scale";

// const geoUrl = "https://raw.githubusercontent.com/zcreativelabs/react-simple-maps/master/topojson-maps/world-110m.json";
const geoUrl = "https://raw.githubusercontent.com/zcreativelabs/react-simple-maps/master/topojson-maps/world-10m.json";

const colorScale = scaleLinear()
    .domain([0, 400000])
    .range(["#ffedea", "#ff5233"]);


class MapChart extends Component {
    x = 5;

    constructor(props) {
        super(props);
        this.state = { showModal: false, mapData: null };
    }

    componentDidMount() {
        fetch(geoUrl).then(res => {
            if (!res.ok) {
                console.log("couldn't fetch map data");
                throw Error(res.statusText);
            }
            return res.json();
        }).then(result => {
            let mapGeos = null;
            let mapData = {};
            let countries = "";
            
            mapGeos = result.objects.ne_10m_admin_0_countries.geometries.map(country => {
                country = country.properties;
                if(country.ISO_A3 == "-99")
                    console.log(country.NAME + " fail");
                return country.ISO_A3;
            });

            countries = mapGeos.join(",");

            fetch("https://corona.lmao.ninja/v2/historical/" + countries + "&lastdays=30").then(res => {
                if (!res.ok) {
                    console.log("couldn't fetch covid data");
                    throw Error(res.statusText);
                }
                return res.json();
            }).then(result => {
                for(var i =0; i<mapGeos.length; i++){
                    mapData[mapGeos[i]] = { country: result[i].country, timeline: result[i].timeline }
                }
                this.setState({ mapGeos: mapGeos,  mapData: mapData});
            });

            
        });


    }

    render() {
        const hideModal = () => {
            this.setState({ showModal: false });
        };
        return (
            <>
                <Modal show={this.state.showModal} onHide={hideModal}>
                    <Modal.Header closeButton>
                        <Modal.Title>Modal heading</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>Woohoo, you're reading this text in a modal!</Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={hideModal}>
                            Close
                        </Button>
                        <Button variant="primary" onClick={hideModal}>
                            Save Changes
                        </Button>
                    </Modal.Footer>
                </Modal>

                <ComposableMap data-tip="" projectionConfig={{ scale: 200 }}>
                    <ZoomableGroup>
                        <Geographies geography={geoUrl}>
                            {({ geographies }) => geographies.map(geo => {
                                let iso3 = geo.properties.ISO_A3;
                                let count = 0;
                                let countFormatted = "";
                                if(this.state.mapData !== null){
                                    count = this.state.mapData[iso3].timeline !== undefined ? this.state.mapData[geo.properties.ISO_A3].timeline.cases["5/9/20"]: 0;
                                    countFormatted = count.toLocaleString(navigator.language, { minimumFractionDigits: 0 });
                                }
                                    
                                return (
                                    <Geography
                                        key={geo.rsmKey}
                                        fill={colorScale(count)}
                                        geography={geo} 
                                        onClick={() => {
                                            const { NAME, POP_EST } = geo.properties;
                                            this.setState({ showModal: true });
                                        }}
                                        onMouseEnter={ () => {
                                            const { NAME, POP_EST } = geo.properties;
                                            this.props.setTooltipContent(NAME + ", " + countFormatted);
                                        }}
                                        onMouseLeave={() => {
                                            this.props.setTooltipContent("");
                                        }}
                                    />)
                                })
                            }
                        </Geographies>
                    </ZoomableGroup>
                </ComposableMap>
            </>
        )
    }
}

export default MapChart;
