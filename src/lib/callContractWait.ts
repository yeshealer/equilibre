import generateToast from '@/components/toast/generateToast';
import { TransactionText } from '@/interfaces';
import { writeContract, waitForTransaction } from '@wagmi/core';
import {
  TransactionExecutionError,
  TransactionReceiptNotFoundError,
} from 'viem';

const callContractWait = async (
  request: any,
  transactionText: TransactionText,
  customErrorHandler?: (error: any) => boolean
) => {
  return await writeContract({
    ...request,
  })
    .then(
      ({ hash }) => {
        generateToast(
          'Transaction sent',
          'Your transaction has been submitted to the network',
          'loading'
        );
        return waitForTransaction({ hash, confirmations: 2, timeout: 0 }).then(
          ({ status }) => {
            if (status === 'success') {
              generateToast(
                transactionText.title,
                transactionText.description,
                'success',
                hash
              );
              return true;
            }
            if (status === 'reverted') {
              generateToast(
                'Transaction failed',
                'Your transaction has been reverted',
                'error',
                hash
              );
              return false;
            }
          },
          error => {
            generateToast(
              'Error meanwhile waiting for transaction',
              error.message,
              'error',
              hash
            );
            return false;
          }
        );
      },
      error => {
        if (customErrorHandler) return customErrorHandler(error);
        if (error instanceof TransactionExecutionError)
          generateToast(error.shortMessage, error.message, 'error');
        if (error instanceof TransactionReceiptNotFoundError)
          generateToast(
            'Transaction Receipt not found',
            error.message,
            'error'
          );

        return false;
      }
    )
    .catch(error => {
      generateToast('Unknown error', error.message, 'error');
      return false;
    });
};

export default callContractWait;
