/**
 * #51：批次寄信回應裡「被擋下的帳單」要讓操作者看得到
 * - success=true 但 message 列出未寄出的帳單 → 不關 modal，顯示 message，仍追蹤進度
 * - success=false 但後端有回 batchId（全部被擋）→ 顯示 message，且仍把 batch 加進進度追蹤
 */

import React from 'react';
import { screen, fireEvent, waitFor } from '@testing-library/react';
import { render, createMockResponse } from '@utils/test-utils';
import { IndustryBillEmailModal } from '../IndustryBillEmailModal';
import { ElectricBillStatus, IndustryBillForEmail } from '@core/graphql/types';
import { EMAIL_CONFIG } from '@core/graphql/queries/emailConfig';
import { INDUSTRY_BILLS_FOR_EMAIL } from '@core/graphql/queries/industryBillsForEmail';
import { gql } from '@apollo/client';

const mockAddTask = jest.fn();
const mockSelectTask = jest.fn();
jest.mock('@core/context/task-progress', () => ({
  ...jest.requireActual('@core/context/task-progress'),
  useTaskProgress: () => ({ addTask: mockAddTask, selectTask: mockSelectTask }),
}));

const SEND_INDUSTRY_BILLS_EMAIL = gql`
  mutation SendIndustryBillsEmail($month: String!, $industryBillIds: [String!]) {
    sendIndustryBillsEmail(month: $month, industryBillIds: $industryBillIds) {
      success
      message
      batchId
      totalJobs
    }
  }
`;

const emailConfigMock = createMockResponse(
  EMAIL_CONFIG,
  {},
  { emailConfig: { id: '1', isTestMode: false, testRecipients: [], updatedAt: new Date().toISOString() } },
);

const bills: IndustryBillForEmail[] = [1, 2].map((i) => ({
  __typename: 'IndustryBillForEmail' as const,
  id: `bill-${i}`,
  status: ElectricBillStatus.Approved,
  billSource: null,
  hasOriginalFile: false,
  powerPlantName: `電廠 ${i}`,
  powerPlantNumber: `E00000${i}`,
  industry: { __typename: 'IndustryBillIndustry' as const, id: `industry-${i}`, name: `發電業 ${i}` },
}));

const heldMessage =
  '已將 1 家公司的郵件任務推送到隊列，系統將異步處理。\n1 張帳單因設定公司與合約公司不一致未寄出，請修正資料後只補寄這些帳單：\n- 測試公司A-測試電廠  - 2026/10：設定公司 測試公司A 與合約 TEST-CONTRACT-001 所屬公司 測試公司B 不一致';

function renderAndSend(sendResponse: Record<string, unknown>, onClose = jest.fn()) {
  const mocks = [
    createMockResponse(INDUSTRY_BILLS_FOR_EMAIL, { month: '2026-10' }, { industryBillsForEmail: bills }),
    createMockResponse(
      SEND_INDUSTRY_BILLS_EMAIL,
      { month: '2026-10', industryBillIds: bills.map((b) => b.id) },
      { sendIndustryBillsEmail: sendResponse },
    ),
    emailConfigMock,
  ];
  render(<IndustryBillEmailModal open month="2026-10" onClose={onClose} />, { mocks });
  return onClose;
}

describe('IndustryBillEmailModal — 被擋下的帳單要看得到（#51）', () => {
  beforeEach(() => jest.clearAllMocks());

  it('success=true 但有帳單未寄出 → 顯示訊息、不關 modal、仍追蹤進度', async () => {
    const onClose = renderAndSend({ success: true, message: heldMessage, batchId: 'batch-held', totalJobs: 2 });

    await waitFor(() => expect(screen.getByText(/準備寄送電費單通知/)).toBeInTheDocument());
    fireEvent.click(screen.getByRole('button', { name: /確認寄信/i }));

    await waitFor(() => expect(screen.getByText(/測試公司A-測試電廠/)).toBeInTheDocument());
    expect(screen.getByText(/1 張帳單因設定公司與合約公司不一致未寄出/)).toBeInTheDocument();
    expect(onClose).not.toHaveBeenCalled();
    expect(mockAddTask).toHaveBeenCalledWith(expect.objectContaining({ batchId: 'batch-held', totalJobs: 2 }));
    expect(mockSelectTask).toHaveBeenCalledWith('batch-held');
  });

  it('success=false 但有 batchId（全部被擋）→ 顯示訊息並仍追蹤進度', async () => {
    const onClose = renderAndSend({
      success: false,
      message: '沒有可寄送的帳單。1 張帳單因設定公司與合約公司不一致未寄出，請修正資料後只補寄這些帳單：\n- 測試公司A-測試電廠  - 2026/10：設定公司與合約公司不一致',
      batchId: 'batch-all-held',
      totalJobs: 1,
    });

    await waitFor(() => expect(screen.getByText(/準備寄送電費單通知/)).toBeInTheDocument());
    fireEvent.click(screen.getByRole('button', { name: /確認寄信/i }));

    await waitFor(() => expect(screen.getByText(/沒有可寄送的帳單/)).toBeInTheDocument());
    expect(onClose).not.toHaveBeenCalled();
    expect(mockAddTask).toHaveBeenCalledWith(expect.objectContaining({ batchId: 'batch-all-held', totalJobs: 1 }));
    expect(mockSelectTask).toHaveBeenCalledWith('batch-all-held');
  });

  it('success=true 且全部寄出 → 行為不變：關 modal、追蹤進度', async () => {
    const onClose = renderAndSend({ success: true, message: '已將 2 家公司的郵件任務推送到隊列，系統將異步處理。', batchId: 'batch-ok', totalJobs: 2 });

    await waitFor(() => expect(screen.getByText(/準備寄送電費單通知/)).toBeInTheDocument());
    fireEvent.click(screen.getByRole('button', { name: /確認寄信/i }));

    await waitFor(() => expect(onClose).toHaveBeenCalled());
    expect(mockAddTask).toHaveBeenCalledWith(expect.objectContaining({ batchId: 'batch-ok' }));
  });
});
