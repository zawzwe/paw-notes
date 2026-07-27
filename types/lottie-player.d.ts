declare namespace JSX {
  interface IntrinsicElements {
    "lottie-player": {
      src: string;
      loop?: boolean | string;
      autoplay?: boolean | string;
      className?: string;
      style?: React.CSSProperties;
    };
  }
}
