import React from "react";
import { useWindowDimensions } from "react-native";
import { Canvas, useImage, Image } from "@shopify/react-native-skia";

const App = () => {
    const { width, height } = useWindowDimensions();

    const bg = useImage(require("./assets/sprites/background-day.png"));
    const bird = useImage(require("./assets/sprites/bluebird-upflap.png"));
    const pipeTop = useImage(require("./assets/sprites/pipe-green-top.png"));
    const pipeBottom = useImage(require("./assets/sprites/pipe-green.png"));
    const base = useImage(require("./assets/sprites/base.png"));

    const pipeOffset = 0;

    const r = width * 0.33;
    return (
        <Canvas style={{ width, height }}>
            {/* Background */}
            <Image image={bg} fit={"cover"} width={width} height={height} />

            {/* Cano superior */}
            <Image
                image={pipeTop}
                x={width / 2}
                y={pipeOffset - 320}
                width={103}
                height={640}
            />

            {/* Cano inferior */}
            <Image
                image={pipeBottom}
                x={width / 2}
                y={height - 320 - pipeOffset}
                width={103}
                height={640}
            />

            {/* base */}
            <Image
                image={base}
                x={0}
                y={height - 75}
                width={width}
                height={112}
                fit={"cover"}
            />

            {/* Pássaro */}
            <Image
                image={bird}
                x={width / 4}
                y={height / 2}
                width={64}
                height={48}
            />
        </Canvas>
    );
};

export default App;
