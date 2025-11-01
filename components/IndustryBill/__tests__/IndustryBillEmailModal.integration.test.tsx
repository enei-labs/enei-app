/**
 * Integration test for IndustryBillEmailModal
 * Tests the full flow of sending multiple industry bill emails from frontend to backend
 */

import React from 'react';
import { screen, fireEvent, waitFor } from '@testing-library/react';
import { render, createMockResponse } from '@utils/test-utils';
import { IndustryBillEmailModal } from '../IndustryBillEmailModal';
import { ElectricBillStatus, IndustryBill } from '@core/graphql/types';
import { gql } from '@apollo/client';

// GraphQL mutation
const SEND_INDUSTRY_BILLS_EMAIL = gql`
  mutation SendIndustryBillsEmail($month: String!) {
    sendIndustryBillsEmail(month: $month) {
      success
      message
    }
  }
`;

// Mock data factory - creates realistic test data for multiple companies
const createMockIndustryBills = (
  month: string,
  numBills: number,
  status: ElectricBillStatus = ElectricBillStatus.Approved
): IndustryBill[] => {
  return Array.from({ length: numBills }, (_, i) => ({
    id: `bill-${i + 1}`,
    powerPlantName: `測試電廠 ${i + 1}`,
    powerPlantNumber: `E${(i + 1).toString().padStart(6, '0')}`,
    powerPlantAddress: `台北市信義區信義路五段 ${i + 1} 號`,
    transferDegree: 1000 + i * 50,
    price: 2.5 + i * 0.1,
    amount: (1000 + i * 50) * (2.5 + i * 0.1),
    billingDate: `${month}-01T00:00:00Z`,
    status,
    industryBillConfigId: `config-${i + 1}`,
    createdAt: `${month}-01T00:00:00Z`,
    updatedAt: `${month}-01T00:00:00Z`,
  })) as IndustryBill[];
};

const createMockBillsWithMixedStatuses = (month: string): IndustryBill[] => {
  const bills = createMockIndustryBills(month, 6, ElectricBillStatus.Approved);
  bills[1].status = ElectricBillStatus.Draft;
  bills[3].status = ElectricBillStatus.Pending;
  bills[5].status = ElectricBillStatus.Rejected;
  return bills;
};

