import React, { useState, useEffect, useMemo } from 'react';
// Types
import { AdminSearchKeyword } from '../../../../types';
// Hooks
import useRequest from '../../../../hooks/useRequest';
import useSignedInUser from '../../../../hooks/useSignedInUser';
import useConfirmation from '../../../../hooks/useConfirmationMiddleware';
// Utils
import api from '../../../../library/api';
import * as pageConfig from './config';
import cls from 'classnames';
// Components
import DataTable from 'react-data-table-component';
import { Icon } from '@iconify/react';
import KeywordModal from './KeywordModal';
import Spinner from '../../../shared/spinner/Spinner';
import DeleteConfirmModal from '../../../shared/DeleteConfirmModal';

interface Props {
  getStyle: (className: string) => string;
}

const KeywordsMain = (props: Props) => {
  const [keywords, setKeywords] = useState<AdminSearchKeyword[]>();
  const [showAddKeywordModal, setShowAddKeywordModal] = useState(false);
  const [keywordToEdit, setKeywordToEdit] = useState<AdminSearchKeyword | null>(null);

  const adminUser = useSignedInUser();
  const { send: sendDeleteReq, loading: deleting } = useRequest();
  const { send: sendKeywordRequest, loading: loadingkeywords } = useRequest();
  const { getStyle } = props;

  const {
    withConfirmation,
    confirmationShown: deleteConfirmationShown,
    confirm: confirmDelete,
    closeConfirmation: closeDeleteConfirmation,
  } = useConfirmation();

  const loadKeywords = () => {
    const req = sendKeywordRequest(api.getKeywords());
    req.then(res => res.status === 'SUCCESS' && setKeywords(res.keywords));
  };

  useEffect(() => {
    if (adminUser?.accessToken) loadKeywords();
  }, [adminUser.accessToken]);

  const tableData = useMemo(() => {
    const rowOptions = {
      onEdit: setKeywordToEdit,
      onDelete: (k: AdminSearchKeyword) => withConfirmation(deleteKeyword.bind(null, k._id)),
    };
    return pageConfig.genTableData(keywords, rowOptions);
  }, [keywords]);

  const deleteKeyword = async (kwId: string) => {
    const req = sendDeleteReq(api.deleteKeyword(kwId, adminUser.accessToken!));
    req
      .then(res => {
        if (res.status !== 'SUCCESS') return;
        closeDeleteConfirmation();
        loadKeywords();
      })
      .catch(console.error);
  };

  return (
    <main className={getStyle('content')}>
      <Spinner show={loadingkeywords} pageWide />
      <KeywordModal
        show={showAddKeywordModal}
        close={setShowAddKeywordModal.bind(null, false)}
        onSaved={loadKeywords}
        keyword={null}
      />
      <KeywordModal
        show={!!keywordToEdit}
        close={setKeywordToEdit.bind(null, null)}
        onSaved={loadKeywords}
        keyword={keywordToEdit}
      />
      <DeleteConfirmModal
        show={deleteConfirmationShown}
        onChooseDelete={confirmDelete}
        loading={deleting}
        close={closeDeleteConfirmation}
      />

      <div className={getStyle('header')}>
        <h1 className={getStyle('header-title fs-1')}>Search Keywords</h1>
        <p className={getStyle('header-subtitle fs-4')}>
          {/* You have {quantitize(props.messages?.length || 0, ['new message', 'new messages'])} */}
        </p>
      </div>
      <div className={getStyle('container-fluid')}>
        <div className={getStyle('row')}>
          <div className={getStyle('col-12')}>
            <div className={getStyle('card flex-fill w-100 px-2 py-4')}>
              <div className={getStyle('card-header')}>
                <div
                  className={cls(
                    getStyle('card-title mb-0'),
                    'd-flex justify-content-between align-items-center',
                  )}
                >
                  <h4> All Keywords</h4>
                  <button
                    className="btn btn-pry btn-rounded"
                    onClick={setShowAddKeywordModal.bind(null, true)}
                  >
                    <Icon icon="ic:baseline-plus" height={20} /> New keyword
                  </button>
                </div>
              </div>

              <div className={getStyle('card-body py-3')}>
                <DataTable
                  columns={pageConfig.tableColumns}
                  data={tableData || []}
                  dense
                  fixedHeader
                  pagination
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default KeywordsMain;
