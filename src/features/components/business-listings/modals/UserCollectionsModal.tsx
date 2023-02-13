import React, { useState, useEffect } from 'react';
import { Icon } from '@iconify/react';
import Image from 'next/image';
import { Modal, Spinner } from 'react-bootstrap';
import { UserCollection, UserPublicProfile } from '../../../types';
import useRequest from '../../../hooks/useRequest';
import api from '../../../library/api';
import useSignedInUser from '../../../hooks/useSignedInUser';
import TextInput from '../../shared/text-input/TextInput';
import useInput from '../../../hooks/useInput';
import { isRequired, maxLength } from '../../../utils/validators/inputValidators';
import RadioOptions from '../../shared/radio/RadioOptions';
import cls from 'classnames';
import AppTooltip from '../../AppTooltip';
import { simulateRequest } from '../../../utils/async-utils';
import PageSuccess from '../../shared/success/PageSuccess';
import LoadingButton from '../../shared/button/Button';

interface Props {
  show: boolean;
  itemToSave?: { item: string; model: string };
  collections?: UserCollection[];
  initMode?: 'new-collection' | 'add-to-collection';
  close: () => void;
}

const MAX_LEN_FOR_NEW_COLLECTION_NAME = 40;
const MAX_LEN_FOR_NEW_COLLECTION_DESCRIPTION = 300;

