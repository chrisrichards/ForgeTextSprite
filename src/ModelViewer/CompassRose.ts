const markerLength = 1;
const fifthMarkerLength = 5;
const tenthMarkerLength = 10;
const ordinalMarkerLength = 15;

const color = 0x444444;
const fontSize = 4;
const halfFontSize = fontSize / 2;
const radius = 100;
const cardinalOffset = 5;
const cardinalOuter = radius + cardinalOffset;


export default class CompassRose {
    build(): THREE.Group {
        const group = new THREE.Group();

        const material = new THREE.LineBasicMaterial({
            color: color
        });

        for (let degree = 0; degree < 360; degree++) {
            const lineParent = new THREE.Group();
            const lineAngle = (Math.PI * degree) / 180;

            lineParent.rotateX(lineAngle);

            const length = this.getMarkerLength(degree);
            const line = this.buildLine(radius, length, material);

            lineParent.add(line);
            group.add(lineParent);
        }

        let sprite = this.createHeadingText("N", material)
            .translateY(cardinalOuter)
            .translateZ(-halfFontSize)
            .rotateY(-Math.PI / 2);
        group.add(sprite);

        sprite = this.createHeadingText("E", material)
            .translateZ(cardinalOuter)
            .translateY(-halfFontSize)
            .rotateY(-Math.PI / 2);
        group.add(sprite);

        sprite = this.createHeadingText("S", material)
            .translateY(-cardinalOuter - cardinalOffset)
            .translateZ(-halfFontSize)
            .rotateY(-Math.PI / 2);
        group.add(sprite);

        sprite = this.createHeadingText("W", material)
            .translateZ(-cardinalOuter)
            .translateY(-halfFontSize)
            .rotateY(Math.PI / 2);
        group.add(sprite);

        return group;
    }

    private getMarkerLength(degree: number) {
        let length: number;

        if (degree % 90 === 0) {
            length = ordinalMarkerLength;
        } else if (degree % 10 === 0) {
            length = tenthMarkerLength;
        } else if (degree % 5 === 0) {
            length = fifthMarkerLength;
        } else {
            length = markerLength;
        }

        return length;
    }

    private buildLine(radius: number, length: number, material: THREE.Material) {
        const lineGeometry = new THREE.Geometry();
        lineGeometry.vertices.push(new THREE.Vector3(0, radius, 0));
        lineGeometry.vertices.push(new THREE.Vector3(0, radius - length, 0));
        return new THREE.Line(lineGeometry, material);
    }

    private createHeadingText(text: string, material: THREE.Material): THREE.Mesh {
        const options = {
            size: fontSize,
            height: 0
        };
        const textGeometry = new THREE.TextGeometry(text, options);
        return new THREE.Mesh(textGeometry, material);
    }
}