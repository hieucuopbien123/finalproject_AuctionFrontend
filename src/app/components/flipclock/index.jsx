import Tick from "@pqina/flip";
import "@pqina/flip/dist/flip.min.css";
import React, { createRef } from "react";

export default class FlipClock extends React.Component {
  constructor(props) {
    super(props);
    this._tickRef = createRef();
  }

  componentDidMount() {
    this._tickInstance = Tick.DOM.create(this._tickRef.current, {
      value: this.props.value,
      credits: false,
    });
  }

  componentDidUpdate() {
    if (!this._tickInstance) return;
    this._tickInstance.value = this.props.value;
  }

  componentWillUnmount() {
    if (!this._tickInstance) return;
    Tick.DOM.destroy(this._tickRef.current);
  }

  render() {
    return (
      <div ref={this._tickRef} className="tick">
        <div data-repeat="true" aria-hidden="true">
          <span data-view="flip">Tick</span>
        </div>
      </div>
    );
  }
}
