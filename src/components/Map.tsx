import * as React from "react";
import {googleApiKey} from "../config";
import * as satellite from 'satellite.js';

const mapStyle = {
  width: '100vw',
  height: '100vh',
};

class Map extends React.Component {

  private mapRef: any = React.createRef();

  private map: any;

  private satRec: any;

  private marker: any;

  public componentDidMount(): void {
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${googleApiKey}`;

    script.addEventListener('load', () => {
      this.map = this.createMap();
      this.setupSatellite();
    });

    document.body.appendChild(script);
  }

  public render(): React.ReactElement<any> {
    return <div ref={this.mapRef} style={mapStyle} />;
  }

  private createMap(): void {
    return new google.maps.Map(this.mapRef.current, {
      zoom: 2,
      center: {lat: 0, lng: 0},
    });
  }

  private setupSatellite() {
    fetch('https://data.ivanstanojevic.me/api/tle/25544')
      .then(response => response.json())
      .then((data) => {
        this.satRec = satellite.twoline2satrec(data.line1, data.line2);

        this.update();
        setInterval(() => {
          this.update();
        }, 2 * 1000);
      });


  }

  private update() {
    const date = new Date();
    const positionAndVelocity = satellite.propagate(this.satRec, date);
    const positionGd = satellite.eciToGeodetic(positionAndVelocity.position, satellite.gstime(date));
    const longitude = positionGd.longitude,
      latitude = positionGd.latitude;

    const position = new google.maps.LatLng(this.radians_to_degrees(latitude), this.radians_to_degrees(longitude));

    if (!this.marker) {
      this.marker = new google.maps.Marker({
        map: this.map,
        position: position,
      });
    }

    this.marker.setPosition(position);
  }

  private radians_to_degrees(radians) {
    return radians * (180 / Math.PI);
  }

}

export default Map;
