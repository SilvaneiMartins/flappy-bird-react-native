import {
    Easing,
    withTiming,
    withRepeat,
    withSequence,
    useSharedValue,
    useFrameCallback,
    useDerivedValue,
    useAnimatedReaction,
    runOnJS,
} from "react-native-reanimated";
import {
    Image,
    Group,
    Canvas,
    useImage,
    interpolate,
    Extrapolate,
    Text,
    matchFont,
} from "@shopify/react-native-skia";
import {
    Gesture,
    GestureDetector,
    GestureHandlerRootView,
} from "react-native-gesture-handler";
import { useEffect, useState } from "react";
import { Platform, useWindowDimensions } from "react-native";

const GRAVITY = 1000;
const JUMP_FORCE = -500;

const App = () => {
    const { width, height } = useWindowDimensions();

    const [score, setScore] = useState(0);

    const bg = useImage(require("./assets/sprites/background-day.png"));
    const bird = useImage(require("./assets/sprites/bluebird-upflap.png"));
    const pipeTop = useImage(require("./assets/sprites/pipe-green-top.png"));
    const pipeBottom = useImage(require("./assets/sprites/pipe-green.png"));
    const base = useImage(require("./assets/sprites/base.png"));

    const x = useSharedValue(width);

    const birdY = useSharedValue(height / 3);
    const birdPos = {  x: width / 4 };
    const birdYVelocity = useSharedValue(0);

    useEffect(() => {
        x.value = withRepeat(
            withSequence(
                withTiming(-150, { duration: 3000, easing: Easing.linear }),
                withTiming(width, { duration: 0 })
            ),
            -1
        );
    }, []);

    useAnimatedReaction(
        () => birdY.value,
        (currentValue, previousValue) => {
            const middle = birdPos.x;

            if (
                currentValue !== previousValue &&
                previousValue &&
                currentValue <= middle &&
                previousValue > middle
            ) {
                runOnJS(setScore)(score + 1);
            }
        }
    );

    useFrameCallback(({ timeSincePreviousFrame: dt }) => {
        if (!dt) return;

        birdY.value = birdY.value + (birdYVelocity.value * dt) / 1000;
        birdYVelocity.value = birdYVelocity.value + (GRAVITY * dt) / 1000;
    });

    const gesture = Gesture.Tap().onStart(() => {
        birdYVelocity.value = JUMP_FORCE;
    });

    const birdTransform = useDerivedValue(() => {
        return [
            {
                rotate: interpolate(
                    birdYVelocity.value,
                    [-500, 500],
                    [-0.5, 0.5],
                    Extrapolate.CLAMP
                ),
            },
        ];
    });

    const birdOrigin = useDerivedValue(() => {
        return { x: width / 4 + 32, y: birdY.value + 24 };
    });

    const pipeOffset = 0;

    const fontFamily = Platform.select({ ios: "Helvetica", default: "serif" });
    const fontStyle: any = {
        fontFamily,
        fontSize: 40,
        fontWeight: "bold",
    };

    const font = matchFont(fontStyle);

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
                    <Group transform={birdTransform} origin={birdOrigin}>
                        <Image
                            image={bird}
                            x={birdPos.x}
                            y={birdY}
                            width={64}
                            height={48}
                        />
                    </Group>

                    {/* score */}
                    <Text
                        y={80}
                        font={font}
                        x={width * 0.05}
                        text={score.toString()}
                    ></Text>
                </Canvas>
            </GestureDetector>
        </GestureHandlerRootView>
    );
};

export default App;
