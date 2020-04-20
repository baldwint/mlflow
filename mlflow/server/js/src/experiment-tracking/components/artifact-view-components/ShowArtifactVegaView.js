import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { getSrc } from './ShowArtifactPage';
import { getArtifactContent } from './ShowArtifactUtils';
import { ReactDOM } from 'react-dom';
import { VegaLite } from 'react-vega';

class ShowArtifactVegaView extends Component {
  constructor(props) {
    super(props);
    this.fetchArtifacts = this.fetchArtifacts.bind(this);
    this.vegaChart = undefined;
    this.vegaDivId = 'vegadiv';
  }

  static propTypes = {
    runUuid: PropTypes.string.isRequired,
    path: PropTypes.string.isRequired,
    getArtifact: PropTypes.func,
  };

  static defaultProps = {
    getArtifact: getArtifactContent,
  }

  state = {
    loading: true,
    error: undefined,
    vegaspec: undefined,
  };

  componentDidMount() {
    this.fetchArtifacts();
  }

  componentDidUpdate(prevProps) {
    if (this.props.path !== prevProps.path || this.props.runUuid !== prevProps.runUuid) {
      this.fetchArtifacts();
    }

    if (this.vegaChart !== undefined) {
      if (true) {
        const inner = "<div id='" + this.vegaDivId + "'></div>";
        document.getElementsByClassName('vega-container')[0].innerHTML = inner;
        this.vegaChart = undefined;
      }
    }

    if (this.state.vegaspec !== undefined) {

      // load the vega-lite spec
      ReactDOM.render(
        <VegaLite spec={this.state.vegaspec} />,
        document.getElementById(this.vegaDivId)
      );

      this.vegaChart = "chart";
    }
  }

  render() {
    if (this.state.loading) {
      return <div className='artifact-vega-view-loading'>Loading...</div>;
    }
    if (this.state.error) {
      return (
        <div className='artifact-vega-view-error'>
          Oops, we couldn't load your file because of an error.
        </div>
      );
    } else {
      return (
        <div className='vega-container'>
          <div id={this.vegaDivId}></div>
        </div>
      );
    }
  }

  /** Fetches artifacts and updates component state with the result */
  fetchArtifacts() {
    const artifactLocation = getSrc(this.props.path, this.props.runUuid);
    this.props.getArtifact(artifactLocation).then((rawFeatures) => {
      const parsedSpec = JSON.parse(rawFeatures);
      this.setState({ vegaspec: parsedSpec, loading: false });
    }).catch((error) => {
      this.setState({ error: error, loading: false, vegaspec: undefined });
    });
  }
}

export default ShowArtifactVegaView;
