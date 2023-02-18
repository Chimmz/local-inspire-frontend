declare module 'read-more-react' {
  import React from 'react';

  interface ReadMoreReactProps {
    text: string;
    min: number;
    ideal: number;
    max: number;
    readMoreText: React.ReactNode;
  }

  const ReadMoreReact: React.FC<ReadMoreReactProps>;

  export default ReadMoreReact;
}
