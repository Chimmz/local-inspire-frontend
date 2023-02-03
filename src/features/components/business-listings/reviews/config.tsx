export const reviewReportReasonsConfig = [
  'Review contains false information',
  'Review violates guidelines',
  'Contains threats, lewdness, or hate speach',
  'Review posted to wrong location',
  'Review is spam',
  'I want to report something else',
];

export const reportModalConfig = {
  heading: <h4 className="text-center w-100 fs-1">Report a problem</h4>,
  body: (
    <>
      <p className="parag">
        Please let us know why you think the content you&apos;re reporting violates our
        guidelines. Use the below forms to report any questionable or inappropriate reviews.
      </p>
      <strong className="mb-3 d-block">Why do you want to report this review?</strong>
      <ul>
        <li className="d-flex align-items-center gap-3">
          <input type="radio" name="" id="" />
          Review contains false information
        </li>
        <li className="d-flex align-items-center gap-3">
          <input type="radio" name="" id="" /> Review violates guidelines
        </li>
        <li className="d-flex align-items-center gap-3">
          <input type="radio" name="" id="" /> Contains threats, lewdness, or hate speach
        </li>
        <li className="d-flex align-items-center gap-3">
          <input type="radio" name="" id="" /> Review posted to wrong location
        </li>
        <li className="d-flex align-items-center gap-3">
          <input type="radio" name="" id="" /> Review is spam
        </li>
        <li className="d-flex align-items-center gap-3">
          <input type="radio" name="" id="" /> I want to report something else
        </li>
      </ul>
      <strong className="my-4 d-block">Please provide specific details below:</strong>
    </>
  ),
};
