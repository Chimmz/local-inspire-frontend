import React, { useState, useEffect, useMemo } from 'react';
// Types
import { AdminFilter, AdminSearchKeyword } from '../../../../types';
// Hooks
import useRequest from '../../../../hooks/useRequest';
import useSignedInUser from '../../../../hooks/useSignedInUser';
// Utils
import api from '../../../../library/api';
// Components
import DataTable from 'react-data-table-component';

import { tableColumns } from './config';
import { Icon } from '@iconify/react';
import cls from 'classnames';
import KeywordModal from './KeywordModal';
import Spinner from '../../../shared/spinner/Spinner';
import DeleteConfirmModal from '../../../shared/DeleteConfirmModal';
import useConfirmation from '../../../../hooks/useConfirmationMiddleware';
import { simulateRequest } from '../../../../utils/async-utils';

interface Props {
  getStyle: (className: string) => string;
}

const KeywordsBody = (props: Props) => {
  const [keywords, setKeywords] = useState<AdminSearchKeyword[]>();
  const [showAddKeywordModal, setShowAddKeywordModal] = useState(false);
  const [keywordToEdit, setKeywordToEdit] = useState<AdminSearchKeyword | null>(null);

  const { send: sendDeleteReq, loading: deleting } = useRequest();

  const adminUser = useSignedInUser();
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

  const deleteKeyword = async (kwId: string) => {
    const req = sendDeleteReq(api.deleteKeyword(kwId, adminUser.accessToken!));
    req
      .then(res => {
        if (res.status !== 'SUCCESS') return;
        closeDeleteConfirmation();
        loadKeywords();
      })
      .catch(err => {});
  };

  const tableData = useMemo(() => {
    return keywords?.map(k => ({
      id: k._id,
      name: k.name,
      sic4Categories: k.sic4Categories?.join(', ') || '-',
      enableForBusiness: k.enableForBusiness ? 'Yes' : 'No',
      enableForFilter: k.enableForFilter ? 'Yes' : 'No',
      actions: (
        <div className="d-flex align-items-center gap-3 ">
          <Icon
            onClick={setKeywordToEdit.bind(null, k)}
            icon="material-symbols:edit-outline-rounded"
            width={18}
            className="cursor-pointer"
            color="#555"
          />
          <Icon
            onClick={withConfirmation.bind(null, () => deleteKeyword(k._id))}
            icon="material-symbols:delete-outline"
            className="cursor-pointer"
            width={18}
            color="#555"
          />
        </div>
      ),
    }));
  }, [keywords]);

  useEffect(() => {
    if (adminUser?.accessToken) loadKeywords();
  }, [adminUser.accessToken]);

  return (
    <>
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
        // onExit={setKeywordToEdit.bind(null, null)}
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
                {/* Card actions */}
                {/* <div className={getStyle('card-actions float-end')}>
                  <a href="#" className={getStyle('me-1')}>
                    <i className={getStyle('align-middle')} data-feather="refresh-cw"></i>
                  </a>
                  <div className={getStyle('d-inline-block dropdown show')}>
                    <a href="#" data-bs-toggle="dropdown" data-bs-display="static">
                      <i className={getStyle('align-middle')} data-feather="more-vertical"></i>
                    </a>

                    <div className={getStyle('dropdown-menu dropdown-menu-end')}>
                      <a className={getStyle('dropdown-item')} href="#">
                        Action
                      </a>
                      <a className={getStyle('dropdown-item')} href="#">
                        Another action
                      </a>
                      <a className={getStyle('dropdown-item')} href="#">
                        Something else here
                      </a>
                    </div>
                  </div>
                </div> */}

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
                  columns={tableColumns}
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
    </>
  );
};

export default KeywordsBody;
