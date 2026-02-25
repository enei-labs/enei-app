/**
 * Integration test for IndustryBillEmailModal
 * Tests the full flow of sending multiple industry bill emails from frontend to backend
 *
 * 注意：Component 透過 useIndustryBillsForEmail hook 從 GraphQL 取得帳單資料，
 * 所有測試需要 mock INDUSTRY_BILLS_FOR_EMAIL query
 */

import React from 'react';
import { screen, fireEvent, waitFor } from '@testing-library/react';
import { render, createMockResponse } from '@utils/test-utils';
import { IndustryBillEmailModal } from '../IndustryBillEmailModal';
import { ElectricBillStatus, IndustryBillForEmail } from '@core/graphql/types';
import { EMAIL_CONFIG } from '@core/graphql/queries/emailConfig';
import { INDUSTRY_BILLS_FOR_EMAIL } from '@core/graphql/queries/industryBillsForEmail';

// GraphQL mutation (must match component's mutation including selection set)
import { gql } from '@apollo/client';
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
  { emailConfig: { id: '1', isTestMode: false, testRecipients: [], updatedAt: new Date().toISOString() } }
);

// Mock data factory - creates IndustryBillForEmail data (matching the GraphQL query return type)
const createMockBillsForEmail = (
  numBills: number,
  status: ElectricBillStatus = ElectricBillStatus.Approved
): IndustryBillForEmail[] => {
  return Array.from({ length: numBills }, (_, i) => ({
    __typename: 'IndustryBillForEmail' as const,
    id: `bill-${i + 1}`,
    status,
    billSource: null,
    hasOriginalFile: false,
    powerPlantName: `測試電廠 ${i + 1}`,
    powerPlantNumber: `E${(i + 1).toString().padStart(6, '0')}`,
    industry: {
      __typename: 'IndustryBillIndustry' as const,
      id: `industry-${i + 1}`,
      name: `測試發電業 ${i + 1}`,
    },
  }));
};

const createMockBillsWithMixedStatuses = (): IndustryBillForEmail[] => {
  const bills = createMockBillsForEmail(6, ElectricBillStatus.Approved);
  bills[1] = { ...bills[1], status: ElectricBillStatus.Draft };
  bills[3] = { ...bills[3], status: ElectricBillStatus.Pending };
  bills[5] = { ...bills[5], status: ElectricBillStatus.Rejected };
  return bills;
};

/** 建立 INDUSTRY_BILLS_FOR_EMAIL query mock */
const createBillsQueryMock = (month: string, bills: IndustryBillForEmail[]) =>
  createMockResponse(
    INDUSTRY_BILLS_FOR_EMAIL,
    { month },
    { industryBillsForEmail: bills }
  );

