import { useEffect, useState } from 'react';
import { MiddlewareNext } from './useMiddleware';

// interface Params {
//   openConfirmation: () => void
//   closeConfirmation: () => void
// }

const useConfirmation = () => {
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [nextAction, setNextAction] = useState<MiddlewareNext | undefined>();
  const [confirmedToProceed, setConfirmToProceed] = useState<boolean>(false);

  useEffect(() => {
    if (confirmedToProceed) nextAction?.();
    setNextAction(undefined);
    setConfirmToProceed(false);
  }, [confirmedToProceed]);

  const withConfirmation = (next: MiddlewareNext) => {
    setShowConfirmation(true); // Show the confirmation
    setNextAction(() => next); // Save the delete (next) action to be executed when user confirms deletion
  };

  return {
    withConfirmation,
    confirmationShown: showConfirmation,
    confirm: setConfirmToProceed.bind(null, true),
    relent: setShowConfirmation.bind(null, false),
    // Extras
    openConfirmation: setShowConfirmation.bind(null, true),
    closeConfirmation: setShowConfirmation.bind(null, false),
  };
};

export default useConfirmation;
