import IconTooltip from "@components/IconTooltip";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import Box from "@mui/material/Box";
import Skeleton from "@mui/material/Skeleton";
import MuiTable from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import React, { useEffect, useState } from "react";
import TableRowExpansion from "./TableRowExpansion";

enum Alignment {
  LEFT = "left",
  RIGHT = "right",
  CENTER = "center",
  JUSTIFY = "justify",
}

interface Page {
  rows: number;
  index: number;
}

interface Config {
  header: string;
  tooltip?: string;
  accessor?: string;
  alignment?: Alignment;
  format?: (data: any) => string | undefined;
  render?: React.ComponentType<any>;
}

interface TableProps {
  configs: Config[];
  list?: any[];
  total?: number;
  dialog?: boolean;
  loading?: boolean;
  rowExpansion?: React.ComponentType<any>;
  onPageChange?: (page: Page) => void;
}

const style = {
  headCell: (theme: any) => ({
    fontSize: "14px",
    fontWeight: "bold",
    whiteSpace: "nowrap",
  }),
  bodyCell: {
    fontSize: "14px",
    whiteSpace: "nowrap",
  },
};

const Table: React.FC<TableProps> = ({
  configs,
  list = [],
  total = 0,
  dialog = false,
  loading = false,
  rowExpansion,
  onPageChange,
}) => {
  const [rows, setRows] = useState(10);
  const [page, setPage] = useState(0);
  const [count, setCount] = useState(total);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
    onPageChange?.({ rows: rows, index: newPage });
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setPage(0);
    setRows(+event.target.value);
    onPageChange?.({ rows: +event.target.value, index: 0 });
  };

  useEffect(() => {
    if (total) setCount(total);
  }, [total]);

  return (
    <Box>
      <TableContainer>
        <MuiTable>
          <TableHead>
            <TableRow>
              {rowExpansion && <TableCell sx={style.headCell} />}
              {configs.map(({ header, tooltip, alignment }) => (
                <TableCell key={header} align={alignment} sx={style.headCell}>
                  {header}{" "}
                  {tooltip && (
                    <IconTooltip icon={HelpOutlineIcon} title={tooltip} />
                  )}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>

          <TableBody>
            {loading ? (
              [0, 1, 2, 3, 4].map((item) => (
                <TableRow key={item}>
                  {rowExpansion && <TableCell />}
                  {configs.map((config) => (
                    <TableCell key={config.header}>
                      <Skeleton variant="text" />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : list.length === 0 ? (
              <TableRow>
                {rowExpansion && <TableCell />}
                <TableCell
                  colSpan={configs.length}
                  align="center"
                  sx={style.bodyCell}
                >
                  No Data.
                </TableCell>
              </TableRow>
            ) : (
              <>
                {list.map((rowData, index) => (
                  <TableRowExpansion
                    key={index}
                    configs={configs}
                    rowData={rowData}
                    rowExpansion={rowExpansion}
                  />
                ))}
              </>
            )}
          </TableBody>
        </MuiTable>
      </TableContainer>

      {!dialog && (
        <TablePagination
          size="small"
          rowsPerPageOptions={[10, 25, 100]}
          component="div"
          page={page}
          count={count}
          rowsPerPage={rows}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      )}
    </Box>
  );
};

export { Alignment };
export type { Config };
export default Table;
