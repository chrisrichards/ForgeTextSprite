import CompassRose from "./CompassRose";
import FontJson from '../fonts/helvetiker_regular.typeface.json'

export class App {
    private urn: string;
    private viewer: Autodesk.Viewing.GuiViewer3D;

    public launchViewer(urn: string, accessToken: string) {
        this.urn = urn;

        const self = this;

        const options = {
            accessToken: accessToken,
            env: "AutodeskProduction"
        }

        THREE.FontUtils.loadFace(FontJson);
        Autodesk.Viewing.Initializer(options, () => self.onInitialized());
    }

    private onInitialized() {
        const forgeViewerElement = document.getElementById("forgeViewer");
        const config3d = {
            extensions: ["Autodesk.ViewCubeUi"],
            loaderExtensions: { svf: "Autodesk.MemoryLimited" },
            profileSettings: {
                settings: {
                    groundReflection: false,
                    groundShadow: false,
                    reverseMouseZoomDir: true,
                    viewCubeCompass: true
                }
            }
        };
        this.viewer = new Autodesk.Viewing.GuiViewer3D(forgeViewerElement, config3d);
        this.viewer.start();

        var self = this;
        const documentId = `urn:${this.urn}`;
        Autodesk.Viewing.Document.load(documentId,
            (doc) => self.onDocumentLoadSuccess(doc),
            (errorCodes) => self.onDocumentLoadFailure(errorCodes));
    }

    private onDocumentLoadSuccess(doc: Autodesk.Viewing.Document) {
        const viewables = doc.getRoot().getDefaultGeometry();
        this.viewer.loadDocumentNode(doc, viewables, {
                keepCurrentModels: false,
                globalOffset: {x:0,y:0,z:0}
            })
            .then(i => {
                // show x, y, and z axis on the cube
                this.viewer.getExtension('Autodesk.ViewCubeUi', (extension: Autodesk.Viewing.Extension) => {
                    const cube = extension as any;
                    cube.showTriad(true);
                });

                this.displayCompassRose();
            });
    }

    private onDocumentLoadFailure(viewerErrorCode: Autodesk.Viewing.ErrorCodes) {
        console.error('onDocumentLoadFailure() - errorCode:' + viewerErrorCode);
    }

    private displayCompassRose(): void {
        if (!this.viewer.overlays.hasScene('compass-rose-scene')) {
            this.viewer.overlays.addScene('compass-rose-scene');
        }

        const compassRose = new CompassRose();
        const compassRoseMesh = compassRose.build();
        compassRoseMesh.rotateOnAxis(new THREE.Vector3(0, 1, 0), THREE.Math.degToRad(90));

        const mesh = compassRoseMesh as any;
        this.viewer.overlays.addMesh(mesh, 'compass-rose-scene');
    }
}
