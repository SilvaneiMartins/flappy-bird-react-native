import {
    Easing,
    withTiming,
    withRepeat,
    withSequence,
    useSharedValue,
    useFrameCallback,
} from "react-native-reanimated";
import {
    Gesture,
    GestureDetector,
    GestureHandlerRootView,
} from "react-native-gesture-handler";
import { useEffect } from "react";
import { useWindowDimensions } from "react-native";
import { Canvas, useImage, Image } from "@shopify/react-native-skia";

const GRAVITY = 500;

const App = () => {
    const { width, height } = useWindowDimensions();

    const bg = useImage(require("./assets/sprites/background-day.png"));
    const bird = useImage(require("./assets/sprites/bluebird-upflap.png"));
    const pipeTop = useImage(require("./assets/sprites/pipe-green-top.png"));
    const pipeBottom = useImage(require("./assets/sprites/pipe-green.png"));
    const base = useImage(require("./assets/sprites/base.png"));

    const x = useSharedValue(width);

    const birdY = useSharedValue(height / 2);
    const birdYVelocity = useSharedValue(100);

    useFrameCallback(({ timeSincePreviousFrame: dt }) => {
        if (!dt) return;

        birdY.value = birdY.value + (birdYVelocity.value * dt) / 1000;
        birdYVelocity.value = birdYVelocity.value + (GRAVITY * dt) / 1000;
    });

    useEffect(() => {
        x.value = withRepeat(
            withSequence(
                withTiming(-150, { duration: 3000, easing: Easing.linear }),
                withTiming(width, { duration: 0 })
            ),
            -1
        );
    }, []);

    const gesture = Gesture.Tap().onStart(() => {
        birdYVelocity.value = -300;
    });

    const pipeOffset = 0;

    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <GestureDetector gesture={gesture}>
                <Canvas style={{ width, height }}>
                    {/* Background */}
                    <Image
                        image={bg}
                        fit={"cover"}
                        width={width}
                        height={height}
                    />

                    {/* Cano superior */}
                    <Image
                        image={pipeTop}
                        x={x}
                        y={pipeOffset - 320}
                        width={103}
                        height={640}
                    />

                    {/* Cano inferior */}
                    <Image
                        image={pipeBottom}
                        x={x}
                        y={height - 320 - pipeOffset}
                        width={103}
                        height={640}
                    />

                    {/* base */}
                    <Image
                        image={base}
                        width={width}
                        height={150}
                        y={height - 75}
                        x={0}
                        fit={"cover"}
                    />

                    {/* Pássaro */}
                    <Image
                        image={bird}
                        x={width / 4}
                        y={birdY}
                        width={64}
                        height={48}
                    />
                </Canvas>
            </GestureDetector>
        </GestureHandlerRootView>
    );
};

export default App;