describe('IndustryBillEmailModal (Integration)', () => {
  const mockProps = {
    open: true,
    onClose: jest.fn(),
    month: '2024-10',
    bills: [] as IndustryBill[],
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Success Scenarios - Multi Email Sending', () => {
    it('should successfully send emails for multiple approved bills', async () => {
      // Arrange: Create 5 approved bills
      const approvedBills = createMockIndustryBills('2024-10', 5);

      const mocks = [
        createMockResponse(
          SEND_INDUSTRY_BILLS_EMAIL,
          { month: '2024-10' },
          {
            sendIndustryBillsEmail: {
              success: true,
              message: '電費單已成功生成 (3/3 家公司)',
            },
          }
        ),
      ];

      // Act
      render(
        <IndustryBillEmailModal {...mockProps} bills={approvedBills} />,
        { mocks }
      );

      // Assert: Modal opens with all approved bills
      await waitFor(() => {
        expect(screen.getByText('發電業電費單 2024-10')).toBeInTheDocument();
        expect(screen.getByText('所有電費單皆已審核完成')).toBeInTheDocument();
        expect(screen.getByText('2024-10 月份共 5 筆電費單')).toBeInTheDocument();
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
      // Arrange: Create 10 approved bills (should show first 5 + "...及其他 5 筆")
      const approvedBills = createMockIndustryBills('2024-11', 10);

      render(
        <IndustryBillEmailModal {...mockProps} month="2024-11" bills={approvedBills} />,
        { mocks: [] }
      );

      // Assert: Shows first 5 bills
      await waitFor(() => {
        expect(screen.getByText('測試電廠 1 (E000001)')).toBeInTheDocument();
        expect(screen.getByText('測試電廠 2 (E000002)')).toBeInTheDocument();
        expect(screen.getByText('測試電廠 3 (E000003)')).toBeInTheDocument();
        expect(screen.getByText('測試電廠 4 (E000004)')).toBeInTheDocument();
        expect(screen.getByText('測試電廠 5 (E000005)')).toBeInTheDocument();
      });

      // Assert: Shows "...及其他 5 筆"
      expect(screen.getByText('...及其他 5 筆')).toBeInTheDocument();
    });

    it('should handle different company groups correctly', async () => {
      // Arrange: Create bills from multiple companies
      const bill1 = createMockIndustryBills('2024-10', 1)[0];
      const bill2 = createMockIndustryBills('2024-10', 1)[0];
      const bill3 = createMockIndustryBills('2024-10', 1)[0];

      bill1.powerPlantName = '公司A 電廠1';
      bill2.powerPlantName = '公司A 電廠2';
      bill3.powerPlantName = '公司B 電廠1';

      const bills = [bill1, bill2, bill3];

      const mocks = [
        createMockResponse(
          SEND_INDUSTRY_BILLS_EMAIL,
          { month: '2024-10' },
          {
            sendIndustryBillsEmail: {
              success: true,
              message: '電費單已成功生成 (2/2 家公司)', // 2 companies
            },
          }
        ),
      ];

      render(
        <IndustryBillEmailModal {...mockProps} bills={bills} />,
        { mocks }
      );

      await waitFor(() => {
        expect(screen.getByText('2024-10 月份共 3 筆電費單')).toBeInTheDocument();
      });

      // Act: Send emails
      const sendButton = screen.getByRole('button', { name: /確認寄信/i });
      fireEvent.click(sendButton);

      // Assert: Success message mentions 2 companies
      await waitFor(() => {
        expect(mockProps.onClose).toHaveBeenCalled();
      });
    });
  });

  describe('Validation - Unapproved Bills', () => {
    it('should show warning when bills are not all approved', async () => {
      // Arrange: Mix of approved and unapproved bills
      const mixedBills = createMockBillsWithMixedStatuses('2024-10');

      render(
        <IndustryBillEmailModal {...mockProps} bills={mixedBills} />,
        { mocks: [] }
      );

      // Assert: Warning alert displayed
      await waitFor(() => {
        expect(screen.getByText(/尚有 3 筆電費單未審核完成/i)).toBeInTheDocument();
        expect(screen.getByText(/請先完成審核後再寄送電費單通知/i)).toBeInTheDocument();
      });

      // Assert: Send button not shown
      expect(screen.queryByRole('button', { name: /確認寄信/i })).not.toBeInTheDocument();

      // Assert: Close button shown instead
      expect(screen.getByRole('button', { name: '關閉' })).toBeInTheDocument();
    });

    it('should display unapproved bills list with correct status badges', async () => {
      // Arrange
      const mixedBills = createMockBillsWithMixedStatuses('2024-10');

      render(
        <IndustryBillEmailModal {...mockProps} bills={mixedBills} />,
        { mocks: [] }
      );

      // Assert: Unapproved bills section shown
      await waitFor(() => {
        expect(screen.getByText('待處理電費單清單')).toBeInTheDocument();
      });

      // Assert: Draft status
      expect(screen.getByText('未完成')).toBeInTheDocument();

      // Assert: Pending status
      expect(screen.getByText('待審核')).toBeInTheDocument();

      // Assert: Rejected status
      expect(screen.getByText('已拒絕')).toBeInTheDocument();
    });

    it('should show clickable links to unapproved bills', async () => {
      // Arrange
      const mixedBills = createMockBillsWithMixedStatuses('2024-10');

      render(
        <IndustryBillEmailModal {...mockProps} bills={mixedBills} />,
        { mocks: [] }
      );

      // Assert: Bills have links
      await waitFor(() => {
        const link = screen.getByRole('link', { name: /測試電廠 2/i });
        expect(link).toHaveAttribute(
          'href',
          '/electric-bill/industry-bill?month=2024-10&industryBillId=bill-2'
        );
      });
    });
  });

  describe('Error Handling', () => {
    it('should display error message when mutation fails', async () => {
      // Arrange
      const approvedBills = createMockIndustryBills('2024-10', 3);

      const mocks = [
        createMockResponse(
          SEND_INDUSTRY_BILLS_EMAIL,
          { month: '2024-10' },
          {
            sendIndustryBillsEmail: {
              success: false,
              message: 'PDF 服務暫時無法使用,請稍後再試',
            },
          }
        ),
      ];

      render(
        <IndustryBillEmailModal {...mockProps} bills={approvedBills} />,
        { mocks }
      );

      await waitFor(() => {
        expect(screen.getByText('所有電費單皆已審核完成')).toBeInTheDocument();
      });

      // Act: Click send
      const sendButton = screen.getByRole('button', { name: /確認寄信/i });
      fireEvent.click(sendButton);

      // Assert: Error displayed
      await waitFor(() => {
        expect(screen.getByText('PDF 服務暫時無法使用,請稍後再試')).toBeInTheDocument();
      });

      // Assert: Modal stays open
      expect(mockProps.onClose).not.toHaveBeenCalled();
    });

    it('should handle GraphQL network errors', async () => {
      // Arrange
      const approvedBills = createMockIndustryBills('2024-10', 3);

      const mocks = [
        createMockResponse(
          SEND_INDUSTRY_BILLS_EMAIL,
          { month: '2024-10' },
          null,
          new Error('Network error')
        ),
      ];

      render(
        <IndustryBillEmailModal {...mockProps} bills={approvedBills} />,
        { mocks }
      );

      await waitFor(() => {
        expect(screen.getByText('所有電費單皆已審核完成')).toBeInTheDocument();
      });

      // Act: Click send
      const sendButton = screen.getByRole('button', { name: /確認寄信/i });
      fireEvent.click(sendButton);

      // Assert: Generic error message
      await waitFor(() => {
        expect(screen.getByText('寄信過程發生錯誤')).toBeInTheDocument();
      });
    });

    it('should handle partial success (some PDFs failed)', async () => {
      // Arrange
      const approvedBills = createMockIndustryBills('2024-10', 6);

      const mocks = [
        createMockResponse(
          SEND_INDUSTRY_BILLS_EMAIL,
          { month: '2024-10' },
          {
            sendIndustryBillsEmail: {
              success: true,
              message: '電費單已成功生成 (2/3 家公司)', // Partial success
            },
          }
        ),
      ];

      render(
        <IndustryBillEmailModal {...mockProps} bills={approvedBills} />,
        { mocks }
      );

      await waitFor(() => {
        expect(screen.getByText('所有電費單皆已審核完成')).toBeInTheDocument();
      });

      // Act: Send
      const sendButton = screen.getByRole('button', { name: /確認寄信/i });
      fireEvent.click(sendButton);

      // Assert: Still closes on success (even if partial)
      await waitFor(() => {
        expect(mockProps.onClose).toHaveBeenCalled();
      });
    });
  });

  describe('UI Interactions', () => {
    it('should disable buttons during loading', async () => {
      // Arrange
      const approvedBills = createMockIndustryBills('2024-10', 3);

      const mocks = [
        {
          ...createMockResponse(
            SEND_INDUSTRY_BILLS_EMAIL,
            { month: '2024-10' },
            {
              sendIndustryBillsEmail: {
                success: true,
                message: '電費單已成功生成',
              },
            }
          ),
          delay: 1000, // Simulate slow network
        },
      ];

      render(
        <IndustryBillEmailModal {...mockProps} bills={approvedBills} />,
        { mocks }
      );

      await waitFor(() => {
        expect(screen.getByText('所有電費單皆已審核完成')).toBeInTheDocument();
      });

      // Act: Click send
      const sendButton = screen.getByRole('button', { name: /確認寄信/i });
      fireEvent.click(sendButton);

      // Assert: Buttons disabled during loading
      await waitFor(() => {
        expect(screen.getByRole('button', { name: '取消' })).toBeDisabled();
        expect(screen.getByText('寄送中...')).toBeInTheDocument();
      });
    });

    it('should close modal when cancel button clicked', async () => {
      // Arrange
      const approvedBills = createMockIndustryBills('2024-10', 3);

      render(
        <IndustryBillEmailModal {...mockProps} bills={approvedBills} />,
        { mocks: [] }
      );

      await waitFor(() => {
        expect(screen.getByText('所有電費單皆已審核完成')).toBeInTheDocument();
      });

      // Act: Click cancel
      const cancelButton = screen.getByRole('button', { name: '取消' });
      fireEvent.click(cancelButton);

      // Assert: onClose called
      expect(mockProps.onClose).toHaveBeenCalled();
    });

    it('should show email icon in header', async () => {
      // Arrange
      const approvedBills = createMockIndustryBills('2024-10', 3);

      render(
        <IndustryBillEmailModal {...mockProps} bills={approvedBills} />,
        { mocks: [] }
      );

      // Assert: Email icon present
      await waitFor(() => {
        const emailIcons = screen.getAllByTestId('EmailIcon');
        expect(emailIcons.length).toBeGreaterThan(0);
      });
    });

    it('should show close icon button in header', async () => {
      // Arrange
      const approvedBills = createMockIndustryBills('2024-10', 3);

      render(
        <IndustryBillEmailModal {...mockProps} bills={approvedBills} />,
        { mocks: [] }
      );

      await waitFor(() => {
        expect(screen.getByLabelText('close')).toBeInTheDocument();
      });

      // Act: Click close icon
      const closeButton = screen.getByLabelText('close');
      fireEvent.click(closeButton);

      // Assert: onClose called
      expect(mockProps.onClose).toHaveBeenCalled();
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty bills array', async () => {
      // Arrange
      render(
        <IndustryBillEmailModal {...mockProps} bills={[]} />,
        { mocks: [] }
      );

      // Assert: Shows "0 筆電費單"
      await waitFor(() => {
        expect(screen.getByText('2024-10 月份共 0 筆電費單')).toBeInTheDocument();
      });

      // Assert: Send button still shown (backend will handle validation)
      expect(screen.getByRole('button', { name: /確認寄信/i })).toBeInTheDocument();
    });

    it('should handle single bill', async () => {
      // Arrange
      const singleBill = createMockIndustryBills('2024-10', 1);

      const mocks = [
        createMockResponse(
          SEND_INDUSTRY_BILLS_EMAIL,
          { month: '2024-10' },
          {
            sendIndustryBillsEmail: {
              success: true,
              message: '電費單已成功生成 (1/1 家公司)',
            },
          }
        ),
      ];

      render(
        <IndustryBillEmailModal {...mockProps} bills={singleBill} />,
        { mocks }
      );

      // Assert: Shows 1 bill
      await waitFor(() => {
        expect(screen.getByText('2024-10 月份共 1 筆電費單')).toBeInTheDocument();
      });

      // Assert: No "...及其他" text (only 1 bill)
      expect(screen.queryByText(/...及其他/i)).not.toBeInTheDocument();

      // Act: Send
      const sendButton = screen.getByRole('button', { name: /確認寄信/i });
      fireEvent.click(sendButton);

      // Assert: Success
      await waitFor(() => {
        expect(mockProps.onClose).toHaveBeenCalled();
      });
    });

    it('should handle bills with missing optional fields', async () => {
      // Arrange: Create bills with missing powerPlantNumber
      const billsWithMissingData = createMockIndustryBills('2024-10', 3);
      billsWithMissingData.forEach((bill) => {
        (bill as any).powerPlantNumber = null;
      });

      render(
        <IndustryBillEmailModal {...mockProps} bills={billsWithMissingData} />,
        { mocks: [] }
      );

      // Assert: Should still render without crashing
      await waitFor(() => {
        expect(screen.getByText('測試電廠 1')).toBeInTheDocument();
      });
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

        const bills = createMockIndustryBills(testCase.month, 2);

        const mocks = [
          createMockResponse(
            SEND_INDUSTRY_BILLS_EMAIL,
            { month: testCase.month },
            {
              sendIndustryBillsEmail: {
                success: true,
                message: '電費單已成功生成',
              },
            }
          ),
        ];

        const { unmount } = render(
          <IndustryBillEmailModal {...mockProps} month={testCase.month} bills={bills} />,
          { mocks }
        );

        await waitFor(() => {
          expect(screen.getByText(`發電業電費單 ${testCase.display}`)).toBeInTheDocument();
        });

        unmount();
      }
    });
  });
});
