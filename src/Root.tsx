import { Composition } from "remotion";
import { XarjiVideo } from "./video-scenes";

const FPS = 30;
const DURATION_SECS = 50;

export function RemotionRoot() {
  return (
    <Composition
      id="XarjiDemo"
      component={XarjiVideo}
      durationInFrames={DURATION_SECS * FPS}
      fps={FPS}
      width={1920}
      height={1080}
      defaultProps={{}}
    />
  );
}
