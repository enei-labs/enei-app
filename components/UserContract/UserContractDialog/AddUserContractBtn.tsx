import { Button } from "@mui/material";
import dynamic from "next/dynamic";
import { useState } from "react";

const UserContractDialog = dynamic(
  () => import("@components/UserContract/UserContractDialog/UserContractDialog")
);

export function AddUserContractBtn({ userName }: { userName: string }) {
  const [opened, open] = useState(false);
  return (
    <>
      <Button onClick={() => open(true)}>新增契約</Button>
      {opened ? (
        <UserContractDialog
          userName={userName}
          isOpenDialog={opened}
          variant="create"
          onClose={() => open(false)}
        />
      ) : null}
    </>
  );
}
