## Tesseract renderer for WebGL

This package offers a simple set of primitives for rendering a Tesseract (4-dimensional hypercube) using Three.JS.

The underlying structure is a set of React components, plus a pure Javascript class called Tesseract which might be useful for people fully reimplementing the view system.

There are two ways of using this library. If you're integrating the components themselves into a larger library or React application, you can import like so:

```
import {PuzzleView, TesseractView} from 'teseract-gl';
```

or just copy the pieces you need into your app entirely.

If you're using a `<script src="tesseract-gl.js"></script>` tag within a browser, that's fine. It'll put boththe real React views and some utility functions into `window.TesseractGL`. You can see how those work in the `examples/` directory. 
### Rebuilding / editing

For people doing development work on the code, make sure you've done `npm install` to get the relevant dependencies, then you can build using webpack:

```
./node_modules/.bin/webpack
```

This will re-create `tesseract-gl.js` from the components in `src/`.

