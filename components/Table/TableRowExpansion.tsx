import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import Collapse from "@mui/material/Collapse";
import IconButton from "@mui/material/IconButton";
import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
import { get } from "lodash";
import { useState } from "react";
import { Config } from "./Table";

interface RowExpansionProps<T = any> {
  rowData?: T;
}

interface TableRowExpansionProps {
  configs: Config[];
  rowData?: any;
  rowExpansion?: React.ComponentType<RowExpansionProps>;
}

const style = {
  bodyCell: {
    fontSize: "14px",
    whiteSpace: "nowrap",
  },
  expandCell: {
    py: 0,
    pl: "36px",
    borderBottom: 0,
    "& .MuiCollapse-root": {
      my: "10px",
    },
  },
};

const TablerowExpansion: React.FC<TableRowExpansionProps> = ({
  configs,
  rowData,
  rowExpansion: RowExpansion,
}) => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <TableRow>
        {RowExpansion && (
          <TableCell width={36} padding="none">
            <IconButton size="small" onClick={() => setOpen(!open)}>
              {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
            </IconButton>
          </TableCell>
        )}
        {configs.map(
          ({ header, accessor, alignment, format, render: Cell }) => {
            const val = get(rowData, accessor || "");
            const formatVal = format ? format(val) : val;
            return (
              <TableCell key={header} align={alignment} sx={style.bodyCell}>
                {Cell ? <Cell {...rowData} /> : formatVal || "N/A"}
              </TableCell>
            );
          }
        )}
      </TableRow>
      {RowExpansion && (
        <TableRow>
          <TableCell
            colSpan={configs.length + 1}
            align="center"
            sx={[style.bodyCell, style.expandCell]}
          >
            <Collapse in={open} timeout="auto" unmountOnExit>
              <RowExpansion rowData={rowData} />
            </Collapse>
          </TableCell>
        </TableRow>
      )}
    </>
  );
};

export type { RowExpansionProps };

export default TablerowExpansion;