const UserCollectionsModal = (props: Props) => {
  const [collections, setCollections] = useState<UserCollection[]>(props.collections || []);

  const [mode, setMode] = useState<'new-collection' | 'add-to-collection' | 'success'>(
    props.initMode || 'add-to-collection',
  );
  const { accessToken } = useSignedInUser();
  const { send: sendCollectionsReq, loading: fetchingCollections } = useRequest({
    autoStopLoading: true,
  });
  const { send: sendAddToCollectionReq, loading: isAddingToCollection } = useRequest({
    autoStopLoading: true,
  });
  const { send: sendCreateCollectionReq, loading: creatingCollection } = useRequest({
    autoStopLoading: true,
  });

  const {
    inputValue: newName,
    handleChange: handleChangeNewName,
    validationErrors: newNameValidationErrors,
    runValidators: runNewNameValidationErrors,
    clearInput: clearNewNameInput,
    clearValidationErrors: clearNewNameErrors,
  } = useInput({
    init: '',
    validators: [
      { fn: isRequired, params: [] },
      { fn: maxLength, params: [MAX_LEN_FOR_NEW_COLLECTION_NAME] },
    ],
  });

  const {
    inputValue: newDescription,
    handleChange: handleChangeNewDescription,
    validationErrors: newDescriptionValidationErrors,
    runValidators: runNewDescriptionValidationErrors,
    clearInput: clearNewDescriptionInput,
    clearValidationErrors: clearNewDescriptionErrors,
  } = useInput({
    init: '',
    validators: [
      { fn: isRequired, params: [] },
      { fn: maxLength, params: [MAX_LEN_FOR_NEW_COLLECTION_DESCRIPTION] },
    ],
  });

  const {
    inputValue: newVisibility,
    handleChange: handleChangeNewVisibility,
    validationErrors: newVisibilityValidationErrors,
    runValidators: runNewVisibilityValidationErrors,
    clearInput: clearNewVisibilityInput,
    clearValidationErrors: clearNewVisibilityErrors,
  } = useInput({
    init: '',
    validators: [{ fn: isRequired, params: [] }],
  });

  const handleSaveToCollection = async (collectionId: string) => {
    if (!props.itemToSave) return;
    const res = await sendAddToCollectionReq(
      api.addItemToCollection(collectionId, props.itemToSave, accessToken!),
    );
    if (res?.status === 'SUCCESS') return setMode('success');
  };

  const createCollectionAndSaveItem: React.FormEventHandler<HTMLFormElement> = async ev => {
    ev.preventDefault();
    const results = [
      runNewNameValidationErrors(),
      runNewDescriptionValidationErrors(),
      runNewVisibilityValidationErrors(),
    ];
    if (results.some(result => result.errorExists)) return;

    const newCollection = {
      name: newName,
      description: newDescription,
      isPrivate: (newVisibility as 'Private' | 'Public').toLowerCase() === 'private',
    };
    let res = await sendCreateCollectionReq(
      api.createCollection(newCollection, accessToken!),
    );
    if (res?.status !== 'SUCCESS') return;
    await handleSaveToCollection(res.newCollectionId);
  };

  const loadCollections = async () => {
    const res = await sendCollectionsReq(api.getUserCollections(accessToken!));
    if (res?.status === 'SUCCESS') setCollections(res.collections);
  };

  useEffect(() => {
    if (!props.show) return;

    loadCollections();
    setMode(props.initMode || 'add-to-collection');
    clearNewNameInput();
    clearNewDescriptionInput();
    clearNewVisibilityInput();
    clearNewDescriptionErrors();
    clearNewNameErrors();
    clearNewVisibilityErrors();
  }, [props.show, collections.length]);
  // Places with the worst experience Collection to store the worst places I've visited

  return (
    <Modal show={props.show} size="lg" centered onHide={props.close}>
      <Modal.Header className="pt-4" closeButton>
        <div className="d-flex gap-2">
          {mode === 'add-to-collection' ? (
            <Icon icon="material-symbols:bookmark-outline" width={18} />
          ) : (
            <Icon icon="material-symbols:add" width={20} />
          )}{' '}
          <h3>{mode === 'add-to-collection' ? 'Save to' : 'New'} Collection</h3>
        </div>
      </Modal.Header>

      <Modal.Body
        className={cls(
          'py-5 position-relative',
          mode === 'add-to-collection' ? 'px-4' : 'px-5',
        )}
      >
        {fetchingCollections || isAddingToCollection ? (
          <div className="w-100 xy-center position-absolute">
            <Spinner animation="border" className="mx-auto" style={{ borderWidth: '1px' }} />
          </div>
        ) : null}

        <PageSuccess
          className={cls(mode !== 'success' ? 'd-none' : 'd-block', 'text-center')}
          title="Saved!"
          description="Your item has been saved successfully"
        />

        <ul
          className={cls(
            'no-bullets d-flex flex-column gap-3',
            mode === 'add-to-collection' ? 'd-block' : 'd-none',
          )}
        >
          {collections.map(c => {
            const itemToAddExistsInCollection = c.items.some(
              ({ item }) => item === props.itemToSave?.item,
            );
            console.log({ itemToAddExistsInCollection });
            return (
              <li className="d-flex align-items-center gap-3" key={c._id}>
                <Image
                  src={'/img/business-img-default.jpeg'}
                  width={100}
                  height={100}
                  objectFit="contain"
                />
                <span
                  className="xy-center btn-circle btn-circle--sm"
                  style={{
                    backgroundColor: c.isPrivate ? 'green' : 'transparent',
                    color: c.isPrivate ? '#fff' : '',
                  }}
                >
                  {c.isPrivate ? (
                    <Icon icon="oi:lock-locked" width={13} />
                  ) : (
                    <Icon icon="mdi:unlocked-variant" width={13} />
                  )}
                </span>
                <h4>{c.name}</h4>
                <button
                  className="btn btn-outline btn--sm ms-auto"
                  onClick={handleSaveToCollection.bind(null, c._id)}
                  disabled={isAddingToCollection}
                >
                  <Icon
                    icon="material-symbols:bookmark"
                    width={15}
                    color={itemToAddExistsInCollection ? 'red' : ''}
                  />
                  {itemToAddExistsInCollection ? 'Remove' : 'Save'}
                </button>
              </li>
            );
          })}
        </ul>

        <form
          className={mode === 'new-collection' ? 'd-block' : 'd-none'}
          onSubmit={createCollectionAndSaveItem}
        >
          <div className="mb-5">
            <TextInput
              value={newName}
              onChange={handleChangeNewName}
              label="Collection name"
              placeholder="Collection name"
              autoFocus={mode === 'new-collection'}
              validationErrors={newNameValidationErrors}
            />
          </div>

          <div className="mb-5">
            <TextInput
              value={newDescription}
              onChange={handleChangeNewDescription}
              validationErrors={newDescriptionValidationErrors}
              label="Collection description"
              placeholder="Collection description"
            />
          </div>

          <div className="">
            <label htmlFor="">Privacy settings</label>
            <RadioOptions
              as="circle"
              value={newVisibility}
              onChange={handleChangeNewVisibility}
              name="collection_visibility"
              // options={['Public', 'Private']}
              options={[
                {
                  label: <AppTooltip text="The public cannot see this">Private</AppTooltip>,
                  value: 'private',
                },
                {
                  label: <AppTooltip text="The public can see this">Public</AppTooltip>,
                  value: 'public',
                },
              ]}
              layout="inline"
              gap="4rem"
              className="mb-4"
              validationError={newVisibilityValidationErrors[0]?.msg}
            />
            <small className="mb-4">
              A public Collection can be seen by others. A private Collection is not visible
              to others.
            </small>
            <LoadingButton
              isLoading={creatingCollection || isAddingToCollection}
              type="submit"
              className="btn btn-pry ms-auto"
              textWhileLoading="Creating..."
            >
              Create & Save
            </LoadingButton>
          </div>
        </form>
      </Modal.Body>

      <Modal.Footer className={mode === 'add-to-collection' ? 'd-block' : 'd-none'}>
        <button
          className={'btn btn-bg-none no-hover-bg text-pry me-auto'}
          onClick={setMode.bind(null, 'new-collection')}
          disabled={isAddingToCollection}
        >
          <Icon icon="material-symbols:add" width={20} /> Create a new collection
        </button>
      </Modal.Footer>
    </Modal>
  );
};

export default UserCollectionsModal;
