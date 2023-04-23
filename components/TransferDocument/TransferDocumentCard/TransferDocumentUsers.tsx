import { Box, Typography } from "@mui/material";
import type { TransferDocumentUserDto, User, UserContract } from "@core/graphql/types";

type TransferDocumentUsersItem =
    Pick<TransferDocumentUserDto, 'monthlyTransferDegree' | 'yearlyTransferDegree'>
    & Pick<User, 'name'>
    & Pick<UserContract, 'purchaseDegree' | 'serialNumber'>

const usersMappedLabels: Array<{
    key: keyof Omit<TransferDocumentUsersItem, 'name'>;
    label: string;
}> = [{
    key: 'serialNumber',
    label: '電號',
}, {
    key: 'purchaseDegree',
    label: '預計年採購度數',
}, {
    key: 'monthlyTransferDegree',
    label: '月上限度數',
}, {
    key: 'yearlyTransferDegree',
    label: '年上限度數',
}];

interface TransferDocumentUsersProps {
    transferDocumentUsers: TransferDocumentUserDto[];
}

interface TransferDocumentUsersItemProps {
    transferDocumentUsers: TransferDocumentUsersItem;
}

function TransferDocumentUsersItem(props: TransferDocumentUsersItemProps) {
    const { transferDocumentUsers } = props;

    return (
        <Box>
            <Typography variant="h4">{transferDocumentUsers.name}</Typography>
            <Box>
                {usersMappedLabels.map(({ key, label }) => (
                    <Box key={key}>
                        <Typography>{label}</Typography>
                        <Typography>{transferDocumentUsers[key]}</Typography>
                    </Box>
                ))}
            </Box>
        </Box>
    );
}

function TransferDocumentUsers(props: TransferDocumentUsersProps) {
    const { transferDocumentUsers } = props;

    const transferDocumentUsersView = transferDocumentUsers.map(el => ({
        name: el.user.name,
        serialNumber: el.userContract.serialNumber,
        purchaseDegree: el.userContract.purchaseDegree,
        monthlyTransferDegree: el.monthlyTransferDegree,
        yearlyTransferDegree: el.yearlyTransferDegree
      }));

    return (
        <Box
            sx={{
                maxWidth: '392px',
                padding: '8px',
                display: 'flex',
                flexDirection: 'column',
                overflowY: 'auto',
                border: '2px solid',
                borderColor: 'primary.main',
                borderRadius: '2px',

            }}>
            {transferDocumentUsersView.map(item => (
               <TransferDocumentUsersItem key={item.name} transferDocumentUsers={item} /> 
            ))}
        </Box>
    );
}

export default TransferDocumentUsers;
