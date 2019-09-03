import * as React from "react";
import {googleApiKey} from "../config";

const mapStyle = {
  width: '100vw',
  height: '100vh',
};

export default class Map extends React.Component {

  private element: any = React.createRef();

  private map: any;

  public componentDidMount(): void {
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${googleApiKey}`;

    script.addEventListener('load', () => {
      this.map = this.createMap();
    });

    document.body.appendChild(script);
  }

  public render(): React.ReactElement<any> {
    return <div ref={this.element} style={mapStyle} />;
  }

  private createMap(): void {
    return new google.maps.Map(this.element.current, {
      zoom: 2,
      center: {lat: 0, lng: 0},
    });
  }

}