describe('IndustryBillEmailModal (Integration)', () => {
  const defaultMonth = '2024-10';
  const mockProps = {
    open: true,
    onClose: jest.fn(),
    month: defaultMonth,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Success Scenarios - Multi Email Sending', () => {
    it('should successfully send emails for multiple approved bills', async () => {
      const bills = createMockBillsForEmail(5);

      const mocks = [
        createBillsQueryMock(defaultMonth, bills),
        createMockResponse(
          SEND_INDUSTRY_BILLS_EMAIL,
          { month: defaultMonth, industryBillIds: bills.map(b => b.id) },
          {
            sendIndustryBillsEmail: {
              success: true,
              message: '電費單已成功生成 (3/3 家公司)',
              batchId: 'batch-1',
              totalJobs: 3,
            },
          }
        ),
        emailConfigMock,
      ];

      render(<IndustryBillEmailModal {...mockProps} />, { mocks });

      // Assert: Modal opens with bill info
      await waitFor(() => {
        expect(screen.getByText(/發電業電費單/)).toBeInTheDocument();
        expect(screen.getByText(/準備寄送電費單通知/)).toBeInTheDocument();
      });

      // Assert: Send button is enabled
      const sendButton = screen.getByRole('button', { name: /確認寄信/i });
      expect(sendButton).toBeEnabled();

      // Act: Click send button
      fireEvent.click(sendButton);

      // Assert: Loading state
      await waitFor(() => {
        expect(screen.getByText('寄送中...')).toBeInTheDocument();
      });

      // Assert: Success - modal closes
      await waitFor(() => {
        expect(mockProps.onClose).toHaveBeenCalled();
      });
    });

    it('should display preview of bills before sending', async () => {
      const month = '2024-11';
      const bills = createMockBillsForEmail(10);

      render(
        <IndustryBillEmailModal {...mockProps} month={month} />,
        { mocks: [createBillsQueryMock(month, bills), emailConfigMock] }
      );

      // Assert: Shows first 5 bills
      await waitFor(() => {
        expect(screen.getByText('測試電廠 1 (E000001)')).toBeInTheDocument();
        expect(screen.getByText('測試電廠 5 (E000005)')).toBeInTheDocument();
      });

      // Assert: Shows "...及其他 5 筆"
      expect(screen.getByText('...及其他 5 筆')).toBeInTheDocument();
    });

    it('should handle different company groups correctly', async () => {
      const bills = createMockBillsForEmail(3);
      // Same industry for first 2 bills
      bills[0] = { ...bills[0], industry: { __typename: 'IndustryBillIndustry', id: 'ind-A', name: '公司A' } };
      bills[1] = { ...bills[1], industry: { __typename: 'IndustryBillIndustry', id: 'ind-A', name: '公司A' } };
      bills[2] = { ...bills[2], industry: { __typename: 'IndustryBillIndustry', id: 'ind-B', name: '公司B' } };

      const mocks = [
        createBillsQueryMock(defaultMonth, bills),
        createMockResponse(
          SEND_INDUSTRY_BILLS_EMAIL,
          { month: defaultMonth, industryBillIds: bills.map(b => b.id) },
          {
            sendIndustryBillsEmail: {
              success: true,
              message: '電費單已成功生成 (2/2 家公司)',
              batchId: 'batch-1',
              totalJobs: 2,
            },
          }
        ),
        emailConfigMock,
      ];

      render(<IndustryBillEmailModal {...mockProps} />, { mocks });

      await waitFor(() => {
        // 2 industry groups → 2 封郵件，3 筆電費單
        expect(screen.getByText(/將發送 2 封郵件，共 3 筆電費單/)).toBeInTheDocument();
      });

      // Act: Send emails
      const sendButton = screen.getByRole('button', { name: /確認寄信/i });
      fireEvent.click(sendButton);

      await waitFor(() => {
        expect(mockProps.onClose).toHaveBeenCalled();
      });
    });
  });

  describe('Validation - Unapproved Bills', () => {
    it('should show no eligible bills message when none are approved', async () => {
      const bills = createMockBillsForEmail(3, ElectricBillStatus.Draft);

      render(
        <IndustryBillEmailModal {...mockProps} />,
        { mocks: [createBillsQueryMock(defaultMonth, bills), emailConfigMock] }
      );

      await waitFor(() => {
        expect(screen.getByText('無符合條件的電費單可寄送')).toBeInTheDocument();
      });

      // Assert: Send button not shown
      expect(screen.queryByRole('button', { name: /確認寄信/i })).not.toBeInTheDocument();

      // Assert: Close button shown instead
      expect(screen.getByRole('button', { name: '關閉' })).toBeInTheDocument();
    });

    it('should display unapproved bills list with correct status badges', async () => {
      const bills = createMockBillsForEmail(3, ElectricBillStatus.Draft);
      bills[1] = { ...bills[1], status: ElectricBillStatus.Pending };
      bills[2] = { ...bills[2], status: ElectricBillStatus.Rejected };

      render(
        <IndustryBillEmailModal {...mockProps} />,
        { mocks: [createBillsQueryMock(defaultMonth, bills), emailConfigMock] }
      );

      await waitFor(() => {
        expect(screen.getByText('待處理電費單清單')).toBeInTheDocument();
      });

      expect(screen.getByText('未完成')).toBeInTheDocument();
      expect(screen.getByText('待審核')).toBeInTheDocument();
      expect(screen.getByText('已拒絕')).toBeInTheDocument();
    });

    it('should show clickable links to unapproved bills', async () => {
      const bills = createMockBillsForEmail(2, ElectricBillStatus.Draft);

      render(
        <IndustryBillEmailModal {...mockProps} />,
        { mocks: [createBillsQueryMock(defaultMonth, bills), emailConfigMock] }
      );

      await waitFor(() => {
        const link = screen.getByRole('link', { name: /測試電廠 1/i });
        expect(link).toHaveAttribute(
          'href',
          '/electric-bill/industry-bill?month=2024-10&industryBillId=bill-1'
        );
      });
    });
  });

  describe('Error Handling', () => {
    it('should display error message when mutation fails', async () => {
      const bills = createMockBillsForEmail(3);

      const mocks = [
        createBillsQueryMock(defaultMonth, bills),
        createMockResponse(
          SEND_INDUSTRY_BILLS_EMAIL,
          { month: defaultMonth, industryBillIds: bills.map(b => b.id) },
          {
            sendIndustryBillsEmail: {
              success: false,
              message: 'PDF 服務暫時無法使用,請稍後再試',
              batchId: null,
              totalJobs: null,
            },
          }
        ),
        emailConfigMock,
      ];

      render(<IndustryBillEmailModal {...mockProps} />, { mocks });

      await waitFor(() => {
        expect(screen.getByText(/準備寄送電費單通知/)).toBeInTheDocument();
      });

      const sendButton = screen.getByRole('button', { name: /確認寄信/i });
      fireEvent.click(sendButton);

      await waitFor(() => {
        expect(screen.getByText('PDF 服務暫時無法使用,請稍後再試')).toBeInTheDocument();
      });

      expect(mockProps.onClose).not.toHaveBeenCalled();
    });

    it('should handle GraphQL network errors', async () => {
      const bills = createMockBillsForEmail(3);

      const mocks = [
        createBillsQueryMock(defaultMonth, bills),
        createMockResponse(
          SEND_INDUSTRY_BILLS_EMAIL,
          { month: defaultMonth, industryBillIds: bills.map(b => b.id) },
          null,
          new Error('Network error')
        ),
        emailConfigMock,
      ];

      render(<IndustryBillEmailModal {...mockProps} />, { mocks });

      await waitFor(() => {
        expect(screen.getByText(/準備寄送電費單通知/)).toBeInTheDocument();
      });

      const sendButton = screen.getByRole('button', { name: /確認寄信/i });
      fireEvent.click(sendButton);

      await waitFor(() => {
        expect(screen.getByText('寄信過程發生錯誤')).toBeInTheDocument();
      });
    });

    it('should handle partial success (some PDFs failed)', async () => {
      const bills = createMockBillsForEmail(6);

      const mocks = [
        createBillsQueryMock(defaultMonth, bills),
        createMockResponse(
          SEND_INDUSTRY_BILLS_EMAIL,
          { month: defaultMonth, industryBillIds: bills.map(b => b.id) },
          {
            sendIndustryBillsEmail: {
              success: true,
              message: '電費單已成功生成 (2/3 家公司)',
              batchId: 'batch-1',
              totalJobs: 3,
            },
          }
        ),
        emailConfigMock,
      ];

      render(<IndustryBillEmailModal {...mockProps} />, { mocks });

      await waitFor(() => {
        expect(screen.getByText(/準備寄送電費單通知/)).toBeInTheDocument();
      });

      const sendButton = screen.getByRole('button', { name: /確認寄信/i });
      fireEvent.click(sendButton);

      await waitFor(() => {
        expect(mockProps.onClose).toHaveBeenCalled();
      });
    });
  });

  describe('UI Interactions', () => {
    it('should disable buttons during loading', async () => {
      const bills = createMockBillsForEmail(3);

      const mocks = [
        createBillsQueryMock(defaultMonth, bills),
        {
          ...createMockResponse(
            SEND_INDUSTRY_BILLS_EMAIL,
            { month: defaultMonth, industryBillIds: bills.map(b => b.id) },
            {
              sendIndustryBillsEmail: {
                success: true,
                message: '電費單已成功生成',
                batchId: 'batch-1',
                totalJobs: 1,
              },
            }
          ),
          delay: 1000,
        },
        emailConfigMock,
      ];

      render(<IndustryBillEmailModal {...mockProps} />, { mocks });

      await waitFor(() => {
        expect(screen.getByText(/準備寄送電費單通知/)).toBeInTheDocument();
      });

      const sendButton = screen.getByRole('button', { name: /確認寄信/i });
      fireEvent.click(sendButton);

      await waitFor(() => {
        expect(screen.getByRole('button', { name: '取消' })).toBeDisabled();
        expect(screen.getByText('寄送中...')).toBeInTheDocument();
      });
    });

    it('should close modal when cancel button clicked', async () => {
      const bills = createMockBillsForEmail(3);

      render(
        <IndustryBillEmailModal {...mockProps} />,
        { mocks: [createBillsQueryMock(defaultMonth, bills), emailConfigMock] }
      );

      await waitFor(() => {
        expect(screen.getByText(/準備寄送電費單通知/)).toBeInTheDocument();
      });

      const cancelButton = screen.getByRole('button', { name: '取消' });
      fireEvent.click(cancelButton);

      expect(mockProps.onClose).toHaveBeenCalled();
    });

    it('should show email icon in header', async () => {
      render(
        <IndustryBillEmailModal {...mockProps} />,
        { mocks: [createBillsQueryMock(defaultMonth, []), emailConfigMock] }
      );

      await waitFor(() => {
        const emailIcons = screen.getAllByTestId('EmailIcon');
        expect(emailIcons.length).toBeGreaterThan(0);
      });
    });

    it('should show close icon button in header', async () => {
      render(
        <IndustryBillEmailModal {...mockProps} />,
        { mocks: [createBillsQueryMock(defaultMonth, []), emailConfigMock] }
      );

      await waitFor(() => {
        expect(screen.getByLabelText('close')).toBeInTheDocument();
      });

      const closeButton = screen.getByLabelText('close');
      fireEvent.click(closeButton);

      expect(mockProps.onClose).toHaveBeenCalled();
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty bills (no eligible, no ineligible)', async () => {
      render(
        <IndustryBillEmailModal {...mockProps} />,
        { mocks: [createBillsQueryMock(defaultMonth, []), emailConfigMock] }
      );

      // 0 eligible bills → shows "無符合條件" since hasEligibleBills is false
      await waitFor(() => {
        expect(screen.getByText('無符合條件的電費單可寄送')).toBeInTheDocument();
      });
    });

    it('should handle single bill', async () => {
      const bills = createMockBillsForEmail(1);

      const mocks = [
        createBillsQueryMock(defaultMonth, bills),
        createMockResponse(
          SEND_INDUSTRY_BILLS_EMAIL,
          { month: defaultMonth, industryBillIds: ['bill-1'] },
          {
            sendIndustryBillsEmail: {
              success: true,
              message: '電費單已成功生成 (1/1 家公司)',
              batchId: 'batch-1',
              totalJobs: 1,
            },
          }
        ),
        emailConfigMock,
      ];

      render(<IndustryBillEmailModal {...mockProps} />, { mocks });

      await waitFor(() => {
        expect(screen.getByText(/將發送 1 封郵件，共 1 筆電費單/)).toBeInTheDocument();
      });

      // Assert: No "...及其他" text (only 1 bill)
      expect(screen.queryByText(/及其他/i)).not.toBeInTheDocument();

      const sendButton = screen.getByRole('button', { name: /確認寄信/i });
      fireEvent.click(sendButton);

      await waitFor(() => {
        expect(mockProps.onClose).toHaveBeenCalled();
      });
    });

    it('should handle bills with missing optional fields', async () => {
      const bills = createMockBillsForEmail(3);
      bills.forEach(bill => {
        bill.powerPlantNumber = null;
      });

      render(
        <IndustryBillEmailModal {...mockProps} />,
        { mocks: [createBillsQueryMock(defaultMonth, bills), emailConfigMock] }
      );

      // Should still render without crashing
      await waitFor(() => {
        expect(screen.getByText('測試電廠 1')).toBeInTheDocument();
      });
    });
  });

  describe('Test Mode Display', () => {
    it('isTestMode=true → 顯示 "目前為測試模式" Alert', async () => {
      const bills = createMockBillsForEmail(3);

      const testModeEmailConfigMock = createMockResponse(
        EMAIL_CONFIG,
        {},
        { emailConfig: { id: '1', isTestMode: true, testRecipients: ['qa@test.com'], updatedAt: new Date().toISOString() } }
      );

      render(
        <IndustryBillEmailModal {...mockProps} />,
        { mocks: [createBillsQueryMock(defaultMonth, bills), testModeEmailConfigMock] }
      );

      await waitFor(() => {
        expect(screen.getByText('目前為測試模式')).toBeInTheDocument();
        expect(screen.getByText('郵件將只寄送給內部測試人員，不會寄給客戶')).toBeInTheDocument();
      });
    });

    it('isTestMode=true → 按鈕文字為 "確認寄信（測試模式）"', async () => {
      const bills = createMockBillsForEmail(3);

      const testModeEmailConfigMock = createMockResponse(
        EMAIL_CONFIG,
        {},
        { emailConfig: { id: '1', isTestMode: true, testRecipients: [], updatedAt: new Date().toISOString() } }
      );

      render(
        <IndustryBillEmailModal {...mockProps} />,
        { mocks: [createBillsQueryMock(defaultMonth, bills), testModeEmailConfigMock] }
      );

      await waitFor(() => {
        expect(screen.getByRole('button', { name: /確認寄信（測試模式）/ })).toBeInTheDocument();
      });
    });

    it('isTestMode=false → 無 Alert，按鈕為 "確認寄信"', async () => {
      const bills = createMockBillsForEmail(3);

      render(
        <IndustryBillEmailModal {...mockProps} />,
        { mocks: [createBillsQueryMock(defaultMonth, bills), emailConfigMock] }
      );

      await waitFor(() => {
        expect(screen.getByRole('button', { name: /確認寄信/i })).toBeInTheDocument();
      });

      // 確認無測試模式 Alert
      expect(screen.queryByText('目前為測試模式')).not.toBeInTheDocument();

      // 確認按鈕文字不含 "測試模式"
      const sendButton = screen.getByRole('button', { name: /確認寄信/i });
      expect(sendButton).toHaveTextContent('確認寄信');
      expect(sendButton).not.toHaveTextContent('測試模式');
    });
  });

  describe('Different Months', () => {
    it('should work with different month formats', async () => {
      const testCases = [
        { month: '2024-01', display: '2024-01' },
        { month: '2024-06', display: '2024-06' },
        { month: '2024-12', display: '2024-12' },
      ];

      for (const testCase of testCases) {
        jest.clearAllMocks();

        const { unmount } = render(
          <IndustryBillEmailModal {...mockProps} month={testCase.month} />,
          { mocks: [createBillsQueryMock(testCase.month, []), emailConfigMock] }
        );

        await waitFor(() => {
          expect(screen.getByText(new RegExp(`發電業電費單.*${testCase.display}`))).toBeInTheDocument();
        });

        unmount();
      }
    });
  });
});
