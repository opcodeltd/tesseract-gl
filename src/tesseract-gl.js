import React from 'react';
import ReactDOM from 'react-dom';
import PuzzleView from 'puzzle';
import TesseractView from 'tesseract_view';

export function toDegrees(radians) {
    return Math.round(radians * 180 / Math.PI);
}

// Helper for developers
class DeveloperView extends React.Component {
    constructor(props) {
        super(props);
        this.axes = ['xy', 'xz', 'yz', 'xw', 'yw', 'zw'];
    }

    render() {
        return <div className="developer">
            <div><b>Distance travelled</b>&nbsp;{this.props.distance}&deg;</div>
            <div><b>Time taken</b>&nbsp;{(this.props.time / 1000.0).toFixed(3)}s</div>
            {this.axes.map((axis) => <div key={axis}><b>{axis}</b>&nbsp;{toDegrees(this.props[axis])}&deg;</div>)}
        </div>
    }
}


export function puzzleRender(element, props) {
    ReactDOM.render(<PuzzleView
        {...props}
    />, element);
}

export function viewRender(element, props) {
    ReactDOM.render(<TesseractView
        {...props}
    />, element);
}

export function developerRender(element, props) {
    ReactDOM.render(<DeveloperView {...props} />, element);
}

export {PuzzleView, TesseractView, DeveloperView};

