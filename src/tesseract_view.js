import THREE from 'three';
import React from 'react';
import ReactDOM from 'react-dom';
import Tesseract from 'tesseract';
import PureRenderMixin from 'react-addons-pure-render-mixin';


export default class TesseractView extends React.Component {


    constructor(props) {
        super(props);
        this.tesseract = null;
        this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
    }

    setupTesseract() {
        this.tesseract = new Tesseract(200);
        this.tesseract.setRotation(
            this.props.xy,
            this.props.xz,
            this.props.yz,
            this.props.xw,
            this.props.yw,
            this.props.zw
        );
        
        this.edges = [];
        this.faces = [];
        this.cubes = [];

        let cubes = this.tesseract.getCubeSet();
        cubes.forEach((cube, index) => {
            cube.getFacesAsGeometry().forEach((shape) => {
                let material = new THREE.MeshLambertMaterial({
                    color: this.props.palette[index],
                    transparent: true,
                    opacity: this.props.faceOpacity,
                    depthWrite: false,
                    blending: THREE.NormalBlending,
                    side: THREE.DoubleSide
                });

                // For some reason we need to order the faces ourselves.
                let max_z = -200000;
                for (let i = 0; i < shape.vertices.length; i++) {
                    if (shape.vertices[i].z > max_z) {
                        max_z = shape.vertices[i].z;
                    }
                }
                shape.computeBoundingSphere();
                let mesh = new THREE.Mesh(shape, material);
                mesh.renderOrder = max_z;
                this.scene.add(mesh);
                this.faces.push(mesh);
            });

            if (this.props.showLines) {
                // THis prop ONLY works on first render, if you change it later it'll break
                // because the lines don't get added/removed from the scene. To fix
                // this make add/removeLines methods and have them do the setup/teardown
                // when the showLines prop changes
                cube.getLinesAsVector3().forEach((line) => {
                    let geometry = new THREE.Geometry();
                    geometry.vertices.push(line[0]);
                    geometry.vertices.push(line[1]);

                    let line_geo = new THREE.Line(geometry, new THREE.LineBasicMaterial({
                        color: this.props.palette[index],
                        linewidth: 2
                    }));
                    this.scene.add(line_geo);
                    this.edges.push(line_geo);
                });
            }

        });
    }

    updateTesseract() {
        let cubes = this.tesseract.getCubeSet();
        let o = 0;
        let f = 0;
        cubes.forEach((cube, index) => {
            cube.getFacesAsGeometry().forEach((shape) => {
                let max_z = -200000;
                for (let i = 0; i < this.faces[f].geometry.vertices.length; i++) {
                    this.faces[f].geometry.vertices[i].set(shape.vertices[i].x, shape.vertices[i].y, shape.vertices[i].z);
                    if (shape.vertices[i].z > max_z) {
                        max_z = shape.vertices[i].z;
                    }
                }
                this.faces[f].renderOrder = max_z;
                this.faces[f].geometry.verticesNeedUpdate = true;
                this.faces[f].geometry.computeFaceNormals();
                this.faces[f].geometry.computeBoundingSphere();
                this.faces[f].geometry.normalsNeedUpdate = true;

                f++;
            });

            if (this.props.showLines) {
                cube.getLinesAsVector3().forEach((line) => {
                    this.edges[o].geometry.vertices[0].set(line[0].x, line[0].y, line[0].z);
                    this.edges[o].geometry.vertices[1].set(line[1].x, line[1].y, line[1].z);
                    this.edges[o].geometry.verticesNeedUpdate = true;

                    o++;
                });
            }
        });
    }

    updateTesseractCubes() {
        let cubes = this.tesseract.getCubeSet();
        let o = 0;
        cubes.forEach((cube, index) => {
            let vertices = cube.getVertices();
            for (let i = 0; i < this.cubes[index].geometry.vertices.length; i++) {
                this.cubes[index].geometry.vertices[i].set(vertices[i].x, vertices[i].y, vertices[i].z);

            }
            this.cubes[index].geometry.verticesNeedUpdate = true;
            this.cubes[index].geometry.computeFaceNormals();
            this.cubes[index].geometry.normalsNeedUpdate = true;
            cube.getLinesAsVector3().forEach((line) => {
                this.edges[o].geometry.vertices[0].set(line[0].x, line[0].y, line[0].z);
                this.edges[o].geometry.vertices[1].set(line[1].x, line[1].y, line[1].z);
                this.edges[o].geometry.verticesNeedUpdate = true;

                o++;
            });
        });
    }

    componentDidMount() {
        this.camera = new THREE.PerspectiveCamera(70, 1, 1, 1000);
        this.camera.position.x = this.props.camera_x;
        this.camera.position.y = this.props.camera_y;
        this.camera.position.z = this.props.camera_z;
        this.camera.updateProjectionMatrix();

        this.scene = new THREE.Scene();

        var ambient = new THREE.AmbientLight(0xffffff);
        this.scene.add(ambient);

        this.setupTesseract();

        this.renderer = new THREE.WebGLRenderer({antialias: true});
        this.renderer.setClearColor(0xffffff);
        this.renderer.setSize(this.props.width, this.props.height);
        // this.renderer.sortObjects = false;

        ReactDOM.findDOMNode(this.refs.box_container).appendChild(this.renderer.domElement);
        this.renderer.render(this.scene, this.camera);
    }

    componentWillUpdate(nextProps) {
        this.tesseract.setRotation(
            nextProps.xy,
            nextProps.xz,
            nextProps.yz,
            nextProps.xw,
            nextProps.yw,
            nextProps.zw
        );
        this.updateTesseract();
        this.renderer.render(this.scene, this.camera);
    }

    render() {
        return <div ref="box_container" className="puzzle-item" style={{width: this.props.width, height: this.props.height}}>
        </div>;
    }
}

TesseractView.propTypes = {
    width: React.PropTypes.number,
    height: React.PropTypes.number,
    xy: React.PropTypes.number.isRequired,
    xz: React.PropTypes.number.isRequired,
    yz: React.PropTypes.number.isRequired,
    xw: React.PropTypes.number.isRequired,
    yw: React.PropTypes.number.isRequired,
    zw: React.PropTypes.number.isRequired,
    camera_x: React.PropTypes.number,
    camera_y: React.PropTypes.number,
    camera_z: React.PropTypes.number,
    palette: React.PropTypes.array,
    faceOpacity: React.PropTypes.number,
    showLines: React.PropTypes.bool
};

TesseractView.defaultProps = {
    width: 200,
    height: 200,
    camera_x: 0,
    camera_y: 0,
    camera_z: 350,
    palette: ["#d0e1f3", "#445463", "#ff9264", "#c20000", "#80e36a", "#005200", "#b273ff", "#0000ca"],
    faceOpacity: 0.2,
    showLines: true
};
