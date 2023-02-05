import { v4 as uuidv4 } from 'uuid';

export const scrollToElement = (query: string | HTMLElement) => {
  if (typeof query === 'string')
    return document.querySelector(query)?.scrollIntoView({ behavior: 'smooth' });

  query.scrollIntoView({ behavior: 'smooth' });
};

export const renderMultiLineText = (text: string[]) => {
  return text.map(parag => {
    if (parag === '') return <br key={uuidv4()} style={{ lineHeight: '20px' }} />;
    return (
      <p key={uuidv4()} className="w-max-content">
        {parag}
      </p>
    );
  });
};
