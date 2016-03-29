import React from 'react';
import TesseractView from 'tesseract_view';
import ReactSlider from 'react-slider';

function toDegrees(radians) {
    return Math.round(radians * 180 / Math.PI);
}

function toRadians(degrees) {
    return (Math.PI * degrees) / 180;
}

export default class PuzzleView extends React.Component {
    constructor(props) {
        super(props);

        this.axes = ['xy', 'xz', 'yz', 'xw', 'yw', 'zw'];

        // Initial state for all sliders is to match the reference image, then we 0 the
        // user ones.
        this.state = {
            xy: props.xy,
            xz: props.xz,
            yz: props.yz,
            xw: props.xw,
            yw: props.yw,
            zw: props.zw,
            distance: 0,
        };

        props.sliders.map((s) => {
            // Blank out any angles the user is expected to set.
            this.state[s] = 0;
        });
    }

    componentWillUnmount() {
        window.clearInterval(this.timer);
    }

    componentDidUpdate() {
        if (this.props.onChange) {
            this.props.onChange(Object.assign({}, this.state));
        }
    }

    render() {
        return <div className="puzzle">
            <TesseractView ref="user"
                           xy={this.state.xy}
                           xz={this.state.xz}
                           yz={this.state.yz}
                           xw={this.state.xw}
                           yw={this.state.yw}
                           zw={this.state.zw}
                           width={200}
                           height={200}
                           palette={this.props.palette}
                           faceOpacity={this.props.faceOpacity}
            />
            <TesseractView ref="user"
                           xy={this.props.xy}
                           xz={this.props.xz}
                           yz={this.props.yz}
                           xw={this.props.xw}
                           yw={this.props.yw}
                           zw={this.props.zw}
                           width={200}
                           height={200}
                           palette={this.props.palette}
                           faceOpacity={this.props.faceOpacity}
            />
            {this.axes.map((axis) => this.renderSlider(axis))}

        </div>
    }

    renderSlider(axis) {
        return <ReactSlider key={axis} defaultValue={toDegrees(this.state[axis])} step={15} min={-180} max={180}
                            onChange={(v) => { this.onSlider(axis, v) }}
                            disabled={this.props.sliders.indexOf(axis) < 0}
                            />
    }

    onSlider(k, v) {
        let kv = {};
        let delta = Math.abs(toDegrees(this.state[k]) - v);
        kv[k] = toRadians(v);
        kv['distance'] = this.state.distance + delta;
        this.setState(kv);
    }
}

PuzzleView.propTypes = {
    xy: React.PropTypes.number.isRequired,
    xz: React.PropTypes.number.isRequired,
    yz: React.PropTypes.number.isRequired,
    xw: React.PropTypes.number.isRequired,
    yw: React.PropTypes.number.isRequired,
    zw: React.PropTypes.number.isRequired,
    sliders: React.PropTypes.array,
    palette: React.PropTypes.array,
    faceOpacity: React.PropTypes.number
};

PuzzleView.defaultProps = {
    palette: ["#ff0000","#00ff00","#0000ff","#ffff00","#ff00ff","#00ffff","#770000","#000077"],
    sliders: ['xy','xz','yz','xw','yw','zw']
};


